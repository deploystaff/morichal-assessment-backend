import { useState } from 'react';
import { HelpCircle, MessageSquare, ChevronDown, ChevronUp, Check, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button, PriorityBadge, RichTextContent, RichTextEditor } from '../../common';
import { PresentationQuestionModal } from './PresentationQuestionModal';
import type { Question } from '../../../types';

interface PresentationQuestionsProps {
  questions: Question[];
  onAnswer: (id: string, answer: string) => void;
  onStatusChange: (id: string, status: Question['status']) => void;
  onAdd?: (data: Partial<Question>) => void;
  onUpdate?: (id: string, data: Partial<Question>) => void;
  onDelete?: (id: string) => void;
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

export function PresentationQuestions({
  questions,
  onAnswer,
  onStatusChange,
  onAdd,
  onUpdate,
  onDelete,
}: PresentationQuestionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Sort: pending first, then needs-follow-up, then answered, then deferred
  const sortedQuestions = [...questions].sort((a, b) => {
    const order: Record<string, number> = { pending: 0, 'needs-follow-up': 1, answered: 2, deferred: 3 };
    return (order[a.status] || 4) - (order[b.status] || 4);
  });

  const pendingCount = questions.filter(q => q.status === 'pending').length;
  const followUpCount = questions.filter(q => q.status === 'needs-follow-up').length;

  const handleSaveAnswer = (id: string) => {
    if (answerInput[id]?.trim()) {
      onAnswer(id, answerInput[id]);
      setAnswerInput({ ...answerInput, [id]: '' });
    }
  };

  const handleAddClick = () => {
    setEditingQuestion(null);
    setModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, question: Question) => {
    e.stopPropagation();
    setEditingQuestion(question);
    setModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDelete && confirm('Are you sure you want to delete this question?')) {
      onDelete(id);
    }
  };

  const handleModalSave = (data: Partial<Question>) => {
    if (editingQuestion) {
      onUpdate?.(editingQuestion.id, data);
    } else {
      onAdd?.(data);
    }
    setModalOpen(false);
    setEditingQuestion(null);
  };

  const handleModalDelete = (id: string) => {
    onDelete?.(id);
    setModalOpen(false);
    setEditingQuestion(null);
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
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
        {onAdd && (
          <Button size="sm" onClick={handleAddClick}>
            <Plus className="w-4 h-4 mr-1" />
            Add Question
          </Button>
        )}
      </div>

      {/* Empty State */}
      {questions.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <HelpCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-lg font-medium text-slate-600">No questions for this meeting</p>
          {onAdd && (
            <Button size="sm" className="mt-4" onClick={handleAddClick}>
              <Plus className="w-4 h-4 mr-1" />
              Add First Question
            </Button>
          )}
        </div>
      ) : (
        /* Questions List */
        <div className="space-y-3">
          {sortedQuestions.map((question) => {
            const isExpanded = expandedId === question.id;
            const needsAnswer = question.status === 'pending' || question.status === 'needs-follow-up';

            return (
              <div
                key={question.id}
                className={`group border-l-4 rounded-r-lg transition-all ${statusColors[question.status]}`}
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
                  <div className="flex items-center gap-2">
                    {/* Edit/Delete buttons - show on hover */}
                    {(onUpdate || onDelete) && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onUpdate && (
                          <button
                            onClick={(e) => handleEditClick(e, question)}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-colors"
                            title="Edit question"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => handleDeleteClick(e, question.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </div>
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
                        <RichTextContent html={question.answer} className="text-slate-700" />
                      </div>
                    )}

                    {/* Answer Input (for unanswered questions) */}
                    {needsAnswer && (
                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="space-y-2">
                          <RichTextEditor
                            label="Add Answer"
                            value={answerInput[question.id] || ''}
                            onChange={(value) => setAnswerInput({ ...answerInput, [question.id]: value })}
                            placeholder="Type answer..."
                            minHeight="100px"
                          />
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              onClick={() => handleSaveAnswer(question.id)}
                              disabled={!answerInput[question.id]?.trim()}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Save Answer
                            </Button>
                          </div>
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
      )}

      {/* Question Modal */}
      <PresentationQuestionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingQuestion(null);
        }}
        question={editingQuestion}
        onSave={handleModalSave}
        onDelete={onDelete ? handleModalDelete : undefined}
      />
    </div>
  );
}
