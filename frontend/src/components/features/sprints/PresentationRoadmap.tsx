import { CheckCircle, Circle, Bot, Zap, Rocket } from 'lucide-react';
import { SprintTimeline } from './SprintTimeline';
import type { RoadmapSummary, Sprint } from '../../../types';

interface PresentationRoadmapProps {
  roadmap: RoadmapSummary | null;
  isLoading?: boolean;
}

export function PresentationRoadmap({ roadmap, isLoading }: PresentationRoadmapProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-slate-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!roadmap || roadmap.sprints.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl p-8 text-center">
        <Rocket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">No roadmap data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Progress Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/10 to-teal-500/10 rounded-xl">
        <div className="flex items-center gap-6">
          {/* Progress Ring */}
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                strokeWidth="8"
                fill="none"
                className="stroke-slate-200"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="stroke-primary transition-all duration-1000"
                strokeDasharray={`${(roadmap.overall_progress / 100) * 251.2} 251.2`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-800">{roadmap.overall_progress}%</span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-800">Project Progress</h3>
            <p className="text-slate-600">
              {roadmap.completed_items} of {roadmap.total_items} items completed
            </p>
          </div>
        </div>

        {/* Current Sprint Badge */}
        {roadmap.current_sprint && (
          <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-500 uppercase">Current Sprint</span>
            </div>
            <p className="font-bold text-slate-800">{roadmap.current_sprint.name}</p>
            <p className="text-sm text-slate-600">{roadmap.current_sprint.progress}% complete</p>
          </div>
        )}
      </div>

      {/* Timeline View */}
      <div>
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Project Timeline</h4>
        <SprintTimeline
          sprints={roadmap.sprints}
          currentSprintId={roadmap.current_sprint?.id}
        />
      </div>

      {/* Sprint Cards Grid */}
      <div>
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Sprint Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmap.sprints.map((sprint) => (
            <SprintCard key={sprint.id} sprint={sprint} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Sprint Card Component
function SprintCard({ sprint }: { sprint: Sprint }) {
  const getStatusBadge = (status: Sprint['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            In Progress
          </span>
        );
      case 'planned':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
            <Circle className="w-3 h-3" />
            Planned
          </span>
        );
      default:
        return null;
    }
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-primary">{sprint.sprint_code}</span>
            {getStatusBadge(sprint.status)}
          </div>
          <h5 className="font-semibold text-slate-800">{sprint.name}</h5>
          <p className="text-sm text-slate-500">{formatDateRange(sprint.start_date, sprint.end_date)}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-slate-800">{sprint.progress}%</span>
          <p className="text-xs text-slate-500">
            {sprint.completed_items}/{sprint.total_items} items
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            sprint.status === 'delivered'
              ? 'bg-emerald-500'
              : sprint.status === 'in_progress'
                ? 'bg-blue-500'
                : 'bg-slate-300'
          }`}
          style={{ width: `${sprint.progress}%` }}
        />
      </div>

      {/* Items Preview */}
      {sprint.items && sprint.items.length > 0 && (
        <div className="space-y-2">
          {sprint.items.slice(0, 4).map((item) => {
            const ItemIcon = item.item_type === 'agent' ? Bot : Zap;
            return (
              <div
                key={item.id}
                className="flex items-center gap-2 text-sm"
              >
                <ItemIcon className={`w-4 h-4 ${item.item_type === 'agent' ? 'text-blue-500' : 'text-emerald-500'}`} />
                <span className={`flex-1 truncate ${item.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {item.name}
                </span>
                {item.status === 'completed' && (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                )}
              </div>
            );
          })}
          {sprint.items.length > 4 && (
            <p className="text-xs text-slate-400 pl-6">
              +{sprint.items.length - 4} more items
            </p>
          )}
        </div>
      )}
    </div>
  );
}
