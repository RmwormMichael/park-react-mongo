# Sprint: ReportesPage — Migración al Design System

## Fase 1 — Auditoría

### Archivo objetivo
`src/pages/ReportesPage.jsx` — **876 líneas** (la más larga del proyecto)

### Resumen ejecutivo
Página de reportes con dos vistas (resumido/detallado), filtros por rango de fechas y tipo de vehículo, exportación CSV y Excel (con `exceljs` dinámico). Es la página más compleja por su cantidad de secciones condicionales. Ya tiene 3 componentes DS (Loading, EmptyState, Alert con dismissible). Usa el mismo patrón `feedback {type, message}` que MovimientosPage.

### Desviaciones identificadas (~100)

| Categoría | Ocurrencias | Ejemplos |
|-----------|-------------|----------|
| Layout | 1 | `bg-gradient-to-b from-gray-50 to-white pt-20` |
| Headings | 6 | `text-gray-900` → `text-fg-primary` |
| Text body | 8 | `text-gray-600` → `text-fg-secondary` |
| Cards (raw divs) | 5 | Filtros + 2 tablas + stats + info |
| Stat cards (raw) | 4 | Total/Carros/Motos/Bicicletas |
| Buttons (raw `<button>`) | 5 | Tabs ×2, Export CSV, Export Excel, Generate |
| Gradient buttons | 1 | Generate (emerald→teal) |
| Inputs (raw) | 2 | Fecha inicio + Fecha fin |
| Select (raw) | 1 | Tipo de vehículo |
| Badges (estado) | ~5 | Estado badge en tabla detallada |
| Color tokens | ~35 | `text-gray-500`, `border-gray-100`, `bg-gray-50` |
| Gradient backgrounds | 2 | Header icon (violet-purple) + Info section (blue-cyan) |
| Shadows | ~5 | `shadow-sm` |
| Borders | ~10 | `border-gray-100`, `border-gray-300` |
| Border radius | ~5 | `rounded-2xl` → `rounded-xl` |
| Percentage bars | ~8 | Barra de progreso raw + colores por tipo |

### Componentes DS ya importados (3)
- `Loading` (línea 18, 532, 709) — correcto
- `EmptyState` (línea 19, 534, 711) — correcto
- `Alert` (línea 20, 329) — correcto (dismissible, variant dinámico)

### Componentes DS disponibles para migrar (8)
| Componente | Uso esperado |
|-----------|-------------|
| `Card` | Filtros panel, tabla resumida wrapper, tabla detallada wrapper |
| `StatCard` | 4 stats (Total, Carros, Motos, Bicicletas) |
| `Button` | Generate, Export CSV, Export Excel, view tabs? |
| `Input type="date"` | Fecha inicio + Fecha fin |
| `Select` | Tipo de vehículo |
| `Badge` | Estado badge en tabla detallada |
| `Loading` | Ya usado |
| `EmptyState` | Ya usado |
| `Alert` | Ya usado |

### Mapa de variantes: tipo vehículo → StatCard variant
| Card | Variante | Ícono |
|------|----------|-------|
| Total General | `brand` | `TrendingUp` |
| Carros | `success` | `Car` |
| Motos | `warning` | `Bike` |
| Bicicletas | `info` | `Truck` |

### Mapa de variantes: tipo vehículo → bar/icon color
| Tipo | Clase DS |
|------|----------|
| carro | `bg-success` |
| moto | `bg-warning` |
| bicicleta | `bg-info` |

### Mapa de variantes: estado → Badge variant
| Estado | Variante Badge | Ícono |
|--------|---------------|-------|
| `dentro` | `success` | `CheckCircle` |
| `fuera` | `neutral` | `XCircle` |

### Mapa de variantes: view tabs
| Estado | Clase activa | Clase inactiva |
|--------|-------------|----------------|
| `vista === actual` | `bg-surface-primary text-brand-primary shadow-token-sm` | `text-fg-secondary hover:text-fg-primary` |

### Patrones compartidos (3/3 páginas — evidencia definitiva)

| Patrón | VehiclesPage | MovimientosPage | ReportesPage | Total |
|--------|-------------|-----------------|-------------|-------|
| **DataTable** | ✅ | ✅ | ✅ (×2: resumido + detallado) | **3/3** |
| **SearchFilterBar** | ✅ | ✅ | ✅ (fechas + tipo + generar) | **3/3** |
| **Status Badge** | ✅ (rol) | ✅ (estado) | ✅ (estado detallado) | **3/3** |
| **Table Footer Legend** | ✅ | ✅ | ✅ (×2) | **3/3** |
| **Gradient→Solid** | ✅ | ✅ | ✅ (×2) | **3/3** |
| **Info Section** | ✅ | ✅ (basic user) | ✅ (cómo interpretar) | **3/3** |
| **View Tabs** | — | — | ✅ | **1/3** (único) |
| **Percentage Bar** | — | — | ✅ | **1/3** (único) |
| **FileUpload** | ✅ | — | — | **1/3** |

### Riesgos
1. **View Tabs (Resumido/Detallado)**: No hay `Tabs` o `SegmentedControl` en DS. Mantener raw con tokens. Documentar como candidato único.
2. **Percentage bars**: Barras de progreso con ancho inline-style. No hay DS ProgressBar. Mantener raw con tokens.
3. **Date inputs**: `Input type="date"` — el componente Input pasa `type` al `<input>` nativo, por lo que `<Input type="date" />` debería funcionar.
4. **Excel export (exceljs)**: Código extenso (~120 líneas) de generación de Excel. **No modificar** — solo migrar la capa visual del botón.
5. **Export CSV**: Lógica inline en el componente. **No modificar** — solo migrar el botón.

---

## Fase 2 — Plan de implementación

### Orden de migración (estricto)

#### 1. Layout (`269`)
```diff
- min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12
+ min-h-screen bg-bg-primary pt-16 pb-12
```

#### 2. Header (`272-294`)
```diff
- text-3xl md:text-4xl font-bold text-gray-900
+ text-2xl md:text-3xl font-bold text-fg-primary
- text-lg text-gray-600 mt-2
+ text-sm text-fg-secondary mt-1
- bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg
+ bg-brand-primary shadow-token-md
- text-white
+ text-fg-inverse
```

#### 3. View Tabs (`296-320`)
Mantener raw `<button>` con tokens DS:
```diff
- bg-gray-100 rounded-xl p-1 w-fit
+ bg-surface-tertiary rounded-xl p-1 w-fit
- Active: bg-white text-emerald-600 shadow-sm
+ Active: bg-surface-primary text-brand-primary shadow-token-sm
- Inactive: text-gray-600 hover:text-gray-900
+ Inactive: text-fg-secondary hover:text-fg-primary
```

#### 4. Feedback Alert (`322-337`)
Sin cambios — ya usa Alert correctamente con dismissible.

#### 5. Filters Panel (`339-444`)
```diff
- bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8
+ <Card variant="bordered" className="mb-8">
+   <Card.Content>
```
**Card.Header:**
```diff
- text-gray-900
+ text-fg-primary
- text-gray-600
+ text-fg-secondary
- Export CSV raw button
+ <Button variant="secondary" icon={Download} onClick={exportToCSV} disabled={data.length === 0}>
    Exportar CSV
  </Button>
```

**Form fields:**
```diff
- Raw date inputs
+ <Input type="date" icon={Calendar} label="Fecha inicial" value={start} onChange={...} />
+ <Input type="date" icon={Calendar} label="Fecha final" value={end} onChange={...} />
- Raw select
+ <Select label="Tipo de vehículo" icon={Car} value={tipo} onChange={...} options={...} />
```

Wait, the Select component doesn't have an `icon` prop. Let me check... Looking at Select.jsx, there's no `icon` prop. So I'll just keep the icon in the label text manually or skip it.

Actually, looking at the existing implementation, the icons are embedded in the label text:
```jsx
<label><Calendar className="inline w-4 h-4 mr-2" />Fecha inicial</label>
```

With the DS Input, the `icon` prop handles this. But for Select, there's no `icon` prop. So I'll use Input with icon for date fields and plain Select (without icon in the label - the label text alone is sufficient). The Filter icon in the section title can stay as-is.

**Generate button:**
```diff
- Raw gradient button
+ <Button variant="primary" size="lg" loading={loading} icon={BarChart3} onClick={...} className="w-full">
    {vista === 'detallado' ? 'Generar Reporte Detallado' : 'Generar Reporte'}
  </Button>
```

**Range info:**
```diff
- border-t border-gray-100
+ border-t border-default
- text-gray-600
+ text-fg-secondary
- text-gray-900
+ text-fg-primary
```

Close Card:
```diff
+   </Card.Content>
+ </Card>
```

#### 6. Stat Cards (`446-498`)
Reemplazar 4 raw divs por `StatCard` con wrappers `motion.div`:

```jsx
{stats.total > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <StatCard variant="brand" icon={TrendingUp} label="Total General" value={stats.total} description="Movimientos en el período" />
    </motion.div>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <StatCard variant="success" icon={Car} label="Carros" value={stats.carro} description="Movimientos de carros" />
    </motion.div>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <StatCard variant="warning" icon={Bike} label="Motos" value={stats.moto} description="Movimientos de motos" />
    </motion.div>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <StatCard variant="info" icon={Truck} label="Bicicletas" value={stats.bicicleta} description="Movimientos de bicicletas" />
    </motion.div>
  </div>
)}
```

Note: changed condition from `data.length > 0` to `stats.total > 0` for cleaner check.

#### 7. Resumido Table (`500-675`)
```diff
- bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
+ <Card className="overflow-hidden">
```
**Table header:**
```diff
- border-b border-gray-100
+ border-b border-default
- text-gray-900
+ text-fg-primary
- text-gray-600
+ text-fg-secondary
```

**Table structure:**
```diff
- bg-gray-50 (thead)
+ bg-surface-tertiary
- text-gray-500 uppercase tracking-wider text-xs font-medium
+ text-fg-tertiary uppercase tracking-wider text-xs font-medium
- divide-gray-100
+ divide-default
- hover:bg-gray-50/50
+ hover:bg-surface-tertiary
```

**Type icon backgrounds:**
```diff
- bg-emerald-100 text-emerald-600 / bg-amber-100 text-amber-600 / bg-violet-100 text-violet-600
+ bg-success-light text-success / bg-warning-light text-warning / bg-info-light text-info
```

**Percentage bar:**
```diff
- bg-gray-200 rounded-full (track)
+ bg-surface-tertiary rounded-full
- bg-emerald-500 / bg-amber-500 / bg-violet-500 (fill)
+ bg-success / bg-warning / bg-info
- text-gray-900
+ text-fg-primary
- text-gray-500
+ text-fg-tertiary
- text-gray-700
+ text-fg-secondary
```

**Table footer:**
```diff
- border-t border-gray-100 bg-gray-50
+ border-t border-default bg-surface-tertiary
- text-gray-600
+ text-fg-secondary
- text-gray-900
+ text-fg-primary
- Legend dots: bg-emerald-500 / bg-amber-500 / bg-violet-500
+ bg-success / bg-warning / bg-info
```

#### 8. Detallado Table (`677-837`)
Mismos cambios que tabla resumida, más:

**Estado badge:**
```diff
- Raw badge with bg-emerald-100 text-emerald-700 / bg-gray-100 text-gray-700
+ <Badge variant={row.estado === 'dentro' ? 'success' : 'neutral'}>
    {row.estado === 'dentro' ? 'Dentro' : 'Fuera'}
  </Badge>
```

**Export Excel button:**
```diff
- Raw button
+ <Button variant="secondary" icon={Download} onClick={exportToExcelDetallado} disabled={detalleData.length === 0}>
    Exportar Excel
  </Button>
```

#### 9. Info section (`839-872`)
```diff
- bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6
+ bg-info-light rounded-xl border border-info p-6
- text-gray-900
+ text-fg-primary
- text-gray-700
+ text-fg-secondary
- bg-blue-100 text-blue-600 (icon)
+ bg-surface-primary text-info
- bg-blue-500 (list dots)
+ bg-info
```

#### 10. Imports update
```diff
- import { motion } from 'framer-motion' (keep)
- Remove: Loader2 (Button loading prop handles this)
+ Add: Card, StatCard, Button, Input, Select, Badge
+ Add from lucide: CheckCircle, XCircle (for Badge icons; already have most)
```

Check icon usage:
- BarChart3 — tabs, generate button, info section ✓
- Calendar — date inputs ✓
- Filter — filters header ✓
- Download — export buttons ✓
- Car — stat card, filter, tabs icon ✓
- Bike — stat card, type icon ✓
- Truck — stat card, type icon ✓
- PieChart — table header ✓
- TrendingUp — stat card ✓
- Clock — range info, table cells ✓
- Loader2 → REMOVE (replaced by Button loading prop)
- Add: CheckCircle, XCircle (for estado Badge)

### Resumen de carga de trabajo

| Sección | Líneas | Tipo | DS Componente | Esfuerzo |
|---------|--------|------|---------------|----------|
| Imports | ~16 | Estructural | +6 DS, -1 lucide | 2 min |
| Layout | 1 | Token | — | 1 min |
| Header | ~22 | Token + estructural | — | 3 min |
| View Tabs | ~25 | Token (raw) | — | 3 min |
| Filters Card | ~105 | Estructural | Card + Input ×2 + Select + Button ×2 | 12 min |
| Stat Cards | ~52 | Estructural | StatCard ×4 | 8 min |
| Resumido Table | ~175 | Token + estructural | Badge (+ Card wrapper) | 15 min |
| Detallado Table | ~160 | Token + estructural | Badge (+ Card wrapper) | 15 min |
| Info section | ~33 | Token | — | 3 min |

**Total:** ~62 min edición + 10 min build/validación

### Impacto en tamaño
- Original: 876 líneas (la más larga)
- Estimado post-migración: ~790–830 líneas (−5% a −10%)
- Desviaciones eliminadas: ~95 de ~100

---

## Checklist de verificación post-migración

- [ ] Build sin errores (`npm run build`)
- [ ] StatCards renderizan 4 columnas
- [ ] Filtros con fechas + tipo funcionan correctamente
- [ ] Generate button con loading mientras `loading=true`
- [ ] Export CSV funciona (sin cambios funcionales)
- [ ] Export Excel funciona (sin cambios funcionales)
- [ ] View tabs cambian entre Resumido/Detallado
- [ ] Estado badge con icono + color correcto en detallado
- [ ] Percentage bars renderizan correctamente
- [ ] Tablas muestran Loading/EmptyState/datos
- [ ] Feedback Alert con dismissible
- [ ] Info section sin gradient
- [ ] Sin regresiones responsivas (md:grid-cols-*)
- [ ] Sin imports sin uso
- [ ] Tipografía: `text-fg-*`
- [ ] Sombras: `shadow-token-*`
- [ ] Bordes: `border-default`, `border-info`
- [ ] Sin lógica de negocio, API, exportación modificados
- [ ] Sin componentes nuevos creados
