import { useState, useMemo } from 'react';
import { Plus, Search, BookOpen } from 'lucide-react';
import { Button, FilterTabs, EmptyState } from '../../common';
import { RuleItem } from './RuleItem';
import { RuleModal } from './RuleModal';
import type { BusinessRule } from '../../../types';

interface RuleListProps {
  rules: BusinessRule[];
  onAdd: (data: Partial<BusinessRule>) => void;
  onUpdate: (id: string, data: Partial<BusinessRule>) => void;
  onDelete: (id: string) => void;
}

export function RuleList({ rules, onAdd, onUpdate, onDelete }: RuleListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<BusinessRule | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(rules.map((r) => r.category).filter(Boolean));
    return ['all', ...Array.from(cats)] as string[];
  }, [rules]);

  const filterOptions = categories.map((cat) => ({
    value: cat,
    label: cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1),
  }));

  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const matchesFilter = filter === 'all' || r.category === filter;
      const matchesSearch =
        searchQuery === '' ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [rules, filter, searchQuery]);

  const handleEdit = (rule: BusinessRule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Partial<BusinessRule>) => {
    if (editingRule) {
      onUpdate(editingRule.id, data);
    } else {
      onAdd(data);
    }
    setIsModalOpen(false);
    setEditingRule(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Business Rules</h2>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Rule
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        {filterOptions.length > 1 && (
          <FilterTabs options={filterOptions} value={filter} onChange={setFilter} />
        )}
      </div>

      {/* Rules List */}
      {filteredRules.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No business rules found"
          description={
            filter !== 'all' || searchQuery
              ? 'Try adjusting your filters or search query'
              : 'Document your first business rule to get started'
          }
          action={
            filter === 'all' && !searchQuery ? (
              <Button onClick={() => setIsModalOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Rule
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredRules.map((rule) => (
            <RuleItem
              key={rule.id}
              rule={rule}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <RuleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        rule={editingRule}
      />
    </div>
  );
}
