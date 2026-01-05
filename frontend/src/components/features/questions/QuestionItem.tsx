import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Trash2, MessageSquare } from 'lucide-react';
import { StatusBadge, PriorityBadge, Button, Card, CardBody } from '../../common';
import type { Question } from '../../../types';

interface QuestionItemProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Question['status']) => void;
}

export function QuestionItem({ question, onEdit, onDelete, onStatusChange }: QuestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 p-1 rounded hover:bg-slate-100 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 line-clamp-2">{question.question}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={question.status} />
                  <PriorityBadge priority={question.priority} />
                  {question.category && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {question.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(question)}
                  className="p-1.5"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(question.id)}
                  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-3 animate-fade-in">
                {question.answer && (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">Answer</span>
                    </div>
                    <p className="text-sm text-slate-700">{question.answer}</p>
                  </div>
                )}

                {question.notes && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-medium text-slate-500">Notes</span>
                    <p className="text-sm text-slate-700 mt-1">{question.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Created {formatDate(question.created_at)}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Status:</span>
                    <select
                      value={question.status}
                      onChange={(e) =>
                        onStatusChange(question.id, e.target.value as Question['status'])
                      }
                      className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="pending">Pending</option>
                      <option value="answered">Answered</option>
                      <option value="needs-follow-up">Needs Follow-up</option>
                      <option value="deferred">Deferred</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
