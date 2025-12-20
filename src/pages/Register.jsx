import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import { UserPlus, ShieldCheck } from "lucide-react";

export default function Register() {
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

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    setRoles([
      { IdRol: 3, NombreRol: "Aprendiz" },
      { IdRol: 2, NombreRol: "Instructor" },
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

      alert("¡Registro exitoso! Inicia sesión.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.6 }}
        className="w-full px-4 py-2 mt-2 bg-white border border-gray-300 rounded-xl 
focus:outline-none focus:ring-2 focus:ring-[#39A900] 
transition-all duration-200 hover:border-[#39A900]"
      >
        <div className="flex justify-center mb-6">
          <ShieldCheck size={42} className="text-sena-green" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Registro - SENA ParkControl
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Crea tu cuenta para acceder al sistema
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
            <input
              name="nombreCompleto"
              className="w-full px-4 py-2 mt-2 bg-white border border-gray-300 rounded-xl 
focus:outline-none focus:ring-2 focus:ring-[#39A900] 
transition-all duration-200 hover:border-[#39A900]"
              onChange={handleChange}
              value={form.nombreCompleto}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Documento</label>
              <input
                name="documento"
                className="w-full px-4 py-2 mt-2 bg-white border border-gray-300 rounded-xl 
focus:outline-none focus:ring-2 focus:ring-[#39A900] 
transition-all duration-200 hover:border-[#39A900]"
                onChange={handleChange}
                value={form.documento}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Teléfono</label>
              <input
                name="telefono"
                className="w-full px-4 py-2 mt-2 bg-gray-100 border border-gray-300 rounded-xl 
             focus:outline-none focus:ring-2 focus:ring-blue-500-form"
                onChange={handleChange}
                value={form.telefono}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              name="correo"
              className="w-full px-4 py-2 mt-2 bg-white border border-gray-300 rounded-xl 
focus:outline-none focus:ring-2 focus:ring-[#39A900] 
transition-all duration-200 hover:border-[#39A900]"
              onChange={handleChange}
              value={form.correo}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Rol</label>
            <select
              name="idRol"
              className="input-form"
              onChange={handleChange}
              value={form.idRol}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.IdRol} value={rol.IdRol}>
                  {rol.NombreRol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              className="w-full px-4 py-2 mt-2 bg-gray-100 border border-gray-300 rounded-xl 
             focus:outline-none focus:ring-2 focus:ring-blue-500-form"
              onChange={handleChange}
              value={form.contrasena}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirmarContrasena"
              className="input-form"
              onChange={handleChange}
              value={form.confirmarContrasena}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border px-3 py-2 rounded-lg text-center">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-sena-green text-white py-3 rounded-lg font-semibold shadow hover:bg-sena-green-dark transition"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="text-center text-gray-600 text-sm mt-3">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-sena-green hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
