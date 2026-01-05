import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Trash2, User, Calendar, CheckCircle } from 'lucide-react';
import { StatusBadge, PriorityBadge, Button, Card, CardBody } from '../../common';
import type { ActionItem as ActionItemType } from '../../../types';

interface ActionItemProps {
  action: ActionItemType;
  onEdit: (action: ActionItemType) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ActionItemType['status']) => void;
}

export function ActionItem({ action, onEdit, onDelete, onStatusChange }: ActionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue =
    action.due_date &&
    new Date(action.due_date) < new Date() &&
    action.status !== 'completed';

  return (
    <Card
      className={`
        hover:shadow-md transition-shadow
        ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
      `}
    >
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onStatusChange(action.id, action.status === 'completed' ? 'pending' : 'completed')}
            className={`
              mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
              ${action.status === 'completed'
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-slate-300 hover:border-primary'
              }
            `}
          >
            {action.status === 'completed' && <CheckCircle className="w-3 h-3" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3
                  className={`
                    font-medium text-slate-900 line-clamp-2
                    ${action.status === 'completed' ? 'line-through text-slate-500' : ''}
                  `}
                >
                  {action.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <StatusBadge status={action.status} />
                  <PriorityBadge priority={action.priority} />
                  {isOverdue && (
                    <span className="text-xs text-red-600 font-medium">Overdue</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(action)}
                  className="p-1.5"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(action.id)}
                  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <div className="flex flex-wrap gap-4 text-sm">
                  {action.assigned_to && (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <User className="w-4 h-4" />
                      <span>{action.assigned_to}</span>
                    </div>
                  )}
                  {action.due_date && (
                    <div
                      className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Due {formatDate(action.due_date)}</span>
                    </div>
                  )}
                </div>

                {action.description && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-medium text-slate-500">Description</span>
                    <p className="text-sm text-slate-700 mt-1">{action.description}</p>
                  </div>
                )}

                {action.notes && (
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <span className="text-xs font-medium text-amber-700">Notes</span>
                    <p className="text-sm text-slate-700 mt-1">{action.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Created {formatDate(action.created_at)}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Status:</span>
                    <select
                      value={action.status}
                      onChange={(e) =>
                        onStatusChange(action.id, e.target.value as ActionItemType['status'])
                      }
                      className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
