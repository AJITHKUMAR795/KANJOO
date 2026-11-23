export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // If running in browser on Vercel or any remote domain, use relative /api
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return '/api';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('kanjoo_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register') &&
        window.location.pathname !== '/'
      ) {
        localStorage.removeItem('kanjoo_token');
        localStorage.removeItem('kanjoo_user');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      let errorMsg = 'An error occurred';
      try {
        const errData = await response.json();
        errorMsg = errData.message || JSON.stringify(errData);
      } catch {
        errorMsg = await response.text();
      }
      throw new Error(errorMsg || `HTTP error ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (err: any) {
    // If fetching from local backend failed and we are in browser, attempt fallback to /api if not already tried
    if (baseUrl !== '/api' && !endpoint.startsWith('http') && typeof window !== 'undefined') {
      try {
        const fallbackRes = await fetch(`/api${cleanEndpoint}`, {
          ...options,
          headers,
        });
        if (fallbackRes.ok) {
          const fbText = await fallbackRes.text();
          return fbText ? JSON.parse(fbText) : ({} as T);
        }
      } catch {
        // Fallback also failed, rethrow original
      }
    }
    throw err;
  }
}
