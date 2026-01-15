import { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../../common';
import type { Decision } from '../../../types';

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Decision>) => void;
  decision?: Decision | null;
}

export function DecisionModal({ isOpen, onClose, onSubmit, decision }: DecisionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    made_by: '',
    implementation_notes: '',
    status: 'pending' as Decision['status'],
  });

  useEffect(() => {
    if (decision) {
      setFormData({
        title: decision.title,
        description: decision.description || '',
        made_by: decision.made_by || '',
        implementation_notes: decision.implementation_notes || '',
        status: decision.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        made_by: '',
        implementation_notes: '',
        status: 'pending',
      });
    }
  }, [decision, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description || null,
      made_by: formData.made_by || null,
      implementation_notes: formData.implementation_notes || null,
      status: formData.status,
    });
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={decision ? 'Edit Decision' : 'Add Decision'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Decision title..."
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the decision..."
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Made By"
            value={formData.made_by}
            onChange={(e) => setFormData({ ...formData, made_by: e.target.value })}
            placeholder="e.g., Team Lead"
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Decision['status'] })}
            options={statusOptions}
          />
        </div>

        <Textarea
          label="Implementation Notes"
          value={formData.implementation_notes}
          onChange={(e) => setFormData({ ...formData, implementation_notes: e.target.value })}
          placeholder="Notes on how to implement this decision..."
          rows={3}
        />

        <div className="sticky bottom-0 bg-white flex justify-end gap-3 pt-4 pb-1 border-t border-slate-200 -mx-6 px-6 -mb-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{decision ? 'Update' : 'Add'} Decision</Button>
        </div>
      </form>
    </Modal>
  );
}
