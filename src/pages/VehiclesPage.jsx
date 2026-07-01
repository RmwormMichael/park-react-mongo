import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useToast } from '../components/ToastProvider'
import { motion } from 'framer-motion'
import { 
  Car,
  Bike,
  Truck,
  PlusCircle,
  Search,
  RefreshCw,
  Trash2,
  User,
  Mail,
  Shield,
  Camera,
  Image as ImageIcon,
  X,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Alert from '../components/Alert'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import { isAdminOrVigilante } from '../utils/permissions'

export default function VehiclesPage({ user }) {
  const { toast } = useToast();
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
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [uploading, setUploading] = useState(false)

  const isAdminOrVigilanteRole = isAdminOrVigilante(user)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      let data
      
      if (isAdminOrVigilanteRole) {
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
      
      toast({ title: 'Vehículo registrado correctamente', variant: 'success' })
    } catch(err) {
      console.error('Error al registrar vehículo:', err)
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function remove(id) {
    setDeletingId(id)
    try {
      await api.request('/vehicles/' + id, { method: 'DELETE' })
      load()
    } catch(err) {
      if (err.message.includes('tiene movimientos registrados')) {
        setError(`${err.message}\n\nSolución:\n1. Vaya a la página de Movimientos\n2. Registre la salida del vehículo\n3. Luego intente eliminarlo de nuevo`)
      } else {
        setError(err.message)
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

  const typeIconMap = {
    carro: Car,
    moto: Bike,
    bicicleta: Truck,
  }

  const typeVariant = {
    carro: 'brand',
    moto: 'info',
    bicicleta: 'success',
  }

  const roleBadgeVariant = {
    'Administrador': 'error',
    'Vigilante': 'warning',
    'Instructor': 'info',
    'Aprendiz': 'success',
  }

  const TypeIcon = ({ type, className = 'w-5 h-5' }) => {
    const Icon = typeIconMap[type] || Truck
    return <Icon className={className} />
  }

  return (
    <>
    <div className="min-h-screen bg-bg-primary pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-fg-primary">
                Gestión de Vehículos
              </h1>
              <p className="text-sm text-fg-secondary mt-1">
                Administra los vehículos registrados en SENA ParkControl
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-brand-primary shadow-token-md">
                <Truck className="w-6 h-6 text-fg-inverse" />
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <StatCard
              variant="brand"
              icon={Truck}
              label="Total"
              value={vehicles.length}
              description="Vehículos registrados"
            />
          </motion.div>

          {Object.entries(typeCounts).map(([type, count]) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <StatCard
                variant={typeVariant[type] || 'brand'}
                icon={typeIconMap[type] || Truck}
                label={type}
                value={count}
                description="Vehículos"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Formulario de registro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <Card.Header>
                <div>
                  <h2 className="text-xl font-bold text-fg-primary">
                    Registrar Nuevo Vehículo
                  </h2>
                  <p className="text-fg-secondary">
                    Completa los datos del vehículo a registrar
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-brand-light text-brand-primary">
                  <PlusCircle className="w-6 h-6" />
                </div>
              </Card.Header>
              <Card.Content>
            <form onSubmit={submit} className="space-y-6">
              {/* Sección de foto */}
              <div className="bg-surface-tertiary rounded-xl p-4">
                <h3 className="font-medium text-fg-primary mb-3">Foto del Vehículo (Opcional)</h3>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-default bg-surface-primary overflow-hidden flex items-center justify-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview del vehículo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="w-8 h-8 text-fg-tertiary mx-auto mb-2" />
                          <p className="text-sm text-fg-tertiary">Sin imagen</p>
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
                        className="absolute -top-2 -right-2 bg-error text-fg-inverse rounded-full p-1 hover:bg-error-hover"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label className="block mb-3">
                      <div className="px-4 py-3 bg-brand-light text-brand-primary rounded-lg hover:bg-brand-primary hover:text-fg-inverse transition-colors cursor-pointer text-center font-medium">
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
                    <p className="text-sm text-fg-secondary mt-2">
                      Sube una foto clara del vehículo. Formatos: JPG, PNG, GIF, WEBP. Máximo: 10MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Campos del formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Input
                    label="Placa *"
                    value={form.placa}
                    onChange={e => setForm({ ...form, placa: e.target.value.toUpperCase() })}
                    placeholder="ABC123"
                    required
                  />
                </div>

                <div>
                  <Select
                    label="Tipo *"
                    value={form.tipo}
                    onChange={e => setForm({ ...form, tipo: e.target.value })}
                    options={[
                      { value: 'carro', label: 'Carro' },
                      { value: 'moto', label: 'Moto' },
                      { value: 'bicicleta', label: 'Bicicleta' },
                    ]}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Modelo"
                    value={form.modelo}
                    onChange={e => setForm({ ...form, modelo: e.target.value })}
                    placeholder="Ej: Toyota Corolla"
                  />
                </div>

                <div>
                  <Input
                    label="Color"
                    value={form.color}
                    onChange={e => setForm({ ...form, color: e.target.value })}
                    placeholder="Ej: Rojo"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-default">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={uploading}
                  disabled={uploading}
                  icon={PlusCircle}
                >
                  Registrar Vehículo
                </Button>
              </div>
            </form>
              </Card.Content>
            </Card>
          </motion.div>

        {/* Panel de búsqueda y filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card variant="bordered">
            <Card.Content>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-fg-primary">
                    Lista de Vehículos
                  </h2>
                  <p className="text-fg-secondary">
                    {filteredVehicles.length} de {vehicles.length} vehículos encontrados
                  </p>
                </div>
                
                <Button
                  variant="secondary"
                  icon={RefreshCw}
                  onClick={load}
                  disabled={loading}
                >
                  Actualizar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Input
                    icon={Search}
                    label="Buscar vehículo"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Buscar por placa, modelo, color, propietario..."
                  />
                </div>

                <div>
                  <Select
                    label="Filtrar por tipo"
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    options={[
                      { value: 'todos', label: 'Todos los tipos' },
                      { value: 'carro', label: 'Carro' },
                      { value: 'moto', label: 'Moto' },
                      { value: 'bicicleta', label: 'Bicicleta' },
                    ]}
                  />
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Tabla de vehículos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="overflow-hidden">
            {/* Mensaje de error */}
            {error && (
              <div className="m-6">
                <Alert variant="error" title="Error">
                  {error}
                </Alert>
              </div>
            )}

            {/* Loading state */}
            {loading ? (
              <Loading text="Cargando vehículos..." />
            ) : filteredVehicles.length === 0 ? (
              <EmptyState
                title="No se encontraron vehículos"
                description={searchTerm || typeFilter !== 'todos'
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Registra tu primer vehículo usando el formulario'}
              />
            ) : (
              <>
                {/* Tabla */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface-tertiary">
                        <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                          Vehículo
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                          Foto
                        </th>
                        {isAdminOrVigilanteRole && (
                          <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                            Propietario
                          </th>
                        )}
                        <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                          Especificaciones
                        </th>
                        {isAdminOrVigilanteRole && (
                          <>
                            <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                              Contacto
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                              Rol
                            </th>
                          </>
                        )}
                        {isAdminOrVigilanteRole && (
                          <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                            Acciones
                          </th>
                        )}
                      </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-default">
                      {filteredVehicles.map((vehicle) => (
                        <motion.tr
                          key={vehicle.IdVehiculo}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="hover:bg-surface-tertiary transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-xl bg-brand-light text-brand-primary">
                                <TypeIcon type={vehicle.Tipo} />
                              </div>
                              <div>
                                <div className="font-semibold text-fg-primary">
                                  {vehicle.Placa}
                                </div>
                                <div className="text-sm text-fg-tertiary capitalize">
                                  {vehicle.Tipo}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              {getVehicleImageUrl(vehicle.FotoVehiculo) ? (
                                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-default shadow-token-sm">
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
                                    className="w-full h-full bg-surface-tertiary flex items-center justify-center"
                                  >
                                    <ImageIcon className="w-6 h-6 text-fg-tertiary" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-surface-tertiary border-2 border-default flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-fg-tertiary" />
                                </div>
                              )}
                            </div>
                          </td>
                          
                          {isAdminOrVigilanteRole && (
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-xl bg-surface-tertiary">
                                  <User className="w-5 h-5 text-fg-secondary" />
                                </div>
                                <div>
                                  <div className="font-semibold text-fg-primary">
                                    {vehicle.NombreCompleto}
                                  </div>
                                </div>
                              </div>
                            </td>
                          )}
                          
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 text-fg-tertiary" />
                                <span className="text-fg-primary">
                                  {vehicle.Modelo || 'Sin especificar'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-fg-secondary">
                                <div className="w-4 h-4" />
                                <span>Color: {vehicle.Color || 'Sin especificar'}</span>
                              </div>
                            </div>
                          </td>
                          
                          {isAdminOrVigilanteRole && (
                            <>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <Mail className="w-4 h-4 text-fg-tertiary" />
                                  <a 
                                    href={`mailto:${vehicle.Correo}`}
                                    className="text-brand-primary hover:text-brand-hover hover:underline"
                                  >
                                    {vehicle.Correo}
                                  </a>
                                </div>
                              </td>
                              
                              <td className="px-6 py-4">
                                <Badge
                                  variant={roleBadgeVariant[vehicle.NombreRol] || 'neutral'}
                                  icon={Shield}
                                >
                                  {vehicle.NombreRol}
                                </Badge>
                              </td>
                            </>
                          )}
                          
                          {isAdminOrVigilanteRole && (
                            <td className="px-6 py-4">
                              <Button
                                variant="destructive"
                                size="sm"
                                icon={Trash2}
                                onClick={() => setConfirmDeleteId(vehicle.IdVehiculo)}
                                disabled={deletingId === vehicle.IdVehiculo}
                                loading={deletingId === vehicle.IdVehiculo}
                              >
                                Eliminar
                              </Button>
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Footer de la tabla */}
                <div className="px-6 py-4 border-t border-default bg-surface-tertiary">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-fg-secondary">
                    <div>
                      Mostrando <span className="font-semibold text-fg-primary">{filteredVehicles.length}</span> de{' '}
                      <span className="font-semibold text-fg-primary">{vehicles.length}</span> vehículos
                    </div>
                    <div className="flex items-center space-x-4">
                      {Object.entries(typeCounts).map(([type, count]) => (
                        <div key={type} className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${typeVariant[type] === 'info' ? 'bg-info' : typeVariant[type] === 'success' ? 'bg-success' : 'bg-brand-primary'}`} />
                          <span className="capitalize">{type}: {count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </motion.div>

        {/* Información de seguridad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="bg-brand-light rounded-xl border border-brand-primary p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-surface-primary text-brand-primary">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fg-primary mb-2">
                  Consideraciones importantes
                </h3>
                <ul className="text-fg-secondary space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Puedes subir fotos de tus vehículos para mejor identificación</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />
                    <span>La eliminación de vehículos elimina también las fotos asociadas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
                    <span>Solo administradores y vigilantes pueden eliminar vehículos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
    </div>
    </div>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => { remove(confirmDeleteId); setConfirmDeleteId(null); }}
        title="¿Eliminar vehículo?"
        message="Esta acción eliminará también todos los movimientos registrados."
        confirmLabel="Eliminar"
        variant="destructive"
      />
    </>
  )
}