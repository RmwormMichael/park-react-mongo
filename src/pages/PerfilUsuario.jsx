import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, FileText, Camera, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import Badge from '../components/Badge';

const PerfilUsuario = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);
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

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('La imagen no debe superar los 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecciona una imagen válida');
      return;
    }

    setProfileImage(file);

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
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loading mode="centered" size="lg" text="Cargando información del perfil..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <Card>
            <div className="bg-brand-primary p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-fg-inverse/30 bg-surface-tertiary overflow-hidden flex items-center justify-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-fg-tertiary" />
                      )}
                    </div>
                    {editing && (
                      <div className="absolute bottom-0 right-0">
                        <IconButton
                          variant="primary"
                          size="sm"
                          icon={Camera}
                          className="shadow-token-lg"
                          aria-label="Cambiar foto de perfil"
                          onClick={() => fileInputRef.current?.click()}
                        />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-fg-inverse">
                      {userData?.NombreCompleto}
                    </h1>
                    <p className="text-fg-inverse/80 mt-1">{userData?.NombreRol}</p>
                  </div>
                </div>
                {!editing && (
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setEditing(true)}
                    className="mt-4 md:mt-0 text-fg-inverse border border-fg-inverse/30 bg-surface-primary/20 backdrop-blur-sm hover:bg-surface-primary/30"
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {successMessage && (
                <div className="mb-4">
                  <Alert variant="success" title={successMessage} />
                </div>
              )}

              {errorMessage && (
                <div className="mb-4">
                  <Alert variant="error" title={errorMessage} />
                </div>
              )}

              {editing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      icon={User}
                      label="Nombre Completo"
                      name="nombreCompleto"
                      value={formData.nombreCompleto}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      icon={FileText}
                      label="Documento"
                      name="documento"
                      value={formData.documento}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      icon={Mail}
                      label="Correo Electrónico"
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      icon={Phone}
                      label="Teléfono"
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="Opcional"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-default">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={uploading}
                      icon={Save}
                      className="flex-1"
                    >
                      Guardar Cambios
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      icon={X}
                      className="flex-1"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <Badge variant="success" size="lg" icon={User} />
                      <div>
                        <p className="text-sm text-fg-tertiary">Nombre Completo</p>
                        <p className="font-medium text-fg-primary">{userData?.NombreCompleto}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge variant="info" size="lg" icon={FileText} />
                      <div>
                        <p className="text-sm text-fg-tertiary">Documento</p>
                        <p className="font-medium text-fg-primary">{userData?.Documento}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <Badge variant="brand" size="lg" icon={Mail} />
                      <div>
                        <p className="text-sm text-fg-tertiary">Correo Electrónico</p>
                        <p className="font-medium text-fg-primary">{userData?.Correo}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge variant="warning" size="lg" icon={Phone} />
                      <div>
                        <p className="text-sm text-fg-tertiary">Teléfono</p>
                        <p className="font-medium text-fg-primary">
                          {userData?.Telefono || 'No registrado'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {editing && (
                <div className="mt-8">
                  <Alert variant="info" title="Nota">
                    Puedes subir una foto de perfil en formato JPG, PNG o GIF.
                    Tamaño máximo: 5MB. La imagen se ajustará automáticamente a 500x500 píxeles.
                  </Alert>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
