import React, { forwardRef, useId } from 'react';

const Textarea = forwardRef(function Textarea(
  {
    label,
    helperText,
    error,
    placeholder,
    value,
    onChange,
    disabled = false,
    readOnly = false,
    required = false,
    rows = 4,
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

  const textareaClasses = [
    'w-full bg-surface-primary border rounded-md px-3 py-2 text-sm text-fg-primary',
    'placeholder:text-fg-tertiary resize-y min-h-20',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-colors duration-150',
    hasError
      ? 'border-error focus:ring-error'
      : 'border-default hover:border-hover focus:ring-brand',
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
      <textarea
        ref={ref}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={rows}
        name={name}
        className={textareaClasses}
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

export default Textarea;
