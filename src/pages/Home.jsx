import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Shield,
  BarChart3,
  Lock,
  LogIn,
  UserPlus,
  Users,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Clock,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import imgPark from "../assets/park.JPG";
import Modal from "../components/Modal";
import Login from "./Login";
import Register from "./Register";

export default function Home() {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleLogin = () => setModalType("login");

  const handleRegister = () => setModalType("register");

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const gradientStyle = {
    background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(30, 126, 52, 0.1), transparent 80%)`,
  };

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gestión por Roles",
      description:
        "Administración diferenciada con permisos específicos por tipo de usuario.",
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Control Vehicular",
      description:
        "Registro y seguimiento completo de vehículos con validación en tiempo real.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Reportes Inteligentes",
      description:
        "Análisis estadístico avanzado para optimización de espacios.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Seguridad Integral",
      description: "Autenticación segura y registro completo de auditoría.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Registro",
      description: "Usuarios registran sus vehículos",
    },
    {
      number: "02",
      title: "Acceso",
      description: "Control de entrada/salida por placa",
    },
    {
      number: "03",
      title: "Monitoreo",
      description: "Supervisión en tiempo real",
    },
    {
      number: "04",
      title: "Análisis",
      description: "Reportes para optimización",
    },
  ];

  const stats = [
    { value: "100%", label: "Seguridad", icon: <Shield className="w-5 h-5" /> },
    {
      value: "24/7",
      label: "Disponibilidad",
      icon: <Clock className="w-5 h-5" />,
    },
    { value: "0", label: "Errores", icon: <CheckCircle className="w-5 h-5" /> },
    { value: "500+", label: "Vehículos", icon: <Car className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-surface-primary relative overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={gradientStyle}
      />
      <div className="fixed inset-0 z-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E7E34' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>
      <nav className="relative z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-token-md">
                <Car className="w-4 h-4 sm:w-5 sm:h-5 text-fg-inverse" />
              </div>
              <div className="hidden xs:block">
                <h1 className="text-base sm:text-lg md:text-xl font-semibold text-fg-primary tracking-tight whitespace-nowrap">
                  SENA ParkControl
                </h1>
                <p className="text-xs text-fg-tertiary hidden sm:block">
                  Sistema de Gestión
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-1 sm:space-x-2 md:space-x-3"
            >
              <button
                onClick={handleLogin}
                className="sm:hidden p-2 text-fg-secondary hover:text-brand-hover hover:bg-surface-tertiary rounded-lg transition-colors duration-200"
                title="Iniciar Sesión"
              >
                <LogIn className="w-5 h-5" />
              </button>

              <button
                onClick={handleLogin}
                className="hidden sm:flex items-center px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium text-fg-secondary hover:text-brand-hover transition-colors duration-200 rounded-lg hover:bg-surface-tertiary whitespace-nowrap"
              >
                <LogIn className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </button>

              <button
                onClick={handleRegister}
                className="px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium text-fg-inverse bg-brand-primary rounded-lg transition-all duration-200 whitespace-nowrap flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Registrarse</span>
              </button>
            </motion.div>
          </div>
        </div>
      </nav>
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-success-light text-success text-sm font-medium mb-8 border border-success">
                <Sparkles className="w-4 h-4 mr-2" />
                Sistema Certificado SENA
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fg-primary mb-6 leading-tight tracking-tight">
                Control inteligente
                <span className="block text-brand-primary">
                  de parqueaderos
                </span>
              </h1>

              <p className="text-lg text-fg-secondary mb-10 leading-relaxed max-w-2xl">
                Sistema integral para la gestión eficiente de accesos
                vehiculares en centros de formación del SENA. Diseñado para
                optimizar espacios y automatizar procesos.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-brand-primary/10 rounded-xl blur-3xl" />
                <div className="relative bg-surface-primary rounded-xl border border-default p-8 shadow-token-xl">
                  <div className="rounded-xl bg-success-light flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-7xl mb-6">
                        <img
                          src={imgPark}
                          alt="Park"
                          className="w-32 h-auto mx-auto pt-4"
                        />
                      </div>
                      <div className="text-fg-primary font-semibold text-xl">
                        SENA ParkControl
                      </div>
                      <p className="text-fg-tertiary text-sm mt-2">
                        Gestión Inteligente
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -2 }}
                        className="bg-surface-primary p-4 rounded-xl border border-default shadow-token-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-fg-primary">
                              {stat.value}
                            </div>
                            <div className="text-sm text-fg-tertiary">
                              {stat.label}
                            </div>
                          </div>
                          <div className="text-brand-primary">{stat.icon}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="relative z-10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-surface-tertiary text-fg-tertiary text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Características Principales
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-fg-primary mb-4">
              Diseñado para la excelencia
            </h2>
            <p className="text-lg text-fg-secondary max-w-2xl mx-auto">
              Funcionalidades pensadas para optimizar la gestión vehicular en
              centros SENA
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="bg-surface-primary rounded-2xl border border-default p-6 shadow-token-sm transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-fg-inverse">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-fg-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-fg-secondary text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Steps Section */}
      <section className="relative z-10 py-6 bg-gradient-to-b from-surface-primary to-surface-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-fg-primary mb-4">
              Flujo de trabajo optimizado
            </h2>
            <p className="text-lg text-fg-secondary max-w-2xl mx-auto">
              Proceso simplificado para máxima eficiencia
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-default to-transparent -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-surface-primary rounded-2xl border border-default p-8 shadow-token-sm transition-all duration-300">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-hover mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold text-fg-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-fg-secondary">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative z-10 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-brand-primary to-brand-hover rounded-3xl p-12 shadow-token-xl"
          >
            <div className="text-center">
              <Building2 className="w-16 h-16 text-fg-inverse mx-auto mb-8 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold text-fg-inverse mb-6">
                Optimiza tu parqueadero hoy
              </h2>
              <p className="text-xl text-fg-inverse/80 mb-10 max-w-2xl mx-auto">
                Únete a la comunidad de centros SENA que gestionan sus
                parqueaderos con eficiencia y seguridad.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <footer className="relative z-10 border-t border-default py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center">
                  <Car className="w-5 h-5 text-fg-inverse" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fg-primary">
                    SENA ParkControl
                  </h3>
                  <p className="text-sm text-fg-tertiary">
                    Sistema de Gestión Vehicular
                  </p>
                </div>
              </div>
              <p className="text-fg-tertiary text-sm max-w-md">
                Desarrollado para optimizar la gestión de parqueaderos en
                centros de formación del SENA.
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-fg-tertiary text-sm mb-2">
                © {new Date().getFullYear()} Servicio Nacional de Aprendizaje
                SENA
              </p>
              <p className="text-xs text-fg-tertiary">
                Todos los derechos reservados
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-default text-center">
            <p className="text-sm text-fg-tertiary">
              Para soporte técnico, contactar al área de sistemas del centro de
              formación.
            </p>
          </div>
        </div>
      </footer>
<Modal open={modalType === "login"} onClose={() => setModalType(null)}>
  <Modal.Content>
    <Login
      onSuccess={() => {
        setModalType(null);
        navigate("/dashboard");
      }}
      onSwitchRegister={() => {
        setModalType("register");
      }}
    />
  </Modal.Content>
</Modal>

<Modal open={modalType === "register"} onClose={() => setModalType(null)}>
  <Modal.Content>
    <Register
      onSuccess={() => {
        setModalType(null);
        setModalType("login");
      }}
      onSwitchLogin={() => {
        setModalType("login");
      }}
    />
  </Modal.Content>
</Modal>
    </div>
  );
}
