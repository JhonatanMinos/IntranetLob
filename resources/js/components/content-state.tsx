import type { LucideIcon } from 'lucide-react';
import { Inbox, LoaderCircle, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ContentStateVariant = 'empty' | 'loading' | 'error';

interface ContentStateProps {
  variant?: ContentStateVariant;
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

const defaultIcons: Record<ContentStateVariant, LucideIcon> = {
  empty: Inbox,
  loading: LoaderCircle,
  error: TriangleAlert,
};

export function ContentState({
  variant = 'empty',
  title,
  description,
  icon,
  action,
  className,
}: ContentStateProps) {
  const Icon = icon ?? defaultIcons[variant];

  return (
    <div
      className={cn(
        'flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center',
        className
      )}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <span
        className={cn(
          'flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground',
          variant === 'error' && 'bg-destructive/10 text-destructive'
        )}
      >
        <Icon className={cn('size-5', variant === 'loading' && 'animate-spin')} />
      </span>
      <div className="max-w-md space-y-1">
        <p className="font-medium">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
