import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import VehiclesPage from './pages/VehiclesPage';
import MovimientosPage from './pages/MovimientosPage';
import ReportesPage from './pages/ReportesPage';
import Nav from './components/Nav';
import { getToken } from './services/auth';
import jwt_decode from "jwt-decode";
import PerfilUsuario from './pages/PerfilUsuario';

export default function App() {
  const [isAuth, setIsAuth] = useState(!!getToken());
  const [decodedUser, setDecodedUser] = useState(null);

  // Función para actualizar estado de autenticación
  const updateAuthStatus = () => {
    const token = getToken();
    setIsAuth(!!token);

    if (token) {
      try {
        setDecodedUser(jwt_decode(token));
      } catch (err) {
        console.error("Token inválido:", err);
        setDecodedUser(null);
      }
    } else {
      setDecodedUser(null);
    }
  };

  useEffect(() => {
    updateAuthStatus();

    const onStorage = (e) => {
      if (e.key === 'sp_token') {
        updateAuthStatus();
      }
    };
    window.addEventListener('storage', onStorage);

    const handleAuthChange = () => updateAuthStatus();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return (
    <div className="app-root">
      {/* Solo mostrar Nav si está autenticado */}
      {isAuth && <Nav updateAuth={updateAuthStatus} />}

      <main className="app-main">
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            isAuth ? <Dashboard /> : <Navigate to="/login" />
          } />

          <Route path="/users" element={
            isAuth ? <UsersPage /> : <Navigate to="/login" />
          } />

          <Route path="/perfil" element={
            isAuth ? <PerfilUsuario /> : <Navigate to="/login" />
          } />

          <Route path="/vehicles" element={
            isAuth ? <VehiclesPage user={decodedUser} /> : <Navigate to="/login" />
          } />

          <Route path="/movimientos" element={
            isAuth ? <MovimientosPage /> : <Navigate to="/login" />
          } />

          <Route path="/reportes" element={
            isAuth ? <ReportesPage /> : <Navigate to="/login" />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
