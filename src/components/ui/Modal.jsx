'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, subtitle, icon: Icon = null, children, footer, width = 560 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in dark:bg-black/60"
      onMouseDown={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl animate-scale-in dark:border-gray-800 dark:bg-gray-900"
        style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-6 dark:border-gray-800">
          <div className="flex items-start gap-3">
            {Icon && (
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Icon size={18} strokeWidth={1.5} />
              </span>
            )}
            <div>
              {title && <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h3>}
              {subtitle && <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
            </div>
          </div>
          <button
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-all duration-150 hover:bg-gray-100 hover:text-gray-600 active:scale-95 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 p-4 dark:border-gray-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
