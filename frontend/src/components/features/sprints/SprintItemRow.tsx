import { useState } from 'react';
import { Bot, Zap, CheckSquare, Bug, Check, Circle, Flag, GripVertical, Trash2, MoreHorizontal, Calendar } from 'lucide-react';
import { InlineEdit } from '../../common/InlineEdit';
import { ItemTypeBadge, ItemStatusBadge } from '../../common/ClickableBadge';
import type { SprintItem } from '../../../types';

interface SprintItemRowProps {
  item: SprintItem;
  onToggleComplete?: (id: string, completed: boolean) => void;
  onEdit?: (item: SprintItem) => void;
  onInlineUpdate?: (id: string, data: Partial<SprintItem>) => Promise<void>;
  onDelete?: (id: string) => void;
  dragHandleProps?: Record<string, unknown>;
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

// Format date range and get color based on urgency
function getDateRangeInfo(startDate: string | null, endDate: string | null, status: string) {
  if ((!startDate && !endDate) || status === 'completed' || status === 'cancelled') return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(0, 0, 0, 0);

  // Format dates for display
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  let label = '';
  let colorClass = 'text-slate-500 bg-slate-100';
  let isOverdue = false;
  let isActive = false;

  if (start && end) {
    // Both dates set: show range
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    if (startMonth === endMonth) {
      // Same month: "Jan 15-20"
      label = `${startMonth} ${start.getDate()}-${end.getDate()}`;
    } else {
      // Different months: "Jan 15 → Feb 2"
      label = `${formatDate(start)} → ${formatDate(end)}`;
    }

    // Color logic
    if (today > end) {
      colorClass = 'text-red-600 bg-red-100'; // Past end date
      isOverdue = true;
    } else if (today >= start && today <= end) {
      // Currently in range
      const daysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 2) {
        colorClass = 'text-amber-600 bg-amber-100'; // Ending soon
      } else {
        colorClass = 'text-blue-600 bg-blue-100'; // Active
      }
      isActive = true;
    } else {
      // Future (before start)
      colorClass = 'text-slate-500 bg-slate-100';
    }
  } else if (start && !end) {
    // Only start date
    label = `From ${formatDate(start)}`;
    if (today >= start) {
      colorClass = 'text-blue-600 bg-blue-100'; // Active (started)
      isActive = true;
    }
  } else if (!start && end) {
    // Only end date (due date style)
    label = `Due ${formatDate(end)}`;
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      colorClass = 'text-red-600 bg-red-100';
      isOverdue = true;
    } else if (diffDays <= 3) {
      colorClass = 'text-amber-600 bg-amber-100';
    }
  }

  return { label, colorClass, isOverdue, isActive };
}

export function SprintItemRow({
  item,
  onToggleComplete,
  onEdit,
  onInlineUpdate,
  onDelete,
  dragHandleProps,
}: SprintItemRowProps) {
  const [showActions, setShowActions] = useState(false);
  const typeConfig = itemTypeConfig[item.item_type] || itemTypeConfig.task;
  const TypeIcon = typeConfig.icon;
  const status = statusConfig[item.status] || statusConfig.planned;
  const isCompleted = item.status === 'completed';
  const isCancelled = item.status === 'cancelled';

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleComplete && !isCancelled) {
      onToggleComplete(item.id, !isCompleted);
    }
  };

  const handleRowClick = () => {
    if (onEdit) {
      onEdit(item);
    }
  };

  // Inline update handlers
  const handleNameUpdate = async (value: string) => {
    if (onInlineUpdate && value !== item.name) {
      await onInlineUpdate(item.id, { name: value });
    }
  };

  const handleTypeUpdate = async (type: SprintItem['item_type']) => {
    if (onInlineUpdate && type !== item.item_type) {
      await onInlineUpdate(item.id, { item_type: type });
    }
  };

  const handleStatusUpdate = async (newStatus: SprintItem['status']) => {
    if (onInlineUpdate && newStatus !== item.status) {
      await onInlineUpdate(item.id, { status: newStatus });
    }
  };

  return (
    <div
      className={`
        group/row flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all
        ${status.bg} hover:bg-slate-100
        ${isCancelled ? 'opacity-50' : ''}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Drag Handle */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-0.5 -ml-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Checkbox */}
      <button
        type="button"
        onClick={handleCheckboxClick}
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
          <Circle className="w-3 h-3 text-slate-300 opacity-0 group-hover/row:opacity-100" />
        )}
      </button>

      {/* Item Type Badge - Clickable if inline update available */}
      {onInlineUpdate ? (
        <ItemTypeBadge
          type={item.item_type}
          onChange={handleTypeUpdate}
        />
      ) : (
        <span className={`
          flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
          ${typeConfig.bg} ${typeConfig.text}
        `}>
          <TypeIcon className="w-3 h-3" />
          {typeConfig.label}
        </span>
      )}

      {/* Item Name - Inline Editable */}
      {onInlineUpdate ? (
        <div className="flex-grow min-w-0" onClick={(e) => e.stopPropagation()}>
          <InlineEdit
            value={item.name}
            onSave={handleNameUpdate}
            placeholder="Item name..."
            className={`
              text-sm font-medium
              ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}
              ${isCancelled ? 'line-through' : ''}
            `}
            showEditIcon={false}
          />
        </div>
      ) : (
        <span
          className={`
            flex-grow text-sm font-medium cursor-pointer
            ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}
            ${isCancelled ? 'line-through' : ''}
          `}
          onClick={handleRowClick}
        >
          {item.name}
        </span>
      )}

      {/* Item Code */}
      <span className="flex-shrink-0 text-xs text-slate-400 font-mono">
        {item.item_code}
      </span>

      {/* Date Range Badge */}
      {(() => {
        const dateInfo = getDateRangeInfo(item.start_date, item.end_date, item.status);
        if (!dateInfo) return null;
        return (
          <span className={`
            flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
            ${dateInfo.colorClass}
          `}>
            <Calendar className="w-3 h-3" />
            {dateInfo.isOverdue ? 'Overdue' : dateInfo.label}
          </span>
        );
      })()}

      {/* Status Badge - Clickable or static indicator */}
      {onInlineUpdate ? (
        <div onClick={(e) => e.stopPropagation()}>
          <ItemStatusBadge
            status={item.status}
            onChange={handleStatusUpdate}
          />
        </div>
      ) : (
        <>
          {item.status === 'in_progress' && (
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          )}
          {item.status === 'blocked' && (
            <span className="flex-shrink-0 text-xs text-red-600 font-medium">
              Blocked
            </span>
          )}
        </>
      )}

      {/* Quick Actions - shown on hover */}
      <div className={`
        flex items-center gap-1 flex-shrink-0 transition-opacity
        ${showActions ? 'opacity-100' : 'opacity-0'}
      `}>
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
            title="Edit Item"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
