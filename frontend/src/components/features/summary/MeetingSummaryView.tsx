import { useState } from 'react';
import { FileText, Edit2, Trash2, Save, X, Sparkles, CheckCircle } from 'lucide-react';
import { Button, Card, CardBody, EmptyState, Textarea } from '../../common';
import type { MeetingSummary } from '../../../types';

interface MeetingSummaryViewProps {
  summary: MeetingSummary | null;
  onSave: (data: Partial<MeetingSummary>) => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export function MeetingSummaryView({ summary, onSave, onDelete, isLoading }: MeetingSummaryViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(summary?.content || '');
  const [keyPoints, setKeyPoints] = useState<string[]>(summary?.key_points || []);
  const [newKeyPoint, setNewKeyPoint] = useState('');

  const handleStartEdit = () => {
    setContent(summary?.content || '');
    setKeyPoints(summary?.key_points || []);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave({
      content,
      key_points: keyPoints.filter(kp => kp.trim()),
      generated_by: 'manual',
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(summary?.content || '');
    setKeyPoints(summary?.key_points || []);
    setIsEditing(false);
  };

  const handleAddKeyPoint = () => {
    if (newKeyPoint.trim()) {
      setKeyPoints([...keyPoints, newKeyPoint.trim()]);
      setNewKeyPoint('');
    }
  };

  const handleRemoveKeyPoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Empty state - no summary yet
  if (!summary && !isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Meeting Summary</h2>
        </div>
        <EmptyState
          icon={FileText}
          title="No summary yet"
          description="Create a summary to capture key outcomes from this meeting"
          action={
            <Button
              onClick={() => setIsEditing(true)}
              size="md"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all"
            >
              <Edit2 className="w-5 h-5 mr-1.5" />
              Create Summary
            </Button>
          }
        />
      </div>
    );
  }

  // Edit mode
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {summary ? 'Edit Summary' : 'Create Summary'}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <Card>
          <CardBody className="p-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Summary
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comprehensive summary of the meeting..."
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Key Points
              </label>
              <div className="space-y-2">
                {keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-slate-50 rounded-md">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="flex-1 text-sm text-slate-700">{point}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyPoint(index)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyPoint}
                    onChange={(e) => setNewKeyPoint(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyPoint())}
                    placeholder="Add a key point..."
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddKeyPoint}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // View mode - summary must exist at this point
  if (!summary) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Meeting Summary</h2>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleStartEdit}>
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardBody className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              summary.generated_by === 'ai'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {summary.generated_by === 'ai' ? (
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Generated
                </span>
              ) : (
                'Manual'
              )}
            </span>
            <span className="text-xs text-slate-500">
              Last updated {formatDate(summary.updated_at)}
            </span>
          </div>

          <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap mb-4">
            {summary.content}
          </div>

          {summary.key_points && summary.key_points.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Key Points</h4>
              <ul className="space-y-2">
                {summary.key_points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
