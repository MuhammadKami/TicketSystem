export default function GlassCard({
  children,
  className = '',
  hover = false,
  glow = false,
  as = 'div',
  ...props
}) {
  const Comp = as;
  const cls = [
    'rounded-xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg dark:bg-gray-900/50 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-xl',
    hover ? 'transition-all duration-150 hover:shadow-xl hover:-translate-y-0.5' : '',
    glow ? 'ring-1 ring-blue-500/20' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <Comp className={cls} {...props}>
      {children}
    </Comp>
  );
}
