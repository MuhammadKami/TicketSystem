'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Info, Sparkles, Zap, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

const CONFIG = {
  success: { Icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bar: 'bg-green-500' },
  error: { Icon: XCircle, color: 'text-red-600 dark:text-red-400', bar: 'bg-red-500' },
  info: { Icon: Info, color: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' },
  ai: { Icon: Sparkles, color: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' },
  escalate: { Icon: Zap, color: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = 'info', title, message, duration = 3600 }) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const api = {
    toast,
    success: (title, message) => toast({ type: 'success', title, message }),
    error: (title, message) => toast({ type: 'error', title, message }),
    info: (title, message) => toast({ type: 'info', title, message }),
    ai: (title, message) => toast({ type: 'ai', title, message }),
    escalate: (title, message) => toast({ type: 'escalate', title, message }),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[200] flex w-full max-w-sm flex-col gap-3 max-sm:left-4 max-sm:right-4 max-sm:bottom-20 max-sm:max-w-none">
        {toasts.map((t) => {
          const { Icon, color, bar } = CONFIG[t.type] || CONFIG.info;
          return (
            <div
              key={t.id}
              className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-lg animate-toast-in dark:border-gray-800 dark:bg-gray-900"
            >
              <span className={`mt-0.5 shrink-0 ${color}`}>
                <Icon size={18} strokeWidth={1.5} />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.title}</span>
                {t.message && <span className="text-xs text-gray-500 dark:text-gray-400">{t.message}</span>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-auto shrink-0 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Dismiss"
              >
                <X size={15} strokeWidth={1.5} />
              </button>
              <span className={`absolute bottom-0 left-0 h-0.5 w-full origin-left animate-bar-shrink ${bar}`} />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
