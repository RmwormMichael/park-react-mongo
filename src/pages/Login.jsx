import React, { useState, useLayoutEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LogIn, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login({ onSuccess, onSwitchRegister }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useLayoutEffect(() => {
    if (sessionStorage.getItem('post_logout') === 'true') {
      sessionStorage.removeItem('post_logout');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0 }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.request("/auth/login", {
        method: "POST",
        body: { correo, contrasena },
      });

      if (!res || !res.token) throw new Error("Credenciales inválidas");

      login(res.token);

      if (onSuccess) onSuccess();

      navigate('/dashboard');

    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.6 }}
        className="w-full bg-white rounded-2xl p-2"
      >
        <div className="flex items-center justify-center mb-4">
          <ShieldCheck size={42} className="text-sena-green" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          SENA ParkControl
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Inicia sesión para continuar
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">

          <div>
            <label className="text-sm text-gray-700 font-medium">Correo</label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sena-green"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">Contraseña</label>
            <input
              type="password"
              className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sena-green"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-sena-green text-white py-3 rounded-lg font-semibold shadow hover:bg-sena-green-dark transition flex items-center justify-center"
          >
            {loading ? (
              "Ingresando..."
            ) : (
              <>
                <LogIn size={18} className="mr-2" /> Ingresar
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-5">
          ¿No tienes cuenta?{" "}
          <span
            className="text-sena-green font-medium cursor-pointer hover:underline"
            onClick={onSwitchRegister}
          >
            Regístrate aquí
          </span>
        </p>
      </motion.div>
    </div>
  );
}
