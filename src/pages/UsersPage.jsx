import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  User, 
  Mail, 
  Shield, 
  Trash2, 
  UserPlus,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  ChevronDown,
  CheckCircle,
  XCircle,
  Eye,
  Phone,
  FileText,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Car,
  Bike,
  Truck,
  ChevronRight,
  Maximize2
} from 'lucide-react'
import Modal from '../components/Modal' // Asegúrate de tener esta importación

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('todos')
  const [deletingId, setDeletingId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null) // Para el modal
  const [showUserModal, setShowUserModal] = useState(false) // Control del modal
  const [userVehicles, setUserVehicles] = useState([]) // Vehículos del usuario
  const [loadingVehicles, setLoadingVehicles] = useState(false) // Loading para vehículos
  const [selectedVehicleImage, setSelectedVehicleImage] = useState(null) // Imagen ampliada del vehículo

  // Cargar usuarios
async function load() {
  setLoading(true)
  setError(null)
  try {
    const data = await api.request('/users', { method: 'GET' })
    console.log('Datos de usuarios recibidos:', data)
    if (data.length > 0) {
      console.log('Primer usuario:', data[0])
      console.log('Primer usuario ID:', data[0].IdUsuario)
      console.log('Primer usuario _id:', data[0]._id)
    }
    setUsers(data)
  } catch(err) { 
    setError(err.message) 
  } finally {
    setLoading(false)
  }
}

  // Eliminar usuario
  async function remove(id) {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return
    
    setDeletingId(id)
    try { 
      await api.request('/users/' + id, { method: 'DELETE' })
      setUsers(users.filter(u => u.IdUsuario !== id))
    } catch(err) { 
      alert(err.message) 
    } finally {
      setDeletingId(null)
    }
  }

  // Función para obtener vehículos del usuario
  const loadUserVehicles = async (userId) => {
    setLoadingVehicles(true)
    try {
      const data = await api.request(`/users/${userId}/vehicles`, { method: 'GET' })
      setUserVehicles(data)
    } catch(err) {
      console.error('Error al cargar vehículos del usuario:', err)
      setUserVehicles([])
    } finally {
      setLoadingVehicles(false)
    }
  }

  // Ver detalles del usuario
  const viewUserDetails = async (user) => {
    console.log('User object:', user);
    console.log('User ID:', user.IdUsuario);
    setSelectedUser(user)
    setShowUserModal(true)
    // Cargar vehículos del usuario
    await loadUserVehicles(user.IdUsuario)
  }

  useEffect(() => { 
    load() 
  }, [])

  // Función para obtener la URL de la imagen del usuario
  const getImageUrl = (fotoPerfil) => {
    if (!fotoPerfil) return null
    const baseUrl = 'https://api-park-mongo.onrender.com'
    return `${baseUrl}${fotoPerfil}`
  }

  // Función para obtener la URL de la imagen del vehículo
  const getVehicleImageUrl = (FotoVehiculo) => {
    if (!FotoVehiculo) return null
    const baseUrl = 'https://api-park-mongo.onrender.com'
    return `${baseUrl}${FotoVehiculo}`
  }

  // Filtrar usuarios según búsqueda y filtro de rol
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.NombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Documento?.toString().includes(searchTerm)
    
    const matchesRole = roleFilter === 'todos' || user.NombreRol === roleFilter
    
    return matchesSearch && matchesRole
  })

  // Obtener roles únicos para filtros
  const uniqueRoles = ['todos', ...new Set(users.map(user => user.NombreRol))]

  // Estadísticas
  const roleCounts = users.reduce((acc, user) => {
    acc[user.NombreRol] = (acc[user.NombreRol] || 0) + 1
    return acc
  }, {})

  const roleColors = {
    'Administrador': { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-500' },
    'Vigilante': { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-500' },
    'Instructor': { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-500' },
    'Aprendiz': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-500' },
    'Visitante': { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-500' }
  }

  // Colores para tipos de vehículos
  const vehicleTypeColors = {
    'carro': { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: 'text-emerald-600' },
    'moto': { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-600' },
    'bicicleta': { bg: 'bg-lime-100', text: 'text-lime-800', icon: 'text-lime-600' }
  }

  const vehicleTypeIcons = {
    'carro': <Car className="w-4 h-4" />,
    'moto': <Bike className="w-4 h-4" />,
    'bicicleta': <Truck className="w-4 h-4" />
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
                Gestión de Usuarios
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Administra los usuarios del sistema SENA ParkControl
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Panel de estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{users.length}</div>
            <p className="text-sm text-gray-600 mt-2">Usuarios registrados</p>
          </div>

          {Object.entries(roleCounts).map(([role, count]) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${roleColors[role]?.bg || 'bg-gray-100'} ${roleColors[role]?.icon || 'text-gray-500'}`}>
                  <User className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-500">{role}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{count}</div>
              <p className="text-sm text-gray-600 mt-2">Usuarios</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Panel de búsqueda y filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Lista de Usuarios
              </h2>
              <p className="text-gray-600">
                {filteredUsers.length} de {users.length} usuarios encontrados
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
                Buscar usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, correo o documento..."
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-2" />
                Filtrar por rol
              </label>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white"
              >
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>
                    {role === 'todos' ? 'Todos los roles' : role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Tabla de usuarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Mensaje de error */}
          {error && (
            <div className="m-6 p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error al cargar usuarios</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
              <p className="mt-2 text-gray-600">Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron usuarios</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm || roleFilter !== 'todos' 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'No hay usuarios registrados en el sistema'}
              </p>
            </div>
          ) : (
            <>
              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Información de Contacto
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <motion.tr
                        key={user.IdUsuario}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              onClick={() => viewUserDetails(user)}
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                                {getImageUrl(user.FotoPerfil) ? (
                                  <img
                                    src={getImageUrl(user.FotoPerfil)}
                                    alt={user.NombreCompleto}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = ''  
                                    }}
                                  />
                                ) : (
                                  <User className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 cursor-pointer hover:text-emerald-600 transition-colors"
                                   onClick={() => viewUserDetails(user)}>
                                {user.NombreCompleto}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.IdUsuario}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <a 
                                href={`mailto:${user.Correo}`}
                                className="text-emerald-600 hover:text-emerald-500 hover:underline"
                              >
                                {user.Correo}
                              </a>
                            </div>
                            {user.Telefono && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{user.Telefono}</span>
                              </div>
                            )}
                            {user.Documento && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span>Doc: {user.Documento}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${roleColors[user.NombreRol]?.bg || 'bg-gray-100'} ${roleColors[user.NombreRol]?.text || 'text-gray-700'}`}>
                            <Shield className="w-3 h-3 mr-1.5" />
                            {user.NombreRol}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-emerald-600 font-medium">Activo</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => viewUserDetails(user)}
                              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center space-x-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Ver</span>
                            </button>
                            <button
                              onClick={() => remove(user.IdUsuario)}
                              disabled={deletingId === user.IdUsuario}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                              {deletingId === user.IdUsuario ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer de la tabla */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-gray-600">
                  <div>
                    Mostrando <span className="font-semibold text-gray-900">{filteredUsers.length}</span> de{' '}
                    <span className="font-semibold text-gray-900">{users.length}</span> usuarios
                  </div>
                  <div className="flex items-center space-x-4">
                    {Object.entries(roleCounts).map(([role, count]) => (
                      <div key={role} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: roleColors[role]?.text?.replace('text-', 'bg-').split(' ')[0] || '#9CA3AF' }}
                        />
                        <span>{role}: {count}</span>
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
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Consideraciones importantes
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>La eliminación de usuarios es permanente y no se puede deshacer</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Asegúrese de que el usuario no tenga vehículos registrados antes de eliminarlo</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Solo los administradores tienen acceso a esta funcionalidad</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de detalles del usuario */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <Modal onClose={() => setShowUserModal(false)}>
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-4 border-emerald-200 bg-gray-100 overflow-hidden flex items-center justify-center mx-auto">
                    {getImageUrl(selectedUser.FotoPerfil) ? (
                      <img
                        src={getImageUrl(selectedUser.FotoPerfil)}
                        alt={selectedUser.NombreCompleto}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <div className={`absolute bottom-0 right-8 ${roleColors[selectedUser.NombreRol]?.bg || 'bg-gray-100'} ${roleColors[selectedUser.NombreRol]?.text || 'text-gray-700'} px-3 py-1 rounded-full text-xs font-medium`}>
                    {selectedUser.NombreRol}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mt-4">{selectedUser.NombreCompleto}</h2>
                <p className="text-gray-600">ID: {selectedUser.IdUsuario}</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Documento</p>
                      <p className="font-medium">{selectedUser.Documento || 'No registrado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{selectedUser.Telefono || 'No registrado'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacto
                  </h3>
                  <div>
                    <p className="text-sm text-gray-500">Correo Electrónico</p>
                    <a 
                      href={`mailto:${selectedUser.Correo}`}
                      className="font-medium text-emerald-600 hover:text-emerald-500 hover:underline break-all"
                    >
                      {selectedUser.Correo}
                    </a>
                  </div>
                </div>

                {/* Sección de vehículos del usuario */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 mr-2" />
                      Vehículos ({userVehicles.length})
                    </div>
                    {loadingVehicles && (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    )}
                  </h3>
                  
                  {loadingVehicles ? (
                    <div className="text-center py-4">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                      <p className="text-sm text-gray-600 mt-2">Cargando vehículos...</p>
                    </div>
                  ) : userVehicles.length === 0 ? (
                    <div className="text-center py-4">
                      <Truck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">El usuario no tiene vehículos registrados</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userVehicles.map((vehicle) => (
                        <div 
                          key={vehicle.IdVehiculo} 
                          className="bg-white rounded-lg p-3 border border-blue-100 hover:border-blue-200 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className={`p-1.5 rounded-md ${vehicleTypeColors[vehicle.Tipo]?.bg || 'bg-gray-100'} ${vehicleTypeColors[vehicle.Tipo]?.icon || 'text-gray-500'}`}>
                                  {vehicleTypeIcons[vehicle.Tipo] || <Truck className="w-3 h-3" />}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{vehicle.Placa}</div>
                                  <div className="text-xs text-gray-500 capitalize">{vehicle.Tipo} • {vehicle.Modelo || 'Sin modelo'}</div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 flex items-center space-x-2">
                                <span>Color: {vehicle.Color || 'Sin especificar'}</span>
                                <span>•</span>
                                <span>ID: {vehicle.IdVehiculo}</span>
                              </div>
                            </div>
                            
                            {/* Imagen del vehículo */}
                            {getVehicleImageUrl(vehicle.FotoVehiculo) && (
                              <div className="relative ml-2">
                                <div 
                                  className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors"
                                  onClick={() => setSelectedVehicleImage(getVehicleImageUrl(vehicle.FotoVehiculo))}
                                >
                                  <img
                                    src={getVehicleImageUrl(vehicle.FotoVehiculo)}
                                    alt={`Foto de ${vehicle.Placa}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      e.currentTarget.nextSibling.style.display = 'flex'
                                    }}
                                  />
                                  <div 
                                    style={{ display: 'none' }}
                                    className="w-full h-full bg-gray-100 flex items-center justify-center"
                                  >
                                    <Truck className="w-6 h-6 text-gray-400" />
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSelectedVehicleImage(getVehicleImageUrl(vehicle.FotoVehiculo))}
                                  className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                                  title="Ampliar imagen"
                                >
                                  <Maximize2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-emerald-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Estado
                  </h3>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium text-emerald-600">Usuario Activo</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">El usuario tiene acceso completo al sistema</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal para imagen ampliada del vehículo */}
      <AnimatePresence>
        {selectedVehicleImage && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-[1001]"
            onClick={() => setSelectedVehicleImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-sm transition-colors z-10"
                onClick={() => setSelectedVehicleImage(null)}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="bg-black/20 rounded-xl overflow-hidden">
                <img
                  src={selectedVehicleImage}
                  alt="Imagen ampliada del vehículo"
                  className="max-w-full max-h-[85vh] object-contain"
                />
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setSelectedVehicleImage(null)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  Cerrar vista
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente RefreshCw para el botón de actualizar
const RefreshCw = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
    />
  </svg>
)