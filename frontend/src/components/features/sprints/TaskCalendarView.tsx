import { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, Clock, AlertCircle, Flag } from 'lucide-react';
import type { Sprint, SprintItem } from '../../../types';

interface TaskCalendarViewProps {
  sprints: Sprint[];
  className?: string;
}

type ViewMode = 'week' | 'month';

// Sprint color mapping
const sprintColors: Record<number, { bg: string; border: string; text: string; light: string }> = {
  0: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-100' },
  1: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-700', light: 'bg-blue-100' },
  2: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-700', light: 'bg-purple-100' },
  3: { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-700', light: 'bg-amber-100' },
  4: { bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-700', light: 'bg-rose-100' },
  5: { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-700', light: 'bg-cyan-100' },
};

// Status icons and colors
const statusConfig = {
  completed: { icon: Check, color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
  in_progress: { icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-500' },
  blocked: { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-500' },
  planned: { icon: Flag, color: 'text-slate-400', bgColor: 'bg-slate-400' },
  cancelled: { icon: Flag, color: 'text-slate-300', bgColor: 'bg-slate-300' },
};

interface TaskBar {
  item: SprintItem;
  sprintIndex: number;
  sprintCode: string;
  startCol: number;
  endCol: number;
  row: number;
}

export function TaskCalendarView({ sprints, className = '' }: TaskCalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  // Get start/end of current view period
  const viewPeriod = useMemo(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (viewMode === 'week') {
      // Start from Monday of current week
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      end.setDate(diff + 6);
    } else {
      // Start from first day of month
      start.setDate(1);
      end.setMonth(end.getMonth() + 1, 0);
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }, [currentDate, viewMode]);

  // Generate days array
  const days = useMemo(() => {
    const result: Date[] = [];
    const current = new Date(viewPeriod.start);
    while (current <= viewPeriod.end) {
      result.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return result;
  }, [viewPeriod]);

  // Get tasks that overlap with the view period
  const taskBars = useMemo(() => {
    const bars: TaskBar[] = [];
    const rowTracker: { [key: number]: number[] } = {}; // Track which columns are used per row

    sprints.forEach((sprint, sprintIndex) => {
      if (!sprint.items) return;

      sprint.items.forEach((item) => {
        if (!item.start_date && !item.end_date) return;
        if (item.status === 'cancelled') return;

        const itemStart = item.start_date ? new Date(item.start_date) : null;
        const itemEnd = item.end_date ? new Date(item.end_date) : null;

        // Single-day fallback if only one date
        const effectiveStart = itemStart || itemEnd!;
        const effectiveEnd = itemEnd || itemStart!;

        // Check if task overlaps with view period
        if (effectiveEnd < viewPeriod.start || effectiveStart > viewPeriod.end) return;

        // Calculate which columns this task spans
        const startCol = Math.max(
          0,
          Math.floor((effectiveStart.getTime() - viewPeriod.start.getTime()) / (1000 * 60 * 60 * 24))
        );
        const endCol = Math.min(
          days.length - 1,
          Math.floor((effectiveEnd.getTime() - viewPeriod.start.getTime()) / (1000 * 60 * 60 * 24))
        );

        // Find available row
        let row = 0;
        while (true) {
          if (!rowTracker[row]) rowTracker[row] = [];
          const conflict = rowTracker[row].some(
            (usedCol) => usedCol >= startCol && usedCol <= endCol
          );
          if (!conflict) break;
          row++;
        }

        // Mark columns as used
        for (let col = startCol; col <= endCol; col++) {
          if (!rowTracker[row]) rowTracker[row] = [];
          rowTracker[row].push(col);
        }

        bars.push({
          item,
          sprintIndex: sprintIndex % Object.keys(sprintColors).length,
          sprintCode: sprint.sprint_code,
          startCol,
          endCol,
          row,
        });
      });
    });

    return bars;
  }, [sprints, viewPeriod, days.length]);

  // Calculate max rows needed
  const maxRows = useMemo(() => {
    return Math.max(3, ...taskBars.map((t) => t.row + 1));
  }, [taskBars]);

  // Navigation
  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Format header date
  const formatHeaderDate = () => {
    const options: Intl.DateTimeFormatOptions =
      viewMode === 'week'
        ? { month: 'long', year: 'numeric' }
        : { month: 'long', year: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-white to-teal-500/5 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Upcoming Schedule</h3>
              <p className="text-sm text-slate-500">
                {taskBars.length} task{taskBars.length !== 1 ? 's' : ''} scheduled
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'week'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'month'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Month
              </button>
            </div>

            {/* Today Button */}
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              Today
            </button>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-3 py-1 min-w-[140px] text-center font-medium text-slate-800">
                {formatHeaderDate()}
              </span>
              <button
                onClick={() => navigate(1)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Day Headers */}
          <div
            className="grid border-b border-slate-200 bg-slate-50"
            style={{ gridTemplateColumns: `repeat(${days.length}, minmax(${viewMode === 'week' ? '120px' : '40px'}, 1fr))` }}
          >
            {days.map((day, index) => {
              const todayClass = isToday(day)
                ? 'bg-primary text-white'
                : 'text-slate-600';
              return (
                <div
                  key={index}
                  className={`px-2 py-3 text-center border-r border-slate-200 last:border-r-0 ${
                    isToday(day) ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="text-xs font-medium text-slate-500 uppercase">
                    {day.toLocaleDateString('en-US', { weekday: viewMode === 'week' ? 'short' : 'narrow' })}
                  </div>
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold mt-1 ${todayClass}`}
                  >
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Task Rows */}
          <div
            className="relative"
            style={{ minHeight: `${maxRows * 48 + 16}px` }}
          >
            {/* Grid Lines */}
            <div
              className="absolute inset-0 grid"
              style={{ gridTemplateColumns: `repeat(${days.length}, minmax(${viewMode === 'week' ? '120px' : '40px'}, 1fr))` }}
            >
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`border-r border-slate-100 last:border-r-0 ${
                    isToday(day) ? 'bg-primary/5' : ''
                  }`}
                />
              ))}
            </div>

            {/* Task Bars */}
            <div className="relative p-2">
              {taskBars.map((bar) => {
                const colors = sprintColors[bar.sprintIndex];
                const status = statusConfig[bar.item.status] || statusConfig.planned;
                const StatusIcon = status.icon;
                const isHovered = hoveredTask === bar.item.id;

                // Calculate position
                const colWidth = 100 / days.length;
                const left = bar.startCol * colWidth;
                const width = (bar.endCol - bar.startCol + 1) * colWidth;

                return (
                  <div
                    key={bar.item.id}
                    className={`absolute h-10 rounded-lg px-2 flex items-center gap-2 cursor-pointer transition-all ${
                      colors.light
                    } border-l-4 ${colors.border} ${
                      isHovered ? 'shadow-lg z-10 scale-[1.02]' : 'shadow-sm'
                    }`}
                    style={{
                      left: `${left}%`,
                      width: `calc(${width}% - 4px)`,
                      top: `${bar.row * 48 + 8}px`,
                    }}
                    onMouseEnter={() => setHoveredTask(bar.item.id)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    {/* Status Icon */}
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        bar.item.status === 'completed' ? 'bg-emerald-500' : 'bg-white'
                      }`}
                    >
                      <StatusIcon
                        className={`w-3 h-3 ${
                          bar.item.status === 'completed' ? 'text-white' : status.color
                        }`}
                      />
                    </div>

                    {/* Task Name */}
                    <span
                      className={`flex-grow text-sm font-medium truncate ${colors.text} ${
                        bar.item.status === 'completed' ? 'line-through opacity-70' : ''
                      }`}
                    >
                      {bar.item.name}
                    </span>

                    {/* Sprint Badge */}
                    {viewMode === 'week' && (
                      <span
                        className={`flex-shrink-0 px-1.5 py-0.5 text-xs font-medium rounded ${colors.bg} text-white`}
                      >
                        {bar.sprintCode}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {taskBars.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No tasks scheduled</p>
                  <p className="text-sm text-slate-400">
                    Add dates to your tasks to see them here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 uppercase">Sprints:</span>
            {sprints.slice(0, 4).map((sprint, index) => {
              const colors = sprintColors[index % Object.keys(sprintColors).length];
              return (
                <div key={sprint.id} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded ${colors.bg}`} />
                  <span className="text-sm text-slate-600">{sprint.sprint_code}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 uppercase">Status:</span>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-sm text-slate-600">Done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-sm text-slate-600">Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-sm text-slate-600">Blocked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
