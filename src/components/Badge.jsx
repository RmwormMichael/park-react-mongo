import React, { forwardRef } from 'react';

const variantStyles = {
  success: 'text-success bg-success-light',
  error: 'text-error bg-error-light',
  warning: 'text-warning bg-warning-light',
  info: 'text-info bg-info-light',
  neutral: 'text-fg-tertiary bg-surface-tertiary',
  brand: 'text-brand-primary bg-brand-light',
};

const sizeStyles = {
  sm: 'h-5 text-xs px-2',
  md: 'h-6 text-sm px-2.5',
  lg: 'h-7 text-sm px-3',
};

const iconSizes = { sm: 12, md: 14, lg: 14 };

const Badge = forwardRef(function Badge(
  {
    variant = 'neutral',
    size = 'md',
    icon: Icon,
    children,
    className = '',
    ...props
  },
  ref,
) {
  return (
    <span
      ref={ref}
      className={`inline-flex items-center gap-1 rounded-full font-medium leading-none whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={iconSizes[size]} />}
      {children && <span>{children}</span>}
    </span>
  );
});

export default Badge;
