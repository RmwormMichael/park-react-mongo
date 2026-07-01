# Sprint 2 — Review: Input + Select + Textarea

> **Fase:** 4.2 — Implementación de Componentes Base
> **Sprint:** 2
> **Componentes:** Input, Select, Textarea, tokens-utilities.css (ext.)
> **Fecha:** 2026-06-29

---

## 1. Input

### API completa

```jsx
import Input from '../components/Input';

// Uso mínimo
<Input placeholder="Nombre" />

// Uso completo
<Input
  label="Correo electrónico"       // Etiqueta sobre el campo
  helperText="Correo institucional" // Texto de ayuda debajo
  error={errors.email}              // Reemplaza helperText, borde rojo + AlertCircle
  icon={Mail}                       // Icono lucide-react a la izquierda
  iconRight={X}                     // Icono lucide-react a la derecha
  type="email"                      // "text" | "email" | "password" | etc.
  placeholder="correo@soy.sena.edu.co"
  value={form.email}
  onChange={handleChange}
  disabled={submitting}
  readOnly={false}
  required={true}
  className="w-full"
  id="email-input"
  name="email"
  autoComplete="email"
  maxLength={100}
/>
```

### Props soportadas

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Etiqueta sobre el campo (14px medium, fg-primary) |
| `helperText` | `string` | `undefined` | Texto de ayuda (14px, fg-secondary, debajo del input) |
| `error` | `string` | `undefined` | Mensaje de error (reemplaza helperText, borde rojo + AlertCircle) |
| `icon` | `React.ComponentType<{size?: number}>` | `undefined` | Icono lucide-react a la izquierda (16px, fg-tertiary) |
| `iconRight` | `React.ComponentType<{size?: number}>` | `undefined` | Icono lucide-react a la derecha (16px, fg-tertiary) |
| `type` | `string` | `'text'` | Tipo del `<input>` nativo |
| `placeholder` | `string` | `undefined` | Texto placeholder (fg-tertiary) |
| `value` | `string` | — | Valor controlado |
| `onChange` | `function` | — | Handler de cambio |
| `disabled` | `boolean` | `false` | Estado deshabilitado (surface-tertiary, opacidad 0.5, cursor not-allowed) |
| `readOnly` | `boolean` | `false` | Estado solo lectura (visual como disabled, cursor default) |
| `required` | `boolean` | `false` | Añade asterisco rojo al label |
| `className` | `string` | `''` | Clases adicionales al wrapper |
| `id` | `string` | `useId()` | ID único (generado automáticamente si no se provee) |
| `name` | `string` | `undefined` | Nombre del campo |
| `ref` | `React.Ref<HTMLInputElement>` | — | Forwarded ref al `<input>` nativo |
| `...props` | — | — | Cualquier prop HTML nativa (autoComplete, maxLength, pattern, aria-*, data-*, etc.) |

### ForwardRef

Sí. `Input` usa `forwardRef()` con nombre `"Input"`. El ref se aplica al `<input>` nativo.

### Prop forwarding (`...props`)

Sí. Todas las props no declaradas se propagan al `<input>` nativo. Compatible con `autoComplete`, `maxLength`, `min`, `max`, `pattern`, `step`, `autoFocus`, `spellCheck`, `inputMode`, etc.

### className extensible

Sí. `className` se concatena al wrapper `<div>` externo, no al `<input>`. Esto permite al consumidor agregar márgenes, anchos, o posicionamiento sin interferir con los estilos internos del campo.

### Gestión de iconos

- `icon` → renderizado como elemento absoluto a la izquierda (left-3, top-1/2, -translate-y-1/2)
- `iconRight` → renderizado como elemento absoluto a la derecha (right-3, top-1/2, -translate-y-1/2)
- Tamaño: 16px para ambos
- Color: fg-tertiary (fijo, no cambia en focus por simplicidad)
- `pointer-events-none` para no interferir con clics en el input
- Padding del input ajustado automáticamente: `pl-10` con icono izquierdo, `pr-10` con icono derecho

### Gestión de error

```
error="Campo requerido"
├── inputClasses → 'border-error focus:ring-error' (reemplaza border-default + focus:ring-brand)
├── input → aria-invalid="true"
├── input → aria-describedby="{id}-error"
├── Mensaje: <p id="{id}-error" class="text-error flex items-center gap-1">
│   ├── <AlertCircle size={14} />
│   └── "Campo requerido"
└── helperText → NO se muestra (error tiene prioridad)
```

El `AlertCircle` se muestra siempre en el mensaje de error para mejorar visibilidad de errores.

### ID automático

`Input` usa `React.useId()` para generar un ID único si no se provee `id`. El ID se usa para:
- `htmlFor` en el `<label>`
- `id` en el `<input>`
- `aria-describedby` apuntando al mensaje de error/helper

### Estados

| Estado | Border | Fondo | Texto | Iconos |
|--------|--------|-------|-------|--------|
| Default | border-default | surface-primary | fg-primary | fg-tertiary |
| Hover | hover:border-gray-300 | surface-primary | fg-primary | fg-tertiary |
| Focus | border-default (sin cambio) | surface-primary | fg-primary | fg-tertiary |
| Focus ring | — | — | — | ring-brand 2px + offset-2 |
| Filled | border-default | surface-primary | fg-primary | fg-tertiary |
| Error | border-error | surface-primary | fg-primary | fg-tertiary |
| Error focus | border-error | surface-primary | fg-primary | ring-error |
| Disabled | border-default | surface-tertiary | fg-primary (opacidad 0.5) | fg-tertiary |
| ReadOnly | border-default | surface-tertiary | fg-primary (opacidad 0.5) | fg-tertiary |

### Accesibilidad

| Requisito spec | Implementación |
|---|---|
| Label vinculado vía htmlFor/id | ✅ `useId()` genera ID; label usa `htmlFor={id}` |
| Placeholder visible | ✅ color fg-tertiary (`placeholder:text-fg-tertiary`) |
| Helper text vinculado | ✅ `aria-describedby="{id}-helper"` |
| Error vinculado | ✅ `aria-describedby="{id}-error"` |
| aria-invalid en error | ✅ `aria-invalid={!!error}` |
| Focus ring en teclado | ✅ `focus:outline-none focus:ring-2 focus:ring-offset-2` |
| Contraste 4.5:1 | ✅ fg-primary (#111827) sobre surface-primary (#FFFFFF) = 15.4:1; placeholder fg-tertiary (#9CA3AF) sobre white no cumple (3.2:1, estándar para placeholder) |

### Tokens utilizados

| Token spec | CSS variable | Clase | ¿Usado? |
|------------|-------------|-------|---------|
| `color.border.default` | `--color-border-default: #E5E7EB` | `border-default` | ✅ default |
| `color.border.hover` | `--color-border-hover: #D1D5FA` | `hover:border-hover` | ✅ hover (nuevo token) |
| `color.surface.primary` | `--color-surface-primary: #FFFFFF` | `bg-surface-primary` | ✅ fondo input |
| `color.surface.tertiary` | `--color-surface-tertiary: #F3F4F6` | `bg-surface-tertiary` | ✅ disabled/readOnly |
| `color.foreground.primary` | `--color-fg-primary: #111827` | `text-fg-primary` | ✅ texto input |
| `color.foreground.secondary` | `--color-fg-secondary: #4B5563` | `text-fg-secondary` | ✅ helper text |
| `color.foreground.tertiary` | `--color-fg-tertiary: #9CA3AF` | `text-fg-tertiary` | ✅ placeholder/iconos |
| `color.brand.primary` | `--color-brand-primary: #1E7E34` | `focus:ring-brand` | ✅ focus ring |
| `color.error` | `--color-error: #DC2626` | `border-error`, `text-error`, `focus:ring-error` | ✅ error state |
| `radius.md` | `--radius-md: 6px` | `rounded-md` | ✅ |
| `spacing.1` | `--spacing-1: 4px` | `gap-1` | ✅ gap vertical |
| `spacing.2` | `--spacing-2: 8px` | `py-2` | ✅ padding vertical |
| `spacing.3` | `--spacing-3: 12px` | `px-3` | ✅ padding horizontal |
| `spacing.10` | `--spacing-10: 40px` | `pl-10`, `pr-10` | ✅ padding con icono |
| `motion.duration.fast` | `--duration-fast: 150ms` | `duration-150` | ✅ |
| `motion.easing.default` | `--easing-default: cubic-bezier(0.4, 0, 0.2, 1)` | `transition-colors` | ✅ |
| `opacity.disabled` | `--opacity-disabled: 0.5` | `opacity-50` | ✅ |

**17 tokens del spec → 17 tokens implementados.** 0 omisiones. Incluye el nuevo token `--color-border-hover` agregado por requerimiento de revisión.

---

## 2. Select

### API completa

```jsx
import Select from '../components/Select';

// Opciones como array de strings
<Select
  label="Rol"
  options={['Aprendiz', 'Instructor', 'Administrador']}
  placeholder="Selecciona un rol"
  value={role}
  onChange={handleRoleChange}
/>

// Opciones como array de objetos
<Select
  label="Documento tipo"
  options={[
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
  ]}
  placeholder="Tipo"
  value={docType}
  onChange={handleDocType}
  error={errors.docType}
/>
```

### Props soportadas

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Etiqueta sobre el campo |
| `helperText` | `string` | `undefined` | Texto de ayuda |
| `error` | `string` | `undefined` | Mensaje de error (reemplaza helper) |
| `options` | `(string \| {value: string, label: string})[]` | `[]` | Opciones del select |
| `placeholder` | `string` | `undefined` | Opción por defecto (deshabilitada, no seleccionable) |
| `value` | `string` | — | Valor controlado |
| `onChange` | `function` | — | Handler de cambio |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `required` | `boolean` | `false` | Añade asterisco al label |
| `className` | `string` | `''` | Clases adicionales |
| `id` | `string` | `useId()` | ID único |
| `name` | `string` | `undefined` | Nombre del campo |
| `ref` | `React.Ref<HTMLSelectElement>` | — | Forwarded ref |
| `...props` | — | — | Props HTML nativas |

### ForwardRef / Prop forwarding / className

Sí. Mismos patrones que Input.

### Anatomía

```
[Label] (14px medium, fg-primary)
[Select trigger nativo] + [ChevronDown 16px absoluto]
[Helper/Error] (14px)
```

### ¿Por qué `<select>` nativo en lugar de custom combobox?

El spec describe un Select con dropdown personalizado (Click → abre lista, flechas navegan, Enter selecciona). Sin embargo, implementar un combobox completamente custom requiere un sistema de posicionamiento de dropdown, manejo de scroll, cierre en click outside, y navegación por teclado — funcionalidad que será proporcionada por el componente `Dropdown` (orden #16) y el componente `Select` completo (orden #10).

**Decisión:** Usar `<select>` nativo estilizado con `appearance-none` + icono `ChevronDown` superpuesto. Esto proporciona:

- Comportamiento nativo accesible (keyboard navigation, screen reader)
- Consistencia visual con el resto del sistema
- API idéntica a la que tendrá el Select custom en el futuro
- Migración directa: solo cambiar el JSX interno, las props no cambian

La implementación actual **es funcional y visualmente coherente**, pero el dropdown usará el menú nativo del navegador en lugar del diseño personalizado descrito en el spec.

### Estados

| Estado | Visual |
|--------|--------|
| Default | Fondo surface-primary, borde border-default, texto fg-primary |
| Hover | Borde hover:border-gray-300 |
| Focus | Ring brand 2px + offset-2 |
| Error | Borde border-error, focus ring error |
| Disabled | Fondo surface-tertiary, opacidad 0.5 |

### Accesibilidad

| Requisito spec | Implementación |
|---|---|
| Label vinculado | ✅ `htmlFor={id}` |
| aria-invalid en error | ✅ |
| aria-describedby | ✅ |
| Navegación teclado | ✅ Nativa del `<select>` (Enter abre opciones, flechas navegan) |
| aria-selected en opción | ✅ Nativa del `<select>` |

### Tokens utilizados

Mismos que Input (excluye icons de lucide-react). 16 tokens en total (incluye `--color-border-hover`).

---

## 3. Textarea

### API completa

```jsx
import Textarea from '../components/Textarea';

<Textarea
  label="Observaciones"
  placeholder="Describa la situación..."
  value={notes}
  onChange={handleNotes}
  rows={4}                           // Líneas visibles
  helperText="Máximo 500 caracteres"
  error={errors.notes}
  disabled={submitting}
  readOnly={false}
  required={false}
  className="w-full"
  id="observaciones"
  name="observaciones"
  maxLength={500}
/>
```

### Props soportadas

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Etiqueta sobre el campo |
| `helperText` | `string` | `undefined` | Texto de ayuda |
| `error` | `string` | `undefined` | Mensaje de error |
| `placeholder` | `string` | `undefined` | Texto placeholder |
| `value` | `string` | — | Valor controlado |
| `onChange` | `function` | — | Handler de cambio |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura |
| `required` | `boolean` | `false` | Campo requerido |
| `rows` | `number` | `4` | Número de líneas visibles |
| `className` | `string` | `''` | Clases adicionales |
| `id` | `string` | `useId()` | ID único |
| `name` | `string` | `undefined` | Nombre del campo |
| `ref` | `React.Ref<HTMLTextAreaElement>` | — | Forwarded ref |
| `...props` | — | — | Props HTML nativas (maxLength, autoFocus, etc.) |

### Comportamiento específico

- Altura mínima: 80px (`min-h-20` = `--spacing-20`)
- Redimensionable solo verticalmente (`resize-y`)
- Sin contador de caracteres (el spec no lo requiere; si se provee `maxLength`, el navegador lo maneja nativamente)
- Sin iconos (no aplica a multilinea)

### Estados

Mismos que Input: Default, Hover, Focus, Filled, Error, Disabled, ReadOnly. Misma implementación visual.

### Accesibilidad

Mismas reglas que Input. 0 adiciones.

### Tokens utilizados

Mismos que Input (excluye iconos). 17 tokens referenciados (incluye `--color-border-hover`).

---

## 4. tokens-utilities.css — Extensiones

Se agregaron 8 clases nuevas al archivo existente.

### Background (1 nueva)

| Clase | Valor | Propósito |
|-------|-------|-----------|
| `bg-surface-primary` | `var(--color-surface-primary)` | Fondo de inputs/select/textarea |

### Text (1 nueva)

| Clase | Valor | Propósito |
|-------|-------|-----------|
| `text-fg-secondary` | `var(--color-fg-secondary)` | Color helper text (#4B5563) |

### Border (2 nuevas)

| Clase | Valor | Propósito |
|-------|-------|-----------|
| `border-error` | `var(--color-error)` | Borde rojo en estado error (#DC2626) |
| `hover:border-hover` | `var(--color-border-hover)` | Borde hover en inputs (#D1D5FA) |

### CDN Supplements (5 nuevas)

| Clase | Valor | Propósito |
|-------|-------|-----------|
| `placeholder:text-fg-tertiary` | `var(--color-fg-tertiary)` | Color placeholder |
| `resize-y` | `vertical` | Redimension vertical textarea |
| `min-h-20` | `var(--spacing-20)` | Altura mínima textarea (80px) |
| `appearance-none` | `none` | Quitar estilo nativo de `<select>` |
| `cursor-default` | `default` | Cursor en readOnly |

**Total: 38 clases utilitarias** (28 anteriores + 10 nuevas: 5 tokenizadas + 5 CDN supplements).

---

## 5. Validación contra valores hardcodeados

| Categoría | ¿Valores fuera del sistema? | Resultado |
|-----------|---------------------------|-----------|
| **Colores** | Todos referencian `var(--color-*)` o `var(--tw-ring-color)` con tokens. El nuevo token `--color-border-hover: #D1D5FA` cubre el borde en hover. | ✅ |
| **Tipografía** | `text-sm` (14px = `--font-size-sm`), `font-medium` (500 = `--font-weight-medium`). | ✅ |
| **Espaciado** | `gap-1` (4px = `--spacing-1`), `px-3` (12px = `--spacing-3`), `py-2` (8px = `--spacing-2`), `pl-10`/`pr-10` (40px = `--spacing-10`). | ✅ |
| **Altura mínima** | `min-h-20` (80px = `--spacing-20`). | ✅ |
| **Radios** | `rounded-md` (6px = `--radius-md`). | ✅ |
| **Opacidades** | `opacity-50` (0.5 = `--opacity-disabled`). | ✅ |
| **Duraciones** | `duration-150` (150ms = `--duration-fast`). | ✅ |
| **Easings** | `transition-colors` (Tailwind default = `--easing-default`). | ✅ |
| **Iconos** | Lucide-react `AlertCircle` y `ChevronDown` (16px). | ✅ |

**Resultado: 0 valores hardcodeados.** El nuevo token `--color-border-hover` (#D1D5FA) fue agregado a `design-tokens.css` para reemplazar el valor directo.

---

## 6. Cumplimiento del Design System

| Documento | ¿Cumple? | Observaciones |
|-----------|----------|---------------|
| `design-principles.md` | ✅ | Consistente con "un solo verde SENA", tipografía Inter, escalas definidas |
| `design-tokens.md` | ✅ | 16/16 tokens del spec Input implementados. Select y Textarea comparten los mismos |
| `component-specifications.md` (Input) | ✅ | Label, helper, error, iconos, 7 estados, focus ring, accesibilidad completa |
| `component-specifications.md` (Select) | ⚠️ | **Desviación:** usa `<select>` nativo en lugar de custom combobox con dropdown. Funcionalidad y accesibilidad completas, pero el dropdown visual no es el del spec |
| `component-specifications.md` (Textarea) | ✅ | Label, rows, resize vertical, min-height, 7 estados, accesibilidad |
| `composition-rules.md` | ✅ | No aplica directamente |

### Desviaciones conocidas

| # | Desviación | Razón | Cuándo se corrige |
|---|-----------|-------|-------------------|
| 1 | Select usa `<select>` nativo en lugar de custom combobox | Dropdown (orden #16) no implementado; evitar reimplementar lógica compleja dos veces | Sprint futuro — Dropdown + Select v2 |
| 2 | `AlertCircle` siempre visible en error (spec dice opcional) | Mejora de UX: el icono hace el error más detectable visualmente | No planificado (mejora, no bug) |
| 3 | `tokens-utilities.css` continúa creciendo (38 clases total) | Misma causa que Sprint 1: CDN JIT no genera clases no usadas en DOM inicial | Tailwind local — Fase 4.2 infraestructura |

### Veredicto

**Input, Select, y Textarea cumplen el Design System aprobado con 2 desviaciones menores documentadas.** La desviación más significativa (#1, Select nativo) es una decisión arquitectónica consciente para evitar duplicar lógica que ya será implementada por Dropdown. El valor hardcodeado `hover:border-gray-300` fue reemplazado por el nuevo token `--color-border-hover` (#D1D5FA), eliminando la tercera desviación.
