import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { StashItemData, CreateStashItemRequest } from '../types';

// Fetch all stash items for the authenticated user
export function useStash() {
  return useQuery<StashItemData[]>({
    queryKey: ['stash'],
    queryFn: async () => {
      const response = await fetch('/api/stash', {
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          return [];
        }
        throw new Error('Failed to fetch stash items');
      }
      return response.json();
    },
    retry: false,
  });
}

// Save a new stash item
export function useSaveToStash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStashItemRequest) => {
      const response = await fetch('/api/stash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save to stash');
      }

      return response.json() as Promise<StashItemData>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stash'] });
    },
  });
}

// Delete a stash item
export function useDeleteFromStash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/stash/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete from stash');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stash'] });
    },
  });
}
