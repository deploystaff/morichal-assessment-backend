import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Trash2 } from 'lucide-react';
import type { Blocker } from '../../../types';

interface PresentationBlockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocker: Blocker | null;
  meetingId: string;
  onSave: (data: Partial<Blocker>) => void;
  onDelete?: (id: string) => void;
}

const severityOptions = [
  { value: 'critical', label: 'Critical', color: 'text-red-600' },
  { value: 'high', label: 'High', color: 'text-orange-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'low', label: 'Low', color: 'text-blue-600' },
];

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

export function PresentationBlockerModal({
  isOpen,
  onClose,
  blocker,
  meetingId,
  onSave,
  onDelete,
}: PresentationBlockerModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as Blocker['severity'],
    status: 'open' as Blocker['status'],
    owner: '',
    resolution: '',
  });

  useEffect(() => {
    if (blocker) {
      setFormData({
        title: blocker.title,
        description: blocker.description,
        severity: blocker.severity,
        status: blocker.status,
        owner: blocker.owner || '',
        resolution: blocker.resolution || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        status: 'open',
        owner: '',
        resolution: '',
      });
    }
  }, [blocker, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      meeting: meetingId,
      owner: formData.owner || null,
      resolution: formData.resolution || null,
    });
  };

  const handleDelete = () => {
    if (blocker && onDelete && confirm('Are you sure you want to delete this blocker?')) {
      onDelete(blocker.id);
      onClose();
    }
  };

  const isValid = formData.title.trim().length > 0 && formData.description.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={blocker ? 'Edit Blocker' : 'Add Blocker'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter blocker title..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the blocker in detail..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            required
          />
        </div>

        {/* Severity & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Severity
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as Blocker['severity'] })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {severityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Blocker['status'] })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Owner */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Owner
          </label>
          <input
            type="text"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            placeholder="Who is responsible for resolving this?"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Resolution (if editing and resolved) */}
        {blocker && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Resolution
            </label>
            <textarea
              value={formData.resolution}
              onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
              placeholder="How was this resolved?"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>
        )}

        <ModalFooter>
          {blocker && onDelete && (
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
            {blocker ? 'Update Blocker' : 'Add Blocker'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
