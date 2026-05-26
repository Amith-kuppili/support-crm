import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <p className={cn('text-sm text-destructive', className)}>{message}</p>
  );
}
