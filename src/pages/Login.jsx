import React, { useState, useLayoutEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Button from "../components/Button";

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
    <AuthLayout
      title="SENA ParkControl"
      subtitle="Inicia sesión para continuar"
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <span
            className="text-brand-primary font-medium cursor-pointer hover:underline"
            onClick={onSwitchRegister}
          >
            Regístrate aquí
          </span>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4 mt-6">
        <Input
          label="Correo"
          placeholder="correo@ejemplo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        {error && (
          <Alert variant="error">{error}</Alert>
        )}
        <Button
          type="submit"
          loading={loading}
          icon={LogIn}
          className="w-full"
        >
          Ingresar
        </Button>
      </form>
    </AuthLayout>
  );
}
