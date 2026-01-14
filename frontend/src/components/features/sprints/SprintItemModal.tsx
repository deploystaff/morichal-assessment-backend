import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Trash2 } from 'lucide-react';
import { useDeleteSprintItem } from '../../../hooks/useData';
import type { SprintItem } from '../../../types';

interface SprintItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SprintItem | null;
  sprintId: string;
  onSave: (data: Partial<SprintItem>) => void;
}

const itemTypeOptions = [
  { value: 'agent', label: 'Agent' },
  { value: 'feature', label: 'Feature' },
  { value: 'task', label: 'Task' },
  { value: 'bugfix', label: 'Bugfix' },
  { value: 'milestone', label: 'Milestone' },
];

const statusOptions = [
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'cancelled', label: 'Cancelled' },
];

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function SprintItemModal({ isOpen, onClose, item, sprintId, onSave }: SprintItemModalProps) {
  const deleteItem = useDeleteSprintItem();

  const [formData, setFormData] = useState({
    item_code: '',
    name: '',
    description: '',
    item_type: 'feature' as SprintItem['item_type'],
    status: 'planned' as SprintItem['status'],
    priority: 'medium' as SprintItem['priority'],
    assigned_to: '',
    estimated_hours: '',
    start_date: '',
    end_date: '',
    notes: '',
    order: 0,
  });

  // Populate form when editing
  useEffect(() => {
    if (item) {
      setFormData({
        item_code: item.item_code,
        name: item.name,
        description: item.description || '',
        item_type: item.item_type,
        status: item.status,
        priority: item.priority,
        assigned_to: item.assigned_to || '',
        estimated_hours: item.estimated_hours?.toString() || '',
        start_date: item.start_date || '',
        end_date: item.end_date || '',
        notes: item.notes || '',
        order: item.order,
      });
    } else {
      // Reset for new item
      setFormData({
        item_code: '',
        name: '',
        description: '',
        item_type: 'feature',
        status: 'planned',
        priority: 'medium',
        assigned_to: '',
        estimated_hours: '',
        start_date: '',
        end_date: '',
        notes: '',
        order: 0,
      });
    }
  }, [item, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      sprint: sprintId,
    });
  };

  const handleDelete = () => {
    if (item && confirm('Are you sure you want to delete this item?')) {
      deleteItem.mutate(item.id);
      onClose();
    }
  };

  const isValid = formData.item_code && formData.name;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Sprint Item' : 'Add Sprint Item'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Code & Name */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Item Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.item_code}
              onChange={(e) => setFormData({ ...formData, item_code: e.target.value })}
              placeholder="e.g., A-1, F-2"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Email Intake Agent"
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
            placeholder="Brief description of this item..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          />
        </div>

        {/* Type, Status, Priority */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type
            </label>
            <select
              value={formData.item_type}
              onChange={(e) => setFormData({ ...formData, item_type: e.target.value as SprintItem['item_type'] })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {itemTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as SprintItem['status'] })}
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
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as SprintItem['priority'] })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assigned To & Estimated Hours */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assigned To
            </label>
            <input
              type="text"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              placeholder="e.g., John Doe"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estimated Hours
            </label>
            <input
              type="number"
              value={formData.estimated_hours}
              onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
              placeholder="e.g., 8"
              min={0}
              step={0.5}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              max={formData.end_date || undefined}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              min={formData.start_date || undefined}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

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
          {item && (
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
            {item ? 'Update Item' : 'Add Item'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
