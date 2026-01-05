import { useState } from 'react';
import { ArrowRight, Plus, User, Calendar, X } from 'lucide-react';
import { Button, Input, Select } from '../../common';
import type { ActionItem } from '../../../types';

interface PresentationNextStepsProps {
  meetingId: string;
  onAddAction: (data: Partial<ActionItem>) => void;
}

interface NewAction {
  title: string;
  assigned_to: string;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
}

export function PresentationNextSteps({ meetingId, onAddAction }: PresentationNextStepsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newActions, setNewActions] = useState<NewAction[]>([]);
  const [formData, setFormData] = useState<NewAction>({
    title: '',
    assigned_to: '',
    due_date: '',
    priority: 'medium',
  });

  const handleAdd = () => {
    if (formData.title.trim()) {
      const action: NewAction = {
        title: formData.title,
        assigned_to: formData.assigned_to || '',
        due_date: formData.due_date || '',
        priority: formData.priority,
      };

      // Add to local list for display
      setNewActions([...newActions, action]);

      // Also save to backend
      onAddAction({
        title: formData.title,
        assigned_to: formData.assigned_to || null,
        due_date: formData.due_date || null,
        priority: formData.priority,
        status: 'pending',
        from_meeting: meetingId,
      });

      // Reset form
      setFormData({
        title: '',
        assigned_to: '',
        due_date: '',
        priority: 'medium',
      });
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    setNewActions(newActions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Capture new commitments during the call.</strong> These will be saved as action items for follow-up.
        </p>
      </div>

      {/* New Actions Added This Session */}
      {newActions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Added This Meeting ({newActions.length})
          </h4>
          <div className="space-y-2">
            {newActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{action.title}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {action.assigned_to && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {action.assigned_to}
                      </span>
                    )}
                    {action.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(action.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Form */}
      {isAdding ? (
        <div className="p-4 bg-white rounded-lg border-2 border-dashed border-primary/30">
          <div className="space-y-3">
            <Input
              label="Action Item"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              autoFocus
            />

            <div className="grid grid-cols-2 gap-3">
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

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
              options={[
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={!formData.title.trim()}>
                <Plus className="w-4 h-4 mr-1" />
                Add Action
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="secondary"
          onClick={() => setIsAdding(true)}
          className="w-full border-2 border-dashed"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Next Step
        </Button>
      )}
    </div>
  );
}
