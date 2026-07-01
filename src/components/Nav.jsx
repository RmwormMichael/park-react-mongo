import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasRole, isAdmin, ROLES } from '../utils/permissions';
import {
  Car,
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import Badge from './Badge';

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'text-success bg-success-light'
      : 'text-fg-secondary hover:text-success hover:bg-surface-tertiary'
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 transition-colors ${
    isActive
      ? 'text-success bg-success-light'
      : 'text-fg-secondary hover:bg-surface-tertiary'
  }`;

const navItems = [
  { to: '/dashboard', label: 'Dashboard', mobileIcon: LayoutDashboard, show: true },
  { to: '/users', label: 'Usuarios', mobileIcon: Users, show: (user) => isAdmin(user) },
  { to: '/reportes', label: 'Reportes', mobileIcon: BarChart3, show: (user) => hasRole(user, ROLES.ADMIN, ROLES.VIGILANTE) },
  { to: '/movimientos', label: 'Movimientos', mobileIcon: Car, show: true },
  { to: '/vehicles', label: 'Vehículos', mobileIcon: Car, show: true },
  { to: '/perfil', label: 'Mi Perfil', mobileIcon: User, show: true },
];

export default function Nav() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handleChange = (e) => {
      if (e.matches) setMobileMenuOpen(false);
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const onLogout = () => {
    sessionStorage.setItem('post_logout', 'true');
    logout();
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-sticky bg-surface-primary/95 backdrop-blur-md border-b border-default shadow-token-sm"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-token-lg">
              <Car className="w-5 h-5 text-fg-inverse" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-fg-primary">SENA ParkControl</h1>
              <p className="text-xs text-fg-tertiary">Sistema de Gestión</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const show = typeof item.show === 'function' ? item.show(user) : item.show;
              if (!show) return null;
              return (
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              );
            })}

            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="success" size="md">
                    <User size={14} />
                  </Badge>
                  <div className="text-left">
                    <p className="text-sm font-medium text-fg-primary">{user.nombre}</p>
                    <p className="text-xs text-fg-tertiary">{user.idRolName}</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  icon={LogOut}
                  onClick={onLogout}
                >
                  Cerrar sesión
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <Badge variant="success" size="md">
                  <User size={14} />
                </Badge>
                <div className="text-left">
                  <p className="text-sm font-medium text-fg-primary">{user.nombre}</p>
                  <p className="text-xs text-fg-tertiary">{user.idRolName}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-fg-secondary" />
              ) : (
                <Menu className="w-5 h-5 text-fg-secondary" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              role="navigation"
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: 500 }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden overflow-hidden border-t border-default"
            >
              <div className="py-4 space-y-1">
                {navItems.map((item) => {
                  const show = typeof item.show === 'function' ? item.show(user) : item.show;
                  if (!show) return null;
                  const Icon = item.mobileIcon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}

                <div className="px-4 py-3 border-t border-default mt-2">
                  <Button
                    variant="destructive"
                    size="md"
                    icon={LogOut}
                    className="w-full"
                    onClick={onLogout}
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
