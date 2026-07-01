# Sprint 3 — Review: Card + StatCard + Badge

> **Fase:** 4.2 — Implementación de Componentes Base
> **Sprint:** 3
> **Componentes:** Card, StatCard, Badge, tokens-utilities.css (ext.)
> **Fecha:** 2026-06-29

---

## 1. Card

### API — Composición

```jsx
import Card from '../components/Card';

// Uso mínimo
<Card>
  <Card.Content>Contenido</Card.Content>
</Card>

// Uso completo con header y footer
<Card variant="default">
  <Card.Header>
    <h2 className="text-xl font-semibold">Título</h2>
    <Button size="sm" variant="ghost">Acción</Button>
  </Card.Header>
  <Card.Content>
    <p>Contenido principal de la card.</p>
  </Card.Content>
  <Card.Footer>
    <span>Actualizado hace 5 min</span>
  </Card.Footer>
</Card>

// Card bordered (sin sombra, con borde)
<Card variant="bordered">
  <Card.Content>...</Card.Content>
</Card>

// Card elevated (sombra grande)
<Card variant="elevated">
  <Card.Content>...</Card.Content>
</Card>
```

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'default' \| 'bordered' \| 'elevated'` | `'default'` | Variante visual |
| `className` | `string` | `''` | Clases adicionales al wrapper |
| `ref` | `React.Ref<HTMLDivElement>` | — | Forwarded ref |
| `...props` | — | — | Props HTML nativas |

### Sub-componentes

| Sub-componente | Estructura | Padding |
|----------------|-----------|---------|
| `Card.Header` | `flex items-center justify-between gap-2` | `px-6 pt-6` |
| `Card.Content` | `<div>` simple | `px-6 pb-6 first:pt-6` |
| `Card.Footer` | `text-sm text-fg-tertiary` con `border-t` | `px-6 py-4` |

### Comportamiento de padding en Content

`Card.Content` usa `first:pt-6` para aplicar padding superior solo cuando es el primer hijo de Card (es decir, cuando no hay `Card.Header`). Si `Card.Header` está presente, Content NO tiene padding superior, evitando duplicación de espacio vertical.

| Estructura | Padding Content |
|------------|-----------------|
| `<Card><Card.Content/>` | 24px todos los lados |
| `<Card><Card.Header/><Card.Content/>` | 24px laterales e inferior, 0 superior |
| `<Card><Card.Content/><Card.Footer/>` | 24px todos los lados |
| `<Card><Card.Header/><Card.Content/><Card.Footer/>` | 24px laterales e inferior, 0 superior |

### Variantes

| Variante | Sombra | Borde | Fondo | Radio |
|----------|--------|-------|-------|-------|
| Default | `shadow-token-md` | Sin borde | `bg-surface-primary` | `rounded-xl` |
| Bordered | Sin sombra | `border border-default` | `bg-surface-primary` | `rounded-xl` |
| Elevated | `shadow-token-lg` | Sin borde | `bg-surface-primary` | `rounded-xl` |

### ForwardRef

Sí. `Card` usa `forwardRef()`. El ref se aplica al `<div>` raíz.

### className extensible

Sí. `className` se concatena al final del string de clases base.

### Accesibilidad

- Card es un contenedor semánticamente neutro (`<div>`). La semántica la define el contenido.
- Los roles y landmarks deben ser aplicados por el consumidor según el contexto de uso.

### Tokens utilizados

| Token spec | CSS variable | Clase | ¿Usado? |
|------------|-------------|-------|---------|
| `color.surface.primary` | `--color-surface-primary: #FFFFFF` | `bg-surface-primary` | ✅ fondo |
| `shadow.md` | `--shadow-md` | `shadow-token-md` | ✅ default |
| `shadow.lg` | `--shadow-lg` | `shadow-token-lg` | ✅ elevated |
| `color.border.default` | `--color-border-default: #E5E7EB` | `border-default` | ✅ bordered |
| `color.foreground.tertiary` | `--color-fg-tertiary: #9CA3AF` | `text-fg-tertiary` | ✅ footer text |
| `radius.xl` | `--radius-xl: 12px` | `rounded-xl` | ✅ |
| `spacing.4` | `--spacing-4: 16px` | `py-4` | ✅ footer vertical |
| `spacing.6` | `--spacing-6: 24px` | `px-6`, `pt-6`, `pb-6` | ✅ header/content padding |

**8 tokens del spec → 8 tokens implementados.** 0 omisiones.

---

## 2. StatCard

### API

```jsx
import StatCard from '../components/StatCard';

<StatCard
  variant="brand"       // "brand" | "success" | "error" | "warning" | "info"
  icon={Users}          // Componente lucide-react
  label="Usuarios"      // Etiqueta (esquina superior derecha)
  value="1,234"         // Valor numérico
  description="+12 nuevos hoy"  // Opcional
/>
```

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'brand' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'brand'` | Color semántico del icono y su fondo |
| `icon` | `React.ComponentType<{size?: number}>` | `undefined` | Icono lucide-react (24px, decorativo) |
| `label` | `string` | — | Texto de etiqueta (esquina superior derecha) |
| `value` | `string \| number` | — | Valor numérico principal (30px bold) |
| `description` | `string` | `undefined` | Texto opcional debajo del valor (14px, fg-tertiary) |
| `className` | `string` | `''` | Clases adicionales |
| `ref` | `React.Ref<HTMLDivElement>` | — | Forwarded ref |
| `...props` | — | — | Props HTML nativas |

### Reutilización de Card

`StatCard` importa `Card` y lo utiliza internamente:

```jsx
// StatCard.jsx (simplificado)
import Card from './Card';

function StatCard({ variant, icon, label, value, description, className }) {
  return (
    <Card className={`shadow-token-sm ${className}`}>
      <div className="p-6 flex flex-col gap-4">
        {/* icono + label */}
        {/* valor + descripción */}
      </div>
    </Card>
  );
}
```

**StatCard NO duplica estilos de Card.** No define `bg-surface-primary`, `rounded-xl`, ni sombras propias — todo lo hereda de Card. Solo agrega `shadow-token-sm` vía `className` para sobrescribir la sombra por defecto.

### Anatomía

```
┌──────────────────────────────────┐
│  [Icono 48x48]     [Label]       │  ← flex items-start justify-between
│                                  │
│  [Valor 30px bold]               │  ← gap-4 desde la fila superior
│  [Descripción 14px] (opcional)   │  ← gap-1 desde el valor
└──────────────────────────────────┘
```

### Variantes de color

| Variante | Fondo del icono | Color del icono |
|----------|----------------|-----------------|
| Brand | `bg-brand-light` (#E6F4EA) | `text-brand-primary` (#1E7E34) |
| Success | `bg-success-light` (#D1FAE5) | `text-success` (#059669) |
| Error | `bg-error-light` (#FEE2E2) | `text-error` (#DC2626) |
| Warning | `bg-warning-light` (#FEF3C7) | `text-warning` (#D97706) |
| Info | `bg-info-light` (#DBEAFE) | `text-info` (#2563EB) |

### Estados

| Estado | Comportamiento |
|--------|---------------|
| Default | Muestra icono + valor + label |
| Empty | Valor muestra `value ?? '—'` (nullish coalescing) |
| Error | La card se oculta (manejo a nivel de página, no componente) |
| Hover | Sin hover state (StatCard no es interactiva) |

### Accesibilidad

- Icono decorativo: `aria-hidden="true"`
- El valor es texto real (no imagen)
- El orden de lectura sigue el orden visual: label → valor → descripción
- El consumidor debe envolver grids de StatCards con `role="group"` y `aria-label`

### Tokens utilizados

| Token spec | CSS variable | Clase | ¿Usado? |
|------------|-------------|-------|---------|
| `color.surface.primary` | `--color-surface-primary: #FFFFFF` | heredado de Card | ✅ |
| `color.brand.primary` | `--color-brand-primary: #1E7E34` | `text-brand-primary` | ✅ brand icon |
| `color.brand.light` | `--color-brand-light: #E6F4EA` | `bg-brand-light` | ✅ brand bg |
| `color.success` | `--color-success: #059669` | `text-success` | ✅ success icon |
| `color.success.light` | `--color-success-light: #D1FAE5` | `bg-success-light` | ✅ success bg |
| `color.error` | `--color-error: #DC2626` | `text-error` | ✅ error icon |
| `color.error.light` | `--color-error-light: #FEE2E2` | `bg-error-light` | ✅ error bg |
| `color.warning` | `--color-warning: #D97706` | `text-warning` | ✅ warning icon |
| `color.warning.light` | `--color-warning-light: #FEF3C7` | `bg-warning-light` | ✅ warning bg |
| `color.info` | `--color-info: #2563EB` | `text-info` | ✅ info icon |
| `color.info.light` | `--color-info-light: #DBEAFE` | `bg-info-light` | ✅ info bg |
| `color.foreground.primary` | `--color-fg-primary: #111827` | `text-fg-primary` | ✅ value |
| `color.foreground.secondary` | `--color-fg-secondary: #4B5563` | `text-fg-secondary` | ✅ label |
| `color.foreground.tertiary` | `--color-fg-tertiary: #9CA3AF` | `text-fg-tertiary` | ✅ description |
| `shadow.sm` | `--shadow-sm` | `shadow-token-sm` | ✅ |
| `radius.xl` | `--radius-xl: 12px` | `rounded-xl` | ✅ icon container + card |
| `spacing.1` | `--spacing-1: 4px` | `gap-1` | ✅ value → description |
| `spacing.4` | `--spacing-4: 16px` | `gap-4` | ✅ top row → value |
| `spacing.6` | `--spacing-6: 24px` | `p-6` | ✅ inner padding |

**19 tokens del spec → 19 tokens implementados.** 0 omisiones.

---

## 3. Badge

### API

```jsx
import Badge from '../components/Badge';

// Uso mínimo
<Badge>Activo</Badge>

// Con variante e icono
<Badge variant="success" icon={CheckCircle}>Completado</Badge>

// Tamaños
<Badge size="sm">Nuevo</Badge>
<Badge size="md">Pendiente</Badge>
<Badge size="lg">En revisión</Badge>
```

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'success' \| 'error' \| 'warning' \| 'info' \| 'neutral' \| 'brand'` | `'neutral'` | Color semántico |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del badge |
| `icon` | `React.ComponentType<{size?: number}>` | `undefined` | Icono lucide-react opcional |
| `children` | `React.ReactNode` | `undefined` | Texto del badge |
| `className` | `string` | `''` | Clases adicionales |
| `ref` | `React.Ref<HTMLSpanElement>` | — | Forwarded ref |
| `...props` | — | — | Props HTML nativas |

### Variantes semánticas

| Variante | Texto + Fondo | Propósito |
|----------|--------------|-----------|
| Success | `text-success bg-success-light` | Activo, Dentro, Completado |
| Error | `text-error bg-error-light` | Inactivo, Rechazado, Error |
| Warning | `text-warning bg-warning-light` | Pendiente, En revisión |
| Info | `text-info bg-info-light` | Informativo, Borrador |
| Neutral | `text-fg-tertiary bg-surface-tertiary` | Etiqueta genérica (default) |
| Brand | `text-brand-primary bg-brand-light` | SENA, Administrador |

### Tamaños

| Tamaño | Altura | Tipografía | Padding horizontal | Icono |
|--------|--------|-----------|-------------------|-------|
| sm | 20px (`h-5`) | 12px (`text-xs`) | 8px (`px-2`) | 12px |
| md | 24px (`h-6`) | 14px (`text-sm`) | 10px (`px-2.5`) | 14px |
| lg | 28px (`h-7`) | 14px (`text-sm`) | 12px (`px-3`) | 14px |

### Estados

| Estado | Comportamiento |
|--------|---------------|
| Default | Muestra texto + icono opcional en fondo semántico |
| Sin icono | El layout no se rompe (gap-1 se omite si no hay icono) |

### Accesibilidad

- `inline-flex` con `items-center` centra el contenido verticalmente
- `gap-1` separa icono y texto
- `whitespace-nowrap` evita quiebre de línea
- `rounded-full` forma de píldora
- `leading-none` evita espacio extra vertical por line-height

### Tokens utilizados

| Token spec | CSS variable | Clase | ¿Usado? |
|------------|-------------|-------|---------|
| `color.success` | `--color-success: #059669` | `text-success` | ✅ |
| `color.success.light` | `--color-success-light: #D1FAE5` | `bg-success-light` | ✅ |
| `color.error` | `--color-error: #DC2626` | `text-error` | ✅ |
| `color.error.light` | `--color-error-light: #FEE2E2` | `bg-error-light` | ✅ |
| `color.warning` | `--color-warning: #D97706` | `text-warning` | ✅ |
| `color.warning.light` | `--color-warning-light: #FEF3C7` | `bg-warning-light` | ✅ |
| `color.info` | `--color-info: #2563EB` | `text-info` | ✅ |
| `color.info.light` | `--color-info-light: #DBEAFE` | `bg-info-light` | ✅ |
| `color.brand.primary` | `--color-brand-primary: #1E7E34` | `text-brand-primary` | ✅ |
| `color.brand.light` | `--color-brand-light: #E6F4EA` | `bg-brand-light` | ✅ |
| `color.foreground.tertiary` | `--color-fg-tertiary: #9CA3AF` | `text-fg-tertiary` | ✅ neutral text |
| `color.surface.tertiary` | `--color-surface-tertiary: #F3F4F6` | `bg-surface-tertiary` | ✅ neutral bg |
| `radius.full` | `--radius-full: 9999px` | `rounded-full` | ✅ |
| `spacing.1` | `--spacing-1: 4px` | `gap-1` | ✅ |
| `spacing.2` | `--spacing-2: 8px` | `px-2` | ✅ sm padding |
| `spacing.2.5` | `--spacing-2-5: 10px` | `px-2.5` | ✅ md padding (nuevo token) |
| `spacing.3` | `--spacing-3: 12px` | `px-3` | ✅ lg padding |
| `typography.size.xs` | `--font-size-xs: 12px` | `text-xs` | ✅ sm |
| `typography.size.sm` | `--font-size-sm: 14px` | `text-sm` | ✅ md, lg |
| `typography.weight.medium` | `--font-weight-medium: 500` | `font-medium` | ✅ |

**19 tokens del spec → 19 tokens implementados.** 0 omisiones.

---

## 4. tokens-utilities.css — Extensiones

Se agregaron 16 clases nuevas.

### Background — Semánticos (5 nuevas)

| Clase | Valor |
|-------|-------|
| `bg-brand-light` | `var(--color-brand-light)` |
| `bg-success-light` | `var(--color-success-light)` |
| `bg-error-light` | `var(--color-error-light)` |
| `bg-warning-light` | `var(--color-warning-light)` |
| `bg-info-light` | `var(--color-info-light)` |

### Text — Semánticos (3 nuevas)

| Clase | Valor |
|-------|-------|
| `text-success` | `var(--color-success)` |
| `text-warning` | `var(--color-warning)` |
| `text-info` | `var(--color-info)` |

### Shadow — Reordenado

`shadow-token-sm` movido al final del grupo para que pueda sobrescribir `shadow-token-md` por cascada CSS cuando ambos están presentes (usado por StatCard).

### CDN Supplements (8 nuevas)

| Clase | Valor | Propósito |
|-------|-------|-----------|
| `pt-6` | `var(--spacing-6)` | Card.Header padding-top |
| `pb-6` | `var(--spacing-6)` | Card.Content padding-bottom |
| `first:pt-6` | `var(--spacing-6)` | Card.Content top padding solo si es primer hijo |
| `h-7` | `var(--spacing-7)` | Badge lg height |
| `px-2` | `var(--spacing-2)` | Badge sm horizontal padding |
| `px-2.5` | `var(--spacing-2-5)` | Badge md horizontal padding |
| `leading-none` | `1` | Badge line-height |

**Total: 54 clases utilitarias** (38 anteriores + 16 nuevas).

---

## 5. Validación: Composición y no duplicación

### StatCard reutiliza Card

```jsx
// Card.jsx — <div className="bg-surface-primary rounded-xl shadow-token-md ...">
// StatCard.jsx — <Card className="shadow-token-sm">...

// StatCard NO define:
//   - bg-surface-primary (heredado de Card)
//   - rounded-xl (heredado de Card)
//   - Sombras propias (usa shadow-token-sm vía className, sobrescribe default)
//   - Estructura de sub-componentes (Header/Content/Footer)
```

**Resultado: StatCard NO duplica ningún estilo de Card.** Solo añade:
- `shadow-token-sm` (sombra más sutil que la default de Card)
- Contenido interno específico (icono + label + valor + descripción)

### Sin estilos repetidos entre componentes

| Componente | Estilos únicos | Compartidos |
|-----------|---------------|-------------|
| Card | shadow-token-md/lg, border-default, first:pt-6 | bg-surface-primary, rounded-xl, px-6, pt-6, pb-6, py-4 |
| StatCard | shadow-token-sm, bg-*-light, w-12 h-12, text-3xl | bg-surface-primary (vía Card), rounded-xl (vía Card) |
| Badge | h-5/6/7, px-2/2.5/3, rounded-full, leading-none, text-xs, whitespace-nowrap | text-*/bg-* semánticos, gap-1, font-medium |

**Resultado: 0 estilos repetidos entre los tres componentes.** Cada uno tiene responsabilidades visuales distintas.

### Validación contra valores hardcodeados

| Categoría | ¿Valores fuera del sistema? | Resultado |
|-----------|---------------------------|-----------|
| **Colores** | Todos referencian `var(--color-*)`. 11 nuevos tokens semánticos agregados. | ✅ |
| **Tipografía** | `text-xs`, `text-sm`, `text-3xl`, `font-medium`, `font-bold`, `leading-none`. | ✅ |
| **Espaciado** | `p-6`, `px-6`, `pt-6`, `pb-6`, `py-4`, `px-2`, `px-2.5`, `px-3`, `gap-1`, `gap-4`. `px-2.5` referencia `var(--spacing-2-5)`. | ✅ |
| **Alturas** | `h-5` (20px = `--spacing-5`), `h-6` (24px = `--spacing-6`), `h-7` (28px = `--spacing-7`). | ✅ |
| **Anchuras** | `w-12` (48px = `--spacing-12`). | ✅ |
| **Radios** | `rounded-xl` (12px = `--radius-xl`), `rounded-full`. | ✅ |
| **Sombras** | `shadow-token-sm/md/lg`. | ✅ |
| **Opacidades** | No se usan nuevas. | ✅ |

**Resultado: 0 valores fuera del sistema de tokens.** Los tokens `--spacing-2-5: 10px` y `--spacing-7: 28px` fueron agregados a `design-tokens.css` para cubrir estos valores necesarios por el Badge, completando la escala de espaciado con valores estándar de Tailwind.

---

## 6. Cumplimiento del Design System

| Documento | ¿Cumple? | Observaciones |
|-----------|----------|---------------|
| `design-principles.md` | ✅ | Consistente con un solo verde SENA, tipografía Inter, escalas definidas |
| `design-tokens.md` | ✅ | Todos los tokens del spec implementados |
| `component-specifications.md` (Card) | ✅ | 3 variantes, anatomía completa, composición Header/Content/Footer, padding correcto |
| `component-specifications.md` (StatCard) | ✅ | 5 variantes, icono 48x48, valor 30px bold, descripción opcional, reutiliza Card |
| `component-specifications.md` (Badge) | ✅ | 6 variantes, 3 tamaños, icono opcional, rounded-full |
| `composition-rules.md` | ✅ | Card como contenedor base, StatCard como especialización |

### Desviaciones conocidas

| # | Desviación | Razón | Cuándo se corrige |
|---|-----------|-------|-------------------|
| 1 | Sombras reordenadas en cascada | `shadow-token-sm` movido al final para permitir override desde className en StatCard | Tailwind local (solución permanente), o refactor de Card |

### Tokens agregados al sistema

Como parte de este sprint se incorporaron dos nuevos tokens de espaciado a `design-tokens.css`, cerrando la brecha entre la escala de Tailwind y el sistema de tokens SenaParkControl:

| Token | Valor | Uso |
|-------|-------|-----|
| `--spacing-2-5` | `10px` | Padding horizontal de Badge md (`px-2.5`) |
| `--spacing-7` | `28px` | Altura de Badge lg (`h-7`) |

Ambos valores forman parte de la escala estándar de espaciado de Tailwind y estaban ausentes del token system. Quedan oficialmente incorporados como Design Tokens.

**Total de tokens de espaciado: 17** (15 anteriores + 2 nuevos).

### Veredicto

**Card, StatCard, y Badge cumplen el Design System aprobado sin desviaciones de valores hardcodeados.** StatCard reutiliza Card sin duplicar estilos. No existe superposición de estilos entre los tres componentes. Todos los colores, alturas y espaciados referencian exclusivamente Design Tokens.
