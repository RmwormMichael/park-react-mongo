import React, { createContext, useContext, useReducer, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const MAX_VISIBLE_TOASTS = 3;
const DEFAULT_DURATION = 4000;

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const borderColors = {
  success: 'border-l-success',
  error: 'border-l-error',
  warning: 'border-l-warning',
  info: 'border-l-info',
};

const iconColors = {
  success: 'text-success',
  error: 'text-error',
  warning: 'text-warning',
  info: 'text-info',
};

let toastId = 0;
function nextId() {
  return ++toastId;
}

const ToastContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TOAST': {
      const toast = { ...action.payload };
      if (state.toasts.length < MAX_VISIBLE_TOASTS) {
        return { ...state, toasts: [...state.toasts, toast] };
      }
      return { ...state, queue: [...state.queue, toast] };
    }
    case 'REMOVE_TOAST': {
      const toasts = state.toasts.filter(t => t.id !== action.id);
      const queue = [...state.queue];
      if (queue.length > 0 && toasts.length < MAX_VISIBLE_TOASTS) {
        toasts.push(queue.shift());
      }
      return { toasts, queue };
    }
    case 'CLEAR_ALL':
      return { toasts: [], queue: [] };
    default:
      return state;
  }
}

export function ToastProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { toasts: [], queue: [] });
  const timers = useRef(new Map());

  function clearTimer(id) {
    const existing = timers.current.get(id);
    if (existing) {
      clearTimeout(existing);
      timers.current.delete(id);
    }
  }

  function startTimer(id, duration) {
    clearTimer(id);
    if (duration > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', id });
        timers.current.delete(id);
      }, duration);
      timers.current.set(id, timer);
    }
  }

  const toast = useCallback((options) => {
    const id = nextId();
    const newToast = {
      id,
      title: options.title,
      description: options.description || '',
      variant: options.variant || 'info',
      duration: options.duration !== undefined ? options.duration : DEFAULT_DURATION,
      closable: options.closable !== undefined ? options.closable : true,
    };
    dispatch({ type: 'ADD_TOAST', payload: newToast });
    if (newToast.duration > 0) {
      startTimer(id, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    clearTimer(id);
    dispatch({ type: 'REMOVE_TOAST', id });
  }, []);

  function handlePause(id) {
    clearTimer(id);
  }

  function handleResume(id, duration) {
    if (duration > 0) {
      startTimer(id, duration);
    }
  }

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-toast flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {state.toasts.map(t => (
            <ToastItem
              key={t.id}
              toast={t}
              onClose={() => removeToast(t.id)}
              onPause={() => handlePause(t.id)}
              onResume={() => handleResume(t.id, t.duration)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose, onPause, onResume }) {
  const Icon = iconMap[toast.variant] || Info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`pointer-events-auto w-full max-w-sm bg-surface-primary shadow-token-lg rounded-xl border-l-4 ${borderColors[toast.variant]} p-4 flex gap-3 items-start`}
    >
      <Icon size={20} className={`flex-shrink-0 mt-0.5 ${iconColors[toast.variant]}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-fg-primary">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-fg-secondary mt-1">{toast.description}</p>
        )}
      </div>
      {toast.closable && (
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 text-fg-tertiary hover:text-fg-primary transition-colors"
          aria-label="Cerrar notificación"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
}
