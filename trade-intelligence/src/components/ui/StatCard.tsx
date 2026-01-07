import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ value, label, description, icon, className = '' }: StatCardProps) {
  return (
    <div className={`text-center ${className}`}>
      {icon && (
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
          {icon}
        </div>
      )}
      <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">{value}</div>
      <div className="text-lg font-semibold text-slate-700 mb-1">{label}</div>
      {description && (
        <div className="text-sm text-slate-500">{description}</div>
      )}
    </div>
  );
}

interface MiniStatProps {
  value: string;
  label: string;
  className?: string;
}

export function MiniStat({ value, label, className = '' }: MiniStatProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-2xl font-bold text-primary">{value}</span>
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}
