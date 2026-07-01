import React, { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

const normalizeOptions = (options) =>
  options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt,
  );

const Select = forwardRef(function Select(
  {
    label,
    helperText,
    error,
    options = [],
    placeholder,
    value,
    onChange,
    disabled = false,
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
  const normalizedOptions = normalizeOptions(options);

  const selectClasses = [
    'w-full bg-surface-primary border rounded-md px-3 py-2 text-sm text-fg-primary',
    'appearance-none cursor-pointer pr-10',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-colors duration-150',
    hasError
      ? 'border-error focus:ring-error'
      : 'border-default hover:border-hover focus:ring-brand',
    disabled ? 'bg-surface-tertiary opacity-50 cursor-not-allowed' : '',
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
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          name={name}
          className={selectClasses}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${id}-error`
              : helperText
                ? `${id}-helper`
                : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-tertiary pointer-events-none"
        />
      </div>
      {(hasError || helperText) && (
        <p
          id={hasError ? `${id}-error` : `${id}-helper`}
          className={`text-sm ${hasError ? 'text-error' : 'text-fg-secondary'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Select;
