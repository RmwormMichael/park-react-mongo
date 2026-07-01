import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { isAdmin, isAdminOrVigilante } from '../utils/permissions';
import { motion } from 'framer-motion';
import {
  Users,
  Car,
  Activity,
  BarChart3,
  Shield,
  LogIn,
} from 'lucide-react';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

function QuickActionCard({ icon: Icon, title, description, onClick, visible }) {
  if (!visible) return null;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
    >
      <Card className="transition-shadow hover:shadow-token-lg cursor-pointer">
        <Card.Content className="flex gap-4 items-start !pt-6">
          <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0">
            <Icon size={20} className="text-brand-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-fg-primary">{title}</h3>
            <p className="text-sm text-fg-secondary mt-1">{description}</p>
          </div>
        </Card.Content>
      </Card>
    </motion.button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [summary, setSummary] = useState({
    usuarios: null,
    vehiculos: null,
    dentro: null,
    movimientosHoy: null,
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
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const today = `${year}-${month}-${day}`;

        if (isAdmin(user)) {
          const [users, vehicles, movimientos] = await Promise.all([
            api.request('/users', { method: 'GET' }).catch(() => []),
            api.request('/vehicles', { method: 'GET' }).catch(() => []),
            api.request(`/movimientos/range?start=${today}&end=${today}`, {
              method: 'GET'
            }).catch(() => [])
          ]);

          const dentro = movimientos.filter(m => m.Estado === "dentro").length;
          setSummary({
            usuarios: users.length,
            vehiculos: vehicles.length,
            dentro,
            movimientosHoy: movimientos.length,
          });

          setRecentVehicles(
            movimientos.filter(m => m.Estado === "dentro").slice(0, 5)
          );
        } else if (user.idRolName === "Vigilante") {
          const movimientos = await api.request(
            `/movimientos/range?start=${today}&end=${today}`,
            { method: 'GET' }
          ).catch(() => []);

          const dentro = movimientos.filter(m => m.Estado === "dentro").length;
          setSummary({ dentro, movimientosHoy: movimientos.length, usuarios: null, vehiculos: null });
          setRecentVehicles(
            movimientos.filter(m => m.Estado === "dentro").slice(0, 5)
          );
        } else {
          const vehicles = await api.request('/vehicles/user', { method: 'GET' }).catch(() => []);
          setSummary({ vehiculos: vehicles.length, usuarios: null, dentro: null, movimientosHoy: null });
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
    return <Loading mode="centered" text="Cargando..." />;
  }

  const stats = [
    {
      title: "Usuarios registrados",
      value: summary.usuarios,
      icon: Users,
      variant: "info",
      show: isAdmin(user),
    },
    {
      title: "Vehículos registrados",
      value: summary.vehiculos,
      icon: Car,
      variant: "success",
      show: ["Administrador", "Aprendiz", "Instructor", "Visitante"].includes(user.idRolName),
    },
    {
      title: "Vehículos dentro",
      value: summary.dentro,
      icon: Activity,
      variant: "warning",
      show: isAdminOrVigilante(user),
    },
    {
      title: "Movimientos hoy",
      value: summary.movimientosHoy,
      icon: BarChart3,
      variant: "brand",
      show: isAdminOrVigilante(user),
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-fg-primary">Panel de Control</h1>
            <p className="text-base text-fg-secondary mt-2">
              Bienvenido de vuelta, <span className="font-semibold text-fg-primary">{user.nombre}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="brand" icon={Shield}>{user.idRolName}</Badge>
            <span className="text-sm text-fg-tertiary">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </motion.header>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Alert variant="error" title="Error al cargar datos" dismissible onDismiss={() => setError(null)}>
              {error}
            </Alert>
          </motion.div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="py-20">
            <Loading mode="centered" text="Cargando estadísticas..." />
          </div>
        ) : (
          <>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.filter(s => s.show).map((stat, i) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.2, ease: 'easeOut' }}
                >
                  <StatCard
                    variant={stat.variant}
                    icon={stat.icon}
                    label={stat.title}
                    value={stat.value}
                  />
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-fg-primary mb-4">Acciones rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickActionCard
                  icon={Users}
                  title="Gestionar Usuarios"
                  description="Administrar permisos y acceso al sistema"
                  onClick={() => navigate('/users')}
                  visible={isAdmin(user)}
                />
                <QuickActionCard
                  icon={LogIn}
                  title="Registrar Movimiento"
                  description="Control de entrada y salida de vehículos"
                  onClick={() => navigate('/movimientos')}
                  visible={true}
                />
                <QuickActionCard
                  icon={Car}
                  title="Gestionar Vehículos"
                  description="Ver y administrar vehículos registrados"
                  onClick={() => navigate('/vehicles')}
                  visible={true}
                />
              </div>
            </section>

            {/* Recent Vehicles */}
            {isAdminOrVigilante(user) && recentVehicles.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-fg-primary">Vehículos actualmente dentro</h2>
                  <span className="text-sm text-fg-tertiary">{recentVehicles.length} vehículos</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {recentVehicles.map((vehicle, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2, ease: 'easeOut' }}
                    >
                      <Card className="text-center">
                        <Card.Content>
                          <div className="flex flex-col items-center gap-2">
                            <Car size={24} className="text-fg-tertiary" />
                            <span className="font-mono font-bold text-lg text-fg-primary">{vehicle.Placa}</span>
                            <span className="text-sm text-fg-secondary">{vehicle.NombreCompleto}</span>
                            <span className="text-xs text-fg-tertiary">
                              Entró: {new Date(vehicle.FechaEntrada).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </Card.Content>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

          </>
        )}
      </div>
    </div>
  );
}
