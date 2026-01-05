import { useState, useEffect } from 'react';
import { Modal, Button, Textarea, Select } from '../../common';
import type { Question } from '../../../types';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Question>) => void;
  question?: Question | null;
  meetingId?: string;
}

export function QuestionModal({
  isOpen,
  onClose,
  onSubmit,
  question,
  meetingId,
}: QuestionModalProps) {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    status: 'pending' as Question['status'],
    priority: 'medium' as Question['priority'],
    category: '',
    notes: '',
  });

  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question,
        answer: question.answer || '',
        status: question.status,
        priority: question.priority,
        category: question.category || '',
        notes: question.notes || '',
      });
    } else {
      setFormData({
        question: '',
        answer: '',
        status: 'pending',
        priority: 'medium',
        category: '',
        notes: '',
      });
    }
  }, [question, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      question: formData.question,
      answer: formData.answer || null,
      status: formData.status,
      priority: formData.priority,
      category: formData.category || null,
      notes: formData.notes || null,
      asked_in_meeting: question?.asked_in_meeting || meetingId || null,
    });
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'answered', label: 'Answered' },
    { value: 'needs-follow-up', label: 'Needs Follow-up' },
    { value: 'deferred', label: 'Deferred' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const categoryOptions = [
    { value: '', label: 'Select category' },
    { value: 'technical', label: 'Technical' },
    { value: 'business', label: 'Business' },
    { value: 'design', label: 'Design' },
    { value: 'process', label: 'Process' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={question ? 'Edit Question' : 'Add Question'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          label="Question"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="Enter the question..."
          rows={3}
          required
        />

        <Textarea
          label="Answer"
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          placeholder="Enter the answer (if known)..."
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as Question['status'] })
            }
            options={statusOptions}
          />

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value as Question['priority'] })
            }
            options={priorityOptions}
          />
        </div>

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={categoryOptions}
        />

        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
          rows={2}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{question ? 'Update' : 'Add'} Question</Button>
        </div>
      </form>
    </Modal>
  );
}
