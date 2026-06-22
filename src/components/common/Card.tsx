import React, { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  key?: any;
}

export function Card({ children, className = '', padded = true, ...props }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md transition-all duration-200 rounded-2xl ${
        padded ? 'p-6' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
