import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Car,
  Bike,
  Truck,
  PlusCircle,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  User,
  Mail,
  Shield,
  RefreshCw,
  Camera,
  Image as ImageIcon,
  X,
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

export default function VehiclesPage({ user }) {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ 
    placa: '', 
    tipo: 'carro', 
    modelo: '', 
    color: '' 
  })
  const [vehicleImage, setVehicleImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('todos')
  const [deletingId, setDeletingId] = useState(null)
  const [uploading, setUploading] = useState(false)

  const isAdminOrVigilante = ["Administrador", "Vigilante"].includes(user?.idRolName)
  const canRegisterVehicle = ["Aprendiz", "Instructor", "Visitante", "Administrador", "Vigilante"].includes(user?.idRolName)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      let data
      
      if (isAdminOrVigilante) {
        data = await api.request('/vehicles', { method: 'GET' })
      } else {
        data = await api.request('/vehicles/user', { method: 'GET' })
      }
      
      setVehicles(data)
    } catch(err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no debe superar los 10MB')
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona una imagen válida')
      return
    }

    setVehicleImage(file)
    
    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  async function submit(e) {
    e.preventDefault()
    setUploading(true)
    setError(null)

    try {
      // Crear FormData para enviar archivo
      const formDataToSend = new FormData()
      formDataToSend.append('placa', form.placa)
      formDataToSend.append('tipo', form.tipo)
      formDataToSend.append('modelo', form.modelo)
      formDataToSend.append('color', form.color)
      
      if (vehicleImage) {
        formDataToSend.append('fotoVehiculo', vehicleImage)
      }

      const data = await api.request('/vehicles', {
        method: 'POST',
        body: formDataToSend
      })

      setForm({ 
        placa: '', 
        tipo: 'carro', 
        modelo: '', 
        color: '' 
      })
      setVehicleImage(null)
      setImagePreview('')
      
      load()
      
      alert('✅ Vehículo registrado correctamente')
    } catch(err) {
      console.error('Error al registrar vehículo:', err)
      setError(err.message)
      alert(`❌ Error: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  async function remove(id) {
    if (!confirm('¿Está seguro de eliminar este vehículo? Esta acción eliminará también todos los movimientos registrados.')) return
    
    setDeletingId(id)
    try {
      await api.request('/vehicles/' + id, { method: 'DELETE' })
      load()
    } catch(err) {
      // Mostrar mensaje más específico
      if (err.message.includes('tiene movimientos registrados')) {
        alert(`❌ Error: ${err.message}\n\nSolución:\n1. Vaya a la página de Movimientos\n2. Registre la salida del vehículo\n3. Luego intente eliminarlo de nuevo`)
      } else {
        alert(`❌ Error: ${err.message}`)
      }
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Función para obtener la URL de la imagen del vehículo
  const getVehicleImageUrl = (FotoVehiculo) => {
    if (!FotoVehiculo) return null
    const baseUrl = 'http://localhost:4000'
    return `${baseUrl}${FotoVehiculo}`
  }

  // Filtrar vehículos
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm === '' || 
      vehicle.Placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.Modelo && vehicle.Modelo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.Color && vehicle.Color.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.NombreCompleto && vehicle.NombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.Correo && vehicle.Correo.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = typeFilter === 'todos' || vehicle.Tipo === typeFilter
    
    return matchesSearch && matchesType
  })

  // Estadísticas por tipo
  const typeCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.Tipo] = (acc[vehicle.Tipo] || 0) + 1
    return acc
  }, {})

  const typeColors = {
    'carro': { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: 'text-emerald-600' },
    'moto': { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-600' },
    'bicicleta': { bg: 'bg-lime-100', text: 'text-lime-800', icon: 'text-lime-600' }
  }

  const typeIcons = {
    'carro': <Car className="w-5 h-5" />,
    'moto': <Bike className="w-5 h-5" />,
    'bicicleta': <Truck className="w-5 h-5" />
  }

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
                Gestión de Vehículos
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Administra los vehículos registrados en SENA ParkControl
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Panel de estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gray-100 text-gray-600">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{vehicles.length}</div>
            <p className="text-sm text-gray-600 mt-2">Vehículos registrados</p>
          </div>

          {Object.entries(typeCounts).map(([type, count]) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${typeColors[type]?.bg || 'bg-gray-100'} ${typeColors[type]?.icon || 'text-gray-500'}`}>
                  {typeIcons[type] || <Truck className="w-6 h-6" />}
                </div>
                <span className="text-sm font-medium text-gray-500 capitalize">{type}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{count}</div>
              <p className="text-sm text-gray-600 mt-2">Vehículos</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Formulario de registro */}
        {canRegisterVehicle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Registrar Nuevo Vehículo
                </h2>
                <p className="text-gray-600">
                  Completa los datos del vehículo a registrar
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                <PlusCircle className="w-6 h-6" />
              </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {/* Sección de foto */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-3">Foto del Vehículo (Opcional)</h3>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 bg-white overflow-hidden flex items-center justify-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview del vehículo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Sin imagen</p>
                        </div>
                      )}
                    </div>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('')
                          setVehicleImage(null)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label className="block mb-3">
                      <div className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer text-center font-medium">
                        <Camera className="inline w-4 h-4 mr-2" />
                        {vehicleImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-600 mt-2">
                      Sube una foto clara del vehículo. Formatos: JPG, PNG, GIF, WEBP. Máximo: 10MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Campos del formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placa *
                  </label>
                  <input
                    type="text"
                    value={form.placa}
                    onChange={e => setForm({ ...form, placa: e.target.value.toUpperCase() })}
                    placeholder="ABC123"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={form.tipo}
                    onChange={e => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white"
                  >
                    <option value="carro">Carro</option>
                    <option value="moto">Moto</option>
                    <option value="bicicleta">Bicicleta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={form.modelo}
                    onChange={e => setForm({ ...form, modelo: e.target.value })}
                    placeholder="Ej: Toyota Corolla"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={e => setForm({ ...form, color: e.target.value })}
                    placeholder="Ej: Rojo"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Registrar Vehículo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Panel de búsqueda y filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Lista de Vehículos
              </h2>
              <p className="text-gray-600">
                {filteredVehicles.length} de {vehicles.length} vehículos encontrados
              </p>
            </div>
            
            <button
              onClick={load}
              disabled={loading}
              className="px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Actualizar</span>
                </>
              )}
            </button>
          </div>

          {/* Filtros de búsqueda */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline w-4 h-4 mr-2" />
                Buscar vehículo
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar por placa, modelo, color, propietario..."
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-2" />
                Filtrar por tipo
              </label>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white"
              >
                <option value="todos">Todos los tipos</option>
                <option value="carro">Carro</option>
                <option value="moto">Moto</option>
                <option value="bicicleta">Bicicleta</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Tabla de vehículos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Mensaje de error */}
          {error && (
            <div className="m-6 p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error al cargar vehículos</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <LoadingSpinner message="Cargando vehículos..." />
          ) : filteredVehicles.length === 0 ? (
            <EmptyState
              message="No se encontraron vehículos"
              suggestion={searchTerm || typeFilter !== 'todos'
                ? 'Intenta con otros términos de búsqueda'
                : canRegisterVehicle
                  ? 'Registra tu primer vehículo usando el formulario'
                  : 'No hay vehículos registrados'}
            />
          ) : (
            <>
              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehículo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Foto
                      </th>
                      {isAdminOrVigilante && (
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Propietario
                        </th>
                      )}
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Especificaciones
                      </th>
                      {isAdminOrVigilante && (
                        <>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contacto
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rol
                          </th>
                        </>
                      )}
                      {isAdminOrVigilante && (
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      )}
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-100">
                    {filteredVehicles.map((vehicle) => (
                      <motion.tr
                        key={vehicle.IdVehiculo}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-xl ${typeColors[vehicle.Tipo]?.bg || 'bg-gray-100'} ${typeColors[vehicle.Tipo]?.icon || 'text-gray-500'}`}>
                              {typeIcons[vehicle.Tipo] || <Truck className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {vehicle.Placa}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {vehicle.Tipo}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            {getVehicleImageUrl(vehicle.FotoVehiculo) ? (
                              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                                <img
                                  src={getVehicleImageUrl(vehicle.FotoVehiculo)}
                                  alt={`Foto de ${vehicle.Placa}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    const sibling = e.target.nextSibling
                                    if (sibling && sibling.style) {
                                      sibling.style.display = 'block'
                                    }
                                  }}
                                />
                                <div 
                                  style={{ display: 'none' }}
                                  className="w-full h-full bg-gray-100 flex items-center justify-center"
                                >
                                  <ImageIcon className="w-6 h-6 text-gray-400" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </td>
                        
                        {isAdminOrVigilante && (
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-xl bg-gray-100">
                                <User className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {vehicle.NombreCompleto}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}
                        
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900">
                                {vehicle.Modelo || 'Sin especificar'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-4 h-4" />
                              <span>Color: {vehicle.Color || 'Sin especificar'}</span>
                            </div>
                          </div>
                        </td>
                        
                        {isAdminOrVigilante && (
                          <>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <a 
                                  href={`mailto:${vehicle.Correo}`}
                                  className="text-emerald-600 hover:text-emerald-500 hover:underline"
                                >
                                  {vehicle.Correo}
                                </a>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${vehicle.NombreRol === 'Administrador' ? 'bg-red-100 text-red-700' : vehicle.NombreRol === 'Vigilante' ? 'bg-amber-100 text-amber-700' : vehicle.NombreRol === 'Instructor' ? 'bg-blue-100 text-blue-700' : vehicle.NombreRol === 'Aprendiz' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                                <Shield className="w-3 h-3 mr-1.5" />
                                {vehicle.NombreRol}
                              </div>
                            </td>
                          </>
                        )}
                        
                        {isAdminOrVigilante && (
                          <td className="px-6 py-4">
                            <button
                              onClick={() => remove(vehicle.IdVehiculo)}
                              disabled={deletingId === vehicle.IdVehiculo}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                              {deletingId === vehicle.IdVehiculo ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              <span>Eliminar</span>
                            </button>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer de la tabla */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-gray-600">
                  <div>
                    Mostrando <span className="font-semibold text-gray-900">{filteredVehicles.length}</span> de{' '}
                    <span className="font-semibold text-gray-900">{vehicles.length}</span> vehículos
                  </div>
                  <div className="flex items-center space-x-4">
                    {Object.entries(typeCounts).map(([type, count]) => (
                      <div key={type} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${typeColors[type]?.bg || 'bg-gray-300'}`} />
                        <span className="capitalize">{type}: {count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Información de seguridad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Consideraciones importantes
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Puedes subir fotos de tus vehículos para mejor identificación</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>La eliminación de vehículos elimina también las fotos asociadas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Solo administradores y vigilantes pueden eliminar vehículos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}