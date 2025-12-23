export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default async function apiFetch(path: string, opts: RequestInit = {}) {
  const headers = new Headers(opts.headers || {});
  const token = localStorage.getItem('tricher_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.get('Content-Type') && !(opts.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw body;
  }
  return res.json().catch(() => ({}));
}
