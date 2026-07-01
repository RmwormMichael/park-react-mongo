# Sprint Review: VehiclesPage — Migración al Design System

## Métricas

| Métrica | Antes | Después | Cambio |
|---------|-------|---------|--------|
| Líneas totales | 759 | 742 | −17 (−2.2%) |
| Componentes DS importados | 3 | 12 | +9 |
| Imports de lucide-react | 17 | 16 | −1 |
| Desviaciones estimadas | ~140 | ~5 | −96% |

## Componentes reutilizados

| Componente | Veces usado | Props clave |
|-----------|-------------|-------------|
| `Card` | 3 | variant="bordered" (1), className="overflow-hidden" (1) |
| `Card.Header` | 1 | — |
| `Card.Content` | 2 | — |
| `StatCard` | 4 | variant ("brand"/"info"/"success"), icon, label, value, description |
| `Button` | 3 | variant ("primary"/"secondary"/"destructive"), size, loading, icon |
| `Input` | 5 | icon, label, required, placeholder |
| `Select` | 3 | label, options, required |
| `Alert` | 1 | variant="error", title |
| `Badge` | ~7 | variant ("error"/"warning"/"info"/"success"/"neutral"), icon |
| `Loading` | 1 | text (ya estaba) |
| `EmptyState` | 1 | (ya estaba) |
| `ConfirmDialog` | 1 | (ya estaba) |

## Desviaciones eliminadas

### Layout
- ❌ `bg-gradient-to-b from-gray-50 to-white` → ✅ `bg-bg-primary`
- ❌ `pt-20` → ✅ `pt-16` (consistente con Dashboard)

### Header
- ❌ `text-3xl md:text-4xl font-bold text-gray-900` → ✅ `text-2xl md:text-3xl font-bold text-fg-primary`
- ❌ `text-lg text-gray-600 mt-2` → ✅ `text-sm text-fg-secondary mt-1`
- ❌ `bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg` → ✅ `bg-brand-primary shadow-token-md`
- ❌ `text-white` → ✅ `text-fg-inverse`

### Stat Cards
- ❌ 4 raw divs con `bg-white rounded-2xl border border-gray-100 p-6 shadow-sm` → ✅ 4 `StatCard` con variantes DS
- ❌ `typeColors` object completo (24 líneas) → ✅ eliminado, reemplazado por `typeVariant` + `typeIconMap`

### Formulario
- ❌ Raw `bg-white rounded-2xl border border-gray-100 shadow-sm p-6` → ✅ `Card` + `Card.Header` + `Card.Content`
- ❌ `text-gray-900` → ✅ `text-fg-primary`
- ❌ `text-gray-600` → ✅ `text-fg-secondary`
- ❌ `text-gray-700` (labels) → ✅ manejado por Input/Select component
- ❌ `bg-gray-50 rounded-xl p-4` (image section) → ✅ `bg-surface-tertiary rounded-xl p-4`
- ❌ `border-dashed border-gray-300` → ✅ `border-dashed border-default`
- ❌ `text-gray-400` → ✅ `text-fg-tertiary`
- ❌ `text-gray-500` → ✅ `text-fg-tertiary`
- ❌ `bg-red-500 text-white` (remove button) → ✅ `bg-error text-fg-inverse`
- ❌ `hover:bg-red-600` → ✅ `hover:bg-error-hover`
- ❌ `bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100` → ✅ `bg-brand-light text-brand-primary rounded-lg hover:bg-brand-primary hover:text-fg-inverse`
- ❌ 3 raw `<input>` → ✅ `Input`
- ❌ 1 raw `<select>` → ✅ `Select`
- ❌ Gradient submit button + raw loader2 → ✅ `Button variant="primary" size="lg" loading={uploading}`
- ❌ `border-t border-gray-200` → ✅ `border-t border-default`

### Search/Filter Panel
- ❌ Raw `bg-white rounded-2xl border border-gray-100 shadow-sm p-6` → ✅ `Card variant="bordered"` + `Card.Content`
- ❌ Raw refresh `<button>` → ✅ `Button variant="secondary" icon={RefreshCw}`
- ❌ Raw search `<input>` → ✅ `Input icon={Search}`
- ❌ Raw filter `<select>` → ✅ `Select`
- ❌ `text-gray-900` → ✅ `text-fg-primary`
- ❌ `text-gray-600` → ✅ `text-fg-secondary`

### Error State
- ❌ Raw error div con `bg-red-50 border border-red-200` + `AlertCircle` → ✅ `Alert variant="error"`

### Tabla
- ❌ `bg-gray-50` → ✅ `bg-surface-tertiary`
- ❌ `text-gray-500` → ✅ `text-fg-tertiary`
- ❌ `divide-gray-100` → ✅ `divide-default`
- ❌ `hover:bg-gray-50/50` → ✅ `hover:bg-surface-tertiary`
- ❌ `text-gray-900` → ✅ `text-fg-primary`
- ❌ `text-gray-500` → ✅ `text-fg-tertiary`
- ❌ `text-gray-600` → ✅ `text-fg-secondary`
- ❌ `text-gray-400` → ✅ `text-fg-tertiary`
- ❌ `border-gray-200` → ✅ `border-default`
- ❌ `bg-gray-100` → ✅ `bg-surface-tertiary`
- ❌ `text-emerald-600 hover:text-emerald-500` → ✅ `text-brand-primary hover:text-brand-hover`
- ❌ `shadow-sm` → ✅ `shadow-token-sm`
- ❌ Role badge: 6 líneas de ternaria anidada → ✅ `Badge variant={roleBadgeVariant[rol] || 'neutral'}`
- ❌ Delete button: raw `<button>` → ✅ `Button variant="destructive" size="sm"`
- ❌ `border-gray-100` → ✅ `border-default`

### Info Section
- ❌ `bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100` → ✅ `bg-brand-light rounded-xl border border-brand-primary`
- ❌ `text-gray-900` → ✅ `text-fg-primary`
- ❌ `text-gray-700` → ✅ `text-fg-secondary`
- ❌ `text-emerald-600` → ✅ `text-brand-primary`

## Cambios en tokens-utilities.css

Se agregaron 5 clases bridge para la producción:

```
.bg-info                          # Legend dot para "moto"
.bg-success                       # Legend dot para "bicicleta"
.bg-warning                       # (futuro uso)
.border-brand-primary             # Info section border
.hover\:text-brand-hover:hover   # Email link hover
```

## Deuda residual

| Item | Razón | Impacto |
|------|-------|---------|
| `h-5`, `h-8`, `space-x-*`, `gap-*`, `mb-8`, `px-6` | Clases Tailwind estándar generadas por CDN JIT; no hay token DS equivalente | Bajo — son clases atómicas estándar |
| `text-2xl md:text-3xl` | DS no tiene jerarquía tipográfica definida; se usa Tailwind estándar | Bajo — consistente con Dashboard |
| `rounded-xl` en icon badges | Existe en tokens-utilities.css como bridge | Ninguno |
| `overflow-hidden`, `overflow-x-auto`, `object-cover` | Utilidades de layout estándar | Bajo |
| `capitalize`, `tracking-wider` | Utilidades de texto estándar | Bajo |
| `w-16 h-16` (imagen tabla) | Tamaño fijo de componente raw (table) | Bajo |
| `border-dashed` | No hay token DS para dashed border | Bajo |
| `-top-2 -right-2` | Posicionamiento absoluto del botón de cerrar preview | Bajo |
| Image upload (raw) | No existe DS FileUpload | Medio — patrón candidato |
| Tabla raw | No existe DS DataTable | Medio — patrón candidato |

## Patrones candidatos para futura versión del DS

Basado en la migración de VehiclesPage y la revisión de MovimientosPage y ReportesPage:

### 1. `SearchFilterBar` — ALTA PRIORIDAD
Toolbar con búsqueda + filtro + acción. Presente en:
- **VehiclesPage**: `Input(Search)` + `Select(filter)` + `Button(Refresh)`
- **UsersPage**: Search input + role filter
- **MovimientosPage**: Filtros por fecha/estado/tipo
- **ReportesPage**: Filtros por rango de fechas

Propuesta: `<SearchFilterBar filters={[...]} onSearch={fn} actions={[...]} />`

### 2. `DataTable` — ALTA PRIORIDAD
Tabla con columnas condicionales por rol, filas con hover, header sticky. Presente en:
- **VehiclesPage**: Tabla con columnas Admin/Vigilante vs resto
- **UsersPage**: Tabla usuarios
- **MovimientosPage**: Tabla movimientos
- **ReportesPage**: Tabla resumen

Propuesta: `<DataTable columns={[...]} data={[...]} conditionalColumns={{ admin: [...], default: [...] }} />`

### 3. `FileUpload` con preview — MEDIA PRIORIDAD
Selector de archivos con imagen preview, validación de tamaño/tipo, botón de eliminar. Presente en:
- **VehiclesPage**: Foto del vehículo
- (Potencial) PerfilUsuario: Foto de perfil

Propuesta: `<FileUpload accept="image/*" maxSize={10} preview onFileChange />`

### 4. `RoleBadge` — BAJA PRIORIDAD
Helper que mapea `NombreRol` a variante de Badge. Presente en:
- **VehiclesPage**: 6–7 instancias de Badge con roleBadgeVariant
- **UsersPage**: Badge de rol en tabla

Propuesta: Extraer `roleBadgeVariant` a `src/utils/permissions.js` como función exportada.

## Checklist de cumplimiento

- [x] Build sin errores (`npm run build`) — 0 errores, 0 warnings
- [x] Sin imports rotos — 12 DS imports verificados
- [x] StatCards renderizan en 4 columnas — grid-cols-1 md:grid-cols-4
- [x] Formulario envía FormData correctamente — sin cambios en submit()
- [x] Botón submit muestra loading — Button loading prop
- [x] Search + filter filtra correctamente — sin cambios en filteredVehicles
- [x] Columnas de tabla condicionales — isAdminOrVigilanteRole intacto
- [x] Role badges con colores correctos — Badge variant map
- [x] Delete button con loading por fila — Button loading={deletingId === id}
- [x] ConfirmDialog se abre/cierra — sin cambios
- [x] Error alert se muestra — Alert variant="error"
- [x] EmptyState aparece sin resultados — sin cambios
- [x] Loading aparece durante carga inicial — sin cambios
- [x] Info section sin gradient — bg-brand-light sólido
- [x] Tipografía: todo `text-fg-*` — verificado línea por línea
- [x] Sombras: `shadow-token-*` — sm y md verificados
- [x] Bordes: `border-default` en lugar de `border-gray-*` — verificado
- [x] Sin regresiones responsivas — md:grid-cols-* preservados
- [x] Sin dependencias rotas con MovimientosPage/ReportesPage
- [x] Sin lógica de negocio modificada
- [x] Sin validaciones modificadas
- [x] Sin permisos modificados

## Veredicto final

**APROBADO** — VehiclesPage migrada al Design System con 0 desviaciones funcionales. 

- **Reducción de líneas**: 759 → 742 (−2.2%, tamaño contenido por tabla raw e image upload)
- **Desviaciones eliminadas**: ~135 de ~140 (−96%)
- **Deuda técnica nueva**: 0 (solo se documentaron candidatos DS)
- **Tokens-utilities.css**: +5 clases bridge para producción
- **Consistencia visual**: Alineada con Dashboard (StatCards, layout, tipografía, colores, sombras)
