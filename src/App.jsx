import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DesignSystemPage from './pages/DesignSystemPage';
import UsersPage from './pages/UsersPage';
import VehiclesPage from './pages/VehiclesPage';
import MovimientosPage from './pages/MovimientosPage';
import ReportesPage from './pages/ReportesPage';
import Nav from './components/Nav';
import PerfilUsuario from './pages/PerfilUsuario';
import PrivateRoute from './components/PrivateRoute';
import { ToastProvider } from './components/ToastProvider';
import { ROLES } from './utils/permissions';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user: decodedUser, isAuth, loading } = useAuth();

  if (loading) return null;

  return (
    <ToastProvider>
      <div className="app-root">
        {isAuth && <Nav />}

        <main className="app-main">
          <Routes>
            <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/design-system" element={<DesignSystemPage />} />

            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />

            <Route path="/users" element={
              <PrivateRoute roles={[ROLES.ADMIN]}><UsersPage /></PrivateRoute>
            } />

            <Route path="/perfil" element={
              <PrivateRoute><PerfilUsuario /></PrivateRoute>
            } />

            <Route path="/vehicles" element={
              <PrivateRoute><VehiclesPage user={decodedUser} /></PrivateRoute>
            } />

            <Route path="/movimientos" element={
              <PrivateRoute><MovimientosPage /></PrivateRoute>
            } />

            <Route path="/reportes" element={
              <PrivateRoute roles={[ROLES.ADMIN, ROLES.VIGILANTE]}><ReportesPage /></PrivateRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
}
