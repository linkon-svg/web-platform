export const API_BASE = 'http://localhost:8000';

export async function apiClient(
  endpoint: string,
  options?: RequestInit & { token?: string }
) {
  const { token, ...fetchOptions } = options || {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}
