import { useMemo, useState } from 'react';
import { Sparkles, Filter } from 'lucide-react';
import { FilterTabs, EmptyState } from '../../common';
import { SuggestionItem } from './SuggestionItem';
import type { AISuggestion } from '../../../types';

interface SuggestionListProps {
  suggestions: AISuggestion[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing?: boolean;
}

export function SuggestionList({ suggestions, onApprove, onReject, isProcessing }: SuggestionListProps) {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [typeFilter, setTypeFilter] = useState('all');

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'all', label: 'All' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'answer', label: 'Answers' },
    { value: 'business_rule', label: 'Rules' },
    { value: 'decision', label: 'Decisions' },
    { value: 'action_item', label: 'Actions' },
  ];

  const filteredSuggestions = useMemo(() => {
    return suggestions
      .filter((s) => {
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchesType = typeFilter === 'all' || s.suggestion_type === typeFilter;
        return matchesStatus && matchesType;
      })
      .sort((a, b) => {
        // Sort by confidence (highest first), then by created date
        const confDiff = (b.confidence ?? 0) - (a.confidence ?? 0);
        if (confDiff !== 0) return confDiff;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [suggestions, statusFilter, typeFilter]);

  const pendingCount = suggestions.filter((s) => s.status === 'pending').length;

  const stats = useMemo(() => ({
    total: suggestions.length,
    pending: suggestions.filter((s) => s.status === 'pending').length,
    approved: suggestions.filter((s) => s.status === 'approved').length,
    rejected: suggestions.filter((s) => s.status === 'rejected').length,
    answers: suggestions.filter((s) => s.suggestion_type === 'answer').length,
    rules: suggestions.filter((s) => s.suggestion_type === 'business_rule').length,
    decisions: suggestions.filter((s) => s.suggestion_type === 'decision').length,
    actions: suggestions.filter((s) => s.suggestion_type === 'action_item').length,
  }), [suggestions]);

  if (suggestions.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No AI suggestions yet"
        description="Upload a transcript and analyze it to generate AI suggestions"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-lg font-semibold text-slate-900">{stats.pending}</p>
          <p className="text-xs text-slate-500">Pending</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-2">
          <p className="text-lg font-semibold text-emerald-600">{stats.approved}</p>
          <p className="text-xs text-slate-500">Approved</p>
        </div>
        <div className="bg-red-50 rounded-lg p-2">
          <p className="text-lg font-semibold text-red-600">{stats.rejected}</p>
          <p className="text-xs text-slate-500">Rejected</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2">
          <p className="text-lg font-semibold text-blue-600">{stats.total}</p>
          <p className="text-xs text-slate-500">Total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <FilterTabs options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggestions List */}
      {filteredSuggestions.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No suggestions match the current filters
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSuggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion.id}
              suggestion={suggestion}
              onApprove={onApprove}
              onReject={onReject}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      )}

      {pendingCount > 0 && statusFilter !== 'pending' && (
        <p className="text-sm text-amber-600 text-center">
          {pendingCount} suggestion{pendingCount !== 1 ? 's' : ''} pending review
        </p>
      )}
    </div>
  );
}
