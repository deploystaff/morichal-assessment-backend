import { useState } from 'react';
import { Pencil, Trash2, Circle, Flag, Clock } from 'lucide-react';
import type { DeliveryMilestone } from '../../../types';

interface DeliveryMilestoneNodeProps {
  milestone: DeliveryMilestone;
  position: number;
  endPosition: number;
  isPeriod: boolean;
  index: number;
  onUpdate: (id: string, data: Partial<DeliveryMilestone>) => Promise<void>;
  onEdit: (milestone: DeliveryMilestone) => void;
  onDelete: (id: string) => void;
}

const STATUS_COLORS = {
  upcoming: { bg: 'bg-slate-400', text: 'text-slate-600', border: 'border-slate-400' },
  in_progress: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500' },
  completed: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-500' },
  delayed: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-500' },
};

const TYPE_ICONS = {
  deliverable: Flag,
  period: Clock,
  checkpoint: Circle,
};

export function DeliveryMilestoneNode({
  milestone,
  position,
  endPosition,
  isPeriod,
  index,
  onUpdate,
  onEdit,
  onDelete,
}: DeliveryMilestoneNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusColors = STATUS_COLORS[milestone.status];
  const Icon = TYPE_ICONS[milestone.milestone_type];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const cycleStatus = async () => {
    const statusOrder: DeliveryMilestone['status'][] = ['upcoming', 'in_progress', 'completed', 'delayed'];
    const currentIndex = statusOrder.indexOf(milestone.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    setIsUpdating(true);
    try {
      await onUpdate(milestone.id, { status: nextStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  // Stagger vertical position based on index to prevent overlap
  const verticalOffset = (index % 2 === 0) ? 0 : 60;

  if (isPeriod) {
    // Render as a bar spanning the date range
    const width = Math.max(5, endPosition - position);

    return (
      <div
        className="absolute"
        style={{
          left: `${position}%`,
          width: `${width}%`,
          top: `${verticalOffset}px`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Period bar */}
        <div
          className={`h-8 rounded-lg ${statusColors.bg} bg-opacity-20 border-2 ${statusColors.border} relative cursor-pointer transition-all ${
            isHovered ? 'scale-105 shadow-lg' : ''
          }`}
          onClick={cycleStatus}
        >
          {/* Progress fill for in_progress */}
          {milestone.status === 'in_progress' && (
            <div className={`absolute inset-0 ${statusColors.bg} opacity-30 rounded-lg animate-pulse`} />
          )}

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center px-2">
            <span className={`text-xs font-medium ${statusColors.text} truncate`}>
              {milestone.name}
            </span>
          </div>

          {/* Loading indicator */}
          {isUpdating && (
            <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Date labels */}
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-500">{formatDate(milestone.start_date)}</span>
          {milestone.end_date && (
            <span className="text-xs text-slate-500">{formatDate(milestone.end_date)}</span>
          )}
        </div>

        {/* Hover actions */}
        {isHovered && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-slate-200 p-1 z-30">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(milestone); }}
              className="p-1 hover:bg-slate-100 rounded"
              title="Edit"
            >
              <Pencil className="w-3 h-3 text-slate-600" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(milestone.id); }}
              className="p-1 hover:bg-red-100 rounded"
              title="Delete"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render as a point milestone
  return (
    <div
      className="absolute"
      style={{
        left: `${position}%`,
        transform: 'translateX(-50%)',
        top: `${verticalOffset}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Milestone node */}
      <div
        className={`relative cursor-pointer transition-all ${isHovered ? 'scale-110' : ''}`}
        onClick={cycleStatus}
      >
        {/* Circle node */}
        <div
          className={`w-10 h-10 rounded-full ${statusColors.bg} flex items-center justify-center shadow-lg border-2 border-white ${
            milestone.status === 'in_progress' ? 'animate-pulse' : ''
          }`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Loading indicator */}
        {isUpdating && (
          <div className="absolute inset-0 bg-white/50 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Connection line to timeline */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-300" style={{ bottom: '100%' }} />
      </div>

      {/* Label */}
      <div className="mt-2 text-center" style={{ width: '120px', marginLeft: '-40px' }}>
        <p className={`text-xs font-medium ${statusColors.text} line-clamp-2`}>
          {milestone.name}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {formatDate(milestone.start_date)}
        </p>
      </div>

      {/* Hover actions */}
      {isHovered && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-slate-200 p-1 z-30">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(milestone); }}
            className="p-1 hover:bg-slate-100 rounded"
            title="Edit"
          >
            <Pencil className="w-3 h-3 text-slate-600" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(milestone.id); }}
            className="p-1 hover:bg-red-100 rounded"
            title="Delete"
          >
            <Trash2 className="w-3 h-3 text-red-600" />
          </button>
        </div>
      )}

      {/* Hover tooltip with full details */}
      {isHovered && milestone.description && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-30 w-48">
          <p className="text-xs text-slate-600">{milestone.description}</p>
        </div>
      )}
    </div>
  );
}
