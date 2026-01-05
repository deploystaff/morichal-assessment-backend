import { useState, useMemo } from 'react';
import { Plus, Search, ListTodo } from 'lucide-react';
import { Button, FilterTabs, EmptyState } from '../../common';
import { ActionItem } from './ActionItem';
import { ActionModal } from './ActionModal';
import type { ActionItem as ActionItemType } from '../../../types';

interface ActionListProps {
  actions: ActionItemType[];
  onAdd: (data: Partial<ActionItemType>) => void;
  onUpdate: (id: string, data: Partial<ActionItemType>) => void;
  onDelete: (id: string) => void;
}

export function ActionList({ actions, onAdd, onUpdate, onDelete }: ActionListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<ActionItemType | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const filteredActions = useMemo(() => {
    return actions
      .filter((a) => {
        const isOverdue =
          a.due_date && new Date(a.due_date) < new Date() && a.status !== 'completed';

        const matchesFilter =
          filter === 'all' ||
          (filter === 'overdue' ? isOverdue : a.status === filter);

        const matchesSearch =
          searchQuery === '' ||
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (a.assigned_to && a.assigned_to.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        // Sort by priority, then by due date
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;

        if (a.due_date && b.due_date) {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        return a.due_date ? -1 : 1;
      });
  }, [actions, filter, searchQuery]);

  const handleEdit = (action: ActionItemType) => {
    setEditingAction(action);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Partial<ActionItemType>) => {
    if (editingAction) {
      onUpdate(editingAction.id, data);
    } else {
      onAdd(data);
    }
    setIsModalOpen(false);
    setEditingAction(null);
  };

  const handleStatusChange = (id: string, status: ActionItemType['status']) => {
    onUpdate(id, { status });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAction(null);
  };

  const overdueCount = actions.filter(
    (a) => a.due_date && new Date(a.due_date) < new Date() && a.status !== 'completed'
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Action Items</h2>
          {overdueCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
              {overdueCount} overdue
            </span>
          )}
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Action
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <FilterTabs options={filterOptions} value={filter} onChange={setFilter} />
      </div>

      {/* Actions List */}
      {filteredActions.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No action items found"
          description={
            filter !== 'all' || searchQuery
              ? 'Try adjusting your filters or search query'
              : 'Add your first action item to get started'
          }
          action={
            filter === 'all' && !searchQuery ? (
              <Button onClick={() => setIsModalOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Action
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredActions.map((action) => (
            <ActionItem
              key={action.id}
              action={action}
              onEdit={handleEdit}
              onDelete={onDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        action={editingAction}
      />
    </div>
  );
}
