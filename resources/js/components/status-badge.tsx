import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva('border font-medium', {
  variants: {
    tone: {
      neutral: 'border-border bg-muted text-muted-foreground',
      info: 'border-info/20 bg-info/10 text-info-foreground',
      success: 'border-success/20 bg-success/10 text-success-foreground',
      warning: 'border-warning/20 bg-warning/10 text-warning-foreground',
      danger: 'border-destructive/20 bg-destructive/10 text-destructive',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export function StatusBadge({
  tone,
  children,
  className,
}: VariantProps<typeof statusBadgeVariants> & { children: ReactNode; className?: string }) {
  return (
    <Badge variant="outline" className={cn(statusBadgeVariants({ tone }), className)}>
      {children}
    </Badge>
  );
}
