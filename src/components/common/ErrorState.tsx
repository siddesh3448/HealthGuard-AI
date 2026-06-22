import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while processing your request.',
  onRetry,
  retryLabel = 'Try Again',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-brand-danger-50/25 dark:bg-brand-danger-50/5 border border-brand-danger-500/10 rounded-2xl">
      <div className="flex items-center justify-center text-brand-danger-500 mb-4 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-brand-danger-500/10">
        <AlertTriangle size={32} />
      </div>
      
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
        {title}
      </h3>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5">
        {message}
      </p>
      
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry} className="bg-brand-danger-500 hover:bg-brand-danger-600 active:bg-brand-danger-700">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
