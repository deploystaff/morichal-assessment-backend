import { useState, type ReactNode } from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { Button } from '../../common';

interface PresentationSectionProps {
  id: string;
  number: number;
  title: string;
  icon: React.ElementType;
  children: ReactNode;
  defaultExpanded?: boolean;
  statusSummary?: ReactNode;
  badgeCount?: number;
  badgeVariant?: 'default' | 'attention' | 'success';
  onAddItem?: () => void;
  addLabel?: string;
}

export function PresentationSection({
  id,
  number,
  title,
  icon: Icon,
  children,
  defaultExpanded = true,
  statusSummary,
  badgeCount,
  badgeVariant = 'default',
  onAddItem,
  addLabel = 'Add Item',
}: PresentationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const badgeColors = {
    default: 'bg-slate-100 text-slate-700',
    attention: 'bg-amber-100 text-amber-700',
    success: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <section id={id} className="scroll-mt-36">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Section Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            {/* Number Circle */}
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {number}
            </span>

            {/* Icon + Title */}
            <div className="flex items-center gap-3">
              <Icon className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            </div>

            {/* Badge Count */}
            {badgeCount !== undefined && badgeCount > 0 && (
              <span className={`px-2.5 py-1 text-sm font-medium rounded-full ${badgeColors[badgeVariant]}`}>
                {badgeCount}
              </span>
            )}

            {/* Status Summary */}
            {statusSummary && (
              <div className="text-sm">
                {statusSummary}
              </div>
            )}
          </div>

          {/* Expand/Collapse */}
          <div className="flex items-center gap-3">
            {onAddItem && isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddItem();
                }}
                className="text-primary hover:text-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-1" />
                {addLabel}
              </Button>
            )}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </button>

        {/* Section Content */}
        {isExpanded && (
          <div className="px-6 pb-6 animate-fade-in">
            <div className="border-t border-slate-100 pt-4">
              {children}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
