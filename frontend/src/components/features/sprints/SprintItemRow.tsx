import { Bot, Zap, CheckSquare, Bug, Check, Circle, Flag } from 'lucide-react';
import type { SprintItem } from '../../../types';

interface SprintItemRowProps {
  item: SprintItem;
  onToggleComplete?: (id: string, completed: boolean) => void;
  onEdit?: (item: SprintItem) => void;
}

const itemTypeConfig = {
  agent: { icon: Bot, bg: 'bg-blue-100', text: 'text-blue-700', label: 'Agent' },
  feature: { icon: Zap, bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Feature' },
  task: { icon: CheckSquare, bg: 'bg-slate-100', text: 'text-slate-600', label: 'Task' },
  bugfix: { icon: Bug, bg: 'bg-amber-100', text: 'text-amber-700', label: 'Bugfix' },
  milestone: { icon: Flag, bg: 'bg-purple-100', text: 'text-purple-700', label: 'Milestone' },
};

const statusConfig = {
  planned: { color: 'text-slate-400', bg: 'bg-slate-50' },
  in_progress: { color: 'text-blue-500', bg: 'bg-blue-50' },
  completed: { color: 'text-emerald-500', bg: 'bg-emerald-50' },
  blocked: { color: 'text-red-500', bg: 'bg-red-50' },
  cancelled: { color: 'text-slate-300', bg: 'bg-slate-50' },
};

export function SprintItemRow({ item, onToggleComplete, onEdit }: SprintItemRowProps) {
  const typeConfig = itemTypeConfig[item.item_type] || itemTypeConfig.task;
  const TypeIcon = typeConfig.icon;
  const status = statusConfig[item.status] || statusConfig.planned;
  const isCompleted = item.status === 'completed';
  const isCancelled = item.status === 'cancelled';

  const handleCheckboxClick = () => {
    if (onToggleComplete && !isCancelled) {
      onToggleComplete(item.id, !isCompleted);
    }
  };

  const handleRowClick = () => {
    if (onEdit) {
      onEdit(item);
    }
  };

  return (
    <div
      className={`
        group flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all
        ${status.bg} hover:bg-slate-100
        ${isCancelled ? 'opacity-50' : ''}
        ${onEdit ? 'cursor-pointer' : ''}
      `}
      onClick={handleRowClick}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleCheckboxClick();
        }}
        disabled={isCancelled}
        className={`
          flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-all duration-200
          ${isCompleted
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-slate-300 hover:border-emerald-400'
          }
          ${isCancelled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isCompleted ? (
          <Check className="w-3 h-3" />
        ) : (
          <Circle className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" />
        )}
      </button>

      {/* Item Type Badge */}
      <span className={`
        flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
        ${typeConfig.bg} ${typeConfig.text}
      `}>
        <TypeIcon className="w-3 h-3" />
        {typeConfig.label}
      </span>

      {/* Item Name */}
      <span className={`
        flex-grow text-sm font-medium
        ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}
        ${isCancelled ? 'line-through' : ''}
      `}>
        {item.name}
      </span>

      {/* Item Code */}
      <span className="flex-shrink-0 text-xs text-slate-400 font-mono">
        {item.item_code}
      </span>

      {/* Status Indicator */}
      {item.status === 'in_progress' && (
        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
      )}
      {item.status === 'blocked' && (
        <span className="flex-shrink-0 text-xs text-red-600 font-medium">
          Blocked
        </span>
      )}
    </div>
  );
}
