import type { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Map status strings to badge variants
const statusVariantMap: Record<string, BadgeVariant> = {
  pending: 'warning',
  answered: 'success',
  completed: 'success',
  in_progress: 'info',
  'in-progress': 'info',
  scheduled: 'default',
  cancelled: 'danger',
  confirmed: 'success',
  draft: 'default',
  deprecated: 'danger',
  approved: 'success',
  rejected: 'danger',
  deferred: 'default',
  'needs-follow-up': 'warning',
};

const priorityVariantMap: Record<string, BadgeVariant> = {
  critical: 'danger',
  high: 'danger',
  medium: 'warning',
  low: 'default',
};

export function StatusBadge({ status }: { status: string }) {
  const variant = statusVariantMap[status] || 'default';
  const label = status.replace(/_/g, ' ').replace(/-/g, ' ');
  return <Badge variant={variant}>{label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const variant = priorityVariantMap[priority] || 'default';
  return <Badge variant={variant}>{priority}</Badge>;
}
