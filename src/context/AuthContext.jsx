import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, saveToken, clearToken } from '../services/auth';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateAuth = () => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser(decoded);
        setIsAuth(true);
      } catch (err) {
        console.error("Token inválido:", err);
        setUser(null);
        setIsAuth(false);
      }
    } else {
      setUser(null);
      setIsAuth(false);
    }
  };

  const login = (token) => {
    saveToken(token);
    updateAuth();
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsAuth(false);
  };

  useEffect(() => {
    updateAuth();
    setLoading(false);

    const onStorage = (e) => {
      if (e.key === 'sp_token') {
        updateAuth();
      }
    };
    window.addEventListener('storage', onStorage);

    const handleAuthChange = () => updateAuth();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
