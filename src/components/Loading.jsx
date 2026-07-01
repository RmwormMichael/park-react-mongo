import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const sizePx = { sm: 16, md: 24, lg: 40, xl: 56 };

const Loading = forwardRef(function Loading(
  { mode = 'centered', size = 'md', text, className = '', ...props },
  ref,
) {
  const px = sizePx[size] || 24;

  if (mode === 'fullscreen') {
    return (
      <div
        ref={ref}
        className={`fixed inset-0 z-overlay bg-black/40 flex items-center justify-center ${className}`}
        {...props}
      >
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={px} className="animate-spin text-brand-primary" />
          {text && <p className="text-sm text-fg-secondary">{text}</p>}
        </div>
      </div>
    );
  }

  if (mode === 'inline') {
    return (
      <Loader2
        ref={ref}
        size={px}
        className={`animate-spin text-brand-primary ${className}`}
        {...props}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center py-12 gap-2 ${className}`}
      {...props}
    >
      <Loader2 size={px} className="animate-spin text-brand-primary" />
      {text && <p className="text-sm text-fg-secondary">{text}</p>}
    </div>
  );
});

export default Loading;
