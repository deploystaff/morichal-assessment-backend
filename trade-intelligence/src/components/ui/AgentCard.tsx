import React from 'react';

interface AgentCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  impact?: string;
  number: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AgentCard({ icon, name, description, impact, number, className = '', style }: AgentCardProps) {
  return (
    <div
      className={`
        group relative bg-white rounded-2xl border border-slate-200 p-6
        hover:shadow-xl hover:border-primary/30 hover:-translate-y-1
        transition-all duration-300
        ${className}
      `}
      style={style}
    >
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shadow-lg">
        {number}
      </div>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
          {impact && (
            <p className="text-xs text-primary font-medium mt-2 pt-2 border-t border-slate-100">
              {impact}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
