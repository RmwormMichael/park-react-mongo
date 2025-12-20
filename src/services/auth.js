// services/auth.js

export function saveToken(token) {
  localStorage.setItem('sp_token', token)
}

export function getToken() {
  return localStorage.getItem('sp_token')
}

export function clearToken() {
  localStorage.removeItem('sp_token')
}
