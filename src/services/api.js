// src/services/api.js
import { getToken, clearToken } from './auth';

const API_URL = 'https://api-park-mongo.onrender.com/api';
//const API_URL = 'http://localhost:4000/api';

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: 'Bearer ' + token }),
  };

  // log request (útil para debug)
  console.log('[API] Request]', options.method || 'GET', API_URL + path, options.body || '');

  const res = await fetch(API_URL + path, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // log status
  console.log('[API] Response status]', res.status, res.statusText);

if (res.status === 401) {
  // token inválido: limpiar y forzar login
  clearToken();
  // ✅ Dispara evento para que App.jsx redirija correctamente
  window.dispatchEvent(new Event('authChange'));
  // No hacemos redirección aquí, App.jsx se encargará
  throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
}

  // intenta parsear JSON, si no es JSON devuelve texto
  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  console.log('[API] Response body]', data);

  if (!res.ok) {
    // si el backend envía { message: '...' } lo mostramos, si no mostramos el body
    const message = data?.message || (typeof data === 'string' ? data : 'Error en la petición');
    throw new Error(message);
  }

  return data;
}

export default { request };
