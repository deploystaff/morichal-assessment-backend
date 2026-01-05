import { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../../common';
import type { Blocker } from '../../../types';

interface BlockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Blocker>) => void;
  blocker?: Blocker | null;
  meetingId?: string;
}

export function BlockerModal({ isOpen, onClose, onSubmit, blocker, meetingId }: BlockerModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as Blocker['severity'],
    status: 'open' as Blocker['status'],
    owner: '',
  });

  useEffect(() => {
    if (blocker) {
      setFormData({
        title: blocker.title,
        description: blocker.description,
        severity: blocker.severity,
        status: blocker.status,
        owner: blocker.owner || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        status: 'open',
        owner: '',
      });
    }
  }, [blocker, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
      status: formData.status,
      owner: formData.owner || null,
      meeting: blocker?.meeting || meetingId,
    });
  };

  const severityOptions = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={blocker ? 'Edit Blocker' : 'Add Blocker'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Brief description of the blocker"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Severity"
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value as Blocker['severity'] })}
            options={severityOptions}
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Blocker['status'] })}
            options={statusOptions}
          />
        </div>

        <Input
          label="Owner"
          value={formData.owner}
          onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          placeholder="Who is responsible for resolving this?"
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed description of the blocker and its impact..."
          rows={4}
          required
        />

        <div className="sticky bottom-0 bg-white flex justify-end gap-3 pt-4 pb-1 border-t border-slate-200 -mx-6 px-6 -mb-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{blocker ? 'Update' : 'Add'} Blocker</Button>
        </div>
      </form>
    </Modal>
  );
}
