import React, { useState, useEffect } from 'react';
import {
  Save, Trash2, Plus, Download, Search, Mail, Eye, EyeOff,
  CheckCircle, XCircle, AlertTriangle, Info, User, Car, Inbox,
  TrendingUp, Users, BarChart3, Activity,
} from 'lucide-react';

import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Badge from '../components/Badge';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

function Section({ title, children }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-fg-primary mb-6 pb-2 border-b border-default">{title}</h2>
      {children}
    </div>
  );
}

function VariantGrid({ children }) {
  return <div className="flex flex-wrap gap-4 items-start">{children}</div>;
}

function VariantLabel({ children }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-xs text-fg-tertiary">{children.props?.variant || children.props?.mode || ''}</span>
    </div>
  );
}

function useTokenValue(token) {
  const [value, setValue] = useState('');
  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    setValue(v);
  }, [token]);
  return value;
}

function ColorSwatch({ token, label }) {
  const value = useTokenValue(token);
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-md border border-default flex-shrink-0" style={{ backgroundColor: `var(${token})` }} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-fg-primary">{label || token}</p>
        <p className="text-xs text-fg-tertiary font-mono break-all">{token}</p>
        {value && <p className="text-xs text-fg-tertiary font-mono">{value}</p>}
      </div>
    </div>
  );
}

function TypographySample({ token, sizeClass, children }) {
  const value = useTokenValue(token);
  return (
    <div className="flex items-baseline gap-4 py-2 border-b border-default/50">
      <div className="w-16 flex-shrink-0">
        <p className="text-xs text-fg-tertiary font-mono">{value || token}</p>
      </div>
      <p className={`${sizeClass} text-fg-primary flex-1`}>{children || `The quick brown fox jumps over the lazy dog`}</p>
    </div>
  );
}

function SpacingSample({ token, sizeClass }) {
  const value = useTokenValue(token);
  const px = parseInt(value) || 0;
  return (
    <div className="flex items-center gap-3 py-1">
      <p className="text-xs text-fg-tertiary font-mono w-16 flex-shrink-0">{token.replace('--spacing-', 's')}</p>
      <p className="text-xs text-fg-tertiary font-mono w-16 flex-shrink-0">{value || '—'}</p>
      <div className="h-4 bg-brand-primary/30 rounded-sm flex-shrink-0" style={{ width: px || 1 }} />
    </div>
  );
}

function RadiusSample({ token }) {
  const value = useTokenValue(token);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-16 h-16 bg-brand-light border border-default" style={{ borderRadius: `var(${token})` }} />
      <span className="text-xs text-fg-tertiary font-mono">{value || token}</span>
      <span className="text-xs text-fg-tertiary">{token.replace('--radius-', 'r')}</span>
    </div>
  );
}

function ShadowSample({ token }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-32 h-20 bg-surface-primary rounded-md flex items-center justify-center" style={{ boxShadow: `var(${token})` }}>
        <span className="text-xs text-fg-tertiary">{token.replace('--shadow-', 's')}</span>
      </div>
    </div>
  );
}

function MotionSample({ durToken, easingToken }) {
  const dur = useTokenValue(durToken);
  const easing = useTokenValue(easingToken);
  return (
    <div className="flex items-center gap-4 py-3 border-b border-default/50">
      <div className="w-20 flex-shrink-0">
        <p className="text-xs text-fg-tertiary font-mono">{durToken.replace('--duration-', 'd')}</p>
        <p className="text-xs text-fg-tertiary">{dur}</p>
      </div>
      <div className="w-20 flex-shrink-0">
        <p className="text-xs text-fg-tertiary font-mono">{easingToken ? easingToken.replace('--easing-', 'e') : '—'}</p>
        <p className="text-xs text-fg-tertiary">{easing}</p>
      </div>
      <div className="flex-1 relative h-8 bg-surface-tertiary rounded overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full w-4 bg-brand-primary rounded animate-ping"
          style={{
            animationDuration: dur,
            animationTimingFunction: easing || 'ease',
          }}
        />
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  const [inputValue, setInputValue] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState({});
  const [modalOpen, setModalOpen] = useState(null);
  const [cdOpen, setCdOpen] = useState(null);
  const [cdLoading, setCdLoading] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-fg-primary mb-2">Design System</h1>
        <p className="text-fg-secondary">
          Catálogo visual de componentes — Solo desarrollo. Última actualización: Sprint 4.
        </p>
      </div>

      {/* ==============================
          FOUNDATIONS
      ============================== */}
      <Section title="Foundations">

        {/* COLORS */}
        <h3 className="text-sm font-semibold text-fg-secondary mb-4 uppercase tracking-wide">Colors</h3>
        <h4 className="text-xs font-semibold text-fg-tertiary mb-2 uppercase tracking-wider">Brand</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <ColorSwatch token="--color-brand-primary" label="Brand Primary" />
          <ColorSwatch token="--color-brand-hover" label="Brand Hover" />
          <ColorSwatch token="--color-brand-light" label="Brand Light" />
          <ColorSwatch token="--color-border-brand" label="Border Brand" />
        </div>

        <h4 className="text-xs font-semibold text-fg-tertiary mb-2 uppercase tracking-wider">Background</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <ColorSwatch token="--color-bg-primary" label="Bg Primary" />
          <ColorSwatch token="--color-bg-secondary" label="Bg Secondary" />
          <ColorSwatch token="--color-bg-tertiary" label="Bg Tertiary" />
        </div>

        <h4 className="text-xs font-semibold text-fg-tertiary mb-2 uppercase tracking-wider">Surface</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <ColorSwatch token="--color-surface-primary" label="Surface Primary" />
          <ColorSwatch token="--color-surface-secondary" label="Surface Secondary" />
          <ColorSwatch token="--color-surface-tertiary" label="Surface Tertiary" />
          <ColorSwatch token="--color-surface-inverse" label="Surface Inverse" />
        </div>

        <h4 className="text-xs font-semibold text-fg-tertiary mb-2 uppercase tracking-wider">Foreground</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <ColorSwatch token="--color-fg-primary" label="Fg Primary" />
          <ColorSwatch token="--color-fg-secondary" label="Fg Secondary" />
          <ColorSwatch token="--color-fg-tertiary" label="Fg Tertiary" />
          <ColorSwatch token="--color-fg-inverse" label="Fg Inverse" />
        </div>

        <h4 className="text-xs font-semibold text-fg-tertiary mb-2 uppercase tracking-wider">Border</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <ColorSwatch token="--color-border-default" label="Border Default" />
          <ColorSwatch token="--color-border-hover" label="Border Hover" />
          <ColorSwatch token="--color-border-secondary" label="Border Secondary" />
        </div>

        <h4 className="text-xs font-semibold text-fg-tertiary mb-2 uppercase tracking-wider">Semantic — Success</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <ColorSwatch token="--color-success" />
          <ColorSwatch token="--color-success-hover" />
          <ColorSwatch token="--color-success-light" />
          <ColorSwatch token="--color-success-border" />
        </div>

        <h4 className="text-xs font-semibold text-fg-tertiary mb-2 uppercase tracking-wider">Semantic — Error</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <ColorSwatch token="--color-error" />
          <ColorSwatch token="--color-error-hover" />
          <ColorSwatch token="--color-error-light" />
          <ColorSwatch token="--color-error-border" />
        </div>

        <h4 className="text-xs font-semibold text-fg-tertiary mb-2 uppercase tracking-wider">Semantic — Warning</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <ColorSwatch token="--color-warning" />
          <ColorSwatch token="--color-warning-hover" />
          <ColorSwatch token="--color-warning-light" />
          <ColorSwatch token="--color-warning-border" />
        </div>

        <h4 className="text-xs font-semibold text-fg-tertiary mb-2 uppercase tracking-wider">Semantic — Info</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <ColorSwatch token="--color-info" />
          <ColorSwatch token="--color-info-hover" />
          <ColorSwatch token="--color-info-light" />
          <ColorSwatch token="--color-info-border" />
        </div>

        <h4 className="text-xs font-semibold text-fg-tertiary mb-2 uppercase tracking-wider">Muted</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <ColorSwatch token="--color-muted" label="Muted" />
        </div>

        {/* TYPOGRAPHY */}
        <h3 className="text-sm font-semibold text-fg-secondary mb-4 mt-10 uppercase tracking-wide">Typography</h3>
        <div className="max-w-lg">
          <TypographySample token="--font-size-xs" sizeClass="text-xs">Extra Small (xs)</TypographySample>
          <TypographySample token="--font-size-sm" sizeClass="text-sm">Small (sm)</TypographySample>
          <TypographySample token="--font-size-base" sizeClass="text-base">Base</TypographySample>
          <TypographySample token="--font-size-lg" sizeClass="text-lg">Large (lg)</TypographySample>
          <TypographySample token="--font-size-xl" sizeClass="text-xl">Extra Large (xl)</TypographySample>
          <TypographySample token="--font-size-2xl" sizeClass="text-2xl">2x Large (2xl)</TypographySample>
          <TypographySample token="--font-size-3xl" sizeClass="text-3xl">3x Large (3xl)</TypographySample>
        </div>

        {/* SPACING */}
        <h3 className="text-sm font-semibold text-fg-secondary mb-4 mt-10 uppercase tracking-wide">Spacing</h3>
        <div className="max-w-md">
          <SpacingSample token="--spacing-0-5" />
          <SpacingSample token="--spacing-1" />
          <SpacingSample token="--spacing-1-5" />
          <SpacingSample token="--spacing-2" />
          <SpacingSample token="--spacing-2-5" />
          <SpacingSample token="--spacing-3" />
          <SpacingSample token="--spacing-4" />
          <SpacingSample token="--spacing-5" />
          <SpacingSample token="--spacing-6" />
          <SpacingSample token="--spacing-7" />
          <SpacingSample token="--spacing-8" />
          <SpacingSample token="--spacing-10" />
          <SpacingSample token="--spacing-12" />
          <SpacingSample token="--spacing-16" />
          <SpacingSample token="--spacing-20" />
        </div>

        {/* BORDER RADIUS */}
        <h3 className="text-sm font-semibold text-fg-secondary mb-4 mt-10 uppercase tracking-wide">Border Radius</h3>
        <VariantGrid>
          <RadiusSample token="--radius-none" />
          <RadiusSample token="--radius-sm" />
          <RadiusSample token="--radius-md" />
          <RadiusSample token="--radius-lg" />
          <RadiusSample token="--radius-xl" />
          <RadiusSample token="--radius-full" />
        </VariantGrid>

        {/* SHADOWS */}
        <h3 className="text-sm font-semibold text-fg-secondary mb-4 mt-10 uppercase tracking-wide">Shadows</h3>
        <VariantGrid>
          <ShadowSample token="--shadow-sm" />
          <ShadowSample token="--shadow-md" />
          <ShadowSample token="--shadow-lg" />
          <ShadowSample token="--shadow-xl" />
        </VariantGrid>

        {/* MOTION */}
        <h3 className="text-sm font-semibold text-fg-secondary mb-4 mt-10 uppercase tracking-wide">Motion</h3>
        <div className="max-w-lg">
          <MotionSample durToken="--duration-fast" easingToken="--easing-default" />
          <MotionSample durToken="--duration-normal" easingToken="--easing-entrance" />
          <MotionSample durToken="--duration-slow" easingToken="--easing-exit" />
        </div>
      </Section>

      {/* ==============================
          BUTTON
      ============================== */}
      <Section title="Button">
        <h3 className="text-sm font-semibold text-fg-secondary mb-3 uppercase tracking-wide">Variants</h3>
        <VariantGrid>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </VariantGrid>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">Sizes</h3>
        <VariantGrid>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </VariantGrid>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">With Icons</h3>
        <VariantGrid>
          <Button icon={Save}>Guardar</Button>
          <Button variant="secondary" icon={Trash2}>Eliminar</Button>
          <Button variant="ghost" icon={Plus}>Agregar</Button>
          <Button icon={Download} iconRight={Download}>Exportar</Button>
        </VariantGrid>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">States</h3>
        <VariantGrid>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button variant="secondary" loading>Loading</Button>
          <Button variant="destructive" loading>Loading</Button>
          <Button variant="link" loading>Loading</Button>
        </VariantGrid>
      </Section>

      {/* ==============================
          INPUT
      ============================== */}
      <Section title="Input">
        <h3 className="text-sm font-semibold text-fg-secondary mb-3 uppercase tracking-wide">Variants</h3>
        <div className="max-w-sm space-y-4">
          <Input
            label="Default"
            placeholder="Escriba aquí..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="With Icon"
            icon={Search}
            placeholder="Buscar..."
          />
          <Input
            label="With Right Icon"
            iconRight={passwordVisible ? EyeOff : Eye}
            type={passwordVisible ? 'text' : 'password'}
            placeholder="Contraseña"
          />
          <Input
            label="Error State"
            error="Este campo es obligatorio"
            placeholder="Correo electrónico"
            icon={Mail}
          />
          <Input
            label="Disabled"
            disabled
            value="Valor deshabilitado"
          />
          <Input
            label="Helper Text"
            helperText="Este es un texto de ayuda"
          />
          <Input
            label="Required"
            required
            placeholder="Campo requerido"
          />
        </div>
      </Section>

      {/* ==============================
          SELECT
      ============================== */}
      <Section title="Select">
        <div className="max-w-sm space-y-4">
          <Select
            label="Rol"
            placeholder="Seleccione un rol"
            options={[
              { value: 'admin', label: 'Administrador' },
              { value: 'instructor', label: 'Instructor' },
              { value: 'aprendiz', label: 'Aprendiz' },
            ]}
          />
          <Select
            label="Con error"
            error="Debe seleccionar un rol"
            placeholder="Seleccione..."
            options={[
              { value: 'a', label: 'Opción A' },
              { value: 'b', label: 'Opción B' },
            ]}
          />
          <Select
            label="Deshabilitado"
            disabled
            options={['Opción deshabilitada']}
          />
        </div>
      </Section>

      {/* ==============================
          TEXTAREA
      ============================== */}
      <Section title="Textarea">
        <div className="max-w-sm space-y-4">
          <Textarea label="Observaciones" placeholder="Escriba aquí..." />
          <Textarea label="Con error" error="Este campo es obligatorio" />
          <Textarea label="Deshabilitado" disabled value="Valor fijo" />
        </div>
      </Section>

      {/* ==============================
          BADGE
      ============================== */}
      <Section title="Badge">
        <h3 className="text-sm font-semibold text-fg-secondary mb-3 uppercase tracking-wide">Variants</h3>
        <VariantGrid>
          <Badge variant="success">Activo</Badge>
          <Badge variant="error">Inactivo</Badge>
          <Badge variant="warning">Pendiente</Badge>
          <Badge variant="info">Borrador</Badge>
          <Badge variant="neutral">Etiqueta</Badge>
          <Badge variant="brand">SENA</Badge>
        </VariantGrid>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">Sizes</h3>
        <VariantGrid>
          <Badge size="sm" variant="success">Small</Badge>
          <Badge size="md" variant="success">Medium</Badge>
          <Badge size="lg" variant="success">Large</Badge>
        </VariantGrid>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">With Icons</h3>
        <VariantGrid>
          <Badge variant="success" icon={CheckCircle}>Completado</Badge>
          <Badge variant="error" icon={XCircle}>Rechazado</Badge>
          <Badge variant="warning" icon={AlertTriangle}>Pendiente</Badge>
          <Badge variant="info" icon={Info}>Informativo</Badge>
        </VariantGrid>
      </Section>

      {/* ==============================
          CARD
      ============================== */}
      <Section title="Card">
        <h3 className="text-sm font-semibold text-fg-secondary mb-3 uppercase tracking-wide">Variants</h3>
        <VariantGrid>
          <Card className="w-72">
            <Card.Header>
              <span className="text-lg font-semibold text-fg-primary">Default Card</span>
              <Badge variant="brand">SENA</Badge>
            </Card.Header>
            <Card.Content>
              <p className="text-fg-secondary">Contenido de la card con información relevante para el usuario.</p>
            </Card.Content>
            <Card.Footer>
              <span>Footer de la card</span>
            </Card.Footer>
          </Card>

          <Card variant="bordered" className="w-72">
            <Card.Header>
              <span className="text-lg font-semibold text-fg-primary">Bordered</span>
            </Card.Header>
            <Card.Content>
              <p className="text-fg-secondary">Card con borde, sin sombra. Ideal para listas y tablas.</p>
            </Card.Content>
          </Card>

          <Card variant="elevated" className="w-72">
            <Card.Header>
              <span className="text-lg font-semibold text-fg-primary">Elevated</span>
            </Card.Header>
            <Card.Content>
              <p className="text-fg-secondary">Card con sombra elevada. Ideal para modales y contenido destacado.</p>
            </Card.Content>
          </Card>
        </VariantGrid>
      </Section>

      {/* ==============================
          STATCARD
      ============================== */}
      <Section title="StatCard">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            variant="brand"
            icon={TrendingUp}
            label="Total Vehículos"
            value="128"
            description="+12% vs ayer"
          />
          <StatCard
            variant="success"
            icon={Car}
            label="Dentro"
            value="84"
            description="Vehículos en parqueadero"
          />
          <StatCard
            variant="error"
            icon={Car}
            label="Fuera"
            value="44"
            description="Vehículos que han salido"
          />
          <StatCard
            variant="warning"
            icon={Activity}
            label="Alertas"
            value="3"
            description="Requieren atención"
          />
          <StatCard
            variant="info"
            icon={BarChart3}
            label="Movimientos Hoy"
            value="67"
          />
          <StatCard
            variant="brand"
            icon={Users}
            label="Usuarios"
            value="—"
          />
        </div>
      </Section>

      {/* ==============================
          ALERT
      ============================== */}
      <Section title="Alert">
        <h3 className="text-sm font-semibold text-fg-secondary mb-3 uppercase tracking-wide">Variants</h3>
        <div className="space-y-3 max-w-2xl">
          <Alert variant="success">
            Operación completada exitosamente. El registro ha sido guardado.
          </Alert>
          <Alert variant="error" title="Error al guardar">
            No se pudo guardar el registro. Verifique los datos e intente nuevamente.
          </Alert>
          <Alert variant="warning" title="Campos incompletos">
            Complete todos los campos obligatorios antes de continuar.
          </Alert>
          <Alert variant="info" title="Nota">
            Los cambios se guardarán automáticamente al salir.
          </Alert>
        </div>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">With Action</h3>
        <div className="space-y-3 max-w-2xl">
          <Alert
            variant="error"
            title="Error de conexión"
            action={<Button variant="link" size="sm">Reintentar</Button>}
          >
            No se pudo conectar con el servidor. Verifique su conexión a internet.
          </Alert>
          <Alert
            variant="info"
            action={<Button variant="link" size="sm">Ver detalles</Button>}
          >
            Hay 3 nuevas actualizaciones disponibles.
          </Alert>
        </div>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">Dismissible</h3>
        <div className="space-y-3 max-w-2xl">
          {!alertDismissed.success && (
            <Alert
              variant="success"
              dismissible
              onDismiss={() => setAlertDismissed((p) => ({ ...p, success: true }))}
            >
              Puede cerrar este mensaje de éxito.
            </Alert>
          )}
          {!alertDismissed.warning && (
            <Alert
              variant="warning"
              title="Con título"
              dismissible
              onDismiss={() => setAlertDismissed((p) => ({ ...p, warning: true }))}
            >
              Alerta con título y botón de cerrar.
            </Alert>
          )}
          {!alertDismissed.dismissed && (
            <Button variant="ghost" size="sm" onClick={() => setAlertDismissed({})}>
              Restaurar alerts
            </Button>
          )}
        </div>
      </Section>

      {/* ==============================
          EMPTYSTATE
      ============================== */}
      <Section title="EmptyState">
        <h3 className="text-sm font-semibold text-fg-secondary mb-3 uppercase tracking-wide">Basic</h3>
        <Card>
          <EmptyState
            title="No hay movimientos para mostrar"
            description="Registre un movimiento usando el formulario de entrada."
          />
        </Card>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">With Primary Action</h3>
        <Card>
          <EmptyState
            title="No hay vehículos registrados"
            description="Agregue el primer vehículo al sistema para comenzar."
            primaryAction={<Button icon={Plus}>Agregar vehículo</Button>}
          />
        </Card>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">With Secondary Action</h3>
        <Card>
          <EmptyState
            title="Sin resultados de búsqueda"
            description="No se encontraron registros con los criterios actuales."
            primaryAction={<Button>Limpiar filtros</Button>}
            secondaryAction={<Button variant="ghost">Volver</Button>}
          />
        </Card>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">Custom Icon</h3>
        <Card>
          <EmptyState
            icon={Search}
            title="No se encontraron resultados"
            description="Intente con otros términos de búsqueda."
          />
        </Card>
      </Section>

      {/* ==============================
          LOADING
      ============================== */}
      <Section title="Loading">
        <h3 className="text-sm font-semibold text-fg-secondary mb-3 uppercase tracking-wide">Inline</h3>
        <VariantGrid>
          <div className="flex items-center gap-4">
            <Loading mode="inline" size="sm" />
            <Loading mode="inline" size="md" />
            <Loading mode="inline" size="lg" />
            <Loading mode="inline" size="xl" />
          </div>
        </VariantGrid>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">Centered</h3>
        <Card>
          <Loading mode="centered" size="md" text="Cargando datos..." />
        </Card>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">Fullscreen</h3>
        <Button onClick={() => setShowFullscreen(true)}>
          Mostrar fullscreen
        </Button>
        {showFullscreen && (
          <>
            <Loading mode="fullscreen" text="Procesando, espere..." />
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-toast">
              <Button variant="secondary" onClick={() => setShowFullscreen(false)}>
                Cerrar fullscreen
              </Button>
            </div>
          </>
        )}
      </Section>

      {/* ==============================
          MODAL
      ============================== */}
      <Section title="Modal">
        <h3 className="text-sm font-semibold text-fg-secondary mb-3 uppercase tracking-wide">Sizes</h3>
        <VariantGrid>
          <Button onClick={() => setModalOpen('sm')}>Small (sm)</Button>
          <Button onClick={() => setModalOpen('md')}>Medium (md)</Button>
          <Button onClick={() => setModalOpen('lg')}>Large (lg)</Button>
          <Button onClick={() => setModalOpen('xl')}>Extra Large (xl)</Button>
          <Button onClick={() => setModalOpen('full')}>Full</Button>
        </VariantGrid>
        <p className="text-xs text-fg-tertiary mt-2">Cada modal incluye Header, Content y Footer.</p>

        {modalOpen && (
          <Modal open onClose={() => setModalOpen(null)} size={modalOpen}>
            <Modal.Header>Modal {modalOpen}</Modal.Header>
            <Modal.Content>
              <p className="text-fg-secondary">
                Este es un modal de tamaño <strong className="text-fg-primary">{modalOpen}</strong>.
                El contenido puede ser tan extenso como sea necesario.
                El modal gestiona automáticamente el scroll interno y el bloqueo del scroll del body.
              </p>
              <div className="h-64 bg-surface-tertiary rounded-md mt-4 flex items-center justify-center text-fg-tertiary text-sm">
                Área de contenido extenso (scroll interno)
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button variant="ghost" onClick={() => setModalOpen(null)}>Cancelar</Button>
              <Button onClick={() => setModalOpen(null)}>Aceptar</Button>
            </Modal.Footer>
          </Modal>
        )}

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">Sin Footer</h3>
        <Button onClick={() => setModalOpen('no-footer')}>Abrir modal sin footer</Button>
        {modalOpen === 'no-footer' && (
          <Modal open onClose={() => setModalOpen(null)} size="sm">
            <Modal.Header showCloseButton={false}>Sin Footer</Modal.Header>
            <Modal.Content>
              <p className="text-fg-secondary">
                Modal sin footer y sin botón de cerrar en el header.
                Solo se puede cerrar con Escape o click en overlay.
              </p>
            </Modal.Content>
          </Modal>
        )}
      </Section>

      {/* ==============================
          CONFIRMDIALOG
      ============================== */}
      <Section title="ConfirmDialog">
        <h3 className="text-sm font-semibold text-fg-secondary mb-3 uppercase tracking-wide">Variants</h3>
        <VariantGrid>
          <Button variant="destructive" onClick={() => setCdOpen('destructive')}>
            Destructive
          </Button>
          <Button variant="secondary" onClick={() => setCdOpen('warning')}>
            Warning
          </Button>
          <Button variant="secondary" onClick={() => setCdOpen('info')}>
            Info
          </Button>
          <Button variant="secondary" onClick={() => setCdOpen('success')}>
            Success
          </Button>
          <Button variant="secondary" onClick={() => setCdOpen('default')}>
            Default
          </Button>
        </VariantGrid>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">Modo Alerta</h3>
        <Button onClick={() => setCdOpen('alert')}>Alerta (hideCancel)</Button>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">Estado Loading</h3>
        <Button onClick={() => { setCdOpen('loading-demo'); setCdLoading(true); }}>
          Confirmar con loading
        </Button>

        {cdOpen === 'destructive' && (
          <ConfirmDialog
            open
            onClose={() => setCdOpen(null)}
            onConfirm={() => setCdOpen(null)}
            title="¿Eliminar usuario?"
            message="Esta acción no se puede deshacer. Todos los datos asociados serán eliminados permanentemente."
            confirmLabel="Eliminar"
            variant="destructive"
          />
        )}
        {cdOpen === 'warning' && (
          <ConfirmDialog
            open
            onClose={() => setCdOpen(null)}
            onConfirm={() => setCdOpen(null)}
            title="¿Archivar registro?"
            message="El registro quedará oculto pero podrá recuperarse desde el archivo."
            confirmLabel="Archivar"
            variant="warning"
          />
        )}
        {cdOpen === 'info' && (
          <ConfirmDialog
            open
            onClose={() => setCdOpen(null)}
            onConfirm={() => setCdOpen(null)}
            title="Actualización disponible"
            message="Hay una nueva versión del sistema disponible. ¿Desea actualizar ahora?"
            confirmLabel="Actualizar"
            variant="info"
          />
        )}
        {cdOpen === 'success' && (
          <ConfirmDialog
            open
            onClose={() => setCdOpen(null)}
            onConfirm={() => setCdOpen(null)}
            title="Operación completada"
            message="El vehículo ha sido registrado correctamente en el sistema."
            confirmLabel="Aceptar"
            variant="success"
            hideCancel
          />
        )}
        {cdOpen === 'default' && (
          <ConfirmDialog
            open
            onClose={() => setCdOpen(null)}
            onConfirm={() => setCdOpen(null)}
            title="¿Confirmar cambios?"
            message="Revise la información antes de continuar."
            confirmLabel="Confirmar"
            variant="default"
          />
        )}
        {cdOpen === 'alert' && (
          <ConfirmDialog
            open
            onClose={() => setCdOpen(null)}
            onConfirm={() => setCdOpen(null)}
            title="Operación exitosa"
            message="El registro ha sido guardado correctamente."
            confirmLabel="Aceptar"
            variant="success"
            hideCancel
          />
        )}
        {cdOpen === 'loading-demo' && (
          <ConfirmDialog
            open
            onClose={() => { setCdOpen(null); setCdLoading(false); }}
            onConfirm={() => {
              setTimeout(() => {
                setCdOpen(null);
                setCdLoading(false);
              }, 2000);
            }}
            title="Procesando..."
            message="Esta operación puede tomar unos segundos."
            confirmLabel="Confirmar"
            variant="info"
            loading={cdLoading}
          />
        )}
      </Section>

      {/* ==============================
          COMPOSITION EXAMPLES
      ============================== */}
      <Section title="Composición">
        <h3 className="text-sm font-semibold text-fg-secondary mb-3 uppercase tracking-wide">Card + Badge</h3>
        <VariantGrid>
          <Card className="w-72">
            <Card.Header>
              <span className="text-lg font-semibold text-fg-primary">Juan Pérez</span>
              <Badge variant="success" icon={CheckCircle}>Activo</Badge>
            </Card.Header>
            <Card.Content>
              <div className="space-y-1 text-sm text-fg-secondary">
                <p><span className="font-medium text-fg-primary">Rol:</span> Administrador</p>
                <p><span className="font-medium text-fg-primary">Email:</span> juan@example.com</p>
                <p><span className="font-medium text-fg-primary">Vehículos:</span> 2</p>
              </div>
            </Card.Content>
            <Card.Footer className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm">Editar</Button>
              <Button variant="destructive" size="sm">Eliminar</Button>
            </Card.Footer>
          </Card>

          <Card className="w-72">
            <Card.Header>
              <span className="text-lg font-semibold text-fg-primary">María García</span>
              <Badge variant="warning" icon={AlertTriangle}>Pendiente</Badge>
            </Card.Header>
            <Card.Content>
              <div className="space-y-1 text-sm text-fg-secondary">
                <p><span className="font-medium text-fg-primary">Rol:</span> Aprendiz</p>
                <p><span className="font-medium text-fg-primary">Email:</span> maria@example.com</p>
                <p><span className="font-medium text-fg-primary">Vehículos:</span> 1</p>
              </div>
            </Card.Content>
            <Card.Footer className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm">Editar</Button>
              <Button variant="destructive" size="sm">Eliminar</Button>
            </Card.Footer>
          </Card>
        </VariantGrid>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">Alert + Button</h3>
        <div className="space-y-3 max-w-2xl">
          <Alert
            variant="error"
            title="Error al procesar"
            action={<Button variant="link" size="sm">Reintentar</Button>}
          >
            Ocurrió un error al procesar la solicitud. Intente nuevamente.
          </Alert>
        </div>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">EmptyState + Button</h3>
        <Card className="max-w-md">
          <EmptyState
            title="No hay datos disponibles"
            description="Comience agregando un nuevo registro."
            primaryAction={<Button icon={Plus}>Nuevo registro</Button>}
            secondaryAction={<Button variant="ghost">Cancelar</Button>}
          />
        </Card>

        <h3 className="text-sm font-semibold text-fg-secondary mb-3 mt-6 uppercase tracking-wide">StatCard Grid (Composición típica de Dashboard)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard variant="brand" icon={TrendingUp} label="Total" value="128" />
          <StatCard variant="success" icon={Car} label="Dentro" value="84" />
          <StatCard variant="error" icon={Car} label="Fuera" value="44" />
          <StatCard variant="info" icon={BarChart3} label="Hoy" value="67" />
        </div>
      </Section>
    </div>
  );
}
