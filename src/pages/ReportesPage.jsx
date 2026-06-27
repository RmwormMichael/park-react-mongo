import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Calendar, 
  Filter, 
  Download, 
  Car, 
  Bike, 
  Truck,
  PieChart,
  TrendingUp,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react'

// Función para obtener fecha actual en Colombia (UTC-5)
const getColombiaDate = () => {
  const now = new Date()
  // Colombia está en UTC-5
  const offsetColombia = -5 * 60 // -5 horas en minutos
  const localOffset = now.getTimezoneOffset() // Offset local en minutos
  const colombiaOffset = offsetColombia - localOffset
  
  // Crear fecha ajustada a Colombia
  const colombiaDate = new Date(now.getTime() + colombiaOffset * 60000)
  return colombiaDate
}

// Función para formatear fecha en formato YYYY-MM-DD
const formatColombiaDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Función para formatear fecha en formato DD/MM/YYYY para mostrar
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export default function ReportesPage() {
  // Usar fecha de Colombia para el estado inicial
  const [start, setStart] = useState(formatColombiaDate(getColombiaDate()))
  const [end, setEnd] = useState(formatColombiaDate(getColombiaDate()))
  const [tipo, setTipo] = useState('todos')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    carro: 0,
    moto: 0,
    bicicleta: 0
  })
  const [vista, setVista] = useState('resumido')
  const [detalleData, setDetalleData] = useState([])

  // Función para generar reporte
async function generate() {
  setLoading(true)
  try {
    console.log('Generando reporte con parámetros:', {
      start,
      end,
      tipo
    });

    const url = `/reportes?fechaInicio=${start}&fechaFin=${end}&tipoVehiculo=${tipo}`;
    console.log('URL de la solicitud:', url);

    const res = await api.request(url, { method: 'GET' });
    console.log('Respuesta recibida:', res);
    
    setData(res)
    
    // Calcular estadísticas
    const stats = {
      total: res.reduce((sum, row) => sum + (parseInt(row.total) || 0), 0),
      carro: res.filter(row => row.Tipo === 'carro').reduce((sum, row) => sum + (parseInt(row.total) || 0), 0),
      moto: res.filter(row => row.Tipo === 'moto').reduce((sum, row) => sum + (parseInt(row.total) || 0), 0),
      bicicleta: res.filter(row => row.Tipo === 'bicicleta').reduce((sum, row) => sum + (parseInt(row.total) || 0), 0)
    }
    console.log('Estadísticas calculadas:', stats);
    setStats(stats)
    
  } catch(err) { 
    console.error('Error al generar reporte:', err);
    alert(err.message) 
  } finally {
    setLoading(false)
  }
  }

  async function generateDetailed() {
    setLoading(true)
    try {
      const url = `/reportes/detalle?fechaInicio=${start}&fechaFin=${end}&tipoVehiculo=${tipo}`
      const res = await api.request(url, { method: 'GET' })
      setDetalleData(res)
    } catch(err) {
      console.error('Error al generar reporte detallado:', err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Generar automáticamente al cargar
  useEffect(() => {
    generate()
  }, [])

  // Función para exportar a CSV
  const exportToCSV = () => {
    if (data.length === 0) {
      alert('No hay datos para exportar')
      return
    }
    
    const headers = ['Fecha', 'Tipo de Vehículo', 'Total']
    const csvContent = [
      headers.join(','),
      ...data.map(row => `${row.fecha},${row.Tipo},${row.total}`)
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `reporte_${start}_${end}.csv`
    link.click()
  }

  const tipoLabel = tipo === 'todos' ? 'Todos los tipos' : tipo.charAt(0).toUpperCase() + tipo.slice(1)

  async function exportToExcelDetallado() {
    if (detalleData.length === 0) {
      alert('No hay datos para exportar')
      return
    }

    let ExcelJS
    try {
      ExcelJS = (await import('exceljs')).default
    } catch {
      alert('Error al cargar la librería de exportación. Verifica tu conexión e intenta de nuevo.')
      return
    }

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'SENA Park Control'
    workbook.created = new Date()
    const ws = workbook.addWorksheet('Reporte Detallado')

    // Column widths
    ws.getColumn(1).width = 22
    ws.getColumn(2).width = 22
    ws.getColumn(3).width = 14
    ws.getColumn(4).width = 18
    ws.getColumn(5).width = 28
    ws.getColumn(6).width = 12

    const green = 'FF1A6B3C'
    const darkGray = 'FF333333'
    const mediumGray = 'FF555555'

    // Row 1 — Main title
    ws.mergeCells('A1:F1')
    const t1 = ws.getCell('A1')
    t1.value = 'SENA PARK CONTROL'
    t1.font = { name: 'Calibri', size: 18, bold: true, color: { argb: green } }
    t1.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(1).height = 32

    // Row 2 — Subtitle
    ws.mergeCells('A2:F2')
    const t2 = ws.getCell('A2')
    t2.value = 'REPORTE DETALLADO DE MOVIMIENTOS'
    t2.font = { name: 'Calibri', size: 14, bold: true, color: { argb: darkGray } }
    t2.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(2).height = 26

    // Row 4–7 — Info section
    const now = new Date()
    const fechaGen = now.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    ws.getCell('A4').value = `Fecha de generación: ${fechaGen}`
    ws.getCell('A5').value = `Período consultado: ${formatDisplayDate(start)} — ${formatDisplayDate(end)}`
    ws.getCell('A6').value = `Tipo de vehículo filtrado: ${tipoLabel}`
    ws.getCell('A7').value = `Total de movimientos encontrados: ${detalleData.length}`

    for (let r = 4; r <= 7; r++) {
      const row = ws.getRow(r)
      row.font = { name: 'Calibri', size: 11, color: { argb: mediumGray } }
      row.getCell(1).alignment = { vertical: 'middle' }
      row.height = 20
    }

    // Row 9 — Column headers
    const hr = 9
    const headers = ['Fecha Entrada', 'Fecha Salida', 'Placa', 'Tipo de Vehículo', 'Propietario', 'Estado']
    headers.forEach((h, i) => {
      const cell = ws.getRow(hr).getCell(i + 1)
      cell.value = h
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: green } }
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      }
    })
    ws.getRow(hr).height = 22

    // Auto-filter on header row
    ws.autoFilter = { from: { row: hr, col: 1 }, to: { row: hr, col: 6 } }

    // Data rows starting at row 10
    detalleData.forEach((reg, i) => {
      const dr = ws.getRow(hr + 1 + i)

      dr.getCell(1).value = new Date(reg.fechaEntrada)
      dr.getCell(1).numFmt = 'dd/mm/yyyy hh:mm'

      if (reg.fechaSalida) {
        dr.getCell(2).value = new Date(reg.fechaSalida)
        dr.getCell(2).numFmt = 'dd/mm/yyyy hh:mm'
      } else {
        dr.getCell(2).value = '—'
        dr.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }
      }

      dr.getCell(3).value = reg.placa
      dr.getCell(4).value = reg.tipoVehiculo === 'carro' ? 'Carro' : reg.tipoVehiculo === 'moto' ? 'Moto' : 'Bicicleta'
      dr.getCell(5).value = reg.propietario
      dr.getCell(6).value = reg.estado === 'dentro' ? 'Dentro' : 'Fuera'
      dr.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' }

      for (let j = 1; j <= 6; j++) {
        const c = dr.getCell(j)
        c.font = { name: 'Calibri', size: 11, color: { argb: darkGray } }
        if (j !== 2 || reg.fechaSalida) c.alignment = c.alignment || { vertical: 'middle' }
        c.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        }
      }
      dr.height = 20
    })

    // Generate and download
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Reporte_Detallado_${start}.xlsx`
    link.click()
    URL.revokeObjectURL(link.href)
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
                Reportes Estadísticos
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Análisis de movimientos vehiculares por fecha y tipo
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs de vista */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => { setVista('resumido'); generate(); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              vista === 'resumido'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Reporte Resumido
          </button>
          <button
            onClick={() => { setVista('detallado'); generateDetailed(); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              vista === 'detallado'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Car className="w-4 h-4 inline mr-2" />
            Reporte Detallado
          </button>
        </div>

        {/* Panel de filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtros del Reporte
              </h2>
              <p className="text-gray-600">Selecciona el rango de fechas y tipo de vehículo</p>
            </div>
            
            <button
              onClick={exportToCSV}
              disabled={data.length === 0}
              className="px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
          </div>

          {/* Formulario de filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Fecha inicial
              </label>
              <input
                type="date"
                value={start}
                onChange={e => setStart(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Fecha final
              </label>
              <input
                type="date"
                value={end}
                onChange={e => setEnd(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Car className="inline w-4 h-4 mr-2" />
                Tipo de vehículo
              </label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white"
              >
                <option value="todos">Todos los tipos</option>
                <option value="carro">Carro</option>
                <option value="moto">Moto</option>
                <option value="bicicleta">Bicicleta</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => { vista === 'detallado' ? generateDetailed() : generate() }}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5 mr-2" />
                    {vista === 'detallado' ? 'Generar Reporte Detallado' : 'Generar Reporte'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Información del rango - CORREGIDO */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                Mostrando datos del <span className="font-semibold text-gray-900">
                  {formatDisplayDate(start)}
                </span> al <span className="font-semibold text-gray-900">
                  {formatDisplayDate(end)}
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Panel de estadísticas */}
        {vista === 'resumido' && data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-500">Total General</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-sm text-gray-600 mt-2">Movimientos en el período</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                  <Car className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-500">Carros</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.carro}</div>
              <p className="text-sm text-gray-600 mt-2">Movimientos de carros</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                  <Bike className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-500">Motos</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.moto}</div>
              <p className="text-sm text-gray-600 mt-2">Movimientos de motos</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-violet-100 text-violet-600">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-500">Bicicletas</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.bicicleta}</div>
              <p className="text-sm text-gray-600 mt-2">Movimientos de bicicletas</p>
            </div>
          </motion.div>
        )}

        {/* Tabla de resultados */}
        {vista === 'resumido' && (
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
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Resultados del Reporte
                </h2>
                <p className="text-gray-600">
                  {data.length} {data.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                </p>
              </div>
              
              {data.length > 0 && (
                <div className="text-sm text-gray-600">
                  Total de movimientos: <span className="font-bold text-gray-900">{stats.total}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                <p className="mt-2 text-gray-600">Generando reporte...</p>
              </div>
            ) : data.length === 0 ? (
              <div className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay datos para mostrar</p>
                <p className="text-sm text-gray-500 mt-1">
                  Ajusta los filtros y genera un nuevo reporte
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Vehículo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total de Movimientos
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Porcentaje
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100">
                  {data.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {new Date(row.fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            row.Tipo === 'carro' ? 'bg-emerald-100 text-emerald-600' :
                            row.Tipo === 'moto' ? 'bg-amber-100 text-amber-600' :
                            'bg-violet-100 text-violet-600'
                          }`}>
                            {row.Tipo === 'carro' ? <Car className="w-4 h-4" /> :
                             row.Tipo === 'moto' ? <Bike className="w-4 h-4" /> :
                             <Truck className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 capitalize">
                              {row.Tipo === 'carro' ? 'Carro' :
                               row.Tipo === 'moto' ? 'Moto' :
                               'Bicicleta'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-xl font-bold text-gray-900">
                          {row.total}
                        </div>
                        <div className="text-sm text-gray-500">
                          movimientos
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                row.Tipo === 'carro' ? 'bg-emerald-500' :
                                row.Tipo === 'moto' ? 'bg-amber-500' :
                                'bg-violet-500'
                              }`}
                              style={{ 
                                width: `${stats.total > 0 ? (parseInt(row.total) / stats.total * 100) : 0}%` 
                              }}
                            />
                          </div>
                          <div className="text-sm font-medium text-gray-700">
                            {stats.total > 0 
                              ? `${((parseInt(row.total) / stats.total) * 100).toFixed(1)}%`
                              : '0%'
                            }
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Footer de la tabla */}
          {data.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-gray-600">
                <div>
                  Reporte generado el{' '}
                  <span className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {' '}a las{' '}
                  <span className="font-semibold text-gray-900">
                    {new Date().toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span>Carros</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>Motos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                    <span>Bicicletas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        )}

        {/* Tabla detallada */}
        {vista === 'detallado' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Reporte Detallado
                </h2>
                <p className="text-gray-600">
                  {detalleData.length} {detalleData.length === 1 ? 'movimiento encontrado' : 'movimientos encontrados'}
                </p>
              </div>
              <button
                onClick={exportToExcelDetallado}
                disabled={detalleData.length === 0}
                className="px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Excel</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                <p className="mt-2 text-gray-600">Generando reporte detallado...</p>
              </div>
            ) : detalleData.length === 0 ? (
              <div className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay datos para mostrar</p>
                <p className="text-sm text-gray-500 mt-1">
                  Ajusta los filtros y genera un nuevo reporte
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Entrada</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Salida</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propietario</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {detalleData.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {new Date(row.fechaEntrada).toLocaleDateString('es-ES', {
                                year: 'numeric', month: 'long', day: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(row.fechaEntrada).toLocaleTimeString('es-ES', {
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {row.fechaSalida ? (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {new Date(row.fechaSalida).toLocaleDateString('es-ES', {
                                  year: 'numeric', month: 'long', day: 'numeric'
                                })}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(row.fechaSalida).toLocaleTimeString('es-ES', {
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            row.tipoVehiculo === 'carro' ? 'bg-emerald-100 text-emerald-600' :
                            row.tipoVehiculo === 'moto' ? 'bg-amber-100 text-amber-600' :
                            'bg-violet-100 text-violet-600'
                          }`}>
                            {row.tipoVehiculo === 'carro' ? <Car className="w-4 h-4" /> :
                             row.tipoVehiculo === 'moto' ? <Bike className="w-4 h-4" /> :
                             <Truck className="w-4 h-4" />}
                          </div>
                          <div className="font-mono font-bold text-gray-900">
                            {row.placa}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 capitalize">
                          {row.tipoVehiculo === 'carro' ? 'Carro' :
                           row.tipoVehiculo === 'moto' ? 'Moto' :
                           'Bicicleta'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {row.propietario}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                          row.estado === 'dentro'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {row.estado === 'dentro' ? 'Dentro' : 'Fuera'}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {detalleData.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="text-sm text-gray-600">
                Reporte generado el{' '}
                <span className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
                {' '}a las{' '}
                <span className="font-semibold text-gray-900">
                  {new Date().toLocaleTimeString('es-ES', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          )}
        </motion.div>
        )}

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Cómo interpretar los reportes?
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <span>Los datos se agrupan por fecha y tipo de vehículo</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <span>El "Total" representa la cantidad de movimientos (entradas + salidas)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <span>Use los filtros para analizar períodos específicos o tipos de vehículos</span>
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