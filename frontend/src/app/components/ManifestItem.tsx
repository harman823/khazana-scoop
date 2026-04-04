import { cn } from './Button';

export function ManifestItem({
  title,
  subtitle,
  price,
  meta,
  onClick,
  active
}: {
  title: string;
  subtitle?: string;
  price?: string;
  meta?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between p-6 transition-colors duration-200",
        onClick && "cursor-pointer hover:bg-surface-container",
        active ? "bg-surface-container" : "bg-transparent"
      )}
    >
      <div>
        <h3 className="font-display text-2xl font-bold tracking-tight text-on-surface">{title}</h3>
        {subtitle && <p className="font-body text-on-surface-variant mt-1">{subtitle}</p>}
      </div>
      <div className="text-right flex flex-col items-end">
        {price && <span className="font-mono text-sm text-on-surface uppercase tracking-widest">{price}</span>}
        {meta && <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mt-1">{meta}</span>}
      </div>
    </div>
  );
}
