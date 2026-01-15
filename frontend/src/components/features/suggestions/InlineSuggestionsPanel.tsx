import { Sparkles, CheckCheck, X, Check } from 'lucide-react';
import { Button, Badge } from '../../common';
import type { AISuggestion } from '../../../types';

interface InlineSuggestionsPanelProps {
  suggestions: AISuggestion[];
  suggestionType?: 'answer' | 'business_rule' | 'decision' | 'action_item';
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onApproveAll: (ids: string[]) => void;
  isProcessing?: boolean;
  showAllTypes?: boolean;
}

const typeLabels = {
  answer: 'Answer',
  business_rule: 'Business Rule',
  decision: 'Decision',
  action_item: 'Action Item',
};

const typeColors = {
  answer: 'bg-emerald-100 text-emerald-700',
  business_rule: 'bg-purple-100 text-purple-700',
  decision: 'bg-blue-100 text-blue-700',
  action_item: 'bg-amber-100 text-amber-700',
};

export function InlineSuggestionsPanel({
  suggestions,
  suggestionType,
  onApprove,
  onReject,
  onApproveAll,
  isProcessing,
  showAllTypes = false,
}: InlineSuggestionsPanelProps) {
  // Filter for pending suggestions of the specified type (or all types if showAllTypes)
  const pendingSuggestions = suggestions.filter(
    (s) => s.status === 'pending' && (showAllTypes || s.suggestion_type === suggestionType)
  );

  if (pendingSuggestions.length === 0) return null;

  const handleApproveAll = () => {
    onApproveAll(pendingSuggestions.map((s) => s.id));
  };

  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="font-medium text-amber-800">
            AI Suggestions ({pendingSuggestions.length})
          </span>
        </div>
        <Button
          size="sm"
          onClick={handleApproveAll}
          disabled={isProcessing}
        >
          <CheckCheck className="w-4 h-4 mr-1" />
          Approve All
        </Button>
      </div>

      <div className="space-y-2">
        {pendingSuggestions.map((suggestion) => {
          const content = suggestion.suggested_content as Record<string, string>;
          const confidencePercent = Math.round((suggestion.confidence ?? 0) * 100);

          return (
            <div
              key={suggestion.id}
              className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-amber-100"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Badge className={typeColors[suggestion.suggestion_type]}>
                  {typeLabels[suggestion.suggestion_type]}
                </Badge>
                <span className="text-sm text-slate-700 truncate">
                  {content.title || content.answer || content.description || 'No preview'}
                </span>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {confidencePercent}%
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onApprove(suggestion.id)}
                  disabled={isProcessing}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                  title="Approve"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onReject(suggestion.id)}
                  disabled={isProcessing}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  title="Reject"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
