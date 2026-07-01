import React, { forwardRef } from 'react';

const variantStyles = {
  primary:
    'bg-brand-primary text-fg-inverse hover:bg-brand-hover focus:ring-brand active:opacity-90',
  secondary:
    'bg-transparent text-fg-primary border border-default hover:bg-surface-tertiary focus:ring-brand active:opacity-90',
  ghost:
    'bg-transparent text-fg-primary hover:bg-surface-tertiary focus:ring-brand active:opacity-90',
  destructive:
    'bg-error text-fg-inverse hover:bg-error-hover focus:ring-error active:opacity-90',
};

const sizeStyles = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const iconSizes = { sm: 16, md: 20, lg: 24 };

const IconButton = forwardRef(function IconButton(
  {
    icon: Icon,
    size = 'md',
    variant = 'ghost',
    disabled = false,
    type = 'button',
    className = '',
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const label = ariaLabel || (typeof props.title === 'string' ? props.title : 'Icon button');

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
      {...props}
    >
      {Icon ? <Icon size={iconSizes[size]} /> : null}
    </button>
  );
});

export default IconButton;
