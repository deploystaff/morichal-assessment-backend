import { useState } from 'react';
import { AlertTriangle, User, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../common';
import type { Blocker } from '../../../types';

interface PresentationBlockersProps {
  blockers: Blocker[];
  onResolve: (id: string, resolution: string) => void;
  onUpdate: (id: string, data: Partial<Blocker>) => void;
}

const severityConfig: Record<Blocker['severity'], { color: string; bgColor: string; borderColor: string; icon: string }> = {
  critical: { color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-l-red-500', icon: '🔴' },
  high: { color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-l-orange-500', icon: '🟠' },
  medium: { color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-l-yellow-500', icon: '🟡' },
  low: { color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-l-blue-500', icon: '🔵' },
};

export function PresentationBlockers({ blockers, onResolve, onUpdate }: PresentationBlockersProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');

  // Sort: open blockers by severity first, then resolved
  const sortedBlockers = [...blockers].sort((a, b) => {
    if (a.status === 'resolved' && b.status !== 'resolved') return 1;
    if (a.status !== 'resolved' && b.status === 'resolved') return -1;

    const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4);
  });

  const openBlockers = blockers.filter(b => b.status !== 'resolved');
  const criticalCount = openBlockers.filter(b => b.severity === 'critical').length;

  if (blockers.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-lg font-medium text-slate-600">No blockers</p>
        <p className="text-sm">Great news! No blockers are blocking progress.</p>
      </div>
    );
  }

  const handleResolve = (id: string) => {
    if (resolution.trim()) {
      onResolve(id, resolution);
      setResolvingId(null);
      setResolution('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      {openBlockers.length > 0 && (
        <div className="flex items-center gap-4 text-sm">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1.5 text-red-600 font-medium animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              {criticalCount} critical
            </span>
          )}
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            {openBlockers.length} open
          </span>
        </div>
      )}

      {/* Blockers List */}
      <div className="space-y-3">
        {sortedBlockers.map((blocker) => {
          const config = severityConfig[blocker.severity];
          const isExpanded = expandedId === blocker.id;
          const isResolving = resolvingId === blocker.id;
          const isResolved = blocker.status === 'resolved';

          return (
            <div
              key={blocker.id}
              className={`
                border-l-4 rounded-r-lg transition-all
                ${config.borderColor} ${isResolved ? 'bg-slate-50 opacity-60' : config.bgColor}
              `}
            >
              {/* Blocker Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : blocker.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bgColor} ${config.color} border`}>
                      {config.icon} {blocker.severity}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      blocker.status === 'open' ? 'bg-red-100 text-red-700' :
                      blocker.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {blocker.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className={`font-medium ${isResolved ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                    {blocker.title}
                  </p>
                  {blocker.owner && (
                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <User className="w-3 h-3" />
                      {blocker.owner}
                    </p>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 animate-fade-in">
                  {/* Description */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-700">{blocker.description}</p>
                  </div>

                  {/* Existing Resolution */}
                  {blocker.resolution && (
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2 text-xs text-emerald-600 mb-2">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="font-medium">Resolution</span>
                      </div>
                      <p className="text-sm text-emerald-700">{blocker.resolution}</p>
                    </div>
                  )}

                  {/* Resolution Input (for unresolved blockers) */}
                  {!isResolved && !isResolving && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setResolvingId(blocker.id)}
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Resolved
                    </Button>
                  )}

                  {isResolving && (
                    <div className="p-3 bg-white rounded-lg border-2 border-emerald-300">
                      <label className="block text-xs font-medium text-emerald-600 mb-2">
                        How was this resolved?
                      </label>
                      <textarea
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="Describe the resolution..."
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setResolvingId(null);
                            setResolution('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleResolve(blocker.id)}
                          disabled={!resolution.trim()}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Status Selector */}
                  {!isResolving && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">Status:</span>
                      <select
                        value={blocker.status}
                        onChange={(e) => onUpdate(blocker.id, { status: e.target.value as Blocker['status'] })}
                        className="text-sm border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
