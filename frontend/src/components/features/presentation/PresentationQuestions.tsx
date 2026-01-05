import { useState } from 'react';
import { HelpCircle, MessageSquare, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Button, PriorityBadge } from '../../common';
import type { Question } from '../../../types';

interface PresentationQuestionsProps {
  questions: Question[];
  onAnswer: (id: string, answer: string) => void;
  onStatusChange: (id: string, status: Question['status']) => void;
}

const statusColors: Record<Question['status'], string> = {
  pending: 'border-l-amber-400 bg-amber-50',
  answered: 'border-l-emerald-400 bg-emerald-50',
  'needs-follow-up': 'border-l-orange-400 bg-orange-50',
  deferred: 'border-l-slate-400 bg-slate-50',
};

const statusLabels: Record<Question['status'], string> = {
  pending: 'Needs Answer',
  answered: 'Answered',
  'needs-follow-up': 'Follow Up',
  deferred: 'Deferred',
};

export function PresentationQuestions({ questions, onAnswer, onStatusChange }: PresentationQuestionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState<Record<string, string>>({});

  // Sort: pending first, then needs-follow-up, then answered, then deferred
  const sortedQuestions = [...questions].sort((a, b) => {
    const order: Record<string, number> = { pending: 0, 'needs-follow-up': 1, answered: 2, deferred: 3 };
    return (order[a.status] || 4) - (order[b.status] || 4);
  });

  const pendingCount = questions.filter(q => q.status === 'pending').length;
  const followUpCount = questions.filter(q => q.status === 'needs-follow-up').length;

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <HelpCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-lg font-medium text-slate-600">No questions for this meeting</p>
      </div>
    );
  }

  const handleSaveAnswer = (id: string) => {
    if (answerInput[id]?.trim()) {
      onAnswer(id, answerInput[id]);
      setAnswerInput({ ...answerInput, [id]: '' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <div className="flex items-center gap-4 text-sm">
        {pendingCount > 0 && (
          <span className="flex items-center gap-1.5 text-amber-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {pendingCount} need{pendingCount === 1 ? 's' : ''} answer
          </span>
        )}
        {followUpCount > 0 && (
          <span className="flex items-center gap-1.5 text-orange-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            {followUpCount} follow-up
          </span>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {sortedQuestions.map((question) => {
          const isExpanded = expandedId === question.id;
          const needsAnswer = question.status === 'pending' || question.status === 'needs-follow-up';

          return (
            <div
              key={question.id}
              className={`border-l-4 rounded-r-lg transition-all ${statusColors[question.status]}`}
            >
              {/* Question Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : question.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      question.status === 'pending' ? 'bg-amber-200 text-amber-800' :
                      question.status === 'answered' ? 'bg-emerald-200 text-emerald-800' :
                      question.status === 'needs-follow-up' ? 'bg-orange-200 text-orange-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {statusLabels[question.status]}
                    </span>
                    <PriorityBadge priority={question.priority} />
                    {question.category && (
                      <span className="px-2 py-0.5 text-xs bg-slate-200 text-slate-600 rounded-full">
                        {question.category}
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-slate-900">{question.question}</p>
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
                  {/* Existing Answer */}
                  {question.answer && (
                    <div className="p-3 bg-white rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2 text-xs text-emerald-600 mb-2">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="font-medium">
                          Answered{question.answered_by && ` by ${question.answered_by}`}
                        </span>
                      </div>
                      <p className="text-slate-700">{question.answer}</p>
                    </div>
                  )}

                  {/* Answer Input (for unanswered questions) */}
                  {needsAnswer && (
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Add Answer
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={answerInput[question.id] || ''}
                          onChange={(e) => setAnswerInput({ ...answerInput, [question.id]: e.target.value })}
                          placeholder="Type answer..."
                          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveAnswer(question.id)}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveAnswer(question.id)}
                          disabled={!answerInput[question.id]?.trim()}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Status Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Status:</span>
                    <select
                      value={question.status}
                      onChange={(e) => onStatusChange(question.id, e.target.value as Question['status'])}
                      className="text-sm border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary"
                    >
                      <option value="pending">Needs Answer</option>
                      <option value="answered">Answered</option>
                      <option value="needs-follow-up">Needs Follow-up</option>
                      <option value="deferred">Deferred</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
