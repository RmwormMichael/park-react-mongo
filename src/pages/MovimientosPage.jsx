import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { getToken } from '../services/auth'
import jwt_decode from "jwt-decode"
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Car, 
  Clock, 
  LogIn, 
  LogOut, 
  Eye, 
  Shield,
  AlertCircle,
  Loader2,
  Calendar,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react'

export default function MovimientosPage() {
  const [placa, setPlaca] = useState('')
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [filter, setFilter] = useState('todos') // 'todos', 'dentro', 'fuera'

  // Obtener rol del token
  const token = getToken()
  let user = null
  if (token) {
    try {
      user = jwt_decode(token)
    } catch (err) {
      console.error("Token inválido", err)
    }
  }

  const canEdit = user?.idRolName === "Administrador" || user?.idRolName === "Vigilante"
  const isBasicRole = ["Aprendiz", "Instructor", "Visitante"].includes(user?.idRolName)

  async function entrada() {
    if (!placa.trim()) {
      alert('Por favor ingrese una placa')
      return
    }
    
    setRegistering(true)
    try {
      let v

      if (canEdit) {
        // ADMIN y VIGILANTE -> pueden usar todos los vehículos
        v = await api.request('/vehicles', { method: 'GET' })
      } else {
        // Roles básicos -> solo sus vehículos
        v = await api.request('/vehicles/user', { method: 'GET' })
      }

      const found = v.find(x => x.Placa === placa.toUpperCase())

      if (!found) {
        setRegistering(false)
        return alert('Placa no encontrada en el sistema')
      }

      await api.request('/movimientos/entrada', {
        method: 'POST',
        body: { idVehiculo: found.IdVehiculo }
      })

      alert('✅ Entrada registrada exitosamente')
      setPlaca('')
      loadRange()
    } catch (err) {
      alert(`❌ Error: ${err.message}`)
    } finally {
      setRegistering(false)
    }
  }

  async function salida() {
    if (!placa.trim()) {
      alert('Por favor ingrese una placa')
      return
    }
    
    setRegistering(true)
    try {
      await api.request('/movimientos/salida', { 
        method: 'POST', 
        body: { placa: placa.toUpperCase() } 
      })
      alert('✅ Salida registrada exitosamente')
      setPlaca('')
      loadRange()
    } catch (err) { 
      alert(`❌ Error: ${err.message}`)
    } finally {
      setRegistering(false)
    }
  }

async function loadRange() {
  setLoading(true)
  try {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")

    const today = `${year}-${month}-${day}`

    const start = `${today} 00:00:00`
    const end   = `${today} 23:59:59`

    const data = await api.request(`/movimientos/range?start=${start}&end=${end}`)
    setMovimientos(data)
  } catch (err) {
    console.error(err)
    alert('Error al cargar movimientos')
  } finally {
    setLoading(false)
  }
}



  useEffect(() => { 
    loadRange() 
  }, [])

  // Filtrar movimientos según el estado
  const filteredMovimientos = movimientos.filter(m => {
    if (filter === 'todos') return true
    if (filter === 'dentro') return m.Estado === 'dentro'
    if (filter === 'fuera') return m.Estado === 'fuera'
    return true
  })

  // Estadísticas
  const dentroCount = movimientos.filter(m => m.Estado === 'dentro').length
  const fueraCount = movimientos.filter(m => m.Estado === 'fuera').length

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
                Movimientos
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Control de entrada y salida de vehículos
                {user && (
                  <span className="ml-2 text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    {user.idRolName}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                <Calendar className="inline w-4 h-4 mr-2" />
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <button
                onClick={loadRange}
                disabled={loading}
                className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
              >
                {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Panel de estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Total hoy</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{movimientos.length}</div>
            <p className="text-sm text-gray-600 mt-2">Movimientos registrados</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                <LogIn className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Dentro</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{dentroCount}</div>
            <p className="text-sm text-gray-600 mt-2">Vehículos en el parqueadero</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                <LogOut className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Salidas</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{fueraCount}</div>
            <p className="text-sm text-gray-600 mt-2">Vehículos que han salido</p>
          </div>
        </motion.div>

        {/* Panel de registro (SOLO ADMIN/VIGILANTE) */}
        {canEdit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6 mb-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Registro rápido</h2>
                <p className="text-gray-600">Registrar entrada o salida de vehículos</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                <Shield className="w-6 h-6" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Car className="inline w-4 h-4 mr-2" />
                  Placa del vehículo
                </label>
                <input
                  value={placa}
                  onChange={e => setPlaca(e.target.value.toUpperCase())}
                  placeholder="Ej: ABC123"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                />
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={entrada}
                  disabled={registering}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
                >
                  {registering ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <LogIn className="w-5 h-5 mr-2" />
                  )}
                  Registrar Entrada
                </button>
                
                <button
                  onClick={salida}
                  disabled={registering}
                  className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-amber-200 disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
                >
                  {registering ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="w-5 h-5 mr-2" />
                  )}
                  Registrar Salida
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>✅ Puede registrar entrada/salida de cualquier vehículo en el sistema</p>
            </div>
          </motion.div>
        )}

        {/* Mensaje para roles básicos */}
        {isBasicRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Modo de solo visualización
                  </h3>
                  <p className="text-gray-700">
                    Como {user?.idRolName}, solo puedes visualizar tus movimientos. 
                    Para registrar entrada o salida de vehículos, contacta a un vigilante o administrador.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filtros y tabla */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Header de la tabla */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Movimientos del día</h2>
                <p className="text-gray-600">{filteredMovimientos.length} movimientos encontrados</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Filtrar:</span>
                </div>
                <div className="flex space-x-2">
                  {['todos', 'dentro', 'fuera'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filter === f
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {f === 'todos' ? 'Todos' : f === 'dentro' ? 'Dentro' : 'Salidas'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propietario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora de Entrada
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora de Salida
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                      <p className="mt-2 text-gray-600">Cargando movimientos...</p>
                    </td>
                  </tr>
                ) : filteredMovimientos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No hay movimientos para mostrar</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {filter !== 'todos' ? `No hay movimientos con estado "${filter}"` : 'Comience registrando un movimiento'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredMovimientos.map((m) => (
                    <motion.tr
                      key={m.IdMovimiento}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gray-100">
                            <Car className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-mono font-bold text-gray-900">{m.Placa}</div>
                            {m.Tipo && (
                              <div className="text-xs text-gray-500 capitalize">{m.Tipo}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{m.NombreCompleto || 'N/A'}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {m.FechaEntrada ? new Date(m.FechaEntrada).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            }) : 'N/A'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {m.FechaEntrada ? new Date(m.FechaEntrada).toLocaleDateString('es-ES') : ''}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {m.FechaSalida ? (
                          <>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">
                                {new Date(m.FechaSalida).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(m.FechaSalida).toLocaleDateString('es-ES')}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                          m.Estado === 'dentro'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {m.Estado === 'dentro' ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1.5" />
                              Dentro
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1.5" />
                              Fuera
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer de la tabla */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                Mostrando <span className="font-semibold">{filteredMovimientos.length}</span> de{' '}
                <span className="font-semibold">{movimientos.length}</span> movimientos
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span>Dentro: {dentroCount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span>Fuera: {fueraCount}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}