import { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, MessageSquare, BookOpen, Gavel, ListTodo } from 'lucide-react';
import { Button, Badge } from '../../common';
import type { AISuggestion } from '../../../types';

interface SuggestionItemProps {
  suggestion: AISuggestion;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing?: boolean;
}

const typeIcons = {
  answer: MessageSquare,
  business_rule: BookOpen,
  decision: Gavel,
  action_item: ListTodo,
};

const typeLabels = {
  answer: 'Answer',
  business_rule: 'Business Rule',
  decision: 'Decision',
  action_item: 'Action Item',
};

const typeColors = {
  answer: 'text-emerald-600 bg-emerald-100',
  business_rule: 'text-purple-600 bg-purple-100',
  decision: 'text-blue-600 bg-blue-100',
  action_item: 'text-amber-600 bg-amber-100',
};

export function SuggestionItem({ suggestion, onApprove, onReject, isProcessing }: SuggestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = typeIcons[suggestion.suggestion_type];
  const content = suggestion.suggested_content as Record<string, string>;

  const confidencePercent = Math.round((suggestion.confidence ?? 0) * 100);
  const confidenceColor = confidencePercent >= 80 ? 'text-emerald-600' :
                          confidencePercent >= 60 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`p-2 rounded-lg ${typeColors[suggestion.suggestion_type]}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-slate-900">
              {typeLabels[suggestion.suggestion_type]}
            </span>
            <Badge variant={suggestion.status === 'approved' ? 'success' :
                          suggestion.status === 'rejected' ? 'danger' : 'default'}>
              {suggestion.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 truncate">
            {content.title || content.answer || content.description || 'No preview available'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${confidenceColor}`}>
            {confidencePercent}%
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <div className="mt-4 space-y-3">
            {/* Content based on type */}
            {suggestion.suggestion_type === 'answer' && (
              <>
                {content.target_question && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Question</label>
                    <p className="text-sm text-slate-700 mt-1">{content.target_question}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Suggested Answer</label>
                  <p className="text-sm text-slate-900 mt-1 bg-emerald-50 p-3 rounded-lg">
                    {content.answer}
                  </p>
                </div>
              </>
            )}

            {suggestion.suggestion_type === 'business_rule' && (
              <>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Title</label>
                  <p className="text-sm text-slate-900 mt-1 font-medium">{content.title}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Description</label>
                  <p className="text-sm text-slate-700 mt-1 bg-purple-50 p-3 rounded-lg">
                    {content.description}
                  </p>
                </div>
                {content.category && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Category</label>
                    <p className="text-sm text-slate-600 mt-1">{content.category}</p>
                  </div>
                )}
              </>
            )}

            {suggestion.suggestion_type === 'decision' && (
              <>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Decision</label>
                  <p className="text-sm text-slate-900 mt-1 font-medium">{content.title}</p>
                </div>
                {content.description && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Details</label>
                    <p className="text-sm text-slate-700 mt-1 bg-blue-50 p-3 rounded-lg">
                      {content.description}
                    </p>
                  </div>
                )}
              </>
            )}

            {suggestion.suggestion_type === 'action_item' && (
              <>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Action Item</label>
                  <p className="text-sm text-slate-900 mt-1 font-medium">{content.title}</p>
                </div>
                {content.description && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Description</label>
                    <p className="text-sm text-slate-700 mt-1 bg-amber-50 p-3 rounded-lg">
                      {content.description}
                    </p>
                  </div>
                )}
                {content.assigned_to && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Assigned To</label>
                    <p className="text-sm text-slate-600 mt-1">{content.assigned_to}</p>
                  </div>
                )}
              </>
            )}

            {/* Source Quote */}
            {content.source_quote && (
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Source Quote</label>
                <p className="text-sm text-slate-500 mt-1 italic border-l-2 border-slate-300 pl-3">
                  "{content.source_quote}"
                </p>
              </div>
            )}

            {/* Actions */}
            {suggestion.status === 'pending' && (
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <Button
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onApprove(suggestion.id); }}
                  disabled={isProcessing}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={(e) => { e.stopPropagation(); onReject(suggestion.id); }}
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}

            {suggestion.status !== 'pending' && suggestion.reviewed_at && (
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                {suggestion.status === 'approved' ? 'Approved' : 'Rejected'}
                {suggestion.reviewed_by && ` by ${suggestion.reviewed_by}`} on {' '}
                {new Date(suggestion.reviewed_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
