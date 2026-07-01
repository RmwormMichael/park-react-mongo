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
  CheckCircle,
  XCircle
} from 'lucide-react'

import Card from '../components/Card'
import StatCard from '../components/StatCard'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Badge from '../components/Badge'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import Alert from '../components/Alert'

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
  const [feedback, setFeedback] = useState(null)

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
      setFeedback({ type: 'error', message: err.message });
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
      setFeedback({ type: 'error', message: err.message })
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
      setFeedback({ type: 'warning', message: 'No hay datos para exportar' })
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
      setFeedback({ type: 'warning', message: 'No hay datos para exportar' })
      return
    }

    let ExcelJS
    try {
      ExcelJS = (await import('exceljs')).default
    } catch {
      setFeedback({ type: 'error', message: 'Error al cargar la librería de exportación. Verifica tu conexión e intenta de nuevo.' })
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
                Reportes Estadísticos
              </h1>
              <p className="text-sm text-fg-secondary mt-1">
                Análisis de movimientos vehiculares por fecha y tipo
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-brand-primary shadow-token-md">
                <BarChart3 className="w-6 h-6 text-fg-inverse" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs de vista */}
        <div className="flex space-x-1 mb-6 bg-surface-tertiary rounded-xl p-1 w-fit">
          <button
            onClick={() => { setVista('resumido'); generate(); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              vista === 'resumido'
                ? 'bg-surface-primary text-brand-primary shadow-token-sm'
                : 'text-fg-secondary hover:text-fg-primary'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Reporte Resumido
          </button>
          <button
            onClick={() => { setVista('detallado'); generateDetailed(); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              vista === 'detallado'
                ? 'bg-surface-primary text-brand-primary shadow-token-sm'
                : 'text-fg-secondary hover:text-fg-primary'
            }`}
          >
            <Car className="w-4 h-4 inline mr-2" />
            Reporte Detallado
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Alert
              variant={feedback.type}
              dismissible
              onDismiss={() => setFeedback(null)}
            >
              {feedback.message}
            </Alert>
          </motion.div>
        )}

        {/* Panel de filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="bordered" className="mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-fg-primary flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filtros del Reporte
                  </h2>
                  <p className="text-fg-secondary">Selecciona el rango de fechas y tipo de vehículo</p>
                </div>
                
                <Button
                  variant="secondary"
                  icon={Download}
                  onClick={exportToCSV}
                  disabled={data.length === 0}
                >
                  Exportar CSV
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Input
                  type="date"
                  label="Fecha inicial"
                  icon={Calendar}
                  value={start}
                  onChange={e => setStart(e.target.value)}
                />

                <Input
                  type="date"
                  label="Fecha final"
                  icon={Calendar}
                  value={end}
                  onChange={e => setEnd(e.target.value)}
                />

                <Select
                  label="Tipo de vehículo"
                  value={tipo}
                  onChange={e => setTipo(e.target.value)}
                  options={[
                    { value: 'todos', label: 'Todos los tipos' },
                    { value: 'carro', label: 'Carro' },
                    { value: 'moto', label: 'Moto' },
                    { value: 'bicicleta', label: 'Bicicleta' },
                  ]}
                />

                <div className="flex items-end">
                  <Button
                    variant="primary"
                    size="lg"
                    loading={loading}
                    icon={BarChart3}
                    onClick={() => { vista === 'detallado' ? generateDetailed() : generate() }}
                    className="w-full"
                  >
                    {vista === 'detallado' ? 'Generar Reporte Detallado' : 'Generar Reporte'}
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-default">
                <div className="flex items-center space-x-2 text-sm text-fg-secondary">
                  <Clock className="w-4 h-4" />
                  <span>
                    Mostrando datos del <span className="font-semibold text-fg-primary">
                      {formatDisplayDate(start)}
                    </span> al <span className="font-semibold text-fg-primary">
                      {formatDisplayDate(end)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Panel de estadísticas */}
        {vista === 'resumido' && data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <StatCard variant="brand" icon={TrendingUp} label="Total General" value={stats.total} description="Movimientos en el período" />
            <StatCard variant="success" icon={Car} label="Carros" value={stats.carro} description="Movimientos de carros" />
            <StatCard variant="warning" icon={Bike} label="Motos" value={stats.moto} description="Movimientos de motos" />
            <StatCard variant="info" icon={Truck} label="Bicicletas" value={stats.bicicleta} description="Movimientos de bicicletas" />
          </motion.div>
        )}

        {/* Tabla de resultados */}
        {vista === 'resumido' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-default">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-fg-primary flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Resultados del Reporte
                  </h2>
                  <p className="text-fg-secondary">
                    {data.length} {data.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                  </p>
                </div>
                
                {data.length > 0 && (
                  <div className="text-sm text-fg-secondary">
                    Total de movimientos: <span className="font-bold text-fg-primary">{stats.total}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <Loading text="Generando reporte..." />
              ) : data.length === 0 ? (
                <EmptyState
                  title="No hay datos para mostrar"
                  description="Ajusta los filtros y genera un nuevo reporte"
                />
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-tertiary">
                      <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                        Tipo de Vehículo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                        Total de Movimientos
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                        Porcentaje
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-default">
                    {data.map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-surface-tertiary transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-fg-primary">
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
                              row.Tipo === 'carro' ? 'bg-success-light text-success' :
                              row.Tipo === 'moto' ? 'bg-warning-light text-warning' :
                              'bg-info-light text-info'
                            }`}>
                              {row.Tipo === 'carro' ? <Car className="w-4 h-4" /> :
                               row.Tipo === 'moto' ? <Bike className="w-4 h-4" /> :
                               <Truck className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="font-medium text-fg-primary capitalize">
                                {row.Tipo === 'carro' ? 'Carro' :
                                 row.Tipo === 'moto' ? 'Moto' :
                                 'Bicicleta'}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-xl font-bold text-fg-primary">
                            {row.total}
                          </div>
                          <div className="text-sm text-fg-tertiary">
                            movimientos
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 h-2 bg-surface-tertiary rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  row.Tipo === 'carro' ? 'bg-success' :
                                  row.Tipo === 'moto' ? 'bg-warning' :
                                  'bg-info'
                                }`}
                                style={{ 
                                  width: `${stats.total > 0 ? (parseInt(row.total) / stats.total * 100) : 0}%` 
                                }}
                              />
                            </div>
                            <div className="text-sm font-medium text-fg-secondary">
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
              <div className="px-6 py-4 border-t border-default bg-surface-tertiary">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-fg-secondary">
                  <div>
                    Reporte generado el{' '}
                    <span className="font-semibold text-fg-primary">
                      {new Date().toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {' '}a las{' '}
                    <span className="font-semibold text-fg-primary">
                      {new Date().toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span>Carros</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <span>Motos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-info"></div>
                      <span>Bicicletas</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
        )}

        {/* Tabla detallada */}
        {vista === 'detallado' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-default">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-fg-primary flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    Reporte Detallado
                  </h2>
                  <p className="text-fg-secondary">
                    {detalleData.length} {detalleData.length === 1 ? 'movimiento encontrado' : 'movimientos encontrados'}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  icon={Download}
                  onClick={exportToExcelDetallado}
                  disabled={detalleData.length === 0}
                >
                  Exportar Excel
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <Loading text="Generando reporte detallado..." />
              ) : detalleData.length === 0 ? (
                <EmptyState
                  title="No hay datos para mostrar"
                  description="Ajusta los filtros y genera un nuevo reporte"
                />
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-tertiary">
                      <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">Fecha Entrada</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">Fecha Salida</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">Placa</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">Propietario</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-default">
                    {detalleData.map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-surface-tertiary transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-fg-tertiary" />
                            <div>
                              <div className="font-medium text-fg-primary">
                                {new Date(row.fechaEntrada).toLocaleDateString('es-ES', {
                                  year: 'numeric', month: 'long', day: 'numeric'
                                })}
                              </div>
                              <div className="text-sm text-fg-tertiary">
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
                              <Clock className="w-4 h-4 text-fg-tertiary" />
                              <div>
                                <div className="font-medium text-fg-primary">
                                  {new Date(row.fechaSalida).toLocaleDateString('es-ES', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                  })}
                                </div>
                                <div className="text-sm text-fg-tertiary">
                                  {new Date(row.fechaSalida).toLocaleTimeString('es-ES', {
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-fg-tertiary">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              row.tipoVehiculo === 'carro' ? 'bg-success-light text-success' :
                              row.tipoVehiculo === 'moto' ? 'bg-warning-light text-warning' :
                              'bg-info-light text-info'
                            }`}>
                              {row.tipoVehiculo === 'carro' ? <Car className="w-4 h-4" /> :
                               row.tipoVehiculo === 'moto' ? <Bike className="w-4 h-4" /> :
                               <Truck className="w-4 h-4" />}
                            </div>
                            <div className="font-mono font-bold text-fg-primary">
                              {row.placa}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-fg-primary capitalize">
                            {row.tipoVehiculo === 'carro' ? 'Carro' :
                             row.tipoVehiculo === 'moto' ? 'Moto' :
                             'Bicicleta'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-fg-primary">
                            {row.propietario}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={row.estado === 'dentro' ? 'success' : 'neutral'} icon={row.estado === 'dentro' ? CheckCircle : XCircle}>
                            {row.estado === 'dentro' ? 'Dentro' : 'Fuera'}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {detalleData.length > 0 && (
              <div className="px-6 py-4 border-t border-default bg-surface-tertiary">
                <div className="text-sm text-fg-secondary">
                  Reporte generado el{' '}
                  <span className="font-semibold text-fg-primary">
                    {new Date().toLocaleDateString('es-ES', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                  {' '}a las{' '}
                  <span className="font-semibold text-fg-primary">
                    {new Date().toLocaleTimeString('es-ES', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
        )}

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-info-light rounded-xl border border-info p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-surface-primary text-info">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fg-primary mb-2">
                  ¿Cómo interpretar los reportes?
                </h3>
                <ul className="text-fg-secondary space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-info mt-2"></div>
                    <span>Los datos se agrupan por fecha y tipo de vehículo</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-info mt-2"></div>
                    <span>El "Total" representa la cantidad de movimientos (entradas + salidas)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-info mt-2"></div>
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