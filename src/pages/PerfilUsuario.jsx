import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, FileText, Camera, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PerfilUsuario = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = authUser?.id;

      const data = await api.request(`/users/${userId}`);
      setUserData(data);
      setFormData({
        nombreCompleto: data.NombreCompleto,
        documento: data.Documento,
        correo: data.Correo,
        telefono: data.Telefono || ''
      });
      
      // Si ya tiene foto de perfil, cargarla
      if (data.FotoPerfil) {
        const baseUrl = 'http://localhost:4000';
        setImagePreview(`${baseUrl}${data.FotoPerfil}`);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      setErrorMessage('Error al cargar los datos del usuario');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('La imagen no debe superar los 5MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecciona una imagen válida');
      return;
    }

    setProfileImage(file);
    
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userId = authUser?.id;

      const formDataToSend = new FormData();
      formDataToSend.append('nombreCompleto', formData.nombreCompleto);
      formDataToSend.append('documento', formData.documento);
      formDataToSend.append('correo', formData.correo);
      formDataToSend.append('telefono', formData.telefono);
      
      if (profileImage) {
        formDataToSend.append('fotoPerfil', profileImage);
      }

      const updatedUser = await api.request(`/users/${userId}`, {
        method: 'PUT',
        body: formDataToSend
      });

      if (updatedUser.FotoPerfil) {
        const baseUrl = 'http://localhost:4000';
        setImagePreview(`${baseUrl}${updatedUser.FotoPerfil}?t=${Date.now()}`);
      }

      setUserData(updatedUser);


      setEditing(false);
      setSuccessMessage('Perfil actualizado correctamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setErrorMessage(error.message || 'Error al actualizar el perfil');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      nombreCompleto: userData?.NombreCompleto || '',
      documento: userData?.Documento || '',
      correo: userData?.Correo || '',
      telefono: userData?.Telefono || ''
    });
    setProfileImage(null);
    if (userData?.FotoPerfil) {
      const baseUrl = 'http://localhost:4000';
      setImagePreview(`${baseUrl}${userData.FotoPerfil}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header con fondo gradient */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 bg-gray-200 overflow-hidden flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  {editing && (
                    <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors shadow-lg">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {userData?.NombreCompleto}
                  </h1>
                  <p className="text-emerald-100 mt-1">{userData?.NombreRol}</p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="mt-4 md:mt-0 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium border border-white/30"
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </div>

          {/* Mensajes de éxito/error */}
          {successMessage && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 m-4 rounded-lg">
              <p className="text-emerald-700">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-lg">
              <p className="text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* Contenido del perfil */}
          <div className="p-6 md:p-8">
            {editing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campo Nombre */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 mr-2" />
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="nombreCompleto"
                      value={formData.nombreCompleto}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Campo Documento */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FileText className="w-4 h-4 mr-2" />
                      Documento
                    </label>
                    <input
                      type="text"
                      name="documento"
                      value={formData.documento}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Campo Email */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Campo Teléfono */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del usuario */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nombre Completo</p>
                      <p className="font-medium text-gray-900">{userData?.NombreCompleto}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Documento</p>
                      <p className="font-medium text-gray-900">{userData?.Documento}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Correo Electrónico</p>
                      <p className="font-medium text-gray-900">{userData?.Correo}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium text-gray-900">
                        {userData?.Telefono || 'No registrado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instrucciones para subir foto */}
            {editing && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Puedes subir una foto de perfil en formato JPG, PNG o GIF.
                  Tamaño máximo: 5MB. La imagen se ajustará automáticamente a 500x500 píxeles.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PerfilUsuario;