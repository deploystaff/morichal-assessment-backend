import { useMemo } from 'react';
import { CheckCircle, PlayCircle, Clock, Calendar } from 'lucide-react';
import type { Sprint } from '../../../types';

interface SprintTimelineProps {
  sprints: Sprint[];
  currentSprintId?: string;
}

export function SprintTimeline({ sprints, currentSprintId }: SprintTimelineProps) {
  // Calculate timeline range
  const timelineData = useMemo(() => {
    if (sprints.length === 0) return null;

    const startDates = sprints.map((s) => new Date(s.start_date));
    const endDates = sprints.map((s) => new Date(s.end_date));

    const minDate = new Date(Math.min(...startDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...endDates.map((d) => d.getTime())));

    // Extend range slightly for visual padding
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 14);

    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    // Generate month markers
    const months: { label: string; position: number }[] = [];
    const current = new Date(minDate);
    current.setDate(1);
    if (current < minDate) current.setMonth(current.getMonth() + 1);

    while (current <= maxDate) {
      const dayOffset = Math.ceil((current.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
      const position = (dayOffset / totalDays) * 100;
      months.push({
        label: current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        position,
      });
      current.setMonth(current.getMonth() + 1);
    }

    // Today marker
    const today = new Date();
    const todayOffset = Math.ceil((today.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const todayPosition = Math.max(0, Math.min(100, (todayOffset / totalDays) * 100));

    return { minDate, maxDate, totalDays, months, todayPosition };
  }, [sprints]);

  const getSprintPosition = (sprint: Sprint) => {
    if (!timelineData) return { left: 0, width: 0 };

    const start = new Date(sprint.start_date);
    const end = new Date(sprint.end_date);

    const startOffset = Math.ceil((start.getTime() - timelineData.minDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return {
      left: (startOffset / timelineData.totalDays) * 100,
      width: (duration / timelineData.totalDays) * 100,
    };
  };

  const getStatusConfig = (status: Sprint['status']) => {
    switch (status) {
      case 'delivered':
        return {
          bg: 'bg-emerald-500',
          icon: CheckCircle,
          label: 'Delivered',
          progressBg: 'bg-emerald-300',
        };
      case 'in_progress':
        return {
          bg: 'bg-blue-500',
          icon: PlayCircle,
          label: 'In Progress',
          progressBg: 'bg-blue-300',
          pulse: true,
        };
      case 'planned':
        return {
          bg: 'bg-slate-400',
          icon: Clock,
          label: 'Planned',
          progressBg: 'bg-slate-300',
        };
      case 'cancelled':
        return {
          bg: 'bg-red-400 opacity-60',
          icon: Calendar,
          label: 'Cancelled',
          progressBg: 'bg-red-300',
        };
    }
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  if (!timelineData || sprints.length === 0) {
    return (
      <div className="bg-slate-100 rounded-lg p-8 text-center text-slate-500">
        No sprints to display
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header with month markers */}
      <div className="relative h-10 bg-slate-50 border-b border-slate-200">
        {timelineData.months.map((month, idx) => (
          <div
            key={idx}
            className="absolute top-0 h-full flex items-center"
            style={{ left: `${month.position}%` }}
          >
            <div className="w-px h-full bg-slate-200" />
            <span className="ml-2 text-xs font-medium text-slate-500 whitespace-nowrap">
              {month.label}
            </span>
          </div>
        ))}
      </div>

      {/* Sprint rows */}
      <div className="relative">
        {sprints.map((sprint) => {
          const pos = getSprintPosition(sprint);
          const config = getStatusConfig(sprint.status);
          const StatusIcon = config.icon;
          const isCurrent = sprint.id === currentSprintId;

          return (
            <div
              key={sprint.id}
              className="relative h-20 border-b border-slate-100 last:border-b-0"
            >
              {/* Sprint bar */}
              <div
                className={`absolute top-3 h-14 rounded-lg shadow-sm transition-all ${config.bg} ${config.pulse ? 'animate-pulse-subtle' : ''} ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
                style={{ left: `${pos.left}%`, width: `${pos.width}%`, minWidth: '120px' }}
              >
                {/* Sprint content */}
                <div className="h-full px-3 flex flex-col justify-center text-white">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-semibold text-sm truncate">
                      {sprint.sprint_code}: {sprint.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-white/80">
                      {formatDateRange(sprint.start_date, sprint.end_date)}
                    </span>
                    <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                      {sprint.completed_items}/{sprint.total_items}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10 rounded-b-lg overflow-hidden">
                    <div
                      className={`h-full ${config.progressBg}`}
                      style={{ width: `${sprint.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Today marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
          style={{ left: `${timelineData.todayPosition}%` }}
        >
          <div className="absolute -top-1 -left-2.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded whitespace-nowrap">
            TODAY
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center gap-6">
        <span className="text-xs font-medium text-slate-500">Status:</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-xs text-slate-600">Delivered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-500 animate-pulse" />
            <span className="text-xs text-slate-600">In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-slate-400" />
            <span className="text-xs text-slate-600">Planned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
