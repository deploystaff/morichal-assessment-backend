import { useState } from 'react';
import { CheckSquare, Calendar, User, AlertTriangle, Check, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button, PriorityBadge } from '../../common';
import { PresentationActionModal } from './PresentationActionModal';
import type { ActionItem } from '../../../types';

interface PresentationActionsProps {
  actions: ActionItem[];
  onUpdate: (id: string, data: Partial<ActionItem>) => void;
  onAdd?: (data: Partial<ActionItem>) => void;
  onDelete?: (id: string) => void;
}

export function PresentationActions({ actions, onUpdate, onAdd, onDelete }: PresentationActionsProps) {
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<ActionItem | null>(null);

  // Sort: pending first by due date, then in_progress, then completed
  const sortedActions = [...actions].sort((a, b) => {
    const statusOrder: Record<string, number> = { pending: 0, in_progress: 1, completed: 2, cancelled: 3 };
    const statusDiff = (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
    if (statusDiff !== 0) return statusDiff;

    // Sort by due date within same status
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return 0;
  });

  const isOverdue = (action: ActionItem) => {
    if (!action.due_date || action.status === 'completed' || action.status === 'cancelled') return false;
    return new Date(action.due_date) < new Date();
  };

  const isDueSoon = (action: ActionItem) => {
    if (!action.due_date || action.status === 'completed' || action.status === 'cancelled') return false;
    const dueDate = new Date(action.due_date);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return dueDate <= threeDaysFromNow && dueDate >= new Date();
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleToggleComplete = (action: ActionItem) => {
    if (action.status === 'completed') {
      onUpdate(action.id, { status: 'pending' });
    } else {
      setCompletingId(action.id);
      onUpdate(action.id, { status: 'completed' });
      setTimeout(() => setCompletingId(null), 500);
    }
  };

  const handleAddClick = () => {
    setEditingAction(null);
    setModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, action: ActionItem) => {
    e.stopPropagation();
    setEditingAction(action);
    setModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDelete && confirm('Are you sure you want to delete this action item?')) {
      onDelete(id);
    }
  };

  const handleModalSave = (data: Partial<ActionItem>) => {
    if (editingAction) {
      onUpdate(editingAction.id, data);
    } else {
      onAdd?.(data);
    }
    setModalOpen(false);
    setEditingAction(null);
  };

  const handleModalDelete = (id: string) => {
    onDelete?.(id);
    setModalOpen(false);
    setEditingAction(null);
  };

  const pendingCount = actions.filter(a => a.status === 'pending').length;
  const overdueCount = actions.filter(isOverdue).length;

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          {overdueCount > 0 && (
            <span className="flex items-center gap-1.5 text-red-600 font-medium">
              <AlertTriangle className="w-4 h-4" />
              {overdueCount} overdue
            </span>
          )}
          {pendingCount > 0 && (
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              {pendingCount} pending
            </span>
          )}
        </div>
        {onAdd && (
          <Button size="sm" onClick={handleAddClick}>
            <Plus className="w-4 h-4 mr-1" />
            Add Action
          </Button>
        )}
      </div>

      {/* Empty State */}
      {actions.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <CheckSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-lg font-medium text-slate-600">No action items</p>
          {onAdd && (
            <Button size="sm" className="mt-4" onClick={handleAddClick}>
              <Plus className="w-4 h-4 mr-1" />
              Add First Action
            </Button>
          )}
        </div>
      ) : (
        /* Actions List */
        <div className="space-y-3">
          {sortedActions.map((action) => {
            const overdue = isOverdue(action);
            const dueSoon = isDueSoon(action);
            const isCompleted = action.status === 'completed';
            const isCompleting = completingId === action.id;

            return (
              <div
                key={action.id}
                className={`
                  group flex items-start gap-4 p-4 rounded-lg border transition-all
                  ${overdue ? 'border-l-4 border-l-red-500 border-red-200 bg-red-50' :
                    dueSoon ? 'border-l-4 border-l-amber-500 border-amber-200 bg-amber-50' :
                    isCompleted ? 'border-slate-200 bg-slate-50 opacity-60' :
                    'border-slate-200 bg-white hover:border-primary/30'}
                `}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleComplete(action)}
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                    ${isCompleted || isCompleting
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-300 hover:border-primary'}
                  `}
                >
                  {(isCompleted || isCompleting) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <PriorityBadge priority={action.priority} />
                    {overdue && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-200 text-red-800 rounded-full">
                        Overdue
                      </span>
                    )}
                    {dueSoon && !overdue && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-amber-200 text-amber-800 rounded-full">
                        Due Soon
                      </span>
                    )}
                  </div>

                  <p className={`font-medium ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                    {action.title}
                  </p>

                  {action.description && (
                    <p className="text-sm text-slate-600 mt-1">{action.description}</p>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    {action.assigned_to && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {action.assigned_to}
                      </span>
                    )}
                    {action.due_date && (
                      <span className={`flex items-center gap-1 ${overdue ? 'text-red-600 font-medium' : ''}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDueDate(action.due_date)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit/Delete buttons - show on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleEditClick(e, action)}
                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit action"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {onDelete && (
                    <button
                      onClick={(e) => handleDeleteClick(e, action.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Delete action"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Status Selector */}
                {!isCompleted && (
                  <select
                    value={action.status}
                    onChange={(e) => onUpdate(action.id, { status: e.target.value as ActionItem['status'] })}
                    className="text-xs border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action Modal */}
      <PresentationActionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAction(null);
        }}
        action={editingAction}
        onSave={handleModalSave}
        onDelete={onDelete ? handleModalDelete : undefined}
      />
    </div>
  );
}
