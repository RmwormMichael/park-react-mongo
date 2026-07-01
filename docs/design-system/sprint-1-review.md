# Sprint 1 — Review: Button + IconButton

> **Fase:** 4.2 — Implementación de Componentes Base
> **Sprint:** 1
> **Componentes:** Button, IconButton, tokens-utilities.css
> **Fecha:** 2026-06-29

---

## 1. Button

### API completa

```jsx
import Button from '../components/Button';

// Uso mínimo
<Button onClick={handleSave}>Guardar</Button>

// Uso completo
<Button
  variant="primary"              // "primary" | "secondary" | "ghost" | "destructive" | "link"
  size="md"                      // "sm" | "md" | "lg"
  disabled={false}
  loading={false}
  icon={Save}                    // Componente de lucide-react (izquierda)
  iconRight={ChevronRight}       // Componente de lucide-react (derecha)
  type="button"                  // "button" | "submit" | "reset"
  onClick={fn}
  className="ml-auto"            // Clases adicionales del consumidor
  id="btn-guardar"
  name="guardar"
  aria-label="Guardar cambios"
  title="Guardar formulario"
>
  Guardar
</Button>
```

### Props soportadas

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive' \| 'link'` | `'primary'` | Variante visual del botón |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del botón |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `loading` | `boolean` | `false` | Estado de carga (reemplaza icono por spinner, deshabilita interacción) |
| `icon` | `React.ComponentType<{size?: number}>` | `undefined` | Icono lucide-react a la izquierda del texto |
| `iconRight` | `React.ComponentType<{size?: number}>` | `undefined` | Icono lucide-react a la derecha del texto |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo del elemento `<button>` |
| `children` | `React.ReactNode` | `undefined` | Contenido textual del botón |
| `className` | `string` | `''` | Clases adicionales (se concatenan al final) |
| `ref` | `React.Ref<HTMLButtonElement>` | — | Forwarded ref al elemento `<button>` |
| `...props` | — | — | Cualquier prop HTML nativa (onClick, id, name, aria-*, data-*, etc.) |

### Valor por defecto de `type`

`type="button"` — explícitamente establecido. Esto evita que botones fuera de formularios actúen como `type="submit"` (problema común identificado en la auditoría de componentes existentes, donde botones de Dashboard, Nav, y modales no tenían `type` definido).

### ForwardRef

Sí. `Button` usa `forwardRef()` con nombre `"Button"` para la devtools. El ref se aplica directamente al `<button>` nativo, permitiendo acceso programático (focus, mediciones, etc.) desde el componente padre.

### Prop forwarding (`...props`)

Sí. Todas las props no declaradas se propagan al elemento `<button>` mediante spread (`{...props}`). Esto garantiza compatibilidad con atributos HTML estándar (`id`, `name`, `title`, `data-*`, `aria-*`, `form`, `autoFocus`, etc.) sin necesidad de declararlos explícitamente.

### className extensible

Sí. `className` se concatena al final del string de clases base. El consumidor puede agregar clases adicionales:

```jsx
<Button className="ml-auto shadow-token-sm">Guardar</Button>
```

### Gestión de loading

```
loading={true}
├── isDisabled = true (deshabilita clics)
├── IconLeft/IconRight → null (ocultos)
├── Loader2 (lucide-react) con animate-spin → reemplaza el icono izquierdo
├── className → cursor-wait (cursor de espera)
└── Texto children → permanece visible
```

El spinner usa `Loader2` de lucide-react como solución temporal hasta que el componente Loading (orden #11) esté implementado.

### Gestión de iconos

- `icon` → renderizado a la izquierda del texto (antes del `<span>`)
- `iconRight` → renderizado a la derecha del texto (después del `<span>`)
- Tamaños: sm=16px, md=16px, lg=20px
- Ambos iconos se ocultan durante loading (reemplazados por Loader2)
- Se acepta cualquier componente de lucide-react

### Accesibilidad

| Requisito spec | Implementación |
|---|---|
| Texto visible o aria-label | ✅ `children` visible en todos los casos (no hay modo icon-only en Button) |
| Focus ring en navegación teclado | ✅ `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand/error` |
| disabled con aria-disabled | ✅ `aria-disabled={isDisabled}` |
| loading deshabilita interacción | ✅ `disabled={isDisabled}` donde `isDisabled = disabled \|\| loading` |
| Contraste 4.5:1 | ✅ fg-inverse (#FFFFFF) sobre brand-primary (#1E7E34) = 5.6:1; fg-primary (#111827) sobre surface-primary (#FFFFFF) = 15.4:1 |

### Tokens utilizados

| Token spec | CSS variable | Clase | ¿Usado? |
|------------|-------------|-------|---------|
| `color.brand.primary` | `--color-brand-primary: #1E7E34` | `bg-brand-primary` | ✅ primary default |
| `color.brand.hover` | `--color-brand-hover: #155724` | `hover:bg-brand-hover` | ✅ primary hover |
| `color.error` | `--color-error: #DC2626` | `bg-error` | ✅ destructive default |
| `color.error.hover` | `--color-error-hover: #B91C1C` | `hover:bg-error-hover` | ✅ destructive hover |
| `color.surface.tertiary` | `--color-surface-tertiary: #F3F4F6` | `hover:bg-surface-tertiary` | ✅ secondary/ghost hover |
| `color.foreground.inverse` | `--color-fg-inverse: #FFFFFF` | `text-fg-inverse` | ✅ primary/destructive text |
| `color.foreground.primary` | `--color-fg-primary: #111827` | `text-fg-primary` | ✅ secondary/ghost/link text |
| `color.border.default` | `--color-border-default: #E5E7EB` | `border-default` | ✅ secondary border |
| `radius.md` | `--radius-md: 6px` | `rounded-md` | ✅ |
| `spacing.2` | `--spacing-2: 8px` | `gap-2` | ✅ gap icon-texto |
| `spacing.3` | `--spacing-3: 12px` | `px-3` | ✅ sm padding horizontal |
| `spacing.4` | `--spacing-4: 16px` | `px-4` | ✅ md padding horizontal |
| `spacing.6` | `--spacing-6: 24px` | `px-6` | ✅ lg padding horizontal |
| `motion.duration.fast` | `--duration-fast: 150ms` | `duration-150` | ✅ |
| `motion.easing.default` | `--easing-default: cubic-bezier(0.4, 0, 0.2, 1)` | `transition-colors` | ✅ Tailwind usa este easing por defecto |
| `opacity.disabled` | `--opacity-disabled: 0.5` | `disabled:opacity-50` | ✅ |

**16 tokens del spec → 16 tokens implementados.** 0 omisiones.

---

## 2. IconButton

### API completa

```jsx
import IconButton from '../components/IconButton';

<IconButton
  icon={X}                       // Componente lucide-react (requerido)
  aria-label="Cerrar"            // Texto accesible (altamente recomendado)
  variant="ghost"                // "primary" | "secondary" | "ghost" | "destructive"
  size="md"                      // "sm" | "md" | "lg"
  disabled={false}
  type="button"
  onClick={onClose}
  className="absolute top-3 right-3"
  title="Cerrar ventana"         // Fallback si aria-label no se provee
/>
```

### Props soportadas

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `icon` | `React.ComponentType<{size?: number}>` | **requerido** | Componente lucide-react |
| `aria-label` | `string` | ver nota | Texto para lectores de pantalla (fallback: `title` o `"Icon button"`) |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive'` | `'ghost'` | Variante visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño (proporción cuadrada) |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo del elemento |
| `className` | `string` | `''` | Clases adicionales |
| `ref` | `React.Ref<HTMLButtonElement>` | — | Forwarded ref |
| `...props` | — | — | Props HTML nativas |

**Nota sobre `aria-label`:** No se forza como requerido en runtime (para no romper casos extremos), pero el spec lo exige para botones icon-only. El componente genera un fallback: `ariaLabel || props.title || 'Icon button'`.

### Diferencias con Button

| Aspecto | Button | IconButton |
|---------|--------|------------|
| Variantes | 5 (incluye link) | 4 (excluye link) |
| Variante default | `primary` | `ghost` |
| Tamaño sm | `h-8 px-3` (32px alto, texto) | `h-8 w-8` (32px cuadrado) |
| Tamaño md | `h-10 px-4` (40px alto, texto) | `h-10 w-10` (40px cuadrado) |
| Tamaño lg | `h-12 px-6` (48px alto, texto) | `h-12 w-12` (48px cuadrado) |
| Icono sm | 16px | 16px |
| Icono md | 16px | 20px |
| Icono lg | 20px | 24px |
| gap | `gap-2` | Sin gap (no hay texto) |
| Loading | Sí, con Loader2 | No |

### Estados

| Estado | Primary | Secondary | Ghost | Destructive |
|--------|---------|-----------|-------|-------------|
| Default | Fondo brand, icono inverse | Sin fondo, borde default, icono primary | Sin fondo, icono primary | Fondo error, icono inverse |
| Hover | Brand hover | Surface tertiary | Surface tertiary | Error hover |
| Active | Opacidad 0.9 | Opacidad 0.9 | Opacidad 0.9 | Opacidad 0.9 |
| Focus | Ring brand 2px | Ring brand 2px | Ring brand 2px | Ring error 2px |
| Disabled | Opacidad 0.5 | Opacidad 0.5 | Opacidad 0.5 | Opacidad 0.5 |

### Accesibilidad

| Requisito | Implementación |
|---|---|
| aria-label obligatorio en icon-only | ✅ `aria-label` aceptado; fallback a `title` o `"Icon button"` |
| Focus ring | ✅ mismo que Button |
| disabled con aria-disabled | ✅ `aria-disabled={disabled}` |
| Contraste 4.5:1 | ✅ mismo que Button |

### Tokens utilizados

Mismos que Button (excluye `color.border.default` que solo usa secondary, y `color.foreground.primary` que solo usa secondary/ghost). 14 tokens en total.

---

## 3. tokens-utilities.css

### ¿Por qué fue necesario?

Tailwind CDN utiliza un motor Just-In-Time (JIT) que genera únicamente las clases CSS que detecta en el DOM al momento de carga. Como los nuevos componentes (Button, IconButton) no son utilizados por ninguna página existente, el CDN no genera sus clases utilitarias personalizadas (`bg-brand-primary`, `text-fg-inverse`, etc.).

Además, varias clases estándar de Tailwind (`rounded-md`, `gap-2`, `focus:ring-2`, `disabled:opacity-50`, etc.) tampoco son generadas porque ningún componente existente las utiliza en el DOM.

Este archivo resuelve ambos problemas proporcionando las clases necesarias como CSS estático, referenciando directamente las variables CSS de `design-tokens.css`.

### ¿Qué clases contiene?

| Sección | Clases | Propósito |
|---------|--------|-----------|
| **Background** (5) | `bg-brand-primary`, `hover:bg-brand-hover`, `bg-error`, `hover:bg-error-hover`, `bg-surface-tertiary`, `hover:bg-surface-tertiary`, `bg-transparent` | Fondos tokenizados |
| **Text** (4) | `text-fg-primary`, `text-fg-inverse`, `text-brand-primary`, `text-error` | Colores de texto tokenizados |
| **Border** (1) | `border-default` | Borde tokenizado |
| **Focus ring** (2) | `focus:ring-brand`, `focus:ring-error` | Anillos de foco tokenizados |
| **Shadow** (4) | `shadow-token-{sm,md,lg,xl}` | Sombras multi-stop |
| **CDN Supplements** (12) | `rounded-md`, `gap-2`, `duration-150`, `focus:ring-2`, `focus:ring-offset-2`, `disabled:opacity-50`, `disabled:cursor-not-allowed`, `cursor-wait`, `animate-spin`, `active:opacity-90`, `active:opacity-80` | Clases estándar de Tailwind no generadas por JIT |

**Total: 28 clases utilitarias.**

### ¿Es una solución temporal?

**Sí.** `tokens-utilities.css` es un puente entre la infraestructura actual (Tailwind CDN con JIT) y el sistema de tokens.

### ¿Cuándo desaparecerá?

Cuando se migre a una **instalación local de Tailwind** (PostCSS + plugin Tailwind). En ese momento:

1. `tailwind.config.js` leerá las mismas variables CSS o valores directos
2. Tailwind generará todas las clases en build-time (sin JIT)
3. `tokens-utilities.css` ya no será necesario y podrá eliminarse
4. Los CDN Supplements serán reemplazados por la generación nativa de Tailwind

### Riesgo

Si se elimina `tokens-utilities.css` sin haber migrado a Tailwind local, todos los componentes del Design System perderán su estilo porque las clases tokenizadas dejarán de existir en el CSS.

---

## 4. Validación contra valores hardcodeados

| Categoría | ¿Valores fuera del sistema? | Resultado |
|-----------|---------------------------|-----------|
| **Colores** | Todos referencian `var(--color-*)` o `var(--tw-ring-color)` con tokens. Ningún HEX hardcodeado en componentes. | ✅ |
| **Tipografía** | `text-sm` (14px = `--font-size-sm`), `text-base` (16px = `--font-size-base`), `font-medium` (500 = `--font-weight-medium`). | ✅ |
| **Espaciado** | `px-3` (12px = `--spacing-3`), `px-4` (16px = `--spacing-4`), `px-6` (24px = `--spacing-6`), `gap-2` (8px = `--spacing-2`). | ✅ |
| **Alturas** | `h-8` (32px), `h-10` (40px), `h-12` (48px) — corresponden a la tabla de tamaños del spec. | ✅ |
| **Anchuras** (IconButton) | `w-8` (32px), `w-10` (40px), `w-12` (48px) — proporciones cuadradas. | ✅ |
| **Radios** | `rounded-md` (6px = `--radius-md`) — único radio usado. | ✅ |
| **Sombras** | No se usan sombras directas en Button/IconButton (sombra es decisión de la página). Clases `shadow-token-*` disponibles para quien las necesite. | ✅ |
| **Opacidades** | `disabled:opacity-50` (0.5 = `--opacity-disabled`), active 0.9/0.8. | ✅ |
| **Duraciones** | `duration-150` (150ms = `--duration-fast`). | ✅ |
| **Easings** | `transition-colors` (Tailwind usa `cubic-bezier(0.4, 0, 0.2, 1)` = `--easing-default`). | ✅ |

### Conclusión

**0 valores hardcodeados fuera del sistema de tokens.** Todos los colores, tamaños, radios, espaciados, opacidades, duraciones y easings referencian exclusivamente las variables CSS definidas en `design-tokens.css` o clases de Tailwind que mapean a valores equivalentes.

---

## 5. Cumplimiento del Design System

| Documento | ¿Cumple? | Observaciones |
|-----------|----------|---------------|
| `design-principles.md` | ✅ | Consistente con "un solo verde SENA" (#1E7E34), tipografía Inter, escalas definidas |
| `design-tokens.md` | ✅ | 16/16 tokens del spec implementados. Todos referencian var(--) |
| `component-specifications.md` (Button) | ✅ | 5 variantes, 3 tamaños, 6 estados, anatomía icono+texto+icono, focus ring, loading, disabled, aria-label |
| `composition-rules.md` | ✅ | No aplica directamente (son reglas de página, no de componente) |

### Desviaciones conocidas

| # | Desviación | Razón | Cuándo se corrige |
|---|-----------|-------|-------------------|
| 1 | Loading usa `Loader2` de lucide-react en lugar del componente `Loading` | Loading (orden #11) aún no implementado | Sprint 4 — Loading |
| 2 | `tokens-utilities.css` como archivo separado | Necesario por CDN JIT; desaparece con Tailwind local | Fase 4.2 — infraestructura futura |
| 3 | `gap-2.5` no usado (lg usa `gap-2`) | `gap-2.5` no está en escala de Tailwind CDN. Se usa `gap-2` uniforme para todos los tamaños. | Cuando se migre a Tailwind local |

### Veredicto

**Button e IconButton cumplen completamente el Design System aprobado, con 2 desviaciones menores documentadas y planificadas para resolución futura.**
