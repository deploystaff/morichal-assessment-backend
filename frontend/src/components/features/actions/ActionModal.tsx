import { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../../common';
import type { ActionItem } from '../../../types';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ActionItem>) => void;
  action?: ActionItem | null;
  meetingId?: string;
}

export function ActionModal({ isOpen, onClose, onSubmit, action, meetingId }: ActionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as ActionItem['status'],
    priority: 'medium' as ActionItem['priority'],
    assigned_to: '',
    due_date: '',
    notes: '',
  });

  useEffect(() => {
    if (action) {
      setFormData({
        title: action.title,
        description: action.description || '',
        status: action.status,
        priority: action.priority,
        assigned_to: action.assigned_to || '',
        due_date: action.due_date ? action.due_date.split('T')[0] : '',
        notes: action.notes || '',
      });
    } else {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assigned_to: '',
        due_date: nextWeek.toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [action, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description || null,
      status: formData.status,
      priority: formData.priority,
      assigned_to: formData.assigned_to || null,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      notes: formData.notes || null,
      from_meeting: action?.from_meeting || meetingId || null,
    });
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={action ? 'Edit Action Item' : 'Add Action Item'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Action item title..."
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What needs to be done?"
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as ActionItem['status'] })
            }
            options={statusOptions}
          />

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value as ActionItem['priority'] })
            }
            options={priorityOptions}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Assigned To"
            value={formData.assigned_to}
            onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
            placeholder="Who is responsible?"
          />

          <Input
            label="Due Date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          />
        </div>

        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
          rows={2}
        />

        <div className="sticky bottom-0 bg-white flex justify-end gap-3 pt-4 pb-1 border-t border-slate-200 -mx-6 px-6 -mb-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{action ? 'Update' : 'Add'} Action</Button>
        </div>
      </form>
    </Modal>
  );
}
