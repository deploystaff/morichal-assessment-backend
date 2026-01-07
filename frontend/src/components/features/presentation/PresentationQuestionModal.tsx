import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../../common/Modal';
import { Button } from '../../common/Button';
import { RichTextEditor } from '../../common/RichTextEditor';
import { Trash2 } from 'lucide-react';
import type { Question } from '../../../types';

interface PresentationQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  onSave: (data: Partial<Question>) => void;
  onDelete?: (id: string) => void;
}

const statusOptions = [
  { value: 'pending', label: 'Needs Answer' },
  { value: 'answered', label: 'Answered' },
  { value: 'needs-follow-up', label: 'Needs Follow-up' },
  { value: 'deferred', label: 'Deferred' },
];

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const categoryOptions = [
  'Technical',
  'Business',
  'Process',
  'Timeline',
  'Budget',
  'Resources',
  'Other',
];

export function PresentationQuestionModal({
  isOpen,
  onClose,
  question,
  onSave,
  onDelete,
}: PresentationQuestionModalProps) {
  const [formData, setFormData] = useState({
    question: '',
    category: '',
    priority: 'medium' as Question['priority'],
    status: 'pending' as Question['status'],
    answer: '',
    notes: '',
  });

  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question,
        category: question.category || '',
        priority: question.priority,
        status: question.status,
        answer: question.answer || '',
        notes: question.notes || '',
      });
    } else {
      setFormData({
        question: '',
        category: '',
        priority: 'medium',
        status: 'pending',
        answer: '',
        notes: '',
      });
    }
  }, [question, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      category: formData.category || null,
      answer: formData.answer || null,
      notes: formData.notes || null,
    });
  };

  const handleDelete = () => {
    if (question && onDelete && confirm('Are you sure you want to delete this question?')) {
      onDelete(question.id);
      onClose();
    }
  };

  const isValid = formData.question.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={question ? 'Edit Question' : 'Add Question'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Question <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="Enter the question..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            required
          />
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">Select category...</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Question['priority'] })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Question['status'] })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Answer (if editing) */}
        {question && (
          <RichTextEditor
            label="Answer"
            value={formData.answer}
            onChange={(value) => setFormData({ ...formData, answer: value })}
            placeholder="Enter the answer..."
            minHeight="120px"
          />
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          />
        </div>

        <ModalFooter>
          {question && onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              className="mr-auto"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!isValid}>
            {question ? 'Update Question' : 'Add Question'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
