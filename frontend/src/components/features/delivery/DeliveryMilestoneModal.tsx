import { useState, useEffect } from 'react';
import { X, Flag, Clock, Circle, Loader2 } from 'lucide-react';
import type { DeliveryMilestone } from '../../../types';

interface DeliveryMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<DeliveryMilestone>) => Promise<void>;
  milestone?: DeliveryMilestone;
  existingCodes: string[];
}

const MILESTONE_TYPES: { value: DeliveryMilestone['milestone_type']; label: string; icon: typeof Flag; description: string }[] = [
  { value: 'deliverable', label: 'Deliverable', icon: Flag, description: 'A single delivery date (e.g., Platform Launch)' },
  { value: 'period', label: 'Period', icon: Clock, description: 'A time range (e.g., Training Phase)' },
  { value: 'checkpoint', label: 'Checkpoint', icon: Circle, description: 'A review or checkpoint (e.g., Demo Meeting)' },
];

const STATUS_OPTIONS: { value: DeliveryMilestone['status']; label: string; color: string }[] = [
  { value: 'upcoming', label: 'Upcoming', color: 'bg-slate-400' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-500' },
  { value: 'delayed', label: 'Delayed', color: 'bg-amber-500' },
];

export function DeliveryMilestoneModal({
  isOpen,
  onClose,
  onSave,
  milestone,
  existingCodes,
}: DeliveryMilestoneModalProps) {
  const [formData, setFormData] = useState({
    milestone_code: '',
    name: '',
    description: '',
    milestone_type: 'deliverable' as DeliveryMilestone['milestone_type'],
    start_date: '',
    end_date: '',
    status: 'upcoming' as DeliveryMilestone['status'],
    notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!milestone;

  useEffect(() => {
    if (milestone) {
      setFormData({
        milestone_code: milestone.milestone_code,
        name: milestone.name,
        description: milestone.description || '',
        milestone_type: milestone.milestone_type,
        start_date: milestone.start_date,
        end_date: milestone.end_date || '',
        status: milestone.status,
        notes: milestone.notes || '',
      });
    } else {
      // Generate next milestone code
      const nextCode = `DM-${(existingCodes.length + 1).toString().padStart(3, '0')}`;
      setFormData({
        milestone_code: nextCode,
        name: '',
        description: '',
        milestone_type: 'deliverable',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'upcoming',
        notes: '',
      });
    }
    setError(null);
  }, [milestone, existingCodes, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.milestone_code.trim()) {
      setError('Milestone code is required');
      return;
    }
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.start_date) {
      setError('Start date is required');
      return;
    }
    if (formData.milestone_type === 'period' && !formData.end_date) {
      setError('End date is required for period milestones');
      return;
    }
    if (!isEditing && existingCodes.includes(formData.milestone_code)) {
      setError('Milestone code already exists');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        end_date: formData.end_date || null,
        description: formData.description || null,
        notes: formData.notes || null,
      });
      onClose();
    } catch (err) {
      setError('Failed to save milestone');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditing ? 'Edit Milestone' : 'Add Milestone'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Milestone Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MILESTONE_TYPES.map(type => {
                const Icon = type.icon;
                const isSelected = formData.milestone_type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, milestone_type: type.value }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className={`text-xs font-medium ${isSelected ? 'text-indigo-600' : 'text-slate-600'}`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {MILESTONE_TYPES.find(t => t.value === formData.milestone_type)?.description}
            </p>
          </div>

          {/* Code and Name */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Code
              </label>
              <input
                type="text"
                value={formData.milestone_code}
                onChange={e => setFormData(prev => ({ ...prev, milestone_code: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="DM-001"
                disabled={isEditing}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Platform Delivery"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {formData.milestone_type === 'period' ? 'Start Date *' : 'Date *'}
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {formData.milestone_type === 'period' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min={formData.start_date}
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(status => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: status.value }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    formData.status === status.value
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${status.color}`} />
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder="Brief description of this milestone..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder="Internal notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Milestone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
