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
  Eye,
  Phone,
  FileText,
  Car,
  Bike,
  Truck,
  Maximize2,
  X,
  RefreshCw,
} from 'lucide-react'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import Button from '../components/Button'
import Input from '../components/Input'
import Badge from '../components/Badge'
import Alert from '../components/Alert'
import Card from '../components/Card'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('todos')
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null) // Para el modal
  const [showUserModal, setShowUserModal] = useState(false) // Control del modal
  const [userVehicles, setUserVehicles] = useState([]) // Vehículos del usuario
  const [loadingVehicles, setLoadingVehicles] = useState(false) // Loading para vehículos
  const [selectedVehicleImage, setSelectedVehicleImage] = useState(null) // Imagen ampliada del vehículo
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [createForm, setCreateForm] = useState({
    idRol: 3,
    nombreCompleto: '',
    documento: '',
    correo: '',
    telefono: '',
    contrasena: ''
  })

  const createRoles = [
    { IdRol: 2, NombreRol: 'Instructor' },
    { IdRol: 3, NombreRol: 'Aprendiz' },
    { IdRol: 4, NombreRol: 'Visitante' },
    { IdRol: 5, NombreRol: 'Vigilante' }
  ]

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
    setDeletingId(id)
    try { 
      await api.request('/users/' + id, { method: 'DELETE' })
      setUsers(users.filter(u => u.IdUsuario !== id))
    } catch(err) { 
      setError(err.message)
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

  const openCreateModal = () => {
    setCreateForm({ idRol: 3, nombreCompleto: '', documento: '', correo: '', telefono: '', contrasena: '' })
    setCreateError(null)
    setShowCreateModal(true)
  }

  const handleCreateChange = (e) =>
    setCreateForm({ ...createForm, [e.target.name]: e.target.value })

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError(null)

    if (!createForm.nombreCompleto.trim()) return setCreateError('El nombre completo es requerido')
    if (!createForm.documento.trim()) return setCreateError('El documento es requerido')
    if (!createForm.correo.trim()) return setCreateError('El correo es requerido')
    if (!createForm.telefono.trim()) return setCreateError('El teléfono es requerido')
    if (createForm.contrasena.length < 6) return setCreateError('La contraseña debe tener mínimo 6 caracteres')

    setCreating(true)
    try {
      await api.request('/users', {
        method: 'POST',
        body: {
          idRol: parseInt(createForm.idRol),
          nombreCompleto: createForm.nombreCompleto,
          documento: createForm.documento,
          correo: createForm.correo,
          telefono: createForm.telefono,
          contrasena: createForm.contrasena
        }
      })
      setShowCreateModal(false)
      await load()
    } catch (err) {
      setCreateError(err.message || 'Error al crear usuario')
    } finally {
      setCreating(false)
    }
  }

  useEffect(() => { 
    load() 
  }, [])

  // Función para obtener la URL de la imagen del usuario
  const getImageUrl = (fotoPerfil) => {
    if (!fotoPerfil) return null
    const baseUrl = 'http://localhost:4000'
    return `${baseUrl}${fotoPerfil}`
  }

  // Función para obtener la URL de la imagen del vehículo
  const getVehicleImageUrl = (FotoVehiculo) => {
    if (!FotoVehiculo) return null
    const baseUrl = 'http://localhost:4000'
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

  // Colores para tipos de vehículos
  const vehicleTypeColors = {
    'carro': { bg: 'bg-brand-light', text: 'text-brand-primary', icon: 'text-brand-primary' },
    'moto': { bg: 'bg-success-light', text: 'text-success', icon: 'text-success' },
    'bicicleta': { bg: 'bg-info-light', text: 'text-info', icon: 'text-info' }
  }

  const vehicleTypeIcons = {
    'carro': <Car className="w-4 h-4" />,
    'moto': <Bike className="w-4 h-4" />,
    'bicicleta': <Truck className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-fg-primary">
              Gestión de Usuarios
            </h1>
            <p className="text-base text-fg-secondary mt-2">
              Administra los usuarios del sistema SENA ParkControl
            </p>
          </div>
        </motion.header>

        {/* Panel de estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
        >
          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-bg-info text-fg-info">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-fg-tertiary">Total</span>
              </div>
              <div className="text-3xl font-bold text-fg-primary">{users.length}</div>
              <p className="text-sm text-fg-secondary mt-2">Usuarios registrados</p>
            </Card.Content>
          </Card>

          {Object.entries(roleCounts).map(([role, count]) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Card>
                <Card.Content className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="neutral" size="sm">{role}</Badge>
                  </div>
                  <div className="text-3xl font-bold text-fg-primary">{count}</div>
                  <p className="text-sm text-fg-secondary mt-2">Usuarios</p>
                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Panel de búsqueda y filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.2, ease: 'easeOut' }}
        >
          <Card>
            <Card.Content className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-fg-primary">
                    Lista de Usuarios
                  </h2>
                  <p className="text-fg-secondary">
                    {filteredUsers.length} de {users.length} usuarios encontrados
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="primary" icon={UserPlus} onClick={openCreateModal}>
                    Crear Usuario
                  </Button>
                  <Button variant="secondary" icon={RefreshCw} onClick={load} loading={loading}>
                    Actualizar
                  </Button>
                </div>
              </div>

              {/* Filtros de búsqueda */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Input
                    icon={Search}
                    label="Buscar usuario"
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre, correo o documento..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-fg-secondary mb-2">
                    <Filter className="inline w-4 h-4 mr-2" />
                    Filtrar por rol
                  </label>
                  <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-default bg-bg-primary text-fg-primary text-sm placeholder-fg-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-default transition-colors duration-200"
                  >
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>
                        {role === 'todos' ? 'Todos los roles' : role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>

            {/* Tabla de usuarios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.2, ease: 'easeOut' }}
            >
              <Card>
                <Card.Content className="p-0">
              {/* Mensaje de error */}
              {error && (
                <div className="m-6">
                  <Alert variant="error" title="Error al cargar usuarios" icon>
                    {error}
                  </Alert>
                </div>
              )}

              {/* Loading state */}
              {loading ? (
                <div className="py-12">
                  <Loading text="Cargando usuarios..." />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-12">
                  <EmptyState
                    title="No se encontraron usuarios"
                    description={searchTerm || roleFilter !== 'todos'
                      ? 'Intenta con otros términos de búsqueda'
                      : 'No hay usuarios registrados en el sistema'}
                  />
                </div>
              ) : (
                <>
                  {/* Tabla */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-bg-tertiary">
                          <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                            Usuario
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                            Información de Contacto
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                            Rol
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      
                      <tbody className="divide-y divide-border-default">
                        {filteredUsers.map((user) => (
                          <motion.tr
                            key={user.IdUsuario}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.2, ease: 'easeOut' }}
                            className="hover:bg-bg-secondary transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div 
                                  onClick={() => viewUserDetails(user)}
                                  className="cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                  <div className="w-10 h-10 rounded-full bg-bg-tertiary overflow-hidden flex items-center justify-center">
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
                                      <User className="w-5 h-5 text-fg-tertiary" />
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-semibold text-fg-primary cursor-pointer hover:text-brand-hover transition-colors"
                                       onClick={() => viewUserDetails(user)}>
                                    {user.NombreCompleto}
                                  </div>
                                  <div className="text-sm text-fg-tertiary">
                                    ID: {user.IdUsuario}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-fg-tertiary" />
                                  <a 
                                    href={`mailto:${user.Correo}`}
                    className="text-brand-primary hover:text-brand-hover hover:underline"
                  >
                    {user.Correo}
                  </a>
                </div>
                {user.Telefono && (
                                  <div className="flex items-center gap-2 text-sm text-fg-secondary">
                                    <Phone className="w-4 h-4 text-fg-tertiary" />
                                    <span>{user.Telefono}</span>
                                  </div>
                                )}
                                {user.Documento && (
                                  <div className="flex items-center gap-2 text-sm text-fg-secondary">
                                    <FileText className="w-4 h-4 text-fg-tertiary" />
                                    <span>Doc: {user.Documento}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            
                            <td className="px-6 py-4">
                              <Badge variant="neutral" size="sm" icon={Shield}>
                                {user.NombreRol}
                              </Badge>
                            </td>
                            
                            <td className="px-6 py-4">
                              <Badge variant="success" size="sm">Activo</Badge>
                            </td>
                            
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <Button variant="secondary" size="sm" icon={Eye} onClick={() => viewUserDetails(user)}>
                                  Ver
                                </Button>
                                <Button variant="destructive" size="sm" icon={Trash2} onClick={() => setConfirmDeleteId(user.IdUsuario)} loading={deletingId === user.IdUsuario} disabled={deletingId === user.IdUsuario}>
                                  Eliminar
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Footer de la tabla */}
                  <div className="px-6 py-4 border-t border-border-default bg-bg-tertiary">
                    <div className="text-sm text-fg-secondary">
                      Mostrando <span className="font-semibold text-fg-primary">{filteredUsers.length}</span> de{' '}
                      <span className="font-semibold text-fg-primary">{users.length}</span> usuarios
                    </div>
                  </div>
                </>
              )}
                </Card.Content>
              </Card>
            </motion.div>

            {/* Información de seguridad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.2, ease: 'easeOut' }}
              className="mt-8"
            >
              <Alert variant="warning" title="Consideraciones importantes">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span>La eliminación de usuarios es permanente y no se puede deshacer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>Asegúrese de que el usuario no tenga vehículos registrados antes de eliminarlo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>Solo los administradores tienen acceso a esta funcionalidad</span>
                  </li>
                </ul>
              </Alert>
            </motion.div>
          </div>

      {/* Modal de detalles del usuario */}
      <Modal open={showUserModal && selectedUser !== null} onClose={() => setShowUserModal(false)}>
        <Modal.Content>
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-4 border-brand-light bg-surface-tertiary overflow-hidden flex items-center justify-center mx-auto">
                    {getImageUrl(selectedUser?.FotoPerfil) ? (
                      <img
                        src={getImageUrl(selectedUser?.FotoPerfil)}
                        alt={selectedUser?.NombreCompleto}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-fg-tertiary" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-8">
                    <Badge variant="neutral" size="sm">{selectedUser?.NombreRol}</Badge>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-fg-primary mt-4">{selectedUser?.NombreCompleto}</h2>
                <p className="text-fg-secondary">ID: {selectedUser?.IdUsuario}</p>
              </div>

              <div className="space-y-6">
                <div className="bg-bg-secondary rounded-lg p-4">
                  <h3 className="font-semibold text-fg-primary mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-fg-tertiary">Documento</p>
                      <p className="font-medium">{selectedUser?.Documento || 'No registrado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-fg-tertiary">Teléfono</p>
                      <p className="font-medium">{selectedUser?.Telefono || 'No registrado'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-secondary rounded-lg p-4">
                  <h3 className="font-semibold text-fg-primary mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contacto
                  </h3>
                  <div>
                    <p className="text-sm text-fg-tertiary">Correo Electrónico</p>
                    <a 
                      href={`mailto:${selectedUser?.Correo}`}
                      className="font-medium text-brand-primary hover:text-brand-hover hover:underline break-all"
                    >
                      {selectedUser?.Correo}
                    </a>
                  </div>
                </div>

                {/* Sección de vehículos del usuario */}
                <Card variant="info">
                  <Card.Content className="p-4">
                    <h3 className="font-semibold text-fg-primary mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Vehículos ({userVehicles.length})
                      </div>
                      {loadingVehicles && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                    </h3>
                    
                    {loadingVehicles ? (
                      <div className="text-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                        <p className="text-sm text-fg-secondary mt-2">Cargando vehículos...</p>
                      </div>
                    ) : userVehicles.length === 0 ? (
                      <div className="text-center py-4">
                        <Truck className="w-8 h-8 text-fg-tertiary mx-auto mb-2" />
                        <p className="text-sm text-fg-secondary">El usuario no tiene vehículos registrados</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userVehicles.map((vehicle) => (
                          <div 
                            key={vehicle.IdVehiculo} 
                            className="bg-surface-primary rounded-lg p-3 border border-default hover:border-brand transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`p-1.5 rounded-md ${vehicleTypeColors[vehicle.Tipo]?.bg || 'bg-surface-tertiary'} ${vehicleTypeColors[vehicle.Tipo]?.icon || 'text-fg-tertiary'}`}>
                                    {vehicleTypeIcons[vehicle.Tipo] || <Truck className="w-3 h-3" />}
                                  </div>
                                  <div>
                                    <div className="font-medium text-fg-primary">{vehicle.Placa}</div>
                                    <div className="text-xs text-fg-tertiary capitalize">{vehicle.Tipo} • {vehicle.Modelo || 'Sin modelo'}</div>
                                  </div>
                                </div>
                                <div className="text-xs text-fg-secondary flex items-center gap-2">
                                  <span>Color: {vehicle.Color || 'Sin especificar'}</span>
                                  <span>•</span>
                                  <span>ID: {vehicle.IdVehiculo}</span>
                                </div>
                              </div>
                              
                              {/* Imagen del vehículo */}
                              {getVehicleImageUrl(vehicle.FotoVehiculo) && (
                                <div className="relative ml-2">
                                  <div 
                                    className="w-16 h-16 rounded-md overflow-hidden border border-default cursor-pointer hover:border-hover transition-colors"
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
                                      className="w-full h-full bg-bg-tertiary flex items-center justify-center"
                                    >
                                      <Truck className="w-6 h-6 text-fg-tertiary" />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setSelectedVehicleImage(getVehicleImageUrl(vehicle.FotoVehiculo))}
                                    className="absolute -top-1 -right-1 bg-info text-fg-inverse rounded-full p-1 hover:bg-info-hover transition-colors"
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
                  </Card.Content>
                </Card>

                <Card variant="success">
                  <Card.Content className="p-4">
                    <h3 className="font-semibold text-fg-primary mb-3 flex items-center gap-2">
                      Estado
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="md">Usuario Activo</Badge>
                    </div>
                    <p className="text-sm text-fg-secondary mt-2">El usuario tiene acceso completo al sistema</p>
                  </Card.Content>
                </Card>
              </div>

              <div className="mt-8 pt-6 border-t border-border-default">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowUserModal(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
        </Modal.Content>
      </Modal>

      {/* Modal de creación de usuario */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Modal.Content>
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-bg-success flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-fg-success" />
                </div>
                <h2 className="text-2xl font-bold text-fg-primary">Crear Usuario</h2>
                <p className="text-fg-secondary mt-1">Registra un nuevo usuario en el sistema</p>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  label="Nombre Completo"
                  name="nombreCompleto"
                  value={createForm.nombreCompleto}
                  onChange={handleCreateChange}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Documento"
                    name="documento"
                    value={createForm.documento}
                    onChange={handleCreateChange}
                    required
                  />
                  <Input
                    label="Teléfono"
                    name="telefono"
                    value={createForm.telefono}
                    onChange={handleCreateChange}
                    required
                  />
                </div>

                <Input
                  label="Correo"
                  type="email"
                  name="correo"
                  value={createForm.correo}
                  onChange={handleCreateChange}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-fg-secondary mb-2">Rol</label>
                  <select
                    name="idRol"
                    value={createForm.idRol}
                    onChange={handleCreateChange}
                    className="w-full h-11 px-4 rounded-lg border border-default bg-bg-primary text-fg-primary text-sm placeholder-fg-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-default transition-colors duration-200"
                  >
                    <option value="">Selecciona un rol</option>
                    {createRoles.map((rol) => (
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
                  value={createForm.contrasena}
                  onChange={handleCreateChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />

                {createError && (
                  <Alert variant="error" icon>
                    {createError}
                  </Alert>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    loading={creating}
                    disabled={creating}
                    className="flex-1"
                  >
                    {creating ? 'Creando...' : 'Crear Usuario'}
                  </Button>
                </div>
              </form>
            </div>
        </Modal.Content>
      </Modal>

      {/* Modal para imagen ampliada del vehículo */}
      <AnimatePresence>
        {selectedVehicleImage && (
          <motion.div 
            className="fixed inset-0 bg-overlay flex justify-center items-center z-overlay"
            onClick={() => setSelectedVehicleImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 bg-surface-primary/20 hover:bg-surface-primary/30 text-fg-inverse rounded-full p-2 backdrop-blur-sm transition-colors z-10"
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
                <Button
                  variant="primary"
                  onClick={() => setSelectedVehicleImage(null)}
                >
                  Cerrar vista
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => { remove(confirmDeleteId); setConfirmDeleteId(null); }}
        title="¿Eliminar usuario?"
        message="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="destructive"
      />
    </div>
  )
}