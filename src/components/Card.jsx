import React, { forwardRef } from 'react';

const variantStyles = {
  default: 'shadow-token-md',
  bordered: 'border border-default',
  elevated: 'shadow-token-lg',
};

const Card = forwardRef(function Card(
  { variant = 'default', className = '', children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`bg-surface-primary rounded-xl ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

function CardHeader({ className = '', children, ...props }) {
  return (
    <div
      className={`px-6 pt-6 flex items-center justify-between gap-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardContent({ className = '', children, ...props }) {
  return (
    <div
      className={`px-6 pb-6 first:pt-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardFooter({ className = '', children, ...props }) {
  return (
    <div
      className={`px-6 py-4 border-t border-default text-sm text-fg-tertiary ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
