import React, { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(function Input(
  {
    label,
    helperText,
    error,
    icon: Icon,
    iconRight: IconRight,
    type = 'text',
    placeholder,
    value,
    onChange,
    disabled = false,
    readOnly = false,
    required = false,
    className = '',
    id: externalId,
    name,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = externalId || generatedId;
  const hasError = !!error;

  const inputClasses = [
    'w-full bg-surface-primary border rounded-md px-3 py-2 text-sm text-fg-primary',
    'placeholder:text-fg-tertiary',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-colors duration-150',
    hasError
      ? 'border-error focus:ring-error'
      : 'border-default hover:border-hover focus:ring-brand',
    Icon ? 'pl-10' : '',
    IconRight ? 'pr-10' : '',
    disabled ? 'bg-surface-tertiary opacity-50 cursor-not-allowed' : '',
    readOnly ? 'bg-surface-tertiary opacity-50 cursor-default' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-fg-primary"
        >
          {label}
          {required && ' *'}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-tertiary pointer-events-none"
          />
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          name={name}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${id}-error`
              : helperText
                ? `${id}-helper`
                : undefined
          }
          {...props}
        />
        {IconRight && (
          <IconRight
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-tertiary pointer-events-none"
          />
        )}
      </div>
      {(hasError || helperText) && (
        <p
          id={hasError ? `${id}-error` : `${id}-helper`}
          className={`text-sm ${hasError ? 'text-error flex items-center gap-1' : 'text-fg-secondary'}`}
        >
          {hasError && <AlertCircle size={14} />}
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
