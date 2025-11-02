/**
 * CSRF Token Management
 * Fetches and caches CSRF tokens for secure API requests
 */

let csrfToken: string | null = null;
let tokenPromise: Promise<string> | null = null;

/**
 * Fetch CSRF token from the server
 * Uses caching to avoid redundant requests
 */
export async function getCsrfToken(): Promise<string> {
  // Return cached token if available
  if (csrfToken) {
    return csrfToken;
  }

  // Return existing promise if fetch is in progress
  if (tokenPromise) {
    return tokenPromise;
  }

  // Fetch new token
  tokenPromise = (async () => {
    try {
      const response = await fetch('/api/csrf-token', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }

      const data = await response.json();
      csrfToken = data.token;
      tokenPromise = null;
      return csrfToken as string;
    } catch (error) {
      tokenPromise = null;
      throw error;
    }
  })();

  return tokenPromise;
}

/**
 * Clear cached CSRF token
 * Call this if you receive a 403 CSRF error to force token refresh
 */
export function clearCsrfToken(): void {
  csrfToken = null;
  tokenPromise = null;
}

/**
 * Add CSRF token to request headers
 */
export async function addCsrfHeaders(headers: HeadersInit = {}): Promise<HeadersInit> {
  const token = await getCsrfToken();
  return {
    ...headers,
    'x-csrf-token': token,
  };
}
