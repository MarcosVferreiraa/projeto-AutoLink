const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function getToken() {
  return localStorage.getItem('autolink_token');
}

export function clearToken() {
  localStorage.removeItem('autolink_token');
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const failure = new Error(error.message || 'Não foi possível concluir a operação.');
    failure.code = error.code;
    failure.status = response.status;
    throw failure;
  }
  if (response.status === 204) return null;
  return response.json();
}

export function jsonBody(value) {
  return JSON.stringify(value);
}
