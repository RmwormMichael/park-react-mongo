import React from 'react';
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
import PerfilUsuario from './pages/PerfilUsuario';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user: decodedUser, isAuth, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="app-root">
      {isAuth && <Nav />}

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
