import { Loader2 } from 'lucide-react';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950';

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

const VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
  outline:
    'border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20',
  success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as = 'button',
  loading = false,
  icon: Icon = null,
  iconRight: IconRight = null,
  className = '',
  ...props
}) {
  const Comp = as;
  const cls = [BASE, SIZES[size], VARIANTS[variant], className].filter(Boolean).join(' ');
  return (
    <Comp className={cls} {...props}>
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : 16} strokeWidth={1.5} className="animate-spin" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={1.5} />
      )}
      {children}
      {!loading && IconRight && <IconRight size={size === 'sm' ? 14 : 16} strokeWidth={1.5} />}
    </Comp>
  );
}
