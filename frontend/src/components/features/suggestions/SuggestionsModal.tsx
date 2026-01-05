import { Sparkles, Loader2 } from 'lucide-react';
import { Modal, Button } from '../../common';
import { SuggestionList } from './SuggestionList';
import type { AISuggestion } from '../../../types';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: AISuggestion[];
  meetingTitle?: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoading?: boolean;
  isProcessing?: boolean;
}

export function SuggestionsModal({
  isOpen,
  onClose,
  suggestions,
  meetingTitle,
  onApprove,
  onReject,
  isLoading,
  isProcessing,
}: SuggestionsModalProps) {
  const pendingCount = suggestions.filter((s) => s.status === 'pending').length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>AI Suggestions</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
              {pendingCount} pending
            </span>
          )}
        </div>
      }
      size="lg"
    >
      {meetingTitle && (
        <p className="text-sm text-slate-500 mb-4">
          Suggestions from: <span className="font-medium text-slate-700">{meetingTitle}</span>
        </p>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading suggestions...</p>
        </div>
      ) : (
        <SuggestionList
          suggestions={suggestions}
          onApprove={onApprove}
          onReject={onReject}
          isProcessing={isProcessing}
        />
      )}

      <div className="flex justify-end pt-4 mt-4 border-t border-slate-200">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
