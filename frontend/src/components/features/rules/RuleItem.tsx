import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Trash2, Tag, Clock } from 'lucide-react';
import { StatusBadge, Button, Card, CardBody } from '../../common';
import type { BusinessRule } from '../../../types';

interface RuleItemProps {
  rule: BusinessRule;
  onEdit: (rule: BusinessRule) => void;
  onDelete: (id: string) => void;
}

export function RuleItem({ rule, onEdit, onDelete }: RuleItemProps) {
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
                <h3 className="font-medium text-slate-900">{rule.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <StatusBadge status={rule.status} />
                  {rule.category && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      <Tag className="w-3 h-3" />
                      {rule.category}
                    </span>
                  )}
                  {rule.source && (
                    <span className="text-xs text-slate-500">Source: {rule.source}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(rule)}
                  className="p-1.5"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(rule.id)}
                  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-3 animate-fade-in">
                {rule.description && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs font-medium text-slate-500">Description</span>
                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{rule.description}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Created {formatDate(rule.created_at)}</span>
                  </div>
                  {rule.updated_at && rule.updated_at !== rule.created_at && (
                    <span>Updated {formatDate(rule.updated_at)}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
