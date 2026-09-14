export class FetchError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'FetchError';
  }
}

const BASE_URL = 'https://dummyjson.com';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new FetchError(`Request failed with status ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}
