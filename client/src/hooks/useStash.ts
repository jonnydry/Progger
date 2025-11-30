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

        // Try to extract error message from response body
        let errorMessage = 'Failed to save to stash';
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // If response body can't be parsed, use status-based messages
          if (response.status === 401) {
            errorMessage = 'You must be logged in to save progressions';
          } else if (response.status === 403) {
            errorMessage = 'Invalid CSRF token. Please refresh the page and try again.';
          } else if (response.status === 400) {
            errorMessage = 'Invalid request. Please check your input and try again.';
          } else if (response.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        }

        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
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
