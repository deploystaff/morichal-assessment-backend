import { useState, useMemo } from 'react';
import { Plus, Search, Gavel } from 'lucide-react';
import { Button, FilterTabs, EmptyState } from '../../common';
import { DecisionItem } from './DecisionItem';
import { DecisionModal } from './DecisionModal';
import type { Decision } from '../../../types';

interface DecisionListProps {
  decisions: Decision[];
  onAdd: (data: Partial<Decision>) => void;
  onUpdate: (id: string, data: Partial<Decision>) => void;
  onDelete: (id: string) => void;
}

export function DecisionList({ decisions, onAdd, onUpdate, onDelete }: DecisionListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDecision, setEditingDecision] = useState<Decision | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const filteredDecisions = useMemo(() => {
    return decisions.filter((d) => {
      const matchesFilter = filter === 'all' || d.status === filter;
      const matchesSearch =
        searchQuery === '' ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [decisions, filter, searchQuery]);

  const handleEdit = (decision: Decision) => {
    setEditingDecision(decision);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Partial<Decision>) => {
    if (editingDecision) {
      onUpdate(editingDecision.id, data);
    } else {
      onAdd(data);
    }
    setIsModalOpen(false);
    setEditingDecision(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDecision(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Decisions</h2>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Decision
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search decisions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <FilterTabs options={filterOptions} value={filter} onChange={setFilter} />
      </div>

      {/* Decisions List */}
      {filteredDecisions.length === 0 ? (
        <EmptyState
          icon={Gavel}
          title="No decisions found"
          description={
            filter !== 'all' || searchQuery
              ? 'Try adjusting your filters or search query'
              : 'Document your first decision to get started'
          }
          action={
            filter === 'all' && !searchQuery ? (
              <Button onClick={() => setIsModalOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Decision
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredDecisions.map((decision) => (
            <DecisionItem
              key={decision.id}
              decision={decision}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <DecisionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        decision={editingDecision}
      />
    </div>
  );
}
