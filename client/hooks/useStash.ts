import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { StashItemData, CreateStashItemRequest } from '../types';
import { addCsrfHeaders, clearCsrfToken } from '../utils/csrf';

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
      const headers = await addCsrfHeaders({
        'Content-Type': 'application/json',
      });
      
      const response = await fetch('/api/stash', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Clear CSRF token on 403 to force refresh
        if (response.status === 403) {
          clearCsrfToken();
        }
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
      const headers = await addCsrfHeaders();
      
      const response = await fetch(`/api/stash/${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        // Clear CSRF token on 403 to force refresh
        if (response.status === 403) {
          clearCsrfToken();
        }
        throw new Error('Failed to delete from stash');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stash'] });
    },
  });
}
