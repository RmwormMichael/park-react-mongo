import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../components/ToastProvider";
import { UserPlus } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Button from "../components/Button";

export default function Register() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    nombreCompleto: "",
    documento: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: "",
    idRol: 3,
  });

  useEffect(() => {
    setRoles([
      { IdRol: 3, NombreRol: "Aprendiz" },
      { IdRol: 4, NombreRol: "Visitante" },
    ]);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!form.nombreCompleto.trim()) return "El nombre completo es requerido";
    if (!form.documento.trim()) return "El documento es requerido";
    if (!form.correo.trim()) return "El correo es requerido";
    if (!form.telefono.trim()) return "El teléfono es requerido";
    if (form.contrasena.length < 6)
      return "La contraseña debe tener mínimo 6 caracteres";
    if (form.contrasena !== form.confirmarContrasena)
      return "Las contraseñas no coinciden";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    const err = validateForm();
    if (err) return setError(err);

    setLoading(true);

    try {
      const data = {
        idRol: parseInt(form.idRol),
        nombreCompleto: form.nombreCompleto,
        documento: form.documento,
        correo: form.correo,
        telefono: form.telefono,
        contrasena: form.contrasena,
      };

      await api.request("/auth/register", { method: "POST", body: data });

      toast({ title: "Registro exitoso", description: "Inicia sesión para continuar.", variant: "success" });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Registro - SENA ParkControl"
      subtitle="Crea tu cuenta para acceder al sistema"
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-brand-primary hover:underline">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4 mt-6">
        <Input
          label="Nombre Completo"
          name="nombreCompleto"
          value={form.nombreCompleto}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Documento"
            name="documento"
            value={form.documento}
            onChange={handleChange}
            required
          />
          <Input
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Correo"
          type="email"
          name="correo"
          value={form.correo}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-fg-secondary mb-2">Rol</label>
          <select
            name="idRol"
            value={form.idRol}
            onChange={handleChange}
            className="w-full h-11 px-4 rounded-lg border border-default bg-bg-primary text-fg-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-default transition-colors duration-200"
          >
            <option value="">Selecciona un rol</option>
            {roles.map((rol) => (
              <option key={rol.IdRol} value={rol.IdRol}>
                {rol.NombreRol}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Contraseña"
          type="password"
          name="contrasena"
          value={form.contrasena}
          onChange={handleChange}
          required
        />

        <Input
          label="Confirmar Contraseña"
          type="password"
          name="confirmarContrasena"
          value={form.confirmarContrasena}
          onChange={handleChange}
          required
        />

        {error && (
          <Alert variant="error">{error}</Alert>
        )}

        <Button
          type="submit"
          loading={loading}
          icon={UserPlus}
          className="w-full"
        >
          Registrarse
        </Button>
      </form>
    </AuthLayout>
  );
}
