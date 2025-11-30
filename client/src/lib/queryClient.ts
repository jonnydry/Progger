import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        const res = await fetch(url, {
          credentials: "include",
        });
        
        if (!res.ok) {
          if (res.status >= 500) {
            throw new Error(`${res.status}: ${res.statusText}`);
          }
          
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            throw new Error(`${res.status}: ${errorData.message || res.statusText}`);
          }
          
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        
        return res.json();
      },
      staleTime: 1000 * 60 * 5,
      retry: false,
    },
  },
});

export async function apiRequest(
  url: string,
  options?: RequestInit
): Promise<any> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    if (res.status >= 500) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }
    
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(`${res.status}: ${errorData.message || res.statusText}`);
    }
    
    throw new Error(`${res.status}: ${res.statusText}`);
  }

  return res.json();
}
