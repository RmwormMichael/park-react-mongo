import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import { isAdminOrVigilante, isBasicRole } from "../utils/permissions";
import { motion } from "framer-motion";
import {
  Car,
  Clock,
  LogIn,
  LogOut,
  Eye,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw,
} from "lucide-react";
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

export default function MovimientosPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [placa, setPlaca] = useState("");
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [filter, setFilter] = useState("todos"); // 'todos', 'dentro', 'fuera'
  const [feedback, setFeedback] = useState(null); // { type: 'error'|'warning'|'info', message }

  const canEdit = isAdminOrVigilante(user);
  const isBasicUser = isBasicRole(user);

  async function entrada() {
    if (!placa.trim()) {
      setFeedback({ type: 'error', message: 'Por favor ingrese una placa' });
      return;
    }

    setRegistering(true);
    try {
      let v;

      if (canEdit) {
        v = await api.request("/vehicles", { method: "GET" });
      } else {
        v = await api.request("/vehicles/user", { method: "GET" });
      }

      const found = v.find((x) => x.Placa === placa.toUpperCase());

      if (!found) {
        setRegistering(false);
        setFeedback({ type: 'error', message: 'Placa no encontrada en el sistema' });
        return;
      }

      await api.request("/movimientos/entrada", {
        method: "POST",
        body: { idVehiculo: found.IdVehiculo },
      });

      toast({ title: "Entrada registrada exitosamente", variant: "success" });
      setPlaca("");
      loadRange();
    } catch (err) {
      setFeedback({ type: 'error', message: `Error: ${err.message}` });
    } finally {
      setRegistering(false);
    }
  }

  async function salida() {
    if (!placa.trim()) {
      setFeedback({ type: 'error', message: 'Por favor ingrese una placa' });
      return;
    }

    setRegistering(true);
    try {
      await api.request("/movimientos/salida", {
        method: "POST",
        body: { placa: placa.toUpperCase() },
      });
      toast({ title: "Salida registrada exitosamente", variant: "success" });
      setPlaca("");
      loadRange();
    } catch (err) {
      setFeedback({ type: 'error', message: `Error: ${err.message}` });
    } finally {
      setRegistering(false);
    }
  }

  async function loadRange() {
    setLoading(true);
    try {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");

      const today = `${year}-${month}-${day}`;

      const start = today;
      const end = today;

      const data = await api.request(
        `/movimientos/range?start=${start}&end=${end}`,
      );
      setMovimientos(data);
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Error al cargar movimientos' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRange();
  }, []);

  // Filtrar movimientos según el estado
  const filteredMovimientos = movimientos.filter((m) => {
    if (filter === "todos") return true;
    if (filter === "dentro") return m.Estado === "dentro";
    if (filter === "fuera") return m.Estado === "fuera";
    return true;
  });

  // Estadísticas
  const dentroCount = movimientos.filter((m) => m.Estado === "dentro").length;
  const fueraCount = movimientos.filter((m) => m.Estado === "fuera").length;

  const roleBadgeVariant = {
    'Administrador': 'error',
    'Vigilante': 'warning',
    'Instructor': 'info',
    'Aprendiz': 'success',
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-fg-primary">
                Movimientos
              </h1>
              <p className="text-sm text-fg-secondary mt-1">
                Control de entrada y salida de vehículos
                {user && (
                  <Badge variant={roleBadgeVariant[user.idRolName] || 'neutral'} icon={Shield} className="ml-2">
                    {user.idRolName}
                  </Badge>
                )}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-sm text-fg-tertiary">
                <Calendar className="inline w-4 h-4 mr-2" />
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <Button
                variant="secondary"
                icon={RefreshCw}
                onClick={loadRange}
                disabled={loading}
              >
                Actualizar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Alert
              variant={feedback.type}
              dismissible
              onDismiss={() => setFeedback(null)}
            >
              {feedback.message}
            </Alert>
          </motion.div>
        )}

        {/* Panel de estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <StatCard
              variant="info"
              icon={Car}
              label="Total hoy"
              value={movimientos.length}
              description="Movimientos registrados"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <StatCard
              variant="success"
              icon={LogIn}
              label="Dentro"
              value={dentroCount}
              description="Vehículos en el parqueadero"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <StatCard
              variant="warning"
              icon={LogOut}
              label="Salidas"
              value={fueraCount}
              description="Vehículos que han salido"
            />
          </motion.div>
        </motion.div>

        {/* Panel de registro (SOLO ADMIN/VIGILANTE) */}
        {canEdit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <Card.Header>
                <div>
                  <h2 className="text-xl font-bold text-fg-primary">
                    Registro rápido
                  </h2>
                  <p className="text-fg-secondary">
                    Registrar entrada o salida de vehículos
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-brand-light text-brand-primary">
                  <Shield className="w-6 h-6" />
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <Input
                      icon={Car}
                      label="Placa del vehículo"
                      value={placa}
                      onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                      placeholder="Ej: ABC123"
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-end">
                    <Button
                      variant="primary"
                      size="lg"
                      icon={LogIn}
                      onClick={entrada}
                      disabled={registering}
                      loading={registering}
                      className="flex-1"
                    >
                      Registrar Entrada
                    </Button>

                    <Button
                      variant="secondary"
                      size="lg"
                      icon={LogOut}
                      onClick={salida}
                      disabled={registering}
                      loading={registering}
                      className="flex-1"
                    >
                      Registrar Salida
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-sm text-fg-secondary">
                  <p>
                    ✅ Puede registrar entrada/salida de cualquier vehículo en el
                    sistema
                  </p>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {/* Mensaje para roles básicos */}
        {isBasicUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-info-light rounded-xl border border-info p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-surface-primary text-info">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fg-primary mb-2">
                    Modo de solo visualización
                  </h3>
                  <p className="text-fg-secondary">
                    Como {user?.idRolName}, solo puedes visualizar tus
                    movimientos. Para registrar entrada o salida de vehículos,
                    contacta a un vigilante o administrador.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filtros y tabla */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            {/* Header de la tabla */}
            <div className="px-6 py-4 border-b border-default">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-fg-primary">
                    Movimientos del día
                  </h2>
                  <p className="text-fg-secondary">
                    {filteredMovimientos.length} movimientos encontrados
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-fg-tertiary" />
                    <span className="text-sm text-fg-secondary">Filtrar:</span>
                  </div>
                  <div className="flex space-x-2">
                    {["todos", "dentro", "fuera"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filter === f
                            ? "bg-brand-primary text-fg-inverse"
                            : "bg-surface-tertiary text-fg-secondary hover:opacity-80"
                        }`}
                      >
                        {f === "todos"
                          ? "Todos"
                          : f === "dentro"
                            ? "Dentro"
                            : "Salidas"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-tertiary">
                    <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                      Placa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                      Propietario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                      Hora de Entrada
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                      Hora de Salida
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-default">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <Loading text="Cargando movimientos..." />
                      </td>
                    </tr>
                  ) : filteredMovimientos.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <EmptyState
                          title="No hay movimientos para mostrar"
                          description={filter !== "todos"
                            ? `No hay movimientos con estado "${filter}"`
                            : "Comience registrando un movimiento"}
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredMovimientos.map((m) => (
                      <motion.tr
                        key={m.IdMovimiento}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-surface-tertiary transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-surface-tertiary">
                              <Car className="w-4 h-4 text-fg-secondary" />
                            </div>
                            <div>
                              <div className="font-mono font-bold text-fg-primary">
                                {m.Placa}
                              </div>
                              {m.Tipo && (
                                <div className="text-xs text-fg-tertiary capitalize">
                                  {m.Tipo}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-fg-primary">
                            {m.NombreCompleto || "N/A"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-fg-tertiary" />
                            <span className="text-fg-secondary">
                              {m.FechaEntrada
                                ? new Date(m.FechaEntrada).toLocaleTimeString(
                                    "es-ES",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                    },
                                  )
                                : "N/A"}
                            </span>
                          </div>
                          <div className="text-xs text-fg-tertiary mt-1">
                            {m.FechaEntrada
                              ? new Date(m.FechaEntrada).toLocaleDateString(
                                  "es-ES",
                                )
                              : ""}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {m.FechaSalida ? (
                            <>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-fg-tertiary" />
                                <span className="text-fg-secondary">
                                  {new Date(m.FechaSalida).toLocaleTimeString(
                                    "es-ES",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                              <div className="text-xs text-fg-tertiary mt-1">
                                {new Date(m.FechaSalida).toLocaleDateString(
                                  "es-ES",
                                )}
                              </div>
                            </>
                          ) : (
                            <span className="text-fg-tertiary">—</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <Badge
                            variant={m.Estado === "dentro" ? "success" : "neutral"}
                            icon={m.Estado === "dentro" ? CheckCircle : XCircle}
                          >
                            {m.Estado === "dentro" ? "Dentro" : "Fuera"}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer de la tabla */}
            <div className="px-6 py-4 border-t border-default bg-surface-tertiary">
              <div className="flex justify-between items-center text-sm text-fg-secondary">
                <div>
                  Mostrando{" "}
                  <span className="font-semibold text-fg-primary">
                    {filteredMovimientos.length}
                  </span>{" "}
                  de <span className="font-semibold text-fg-primary">{movimientos.length}</span>{" "}
                  movimientos
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <span>Dentro: {dentroCount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <span>Fuera: {fueraCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
