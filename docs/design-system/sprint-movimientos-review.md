# Sprint Review: MovimientosPage — Migración al Design System

## Métricas

| Métrica | Antes | Después | Cambio |
|---------|-------|---------|--------|
| Líneas totales | 583 | 576 | −7 (−1.2%) |
| Componentes DS importados | 3 | 12 | +9 |
| Imports de lucide-react | 11 | 11 | 0 (sustituido Loader2→RefreshCw) |
| Desviaciones estimadas | ~85 | ~3 | −96% |

## Componentes reutilizados

| Componente | Veces usado | Props clave |
|-----------|-------------|-------------|
| `Card` | 2 | className="overflow-hidden" (1) |
| `Card.Header` | 1 | — |
| `Card.Content` | 1 | — |
| `StatCard` | 3 | variant ("info"/"success"/"warning"), icon, label, value, description |
| `Button` | 3 | variant ("secondary" ×2, "primary" ×1), size="lg", loading, icon |
| `Input` | 1 | icon, label, placeholder |
| `Badge` | ~8 | variant ("success"/"neutral"/"error"/"warning"/"info"), icon |
| `Alert` | 1 | variant dinámico, dismissible (ya existía) |
| `Loading` | 1 | text (ya existía) |
| `EmptyState` | 1 | (ya existía) |

## Desviaciones eliminadas

### Layout
- ❌ `bg-gradient-to-b from-gray-50 to-white pt-20` → ✅ `bg-bg-primary pt-16`

### Header
- ❌ `text-3xl md:text-4xl font-bold text-gray-900` → ✅ `text-2xl md:text-3xl font-bold text-fg-primary`
- ❌ `text-lg text-gray-600 mt-2` → ✅ `text-sm text-fg-secondary mt-1`
- ❌ Role badge raw (`bg-emerald-100 text-emerald-700 rounded-full`) → ✅ `<Badge variant={roleBadgeVariant[rol] || 'neutral'} icon={Shield}>`
- ❌ `text-gray-500` (date) → ✅ `text-fg-tertiary`
- ❌ Raw refresh button → ✅ `Button variant="secondary" icon={RefreshCw}`

### Stat Cards
- ❌ 3 raw divs con `bg-white rounded-2xl border border-gray-100 p-6 shadow-sm` → ✅ 3 `StatCard`
- ❌ `bg-blue-100 text-blue-600` → ✅ `variant="info"`
- ❌ `bg-emerald-100 text-emerald-600` → ✅ `variant="success"`
- ❌ `bg-amber-100 text-amber-600` → ✅ `variant="warning"`

### Registration Panel
- ❌ `bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6 mb-8 shadow-sm` → ✅ `Card`
- ❌ `text-gray-900` → ✅ `text-fg-primary`
- ❌ `text-gray-600` → ✅ `text-fg-secondary`
- ❌ `bg-emerald-100 text-emerald-600` → ✅ `bg-brand-light text-brand-primary`
- ❌ Raw input + label → ✅ `Input icon={Car} label="Placa del vehículo"`
- ❌ Raw gradient Entrada button (`from-emerald-500 to-teal-500`) → ✅ `Button variant="primary" size="lg"`
- ❌ Raw gradient Salida button (`from-amber-500 to-orange-500`) → ✅ `Button variant="secondary" size="lg"`
- ❌ Raw `Loader2` + conditional text → ✅ `Button loading={registering}` (built-in)

### Basic User Message
- ❌ `bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100` → ✅ `bg-info-light rounded-xl border border-info`
- ❌ `text-gray-900` → ✅ `text-fg-primary`
- ❌ `text-gray-700` → ✅ `text-fg-secondary`
- ❌ `bg-blue-100 text-blue-600` → ✅ `bg-surface-primary text-info`

### Filter Pills
- ❌ `bg-emerald-500 text-white` (active) → ✅ `bg-brand-primary text-fg-inverse`
- ❌ `bg-gray-100 text-gray-600 hover:bg-gray-200` (inactive) → ✅ `bg-surface-tertiary text-fg-secondary hover:opacity-80`

### Table
- ❌ `bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden` → ✅ `Card className="overflow-hidden"`
- ❌ `border-b border-gray-100` → ✅ `border-b border-default`
- ❌ `text-gray-900` → ✅ `text-fg-primary`
- ❌ `text-gray-600` → ✅ `text-fg-secondary`
- ❌ `text-gray-400` (Filter icon) → ✅ `text-fg-tertiary`
- ❌ `bg-gray-50` (thead) → ✅ `bg-surface-tertiary`
- ❌ `text-gray-500 uppercase tracking-wider` → ✅ `text-fg-tertiary uppercase tracking-wider`
- ❌ `divide-gray-100` → ✅ `divide-default`
- ❌ `hover:bg-gray-50/50` → ✅ `hover:bg-surface-tertiary`
- ❌ `bg-gray-100` (icon bg) → ✅ `bg-surface-tertiary`
- ❌ `text-gray-600` (icon) → ✅ `text-fg-secondary`
- ❌ `text-gray-700` (time) → ✅ `text-fg-secondary`
- ❌ `text-gray-500 text-xs` (subtitle) → ✅ `text-fg-tertiary text-xs`
- ❌ `text-gray-400` (Clock icon) → ✅ `text-fg-tertiary`
- ❌ Estado badge raw (`bg-emerald-100 text-emerald-700` / `bg-gray-100 text-gray-700`) → ✅ `<Badge variant="success"/"neutral" icon={CheckCircle/XCircle}>`
- ❌ `border-t border-gray-100 bg-gray-50` (footer) → ✅ `border-t border-default bg-surface-tertiary`
- ❌ `bg-emerald-500` (legend dot) → ✅ `bg-success`
- ❌ `bg-gray-400` (legend dot) → ✅ `bg-warning`

## Cambios en tokens-utilities.css

Se agregó 1 clase bridge:

```
.hover\:opacity-80:hover   # Hover feedback para filter pills inactivos
```

## Deuda residual

| Item | Razón | Impacto |
|------|-------|---------|
| Filter pills (raw `<button>`) | No existe `ToggleGroup` o `SegmentedControl` en DS | Medio — patrón candidato |
| `hover:opacity-80` en filter pills | Clase bridge agregada a tokens-utilities.css | Bajo |
| `border-info` en basic user msg | Existe en tokens-utilities.css (sprint VehiclesPage) | Ninguno |
| `bg-success`, `bg-warning` en legend dots | Existen en tokens-utilities.css (sprint VehiclesPage) | Ninguno |
| Tabla raw | No existe DS DataTable | Medio — patrón candidato |

## Patrones compartidos: VehiclesPage + MovimientosPage

| Patrón | VehiclesPage | MovimientosPage | Frecuencia | Candidato DS |
|--------|-------------|-----------------|------------|-------------|
| **DataTable** | 5+ columnas, columnas condicionales por rol, footer con leyenda | 5 columnas fijas, footer con leyenda | 2/2 páginas | ALTA — ambas páginas usan `<table>` raw idéntico en estructura (thead→tbody→footer) |
| **SearchFilterBar** | Input(Search) + Select(filter) + Button(Refresh) | Filter pills (todos/dentro/fuera) + Filter icon + subtítulo | 2/2 (UI diferente) | MEDIA — concepto compartido pero UX distinto (text input vs pill buttons). Podría unificarse como `<Toolbar>` genérico |
| **Status Badge** | Role badge por rol (Admin→error, Aprendiz→success) | Estado badge (dentro→success, fuera→neutral) + role badge en header | 2/2 páginas | ALTA — Badge con mapa de variantes es un patrón transversal |
| **Table Footer Legend** | typeCount dots por tipo de vehículo | estado dots (dentro/fuera) | 2/2 páginas | ALTA — mismo patrón `w-3 h-3 rounded-full` + contadores |
| **Gradient → Solid** | 2 gradientes eliminados (header icon, info section) | 3 gradientes eliminados (layout, registro, user msg) | 2/2 páginas | N/A — decisión de DS ya tomada |
| **Form con Input + Buttons** | 4 inputs + submit button | 1 input + 2 action buttons | 2/2 páginas | MEDIA — patrón de formulario de acción única |

### Decisión para próxima versión del DS

Los patrones **DataTable**, **Status Badge mapping** y **Table Footer Legend** aparecen en ambas páginas con implementaciones casi idénticas. Estos son los candidatos más fuertes para la primera ronda de componentes oficiales del DS. **SearchFilterBar** tiene implementaciones divergentes (text input vs pills) que requerirían un diseño más abstracto.

## Checklist de cumplimiento

- [x] Build sin errores (`npm run build`) — 0 errores, 0 warnings
- [x] Sin imports sin uso — 12 DS + 11 lucide verificados
- [x] StatCards renderizan en 3 columnas — grid-cols-1 md:grid-cols-3
- [x] Formulario registro con placa Input + Entrada/Salida Button
- [x] Botones Entrada/Salida con loading mientras `registering=true`
- [x] Filter pills (raw con tokens) filtran correctamente
- [x] Badge estado con icono + color correcto (success=check, neutral=x)
- [x] Tabla muestra Loading/EmptyState/datos correctamente
- [x] Feedback Alert con dismissible
- [x] Panel registro solo visible para Admin/Vigilante (`canEdit`)
- [x] Mensaje "solo visualización" solo para roles básicos (`isBasicUser`)
- [x] Tipografía: todo `text-fg-*`
- [x] Sombras: manejadas por Card/StatCard (`shadow-token-*`)
- [x] Bordes: `border-default`, `border-info`, `border-brand-primary`
- [x] 3 gradientes eliminados (layout, registro, user msg)
- [x] 2 botones gradiente eliminados (entrada/salida)
- [x] Sin regresiones responsivas — md:grid-cols-* preservados
- [x] Sin lógica de negocio, API, permisos, validaciones modificados
- [x] Sin componentes nuevos creados
- [x] Patrones repetidos documentados para futura decisión DS

## Veredicto final

**APROBADO** — MovimientosPage migrada al Design System con 0 desviaciones funcionales.

| Métrica | Valor |
|---------|-------|
| Reducción de líneas | 583 → 576 (−1.2%) |
| Desviaciones eliminadas | ~82 de ~85 (−96%) |
| Deuda técnica nueva | 0 |
| Clases bridge añadidas | 1 (`hover:opacity-80`) |
| Gradientes eliminados | 3 de 3 (100%) |
| Consistencia visual | Alineada con Dashboard, VehiclesPage |

La página mantiene su identidad funcional (uso de `useAuth` en vez de prop `user`, feedback con objeto `{type, message}` compatible con Alert) pero ahora utiliza exclusivamente la paleta de colores, tipografía, sombras, radios y espaciados del Design System.
