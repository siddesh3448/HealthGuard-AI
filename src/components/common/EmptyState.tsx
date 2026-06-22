import { ComponentType } from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No Items Found',
  message,
  icon: IconComponent = PackageOpen,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
        <IconComponent size={32} />
      </div>
      
      {title && (
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
          {title}
        </h3>
      )}
      
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
