import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const tileSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-sm gap-1',
    md: 'text-lg gap-1.5',
    lg: 'text-2xl gap-2',
  };

  return (
    <div className={`flex items-center select-none ${textSizes[size]}`}>
      {/* Icon Tile */}
      <div className={`flex items-center justify-center bg-brand-primary-500 text-white shadow-sm shrink-0 ${tileSizes[size]}`}>
        <ShieldCheck size={iconSizes[size]} strokeWidth={2.5} className="text-white" />
      </div>

      {/* Brand Name Text */}
      {showText && (
        <span className="flex items-center text-slate-800 dark:text-slate-100 uppercase tracking-tight">
          <span className="font-bold">HealthGuard</span>
          <span className="font-light text-brand-primary-500 ml-0.5">AI</span>
        </span>
      )}
    </div>
  );
}
export default Logo;
