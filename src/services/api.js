import { getToken, clearToken } from './auth';

const API_URL = 'http://localhost:4000/api';

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(token && { Authorization: 'Bearer ' + token }),
  };

  const isFormData = options.body instanceof FormData;
  const hasBody = options.body !== undefined && options.body !== null;

  if (hasBody && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(API_URL + path, {
    method: options.method || 'GET',
    headers,
    body: isFormData ? options.body : hasBody ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new Event('authChange'));
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  }

  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const message = data?.message || (typeof data === 'string' ? data : 'Error en la petición');
    throw new Error(message);
  }

  return data;
}

export default { request };
