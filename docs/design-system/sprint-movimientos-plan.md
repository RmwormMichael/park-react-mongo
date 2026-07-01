# Sprint: MovimientosPage — Migración al Design System

## Fase 1 — Auditoría

### Archivo objetivo
`src/pages/MovimientosPage.jsx` — 583 líneas

### Resumen ejecutivo
Página de control de entrada/salida de vehículos. Usa `useAuth` en lugar de prop `user` (diferencia con VehiclesPage). Ya tiene 3 componentes DS importados (Loading, EmptyState, Alert) con uso correcto de `Alert` (dismissible, variant dinámica). Sin modales ni confirm dialogs. Gradientes en 3 secciones (layout, panel de registro, mensaje rol básico).

### Desviaciones identificadas (~85)

| Categoría | Ocurrencias | Ejemplos |
|-----------|-------------|----------|
| Layout (bg, spacing) | 1 | `bg-gradient-to-b from-gray-50 to-white pt-20` |
| Headings | 4 | `text-gray-900` → `text-fg-primary` |
| Text body | 6 | `text-gray-600` → `text-fg-secondary` |
| Cards (raw divs) | 5 | Stats panel + registro + mensaje + tabla wrapper + footer |
| Stat cards (raw) | 3 | Total/Dentro/Salida sin `StatCard` |
| Buttons (raw `<button>`) | 5 | Refresh, Entrada, Salida, filter pills (×3 agrupados pero 2 estados) |
| Inputs (raw) | 1 | Placa input |
| Badges (estado) | ~10 | Estado badge (dentro/fuera) + role badge en header |
| Color tokens (grises) | ~20 | `text-gray-500`, `border-gray-100`, `bg-gray-50` |
| Gradient backgrounds | 3 | Layout, formulario registro, mensaje rol básico |
| Gradient buttons | 2 | Entrada (emerald→teal) + Salida (amber→orange) |
| Shadows | ~5 | `shadow-sm` |
| Borders | ~8 | `border-gray-100`, `border-gray-300`, `border-emerald-100`, `border-blue-100` |
| Border radius | ~5 | `rounded-2xl` → `rounded-xl` |
| Spacing | ~4 | `pt-20` → `pt-16` |
| Motion timing | ~5 | Consistentes con DS (0.1, 0.2, 0.3 delays) |

### Componentes DS ya importados (3)
- `Loading` (línea 20, 430) — correcto
- `EmptyState` (línea 21, 437) — correcto
- `Alert` (línea 22, 192) — correcto (ya usa variant dinámica + dismissible)

### Componentes DS disponibles para migrar (8)
| Componente | Props clave | Uso esperado |
|-----------|-------------|--------------|
| `Card` | variant, className | Tabla wrapper, formulario registro, mensaje básico |
| `StatCard` | variant, icon, label, value, description | 3 stats: Total, Dentro, Salidas |
| `Button` | variant, size, loading, icon | Refresh, Entrada, Salida, filter pills |
| `Input` | label, icon, required, placeholder | Placa del vehículo |
| `Badge` | variant, size, icon, children | Estado badge (dentro/fuera), role badge header |
| `Loading` | text | Ya usado |
| `EmptyState` | title, description | Ya usado |
| `Alert` | variant, dismissible, title | Ya usado |

### Mapa de variantes: estado → Badge variant
| Estado | Variante Badge | Ícono |
|--------|---------------|-------|
| `dentro` | `success` | `CheckCircle` |
| `fuera` | `neutral` | `XCircle` |

### Mapa de variantes: stat cards
| Card | Variante StatCard | Ícono |
|------|------------------|-------|
| Total hoy | `info` | `Car` |
| Dentro | `success` | `LogIn` |
| Salidas | `warning` | `LogOut` |

### Mapa de variantes: filter pills
| Estado | Clase activa | Clase inactiva |
|--------|-------------|----------------|
| `todos` | `bg-brand-primary text-fg-inverse` | `bg-surface-tertiary text-fg-secondary hover:bg-surface-tertiary` |
| `dentro` | `bg-brand-primary text-fg-inverse` | `bg-surface-tertiary text-fg-secondary hover:bg-surface-tertiary` |
| `fuera` | `bg-brand-primary text-fg-inverse` | `bg-surface-tertiary text-fg-secondary hover:bg-surface-tertiary` |

### Patrones compartidos con VehiclesPage (documentar, NO implementar)

| Patrón | VehiclesPage | MovimientosPage | Candidato DS |
|--------|-------------|-----------------|-------------|
| Toolbar con acciones | Search + Filter Select + Refresh button | Filter pills + estado + subtítulo | `SearchFilterBar` |
| Tabla raw | 5+ columnas condicionales, imagen, badge, delete | 5 columnas fijas, badge estado | `DataTable` |
| Estado badge | Role badge con variante por rol | Estado badge con variante por estado (+/- icon) | `Badge` expandido |
| EmptyState + Loading | Mismo patrón | Mismo patrón (dentro de tabla) | — (ya estandarizado) |
| Table footer con leyenda | typeCount dots + contador | estado dots + contador | `DataTable` footer |
| Gradient sections | Header icon + Info section | Layout + Registro panel + Basic user msg | — (eliminado en migración) |

### Riesgos
1. **Filter pills sin componente DS**: No hay `ToggleGroup` o `SegmentedControl` en DS. Se mantendrán raw `<button>` con tokens DS.
2. **Gradient buttons (Entrada/Salida)**: DS no tiene gradientes. Entrada → `Button variant="primary"` (verde sólido). Salida → `Button variant="secondary"` con icono `LogOut`. Pérdida del color ámbar.
3. **Mensaje "solo visualización"**: Gradiente azul → sólido `bg-info-light`. Consistente con DS.
4. **useAuth vs prop user**: MovimientosPage usa `useAuth()` para obtener `user`, VehiclesPage recibe `user` como prop. **No cambiar** — comportamiento existente.
5. **Feedback state usa objeto `{type, message}`**: Ya compatible con `Alert variant={feedback.type}`. `feedback.type` usa 'error'/'warning'/'info' que coinciden con DS. Sin cambios.

---

## Fase 2 — Plan de implementación

### Orden de migración (estricto)

#### 1. Layout (`141`)
```diff
- min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12
+ min-h-screen bg-bg-primary pt-16 pb-12
```

#### 2. Header (`144-183`)
```diff
- text-3xl md:text-4xl font-bold text-gray-900
+ text-2xl md:text-3xl font-bold text-fg-primary

- text-lg text-gray-600 mt-2
+ text-sm text-fg-secondary mt-1

- bg-emerald-100 text-emerald-700 (role badge)
+ <Badge variant={roleBadgeVariant} icon={Shield}>{user.idRolName}</Badge>

- text-gray-500 (date)
+ text-fg-tertiary

- Raw refresh button
+ <Button variant="secondary" icon={RefreshCw} onClick={loadRange} disabled={loading}>
```

**Role badge helper:**
```js
const roleBadgeVariant = {
  'Administrador': 'error',
  'Vigilante': 'warning',
  'Instructor': 'info',
  'Aprendiz': 'success',
}
```

Note: `RefreshCw` icon needs to be imported from `lucide-react`.

#### 3. Stat Cards (`202-253`)
Reemplazar 3 raw divs por `StatCard`:

| Card | Variant | Icon | Label | Value | Description |
|------|---------|------|-------|-------|-------------|
| Total | `info` | `Car` | "Total hoy" | `movimientos.length` | "Movimientos registrados" |
| Dentro | `success` | `LogIn` | "Dentro" | `dentroCount` | "Vehículos en el parqueadero" |
| Salidas | `warning` | `LogOut` | "Salidas" | `fueraCount` | "Vehículos que han salido" |

Cada `StatCard` envuelto en `motion.div` para animación de entrada.

#### 4. Registration Panel (`255-327`)
```diff
- bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6 mb-8 shadow-sm
+ <Card className="mb-8">
+   <Card.Header>...</Card.Header>
+   <Card.Content>...</Card.Content>
+ </Card>
```

**Card.Header:**
```diff
- text-gray-900
+ text-fg-primary
- text-gray-600
+ text-fg-secondary
- bg-emerald-100 text-emerald-600
+ bg-brand-light text-brand-primary
```

**Form grid:**
```diff
- Raw input placa
+ <Input icon={Car} label="Placa del vehículo *" value={placa} onChange={...} placeholder="Ej: ABC123" required />

- Raw gradient Entrada button
+ <Button variant="primary" size="lg" loading={registering} icon={LogIn} onClick={entrada} disabled={registering} className="flex-1">
    Registrar Entrada
  </Button>

- Raw gradient Salida button
+ <Button variant="secondary" size="lg" loading={registering} icon={LogOut} onClick={salida} disabled={registering} className="flex-1">
    Registrar Salida
  </Button>
```

**Warning:** The original buttons had `flex-1` and equal sizing. I'll add `className="flex-1"` to both buttons. The gradient buttons used `py-3.5` while DS Button `size="lg"` uses `h-12`. Consistent enough.

**Helper text below buttons:**
```diff
- text-sm text-gray-600
+ text-sm text-fg-secondary
```

#### 5. Basic User Message (`329-354`)
```diff
- bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6
+ <Card variant="bordered" className="border-info">
+   <Card.Content>...</Card.Content>
+ </Card>
```

Wait, `border-info` is a class, but Card has `border border-default` for bordered variant. I can't easily override just the border color of Card's inline style. Let me use a raw div with tokens instead, similar to VehiclesPage's info section:

```diff
+ <div className="bg-info-light rounded-xl border border-info p-6">
```

Actually, looking at the Alert component, it has `borderStyles[variant]` which maps to `border-info`, `border-success`, etc. These classes exist in tokens-utilities.css.

For the basic user message, I can use a Card-like structure but with info colors:

```jsx
<div className="bg-info-light rounded-xl border border-info p-6">
  <div className="flex items-start space-x-4">
    <div className="p-3 rounded-xl bg-surface-primary text-info">
      <Eye className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-fg-primary mb-2">...</h3>
      <p className="text-fg-secondary">...</p>
    </div>
  </div>
</div>
```

#### 6. Filter pills (`380-398`)
Mantener raw buttons con tokens DS:
```diff
- Active: bg-emerald-500 text-white
+ Active: bg-brand-primary text-fg-inverse

- Inactive: bg-gray-100 text-gray-600 hover:bg-gray-200
+ Inactive: bg-surface-tertiary text-fg-secondary hover:bg-surface-tertiary
```
Note: the `hover:bg-surface-tertiary` on inactive won't change since it's already the same color. To provide visual feedback, we could add a ring or slight darkening. But since DS doesn't have `hover:bg-surface-secondary`, we keep it simple.

Actually, let me use `hover:opacity-80` for the inactive state to provide feedback, or just leave as-is (same approach as UsersPage filter pills).

#### 7. Table header (`364-400`)
```diff
- border-b border-gray-100
+ border-b border-default
- text-gray-900
+ text-fg-primary
- text-gray-600
+ text-fg-secondary
- text-gray-400 (Filter icon)
+ text-fg-tertiary
```

#### 8. Table wrapper (`361`)
```diff
- bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
+ <Card className="overflow-hidden">
```

Content inside: remove the raw div wrapper and let Card handle it. The header of the table section uses `px-6 py-4 border-b border-gray-100` which can just stay as `px-6 py-4 border-b border-default`.

#### 9. Table structure (`403-553`)
```diff
- bg-gray-50 (thead)
+ bg-surface-tertiary
- text-gray-500 uppercase tracking-wider text-xs font-medium
+ text-fg-tertiary uppercase tracking-wider text-xs font-medium
- divide-gray-100
+ divide-default
- hover:bg-gray-50/50
+ hover:bg-surface-tertiary

- bg-gray-100 (icon bg) + text-gray-600
+ bg-surface-tertiary + text-fg-secondary

- text-gray-900 font-bold
+ text-fg-primary font-bold

- text-gray-500 text-xs
+ text-fg-tertiary text-xs

- text-gray-700
+ text-fg-secondary

- text-gray-400 (Clock icon)
+ text-fg-tertiary

- Estado badge (raw)
+ <Badge variant={m.Estado === 'dentro' ? 'success' : 'neutral'} icon={m.Estado === 'dentro' ? CheckCircle : XCircle}>
    {m.Estado === 'dentro' ? 'Dentro' : 'Fuera'}
  </Badge>
```

#### 10. Table footer (`556-578`)
```diff
- border-t border-gray-100 bg-gray-50
+ border-t border-default bg-surface-tertiary
- text-gray-600
+ text-fg-secondary
- bg-emerald-500 (legend dot)
+ bg-success
- bg-gray-400 (legend dot)
+ bg-fg-tertiary (or bg-surface-tertiary for a lighter dot)
```

Wait, for the "Fuera" legend dot: `bg-gray-400` → needs DS equivalent. The closest is `bg-fg-tertiary` or I could use `bg-warning`. Since the original is gray, I'll make it neutral: maybe keep a neutral color. There's no explicit `bg-neutral` in the DS. Options:
- `bg-fg-tertiary` (gray-400 equivalent)
- Or I can use a class like `bg-surface-tertiary`

Actually, let me use `bg-fg-tertiary` for the "Fuera" dot since it's a neutral gray, matching the original `bg-gray-400`.

#### 11. Table wrapper close
The original closes `</motion.div>` at line 579. With Card, I need to add `</Card>` before closing the motion div.

#### 12. Imports update
```diff
- import { motion, AnimatePresence } from "framer-motion";
+ import { motion } from "framer-motion";

- Remove unused: Loader2, Filter (if not used directly)
+ Add: RefreshCw, CheckCircle, XCircle (already present), LogIn, LogOut, Eye, Shield (already present)
+ Add: Card, StatCard, Button, Input, Badge
```

Wait, let me check which icons are used after migration:
- `Car` — StatCard and Input icon
- `Clock` — table cells (keep)
- `LogIn` — Entrada button (already imported) and StatCard
- `LogOut` — Salida button (already imported) and StatCard
- `Eye` — basic user message icon (keep)
- `Shield` — registration panel header (keep)
- `Loader2` — removed (Button loading prop handles this)
- `Calendar` — date display (keep)
- `CheckCircle` — estado badge (already imported)
- `XCircle` — estado badge (already imported)
- `Filter` — header filter icon (keep for the label? actually it's in a span+Filter combo that becomes text-only)

Let me check the Filter icon usage. Line 377: `<Filter className="w-4 h-4 text-gray-400" />`
This icon is next to "Filtrar:" text. Since we're not changing the layout, I'll keep Filter imported.

Wait, actually since the filter pills section is staying raw, I should keep Filter icon too.

Let me revise:
- Remove: `Loader2` (replaced by Button loading={registering}, and Loading component)
- Remove: `AnimatePresence` (never used)
- Keep: All other icons
- Add: `RefreshCw` (refresh button)
- Add: `Card`, `StatCard`, `Button`, `Input`, `Badge`

Actually, `Loader2` is used in the original buttons' loading state. With Button's `loading` prop, the spinner is built-in. So yes, remove.

### Resumen de carga de trabajo

| Sección | Líneas | Tipo | DS Componente | Esfuerzo |
|---------|--------|------|---------------|----------|
| Imports | ~22 | Estructural | +5 DS, -1 lucide | 2 min |
| Layout | 1 | Token | — | 1 min |
| Header | ~40 | Estructural + token | Badge + Button | 5 min |
| StatCards | ~50 | Estructural | StatCard (3) | 8 min |
| Registration panel | ~72 | Estructural | Card + Input + Button (2) | 10 min |
| Basic user msg | ~25 | Token | — | 3 min |
| Filter pills | ~18 | Token | — | 3 min |
| Table header | ~38 | Token | — | 3 min |
| Table rows | ~108 | Token + estructural | Badge (~5) | 8 min |
| Table footer | ~23 | Token | — | 3 min |
| Card wrapper | ~2 | Estructural | Card | 1 min |

**Total:** ~47 min edición + 10 min build/validación

### Impacto en tamaño
- Original: 583 líneas
- Estimado post-migración: ~510–540 líneas (−7% a −12%)
- Desviaciones eliminadas: ~80 de ~85

---

## Checklist de verificación post-migración

- [ ] Build sin errores (`npm run build`)
- [ ] StatCards renderizan 3 columnas
- [ ] Formulario registro con placa Input + Entrada/Salida Button
- [ ] Botones Entrada/Salida muestran loading mientras `registering=true`
- [ ] Filter pills filtran correctamente (todos/dentro/fuera)
- [ ] Estado badge con icono + color correcto (success=check, neutral=x)
- [ ] Tabla muestra Loading/EmptyState/datos correctamente
- [ ] Feedback Alert se muestra y se descarta
- [ ] Panel registro solo visible para Admin/Vigilante
- [ ] Mensaje "solo visualización" solo para roles básicos
- [ ] Sin regresiones de layout responsivo
- [ ] Sin imports sin uso
- [ ] Tipografía: `text-fg-*` donde corresponde
- [ ] Sombras: `shadow-token-*`
- [ ] Bordes: `border-default`, `border-info`, `border-error` etc.
- [ ] Gradientes eliminados (3 secciones)
- [ ] Sin lógica de negocio modificada
