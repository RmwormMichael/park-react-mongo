import React, { forwardRef } from 'react';
import Loading from './Loading';

const variantStyles = {
  primary:
    'bg-brand-primary text-fg-inverse hover:bg-brand-hover focus:ring-brand active:opacity-90',
  secondary:
    'bg-transparent text-fg-primary border border-default hover:bg-surface-tertiary focus:ring-brand active:opacity-90',
  ghost:
    'bg-transparent text-fg-primary hover:bg-surface-tertiary focus:ring-brand active:opacity-90',
  destructive:
    'bg-error text-fg-inverse hover:bg-error-hover focus:ring-error active:opacity-90',
  link:
    'bg-transparent text-brand-primary hover:text-brand-primary hover:underline focus:ring-brand active:opacity-80',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const iconSizes = { sm: 16, md: 16, lg: 20 };

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon: IconLeft,
    iconRight: IconRight,
    type = 'button',
    className = '',
    children,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const showLeftIcon = !loading ? IconLeft : null;
  const showRightIcon = !loading ? IconRight : null;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer gap-2 ${variantStyles[variant]} ${sizeStyles[size]} ${loading ? 'cursor-wait' : ''} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <Loading mode="inline" size="sm" />
      ) : showLeftIcon ? (
        <showLeftIcon size={iconSizes[size]} />
      ) : null}
      {children ? <span>{children}</span> : null}
      {showRightIcon ? (
        <showRightIcon size={iconSizes[size]} />
      ) : null}
    </button>
  );
});

export default Button;
