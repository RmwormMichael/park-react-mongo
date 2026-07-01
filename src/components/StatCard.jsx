import React, { forwardRef } from 'react';
import Card from './Card';

const variantColors = {
  brand: { bg: 'bg-brand-light', icon: 'text-brand-primary' },
  success: { bg: 'bg-success-light', icon: 'text-success' },
  error: { bg: 'bg-error-light', icon: 'text-error' },
  warning: { bg: 'bg-warning-light', icon: 'text-warning' },
  info: { bg: 'bg-info-light', icon: 'text-info' },
};

const StatCard = forwardRef(function StatCard(
  {
    variant = 'brand',
    icon: Icon,
    label,
    value,
    description,
    className = '',
    ...props
  },
  ref,
) {
  const colors = variantColors[variant] || variantColors.brand;

  return (
    <Card
      ref={ref}
      className={`shadow-token-sm ${className}`}
      {...props}
    >
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}
          >
            {Icon && <Icon size={24} className={colors.icon} aria-hidden="true" />}
          </div>
          <span className="text-sm text-fg-secondary text-right">{label}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold text-fg-primary">{value ?? '—'}</span>
          {description && (
            <span className="text-sm text-fg-tertiary">{description}</span>
          )}
        </div>
      </div>
    </Card>
  );
});

export default StatCard;
