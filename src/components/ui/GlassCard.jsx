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
    'card',
    hover ? 'transition-all duration-150 hover:shadow-md hover:-translate-y-0.5' : '',
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
