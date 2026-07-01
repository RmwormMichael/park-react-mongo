import React, { forwardRef, useRef, useEffect, useCallback, useId, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import IconButton from './IconButton';

const easingEntrance = [0, 0, 0.2, 1];
const easingExit = [0.4, 0, 1, 1];

const overlayTransition = {
  enter: { duration: 0.3, ease: easingEntrance },
  exit: { duration: 0.2, ease: easingExit },
};

const panelTransition = {
  enter: { duration: 0.3, ease: easingEntrance },
  exit: { duration: 0.2, ease: easingExit },
};

const sizeWidth = {
  sm: 400,
  md: 480,
  lg: 640,
  xl: 800,
  full: '90vw',
};

const ModalContext = createContext(null);

function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('Modal sub-components must be used within <Modal>');
  return ctx;
}

let scrollLockCount = 0;
let originalBodyOverflow = '';

function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    if (scrollLockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    scrollLockCount++;
    return () => {
      scrollLockCount--;
      if (scrollLockCount <= 0) {
        document.body.style.overflow = originalBodyOverflow;
        scrollLockCount = 0;
      }
    };
  }, [active]);
}

const FOCUSABLE = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"]), [contenteditable]';

function getFocusable(container) {
  if (!container) return [];
  const nodes = container.querySelectorAll(FOCUSABLE);
  return Array.from(nodes).filter((el) => !el.disabled && el.offsetParent !== null);
}

function useFocusTrap(containerRef, active) {
  const prevRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    prevRef.current = document.activeElement;
    const first = getFocusable(containerRef.current)[0];
    if (first) first.focus();

    const handler = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable(containerRef.current);
      if (focusable.length < 2) { e.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      if (prevRef.current && typeof prevRef.current.focus === 'function') {
        prevRef.current.focus();
      }
    };
  }, [active, containerRef]);
}

function ModalHeader({ children, showCloseButton = true, className = '', ...props }) {
  const { onClose, titleId } = useModalContext();
  return (
    <div
      className={`px-6 pt-6 pb-0 flex items-start justify-between gap-4 ${className}`}
      {...props}
    >
      <div id={titleId} className="text-xl font-semibold text-fg-primary flex-1">
        {children}
      </div>
      {showCloseButton && onClose && (
        <IconButton
          icon={X}
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Cerrar"
          className="flex-shrink-0"
        />
      )}
    </div>
  );
}

function ModalContent({ children, className = '', ...props }) {
  return (
    <div
      className={`px-6 py-4 overflow-y-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function ModalFooter({ children, className = '', ...props }) {
  return (
    <div
      className={`px-6 pb-6 pt-4 border-t border-default flex items-center justify-end gap-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

const Modal = forwardRef(function Modal(
  {
    open = false,
    onClose,
    size = 'md',
    closeOnOverlay = true,
    closeOnEscape = true,
    disableFocusTrap = false,
    description,
    children,
    className = '',
    ...props
  },
  ref,
) {
  const panelRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  useScrollLock(open);
  useFocusTrap(disableFocusTrap ? null : panelRef, open);

  const handleOverlayClick = useCallback(
    (e) => {
      if (closeOnOverlay && e.target === e.currentTarget) onClose?.();
    },
    [closeOnOverlay, onClose],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (closeOnEscape && e.key === 'Escape') onClose?.();
    },
    [closeOnEscape, onClose],
  );

  const contextValue = { onClose, titleId };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 z-overlay flex items-center justify-center p-4 bg-black/40"
          initial="exit"
          animate="enter"
          exit="exit"
          variants={{
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
          transition={overlayTransition}
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            ref={(node) => {
              panelRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            key="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            className={`bg-surface-primary rounded-xl shadow-token-lg w-full flex flex-col max-h-[85vh] ${className}`}
            style={{ maxWidth: sizeWidth[size] || sizeWidth.md }}
            variants={{
              enter: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.95 },
            }}
            transition={panelTransition}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            <ModalContext.Provider value={contextValue}>
              {description && (
                <p id={descId} className="sr-only">
                  {description}
                </p>
              )}
              {children}
            </ModalContext.Provider>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
});

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
