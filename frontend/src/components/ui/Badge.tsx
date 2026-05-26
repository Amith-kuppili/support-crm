import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'open' | 'in_progress' | 'closed' | 'low' | 'medium' | 'high';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-secondary text-secondary-foreground': variant === 'default',
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': variant === 'open',
          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': variant === 'in_progress',
          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400': variant === 'closed',
          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400': variant === 'low',
          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': variant === 'medium',
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': variant === 'high',
        },
        className
      )}
      {...props}
    />
  );
}
