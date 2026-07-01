import React, { forwardRef } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const variantConfig = {
  destructive: {
    icon: AlertTriangle,
    iconBg: 'bg-error-light',
    iconColor: 'text-error',
    buttonVariant: 'destructive',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-warning-light',
    iconColor: 'text-warning',
    buttonVariant: 'primary',
  },
  info: {
    icon: Info,
    iconBg: 'bg-info-light',
    iconColor: 'text-info',
    buttonVariant: 'primary',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-success-light',
    iconColor: 'text-success',
    buttonVariant: 'primary',
  },
  default: {
    icon: Info,
    iconBg: 'bg-surface-tertiary',
    iconColor: 'text-fg-tertiary',
    buttonVariant: 'primary',
  },
};

const ConfirmDialog = forwardRef(function ConfirmDialog(
  {
    open = false,
    onClose,
    onConfirm,
    title,
    message,
    children,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'default',
    icon: CustomIcon,
    hideIcon = false,
    hideCancel = false,
    loading = false,
    disabled = false,
    reverse = false,
    className = '',
  },
  ref,
) {
  const config = variantConfig[variant] || variantConfig.default;
  const IconComponent = CustomIcon || config.icon;

  return (
    <Modal
      ref={ref}
      open={open}
      onClose={onClose}
      size="sm"
      closeOnOverlay={false}
      className={className}
    >
      <Modal.Header showCloseButton={false}>
        {!hideIcon && (
          <div
            className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}
            aria-hidden="true"
          >
            <IconComponent size={24} className={config.iconColor} />
          </div>
        )}
      </Modal.Header>
      <Modal.Content>
        {title && <p className="text-lg font-semibold text-fg-primary mb-1">{title}</p>}
        {message && <p className="text-sm text-fg-secondary">{message}</p>}
        {children}
      </Modal.Content>
      <Modal.Footer>
        <div className={`flex gap-2 w-full ${reverse ? 'flex-row' : 'flex-row-reverse'}`}>
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            loading={loading}
            disabled={disabled || loading}
          >
            {confirmLabel}
          </Button>
          {!hideCancel && (
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={disabled || loading}
            >
              {cancelLabel}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
});

export default ConfirmDialog;
