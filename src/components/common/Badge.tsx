import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'info' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const styles = {
    success: 'bg-brand-primary-50 text-brand-primary-700 dark:bg-brand-primary-50/10 dark:text-brand-primary-100 border border-brand-primary-500/20',
    info: 'bg-brand-secondary-50 text-brand-secondary-700 dark:bg-brand-secondary-50/10 dark:text-brand-secondary-100 border border-brand-secondary-500/20',
    warning: 'bg-brand-warning-50 text-brand-warning-600 dark:bg-brand-warning-50/10 dark:text-brand-warning-500 border border-brand-warning-500/20',
    danger: 'bg-brand-danger-50 text-brand-danger-600 dark:bg-brand-danger-50/10 dark:text-brand-danger-500 border border-brand-danger-500/20',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-205 dark:border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full select-none ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
