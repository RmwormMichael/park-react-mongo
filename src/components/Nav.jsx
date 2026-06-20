import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

export default function Nav() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const onLogout = () => {
    sessionStorage.setItem('post_logout', 'true');
    logout();
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo y nombre */}
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
            >
              <Car className="w-5 h-5 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">SENA ParkControl</h1>
              <p className="text-xs text-gray-500">Sistema de Gestión</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink 
              to="/dashboard"
              className={({ isActive }) => 
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                }`
              }
            >
              Dashboard
            </NavLink>

            {/* SOLO ADMIN */}
            {(user?.idRol === 1 || user?.idRolName === "Administrador") && (
              <>
                <NavLink 
                  to="/users"
                  className={({ isActive }) => 
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'text-emerald-600 bg-emerald-50' 
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`
                  }
                >
                  Usuarios
                </NavLink>
                <NavLink 
                  to="/reportes"
                  className={({ isActive }) => 
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'text-emerald-600 bg-emerald-50' 
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`
                  }
                >
                  Reportes
                </NavLink>
              </>
            )}

            {/* VIGILANTE */}
            {user?.idRolName === "Vigilante" && (
              <NavLink 
                to="/reportes"
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`
                }
              >
                Reportes
              </NavLink>
            )}

            {/* TODOS los roles pueden ver Movimientos */}
            <NavLink 
              to="/movimientos"
              className={({ isActive }) => 
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                }`
              }
            >
              Movimientos
            </NavLink>

            {/* APRENDIZ / INSTRUCTOR / VISITANTE / ADMIN / VIGILANTE */}
            {["Aprendiz", "Instructor", "Visitante", "Administrador", "Vigilante"]
              .includes(user?.idRolName) && (
              <NavLink 
                to="/vehicles"
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`
                }
              >
                Vehículos
              </NavLink>
            )}

                        {["Aprendiz", "Instructor", "Visitante"].includes(user?.idRolName) && (
                <NavLink 
                  to="/perfil"
                  className={({ isActive }) => 
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'text-emerald-600 bg-emerald-50' 
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`
                  }
                >
                  Mi Perfil
                </NavLink>
              )}

            {/* User info and logout button */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{user.nombre}</p>
                    <p className="text-xs text-gray-500">{user.idRolName}</p>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors duration-200 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user.nombre}</p>
                  <p className="text-xs text-gray-500">{user.idRolName}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-1">
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 transition-colors ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </NavLink>

                {/* SOLO ADMIN */}
                {(user?.idRol === 1 || user?.idRolName === "Administrador") && (
                  <>
                    <NavLink
                      to="/users"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 transition-colors ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      <Users className="w-5 h-5" />
                      <span>Usuarios</span>
                    </NavLink>
                    <NavLink
                      to="/reportes"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 transition-colors ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Reportes</span>
                    </NavLink>
                  </>
                )}

                {/* VIGILANTE */}
                {user?.idRolName === "Vigilante" && (
                  <NavLink
                    to="/reportes"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 transition-colors ${
                        isActive 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Reportes</span>
                  </NavLink>
                )}

                {/* TODOS los roles pueden ver Movimientos */}
                <NavLink
                  to="/movimientos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 transition-colors ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <Car className="w-5 h-5" />
                  <span>Movimientos</span>
                </NavLink>

                {/* APRENDIZ / INSTRUCTOR / VISITANTE / ADMIN / VIGILANTE */}
                {["Aprendiz", "Instructor", "Visitante", "Administrador", "Vigilante"]
                  .includes(user?.idRolName) && (
                  <NavLink
                    to="/vehicles"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 transition-colors ${
                        isActive 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <Car className="w-5 h-5" />
                    <span>Vehículos</span>
                  </NavLink>
                )}

                
                {["Aprendiz", "Instructor", "Visitante"].includes(user?.idRolName) && (
                    <NavLink
                      to="/perfil"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 transition-colors ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      <User className="w-5 h-5" />
                      <span>Mi Perfil</span>
                    </NavLink>
                  )}

                {/* Logout button for mobile */}
                <div className="px-4 py-3 border-t border-gray-100 mt-2">
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}