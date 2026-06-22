import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export function LoadingState({
  message = 'Retrieving data...',
  size = 'md',
  fullHeight = false,
}: LoadingStateProps) {
  const iconSizes = {
    sm: 18,
    md: 28,
    lg: 40,
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center ${
        fullHeight ? 'min-h-[300px]' : ''
      }`}
    >
      <Loader2
        size={iconSizes[size]}
        className="animate-spin text-brand-primary-500 mb-3"
      />
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {message}
      </span>
    </div>
  );
}

export default LoadingState;
