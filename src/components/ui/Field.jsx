'use client';

import { AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

export function Field({ label, hint, error, success, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle size={13} strokeWidth={1.5} />
          {error}
        </span>
      ) : success ? (
        <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <CheckCircle2 size={13} strokeWidth={1.5} />
          {success}
        </span>
      ) : (
        hint && <span className="text-xs text-gray-400 dark:text-gray-500">{hint}</span>
      )}
    </div>
  );
}

export function Input({ icon: Icon = null, error = false, className = '', ...props }) {
  const base = `input ${error ? '!border-red-300 focus:!ring-red-500 dark:!border-red-500/50' : ''} ${className}`;
  if (!Icon) return <input className={base} {...props} />;
  return (
    <div className="relative">
      <Icon
        size={16}
        strokeWidth={1.5}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input className={`input input-icon ${error ? '!border-red-300 focus:!ring-red-500 dark:!border-red-500/50' : ''} ${className}`} {...props} />
    </div>
  );
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`input min-h-[120px] resize-y leading-relaxed ${className}`} {...props} />;
}

export function Select({ children, className = '', ...props }) {
  return (
    <div className="relative">
      <select className={`input cursor-pointer appearance-none pr-8 ${className}`} {...props}>
        {children}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={1.5}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

export function Toggle({ checked, onChange, label, description, icon: Icon = null }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 text-left transition-all duration-150 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
      onClick={() => onChange(!checked)}
    >
      <span className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <Icon size={16} strokeWidth={1.5} />
          </span>
        )}
        <span className="flex flex-col">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
          {description && <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>}
        </span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </span>
    </button>
  );
}

export function Slider({ value, min = 0, max = 1, step = 0.01, onChange, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-4">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-blue flex-1"
        style={{ background: `linear-gradient(90deg, #2563eb ${pct}%, rgb(229 231 235) ${pct}%)` }}
      />
      <span className="min-w-[52px] text-right text-sm font-semibold tabular-nums text-blue-600 dark:text-blue-400">
        {format ? format(value) : value}
      </span>
    </div>
  );
}
