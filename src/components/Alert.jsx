import React, { forwardRef } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const borderStyles = {
  success: 'border-success',
  error: 'border-error',
  warning: 'border-warning',
  info: 'border-info',
};

const bgStyles = {
  success: 'bg-success-light',
  error: 'bg-error-light',
  warning: 'bg-warning-light',
  info: 'bg-info-light',
};

const iconColors = {
  success: 'text-success',
  error: 'text-error',
  warning: 'text-warning',
  info: 'text-info',
};

const Alert = forwardRef(function Alert(
  {
    variant = 'info',
    title,
    children,
    action,
    dismissible = false,
    onDismiss,
    className = '',
    ...props
  },
  ref,
) {
  const Icon = iconMap[variant] || Info;

  return (
    <div
      ref={ref}
      role={variant === 'error' ? 'alert' : undefined}
      className={`flex gap-3 p-4 items-start rounded-md ${borderStyles[variant]} ${bgStyles[variant]} ${className}`}
      {...props}
    >
      <Icon size={20} className={`flex-shrink-0 ${iconColors[variant]}`} aria-hidden="true" />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {title && <p className="text-sm font-semibold text-fg-primary">{title}</p>}
        {children && <div className="text-sm text-fg-secondary">{children}</div>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 text-fg-tertiary hover:text-fg-primary transition-colors"
          aria-label="Cerrar alerta"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
});

export default Alert;
