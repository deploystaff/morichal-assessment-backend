import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../../common/Modal';
import { Button } from '../../common/Button';
import type { Sprint } from '../../../types';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprint: Sprint | null;
  onSave: (data: Partial<Sprint>) => void;
}

const statusOptions = [
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const colorOptions = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#10B981', label: 'Green' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#EF4444', label: 'Red' },
  { value: '#06B6D4', label: 'Cyan' },
];

export function SprintModal({ isOpen, onClose, sprint, onSave }: SprintModalProps) {
  const [formData, setFormData] = useState({
    sprint_code: '',
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planned' as Sprint['status'],
    color: '#3B82F6',
    order: 0,
  });

  // Populate form when editing
  useEffect(() => {
    if (sprint) {
      setFormData({
        sprint_code: sprint.sprint_code,
        name: sprint.name,
        description: sprint.description || '',
        start_date: sprint.start_date,
        end_date: sprint.end_date,
        status: sprint.status,
        color: sprint.color,
        order: sprint.order,
      });
    } else {
      // Reset for new sprint
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      setFormData({
        sprint_code: '',
        name: '',
        description: '',
        start_date: today.toISOString().split('T')[0],
        end_date: nextWeek.toISOString().split('T')[0],
        status: 'planned',
        color: '#3B82F6',
        order: 0,
      });
    }
  }, [sprint, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isValid = formData.sprint_code && formData.name && formData.start_date && formData.end_date;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sprint ? 'Edit Sprint' : 'Create Sprint'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sprint Code & Name */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sprint Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.sprint_code}
              onChange={(e) => setFormData({ ...formData, sprint_code: e.target.value })}
              placeholder="e.g., S1, SP-01"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sprint Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Core Foundation"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of sprint goals..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              required
            />
          </div>
        </div>

        {/* Status & Color */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Sprint['status'] })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Color
            </label>
            <div className="flex items-center gap-2">
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="flex-grow px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                {colorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div
                className="w-10 h-10 rounded-lg border border-slate-300 flex-shrink-0"
                style={{ backgroundColor: formData.color }}
              />
            </div>
          </div>
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            min={0}
            className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          <p className="mt-1 text-xs text-slate-500">Lower numbers appear first in the timeline</p>
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!isValid}>
            {sprint ? 'Update Sprint' : 'Create Sprint'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
