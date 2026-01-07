import { CheckCircle, Clock, Star, XCircle, Edit2, Plus, Trash2 } from 'lucide-react';
import { SprintProgressRing } from './SprintProgressRing';
import { SprintItemRow } from './SprintItemRow';
import type { Sprint, SprintItem } from '../../../types';

interface SprintMilestoneCardProps {
  sprint: Sprint;
  isCurrent: boolean;
  isLast: boolean;
  onEditSprint?: (sprint: Sprint) => void;
  onDeleteSprint?: (id: string) => void;
  onAddItem?: (sprintId: string) => void;
  onEditItem?: (item: SprintItem) => void;
  onToggleItemComplete?: (id: string, completed: boolean) => void;
}

const statusConfig = {
  delivered: {
    icon: CheckCircle,
    nodeColor: 'bg-emerald-500',
    borderColor: 'border-emerald-200',
    progressColor: 'emerald' as const,
    label: 'Delivered',
    labelBg: 'bg-emerald-100',
    labelText: 'text-emerald-700',
  },
  in_progress: {
    icon: Star,
    nodeColor: 'bg-blue-500',
    borderColor: 'border-blue-300',
    progressColor: 'blue' as const,
    label: 'In Progress',
    labelBg: 'bg-blue-100',
    labelText: 'text-blue-700',
  },
  planned: {
    icon: Clock,
    nodeColor: 'bg-slate-400',
    borderColor: 'border-slate-200',
    progressColor: 'slate' as const,
    label: 'Planned',
    labelBg: 'bg-slate-100',
    labelText: 'text-slate-600',
  },
  cancelled: {
    icon: XCircle,
    nodeColor: 'bg-red-400',
    borderColor: 'border-red-200',
    progressColor: 'slate' as const,
    label: 'Cancelled',
    labelBg: 'bg-red-100',
    labelText: 'text-red-600',
  },
};

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const year = endDate.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

export function SprintMilestoneCard({
  sprint,
  isCurrent,
  isLast,
  onEditSprint,
  onDeleteSprint,
  onAddItem,
  onEditItem,
  onToggleItemComplete,
}: SprintMilestoneCardProps) {
  const config = statusConfig[sprint.status] || statusConfig.planned;
  const StatusIcon = config.icon;

  return (
    <div className="relative flex">
      {/* Timeline Line & Node */}
      <div className="flex flex-col items-center mr-6">
        {/* Node */}
        <div
          className={`
            relative z-10 flex items-center justify-center w-10 h-10 rounded-full
            ${config.nodeColor} text-white shadow-lg
            ${isCurrent ? 'ring-4 ring-blue-200 animate-pulse' : ''}
          `}
        >
          <StatusIcon className="w-5 h-5" />
        </div>
        {/* Line */}
        {!isLast && (
          <div className="w-1 flex-grow bg-gradient-to-b from-primary to-teal-400 min-h-[100px]" />
        )}
      </div>

      {/* Card */}
      <div
        className={`
          flex-grow mb-6 bg-white rounded-2xl border-2 shadow-lg
          transition-all duration-300 hover:shadow-xl
          ${config.borderColor}
          ${isCurrent ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              {/* Sprint Code & Status */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-primary">
                  {sprint.sprint_code}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.labelBg} ${config.labelText}`}>
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </span>
                {isCurrent && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500 text-white animate-pulse">
                    CURRENT
                  </span>
                )}
              </div>
              {/* Sprint Name */}
              <h3 className="text-xl font-bold text-slate-800 mb-1">
                {sprint.name}
              </h3>
              {/* Date Range */}
              <p className="text-sm text-slate-500">
                {formatDateRange(sprint.start_date, sprint.end_date)}
              </p>
              {/* Description */}
              {sprint.description && (
                <p className="mt-2 text-sm text-slate-600">
                  {sprint.description}
                </p>
              )}
            </div>

            {/* Progress Ring */}
            <div className="flex-shrink-0 ml-4">
              <SprintProgressRing
                progress={sprint.progress}
                size={72}
                strokeWidth={8}
                color={config.progressColor}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{sprint.completed_items} of {sprint.total_items} items</span>
              <span>{sprint.progress}% complete</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  sprint.status === 'delivered' ? 'bg-emerald-500' :
                  sprint.status === 'in_progress' ? 'bg-blue-500' :
                  'bg-slate-400'
                }`}
                style={{ width: `${sprint.progress}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEditSprint && (
              <button
                onClick={() => onEditSprint(sprint)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Edit Sprint
              </button>
            )}
            {onAddItem && (
              <button
                onClick={() => onAddItem(sprint.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Item
              </button>
            )}
            {onDeleteSprint && sprint.items.length === 0 && (
              <button
                onClick={() => onDeleteSprint(sprint.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Items List - Always Expanded */}
        {sprint.items && sprint.items.length > 0 && (
          <div className="p-4 space-y-1">
            {sprint.items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <SprintItemRow
                  key={item.id}
                  item={item}
                  onEdit={onEditItem}
                  onToggleComplete={onToggleItemComplete}
                />
              ))}
          </div>
        )}

        {/* Empty State */}
        {(!sprint.items || sprint.items.length === 0) && (
          <div className="p-6 text-center">
            <p className="text-sm text-slate-400">No items in this sprint</p>
            {onAddItem && (
              <button
                onClick={() => onAddItem(sprint.id)}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add first item
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
