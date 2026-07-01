# Sprint: VehiclesPage — Migración al Design System

## Fase 1 — Auditoría

### Archivo objetivo
`src/pages/VehiclesPage.jsx` — 759 líneas (13.6% de crecimiento vs UsersPage 860, Dashboard 295)

### Desviaciones identificadas (~140)

| Categoría | Ocurrencias | Ejemplos representativos |
|-----------|-------------|--------------------------|
| Layout (bg, spacing) | 2 | `bg-gradient-to-b from-gray-50 to-white`, `pt-20` |
| Headings | 4 | `text-gray-900` → `text-fg-primary` |
| Text body | 8 | `text-gray-600` → `text-fg-secondary` |
| Cards (raw divs) | 5 | `bg-white rounded-2xl border border-gray-100 p-6 shadow-sm` → `Card` |
| Stat cards (raw) | 4 | Total + per-type cards sin `StatCard` |
| Buttons (raw `<button>`) | 3 | Submit gradient, Refresh, Delete |
| Inputs (raw `<input>`) | 3 | Placa, Modelo, Color (raw, sin label wrapper) |
| Selects (raw `<select>`) | 2 | Tipo filter + form Tipo |
| Search input (raw) | 1 | `Search` icon posicionado manualmente |
| Badges (rol) | ~7 | 6–8 role badges con colores manuales |
| Alert / Error (raw div) | 1 | Error panel con `AlertCircle` manual |
| Color tokens (grises) | ~30 | `text-gray-500`, `border-gray-100`, `bg-gray-50` |
| Border tokens | ~10 | `rounded-2xl` → `rounded-xl`, `border-gray-300` → `border-default` |
| Shadow tokens | ~7 | `shadow-sm` → `shadow-token-sm` / `shadow-token-md` |
| Gradient backgrounds | 2 | Header icon gradient + Info section gradient |
| Motion (raw `motion.div`) | ~8 | Sin consolidar timing |

### Componentes DS ya importados (3)
- `Loading` (línea 512) — correcto
- `EmptyState` (línea 513) — correcto
- `ConfirmDialog` (línea 748) — correcto

### Componentes DS disponibles para migrar (8)
| Componente | Props clave |
|-----------|-------------|
| `Card` | `variant` (default, bordered, elevated), `Card.Header/Content/Footer` |
| `StatCard` | `variant` (brand, success, error, warning, info), `icon`, `label`, `value`, `description` |
| `Button` | `variant` (primary, secondary, ghost, destructive), `size`, `loading`, `icon`, `disabled` |
| `Input` | `label`, `icon`, `error`, `required`, `type`, `placeholder`, `helperText` |
| `Select` | `label`, `options`, `placeholder`, `required`, `error` |
| `Alert` | `variant` (success, error, warning, info), `title`, `children`, `dismissible` |
| `Badge` | `variant` (success, error, warning, info, neutral, brand), `size`, `icon` |
| `Modal` | `open`, `onClose`, `size`, `Header/Content/Footer` |

### Componentes DS NO disponibles (raw obligatorio)
- **File upload / ImagePicker** — no existe en DS. Se mantendrá HTML raw pero con tokens DS.
- **Table** — no existe en DS. Se mantendrá `<table>` raw con tokens. Documentar como patrón candidato.
- **Tabla footer (summary)** — raw div con tokens. Patrón candidato.

### Mapa de variantes: tipos de vehículo → StatCard variant
| Tipo | Variante StatCard | Justificación (Dashboard) |
|------|------------------|--------------------------|
| `carro` | `brand` | Verde esmeralda → brand-primary |
| `moto` | `info` | Azul — distinción visual |
| `bicicleta` | `success` | Verde claro — natural para bicicleta |

### Mapa de variantes: roles → Badge variant
| Rol | Variante Badge |
|-----|---------------|
| Administrador | `error` |
| Vigilante | `warning` |
| Instructor | `info` |
| Aprendiz | `success` |
| Visitante | `neutral` |

### Patrones compartidos (documentar, NO implementar como componentes)
- **Tabla con columnas condicionales por rol** — también en MovimientosPage, ReportesPage
- **Toolbar de búsqueda + filtro** — también en UsersPage, MovimientosPage, ReportesPage
- **Role badge** — también en UsersPage, (futuros pages con usuarios)
- **EmptyState + Loading** — común en todas las páginas

---

## Fase 2 — Plan de implementación

### Orden de migración (estricto)

#### 1. Layout (`200-201`)
```
- min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12
+ min-h-screen bg-bg-primary pt-16 pb-12
```
**Tokens:**
| Clase vieja | Clase nueva |
|-------------|-------------|
| `bg-gradient-to-b from-gray-50 to-white` | `bg-bg-primary` |
| `pt-20` | `pt-16` |

#### 2. Header (`203-225`)
```
- text-3xl md:text-4xl font-bold text-gray-900
+ text-2xl md:text-3xl font-bold text-fg-primary

- text-lg text-gray-600 mt-2
+ text-sm text-fg-secondary mt-1

- <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
+ <div className="p-3 rounded-xl bg-brand-primary shadow-token-md">
```
**Ícono Truck:** `text-white` → `text-fg-inverse`

#### 3. Stat Cards (`227-262`) — RECOMENDACIÓN CRÍTICA

**Card total (línea 234):**
Reemplazar raw div + contenido por `StatCard variant="brand" icon={Truck} label="Total" value={vehicles.length} description="Vehículos registrados"`

Si no se quiere perder el contenedor `motion.div` con escala, envolver `StatCard` en `motion.div`.

**Per-type cards (línea 245):**
Reemplazar raw divs por `StatCard` con variante según tipo (`brand`, `info`, `success`):
```jsx
<StatCard
  variant={type === 'carro' ? 'brand' : type === 'moto' ? 'info' : 'success'}
  icon={typeIcons[type]?.type || Truck}
  label={type}
  value={count}
  description="Vehículos"
/>
```
**Advertencia:** `StatCard` renderiza `Icon` como componente (no JSX), por lo que `typeIcons` deberá cambiar de `JSX.Element` a componente `lucide-react` (`Car`, `Bike`, `Truck`). Ejemplo:
```js
const typeIcons = {
  carro: Car,     // antes: <Car className="w-5 h-5" />
  moto: Bike,
  bicicleta: Truck,
}
```

#### 4. Form - Image Upload (`287-337`)
Sin componente DS. Migración puramente de tokens:
- `bg-gray-50 rounded-xl p-4` → `bg-surface-tertiary rounded-xl p-4`
- `text-gray-900` → `text-fg-primary`
- `border-gray-300` → `border-default`
- `border-dashed border-gray-300` → `border-dashed border-default`
- `text-gray-400` → `text-fg-tertiary`
- `text-gray-500` → `text-fg-tertiary`
- `text-gray-600` → `text-fg-secondary`
- `bg-red-500 text-white` (remove button) → `Button variant="destructive" size="sm" icon={X}` (o mantener raw por simplicidad)
- `bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100` → `bg-brand-light text-brand-primary rounded-lg hover:bg-brand-light/80`

#### 5. Form - Fields (`339-395`)
Cada raw input/select migra a componente DS:

**Placa:**
```jsx
<Input
  label="Placa *"
  value={form.placa}
  onChange={e => setForm({ ...form, placa: e.target.value.toUpperCase() })}
  placeholder="ABC123"
  required
/>
```

**Tipo:**
```jsx
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
```

**Modelo:**
```jsx
<Input
  label="Modelo"
  value={form.modelo}
  onChange={e => setForm({ ...form, modelo: e.target.value })}
  placeholder="Ej: Toyota Corolla"
/>
```

**Color:**
```jsx
<Input
  label="Color"
  value={form.color}
  onChange={e => setForm({ ...form, color: e.target.value })}
  placeholder="Ej: Rojo"
/>
```

#### 6. Form - Submit Button (`397-415`)
```jsx
<Button
  type="submit"
  disabled={uploading}
  loading={uploading}
  icon={PlusCircle}
  size="lg"
>
  Registrar Vehículo
</Button>
```

**Nota:** El Button DS renderiza `loading` como spinner y no como texto "Registrando...". El texto cambia automáticamente a solo el spinner cuando `loading=true`. Esto es intencional y consistente con el resto del DS.

**Advertencia:** El botón actual está dentro de un `div.pt-4.border-t.border-gray-200`. Mantener ese wrapper pero con tokens DS: `border-t border-default`.

#### 7. Search/Filter Panel (`419-488`)

**Sección wrapper:** `bg-white rounded-2xl border border-gray-100 shadow-sm p-6` → `Card variant="bordered"` con `Card.Content`

**Search input:**
```jsx
<Input
  icon={Search}
  label="Buscar vehículo"
  value={searchTerm}
  onChange={e => setSearchTerm(e.target.value)}
  placeholder="Buscar por placa, modelo, color, propietario..."
/>
```

**Type filter:**
```jsx
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
```

**Refresh button:**
```jsx
<Button
  variant="secondary"
  icon={RefreshCw}
  onClick={load}
  disabled={loading}
>
  Actualizar
</Button>
```

#### 8. Error state (`498-508`)
```jsx
<Alert variant="error" title="Error al cargar vehículos">
  {error}
</Alert>
```
Mover el Alert DENTRO de `Card` que envuelve la tabla, o renderizarlo antes de la tabla si el wrapper se simplifica.

#### 9. Table header row (`525-557`)
Tokens únicamente:
- `bg-gray-50` → `bg-surface-tertiary`
- `text-gray-500 uppercase tracking-wider text-xs font-medium` → `text-fg-tertiary uppercase tracking-wider text-xs font-medium`
- `px-6 py-4` → mantener
- `text-left` → mantener

#### 10. Table rows / cells (`559-686`)
Tokens únicamente:
- `divide-gray-100` → `divide-default`
- `hover:bg-gray-50/50` → `hover:bg-surface-tertiary/50`
- `text-gray-900` → `text-fg-primary`
- `text-gray-500` → `text-fg-tertiary`
- `text-gray-600` → `text-fg-secondary`
- `text-emerald-600 hover:text-emerald-500` (email link) → `text-brand-primary hover:text-brand-hover`
- `border-2 border-gray-200` (image) → `border-2 border-default`

#### 11. Role badges (`660-663`)
```jsx
<Badge variant={roleBadgeVariant(vehicle.NombreRol)} icon={Shield}>
  {vehicle.NombreRol}
</Badge>
```
Función auxiliar:
```js
const roleBadgeVariant = (rol) => {
  const map = {
    'Administrador': 'error',
    'Vigilante': 'warning',
    'Instructor': 'info',
    'Aprendiz': 'success',
    'Visitante': 'neutral',
  }
  return map[rol] || 'neutral'
}
```

#### 12. Delete button per row (`670-683`)
```jsx
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
```

#### 13. Table footer (`690-706`)
Tokens:
- `border-t border-gray-100` → `border-t border-default`
- `bg-gray-50` → `bg-surface-tertiary`
- `text-gray-600` → `text-fg-secondary`
- `text-gray-900 font-semibold` → `text-fg-primary font-semibold`
- Legend color dots: `bg-{typeColors[type]?.bg || 'bg-gray-300'}` → usar tokens del DS si aplica

#### 14. Info section (`711-743`)
```
- bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100
+ bg-brand-light rounded-xl border border-brand
```
**Tokens adicionales:**
- `text-gray-900` → `text-fg-primary`
- `text-gray-700` → `text-fg-secondary`
- `text-emerald-600` → `text-brand-primary`
- `bg-emerald-100 text-emerald-600` → `bg-brand-light text-brand-primary`

#### 15. ConfirmDialog (`748-756`)
Ya usa el componente DS correctamente. Sin cambios.

---

## Resumen de carga de trabajo

| Elemento | Líneas | Tipo | DS Componente | Esfuerzo |
|----------|--------|------|---------------|----------|
| Layout | 2 | Token | — | 1 min |
| Header | ~22 | Token + estructural | — | 2 min |
| Stat Cards | ~36 | **Estructural** | StatCard (4) | 10 min |
| Form image | ~50 | Token | — | 5 min |
| Form fields | ~56 | **Estructural** | Input (3) + Select (1) | 8 min |
| Form submit | ~18 | **Estructural** | Button | 2 min |
| Search/filter | ~68 | **Estructural** | Card + Input + Select + Button | 8 min |
| Error alert | ~10 | **Estructural** | Alert | 1 min |
| Table header | ~30 | Token | — | 3 min |
| Table rows | ~130 | Token + estructural | Badge (~7) + Button (~7 destroy) | 15 min |
| Table footer | ~17 | Token | — | 2 min |
| Info section | ~33 | Token | — | 3 min |
| ConfirmDialog | ~9 | Ya DS | — | 0 min |
| Imports | ~28 | **Estructural** | Agregar imports faltantes | 2 min |

**Total estimado:** ~62 minutos de edición + 10 min build/validación

### Impacto en tamaño
- Original: ~759 líneas
- Estimado post-migración: ~570–620 líneas (−18% a −25%)
- Desviaciones eliminadas: ~140

---

## Checklist de verificación post-migración

- [ ] Build sin errores (`npm run build`)
- [ ] Sin imports rotos (revisar `import * from 'lucide-react'`)
- [ ] StatCards renderizan correctamente en 4 columnas
- [ ] Formulario envía FormData correctamente (placa.toUpperCase(), tipo, foto)
- [ ] Botón submit muestra loading mientras `uploading=true`
- [ ] Search + filter filtra correctamente
- [ ] Columnas de tabla condicionales (Admin/Vigilante vs resto)
- [ ] Role badges muestran colores correctos por rol
- [ ] Delete button muestra loading por fila individual
- [ ] ConfirmDialog se abre/cierra correctamente
- [ ] Error alert se muestra y se oculta al recargar
- [ ] EmptyState aparece cuando no hay resultados
- [ ] Loading aparece durante carga inicial
- [ ] Info section se renderiza sin gradient background
- [ ] Tipografía: todos los textos usan `text-fg-*` donde corresponde
- [ ] Sombras: usan `shadow-token-*` en lugar de `shadow-sm`/`shadow`
- [ ] Bordes: usan `border-default` en lugar de `border-gray-*`
- [ ] Sin regresiones de layout responsivo (md:grid-cols-4, md:grid-cols-2, etc.)

---

## Documentación de patrones compartidos

Los siguientes patrones se repiten en VehiclesPage, MovimientosPage y ReportesPage. **No se implementan como componentes ahora**, pero se documentan para futura creación de DS:

1. **Toolbar de búsqueda + filtro** — layout de grid 1/3 + 2/3 con Input(Search) + Select. Presente en UsersPage, VehiclesPage. Futuro componente: `SearchFilterBar`.

2. **Tabla con columnas condicionales** — `<table>` con columnas visibles según rol (Admin/Vigilante). Presente en VehiclesPage y (similar) en UsersPage. Futuro componente: `DataTable` (sin paginación ni ordenamiento).

3. **Role badge mapping** — `Badge` variant según `NombreRol`. Presente en UsersPage y VehiclesPage. Futuro helper: `getRoleBadgeVariant(rol)` en utils.

4. **Image fallback pattern** — `img` con `onError` que oculta la imagen y muestra placeholder. Presente solo en VehiclesPage (foto vehículo).

5. **Form with image upload** — File input + preview + remove. Presente solo en VehiclesPage. Si ReportesPage o PerfilUsuario necesitan upload, considerar `FileUploader` componente.
