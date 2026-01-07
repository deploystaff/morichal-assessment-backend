import { useState } from 'react';
import { Sparkles, CheckCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../common';
import { PresentationKeyPointModal } from './PresentationKeyPointModal';
import type { MeetingSummary } from '../../../types';

interface PresentationSummaryProps {
  summary: MeetingSummary | null;
  onUpdate?: (data: Partial<MeetingSummary>) => void;
}

export function PresentationSummary({ summary, onUpdate }: PresentationSummaryProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingKeyPoint, setEditingKeyPoint] = useState<string | null>(null);

  const keyPoints = summary?.key_points || [];

  const handleAddClick = () => {
    setEditingIndex(null);
    setEditingKeyPoint(null);
    setModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, point: string, index: number) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditingKeyPoint(point);
    setModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this key point?')) {
      const newKeyPoints = [...keyPoints];
      newKeyPoints.splice(index, 1);
      onUpdate?.({ key_points: newKeyPoints });
    }
  };

  const handleModalSave = (text: string, index: number | null) => {
    const newKeyPoints = [...keyPoints];
    if (index !== null) {
      // Edit existing
      newKeyPoints[index] = text;
    } else {
      // Add new
      newKeyPoints.push(text);
    }
    onUpdate?.({ key_points: newKeyPoints });
    setModalOpen(false);
    setEditingIndex(null);
    setEditingKeyPoint(null);
  };

  const handleModalDelete = (index: number) => {
    const newKeyPoints = [...keyPoints];
    newKeyPoints.splice(index, 1);
    onUpdate?.({ key_points: newKeyPoints });
    setModalOpen(false);
    setEditingIndex(null);
    setEditingKeyPoint(null);
  };

  if (!summary && !onUpdate) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-lg font-medium text-slate-600">No summary available</p>
        <p className="text-sm">Add key points from the Summary tab to display here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Points */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Key Points
          </h3>
          {onUpdate && (
            <Button size="sm" onClick={handleAddClick}>
              <Plus className="w-4 h-4 mr-1" />
              Add Key Point
            </Button>
          )}
        </div>

        {keyPoints.length === 0 ? (
          <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No key points yet</p>
            {onUpdate && (
              <Button size="sm" className="mt-3" onClick={handleAddClick}>
                <Plus className="w-4 h-4 mr-1" />
                Add First Key Point
              </Button>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {keyPoints.map((point, index) => (
              <li
                key={index}
                className="group flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100 hover:border-emerald-200 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="flex-1 text-slate-700 font-medium">{point}</span>

                {/* Edit/Delete buttons - show on hover */}
                {onUpdate && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditClick(e, point, index)}
                      className="p-1.5 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-colors"
                      title="Edit key point"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, index)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                      title="Delete key point"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Full Summary (Collapsible) */}
      {summary?.content && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Full Summary
            </h3>
            {summary.generated_by === 'ai' && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {summary.content}
            </p>
          </div>
        </div>
      )}

      {/* Key Point Modal */}
      <PresentationKeyPointModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingIndex(null);
          setEditingKeyPoint(null);
        }}
        keyPoint={editingKeyPoint}
        index={editingIndex}
        onSave={handleModalSave}
        onDelete={onUpdate ? handleModalDelete : undefined}
      />
    </div>
  );
}
