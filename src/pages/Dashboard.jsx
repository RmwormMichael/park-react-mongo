import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Users, 
  Car, 
  Clock, 
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState({ 
    usuarios: 0, 
    vehiculos: 0, 
    dentro: 0,
    movimientosHoy: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentVehicles, setRecentVehicles] = useState([]);

  useEffect(() => {
  if (!user) return;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener fechas de hoy
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const today = `${year}-${month}-${day}`;
      const start = `${today} 00:00:00`;
      const end = `${today} 23:59:59`;

      // ADMINISTRADOR → puede ver todo
      if (user.idRol === 1 || user.idRolName === "Administrador") {
        const [users, vehicles, movimientos] = await Promise.all([
          api.request('/users', { method: 'GET' }).catch(() => []),
          api.request('/vehicles', { method: 'GET' }).catch(() => []),
          // CAMBIO AQUÍ: Usar /movimientos/range con fecha de hoy
          api.request(`/movimientos/range?start=${today}&end=${today}`, { 
            method: 'GET' 
          }).catch(() => [])
        ]);

        const dentro = movimientos.filter(m => m.Estado === "dentro").length;
        const movimientosHoy = movimientos.length; // Ya están filtrados por hoy

        setSummary({
          usuarios: users.length,
          vehiculos: vehicles.length,
          dentro,
          movimientosHoy
        });

        // Últimos vehículos dentro (solo los de hoy)
        const dentroList = movimientos
          .filter(m => m.Estado === "dentro")
          .slice(0, 5);
        setRecentVehicles(dentroList);
      }

      // VIGILANTE → movimientos del día
      else if (user.idRolName === "Vigilante") {
        // CAMBIO AQUÍ: Usar /movimientos/range con fecha de hoy
        const movimientos = await api.request(
          `/movimientos/range?start=${today}&end=${today}`, 
          { method: 'GET' }
        ).catch(() => []);
        
        const dentro = movimientos.filter(m => m.Estado === "dentro").length;
        const movimientosHoy = movimientos.length; // Ya están filtrados por hoy

        setSummary({ 
          dentro, 
          movimientosHoy, 
          usuarios: null, 
          vehiculos: null 
        });

        // Últimos vehículos dentro (solo los de hoy)
        const dentroList = movimientos
          .filter(m => m.Estado === "dentro")
          .slice(0, 5);
        setRecentVehicles(dentroList);
      }

      // APRENDIZ / INSTRUCTOR / VISITANTE → solo sus vehículos
      else {
        const vehicles = await api.request('/vehicles/user', { method: 'GET' }).catch(() => []);
        setSummary({ 
          vehiculos: vehicles.length, 
          usuarios: null, 
          dentro: null,
          movimientosHoy: null 
        });
      }

    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError(err.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const roleColors = {
    "Administrador": { 
      bg: "from-red-500/10 to-red-500/5", 
      icon: "text-red-500",
      border: "border-red-100"
    },
    "Vigilante": { 
      bg: "from-amber-500/10 to-amber-500/5", 
      icon: "text-amber-500",
      border: "border-amber-100"
    },
    "Instructor": { 
      bg: "from-blue-500/10 to-blue-500/5", 
      icon: "text-blue-500",
      border: "border-blue-100"
    },
    "Aprendiz": { 
      bg: "from-emerald-500/10 to-emerald-500/5", 
      icon: "text-emerald-500",
      border: "border-emerald-100"
    },
    "Visitante": { 
      bg: "from-purple-500/10 to-purple-500/5", 
      icon: "text-purple-500",
      border: "border-purple-100"
    }
  };

  const userRole = roleColors[user.idRolName] || { 
    bg: "from-gray-500/10 to-gray-500/5", 
    icon: "text-gray-500",
    border: "border-gray-100"
  };

  const stats = [
    {
      title: "Usuarios registrados",
      value: summary.usuarios ?? '-',
      icon: <Users className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      show: user.idRolName === "Administrador"
    },
    {
      title: "Vehículos registrados",
      value: summary.vehiculos ?? '-',
      icon: <Car className="w-5 h-5" />,
      color: "from-emerald-500 to-teal-500",
      show: ["Administrador", "Aprendiz", "Instructor", "Visitante"].includes(user.idRolName)
    },
    {
      title: "Vehículos dentro",
      value: summary.dentro ?? '-',
      icon: <Activity className="w-5 h-5" />,
      color: "from-amber-500 to-orange-500",
      show: ["Administrador", "Vigilante"].includes(user.idRolName)
    },
    {
      title: "Movimientos hoy",
      value: summary.movimientosHoy ?? '-',
      icon: <BarChart3 className="w-5 h-5" />,
      color: "from-violet-500 to-purple-500",
      show: ["Administrador", "Vigilante"].includes(user.idRolName)
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Panel de Control
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Bienvenido de vuelta, <span className="font-semibold text-gray-900">{user.nombre}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`px-4 py-2 rounded-xl border ${userRole.border} bg-gradient-to-r ${userRole.bg}`}>
                <div className="flex items-center space-x-2">
                  <Shield className={`w-4 h-4 ${userRole.icon}`} />
                  <span className="text-sm font-medium text-gray-700">{user.idRolName}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error al cargar datos</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {stats.filter(stat => stat.show).map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <div className="text-white">
                          {stat.icon}
                        </div>
                      </div>
                      <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.title}</h3>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    
                    <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                        style={{ width: stat.value === '-' ? '0%' : '100%' }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Recent Vehicles (Admin & Vigilante) */}
            {["Administrador", "Vigilante"].includes(user.idRolName) && recentVehicles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Vehículos actualmente dentro</h2>
                  <span className="text-sm text-gray-500">{recentVehicles.length} vehículos</span>
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
                    {recentVehicles.map((vehicle, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-6 border-r border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">🚗</div>
                          <div className="font-mono font-bold text-lg text-gray-900 mb-1">
                            {vehicle.Placa}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{vehicle.NombreCompleto}</div>
                          <div className="text-xs text-gray-400">
                            Entró: {new Date(vehicle.FechaEntrada).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones rápidas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.idRolName === "Administrador" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/users')}
                    className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl text-left hover:shadow-md transition-all"
                  >
                    <Users className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Gestionar Usuarios</h3>
                    <p className="text-sm text-gray-600">Administrar permisos y acceso al sistema</p>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/movimientos')}
                  className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl text-left hover:shadow-md transition-all"
                >
                  <Car className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Registrar Movimiento</h3>
                  <p className="text-sm text-gray-600">Control de entrada y salida de vehículos</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/vehicles')}
                  className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl text-left hover:shadow-md transition-all"
                >
                  <Car className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Gestionar Vehículos</h3>
                  <p className="text-sm text-gray-600">Ver y administrar vehículos registrados</p>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}