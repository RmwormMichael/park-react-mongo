import React, { forwardRef } from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = forwardRef(function EmptyState(
  {
    icon,
    illustration,
    title,
    description,
    primaryAction,
    secondaryAction,
    className = '',
    ...props
  },
  ref,
) {
  const DefaultIcon = icon || Inbox;

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      {...props}
    >
      {illustration ? (
        <div className="mb-4">{illustration}</div>
      ) : (
        <DefaultIcon size={48} className="text-fg-tertiary mb-4" aria-hidden="true" />
      )}
      {title && <p className="text-base text-fg-secondary mb-1">{title}</p>}
      {description && <p className="text-sm text-fg-tertiary mb-4">{description}</p>}
      {primaryAction && <div>{primaryAction}</div>}
      {secondaryAction && <div className="mt-3">{secondaryAction}</div>}
    </div>
  );
});

export default EmptyState;
