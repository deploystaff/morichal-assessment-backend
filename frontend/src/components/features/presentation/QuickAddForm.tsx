import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, Input, Select, Textarea } from '../../common';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface QuickAddFormProps {
  fields: Field[];
  onSubmit: (data: Record<string, string>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function QuickAddForm({ fields, onSubmit, onCancel, submitLabel = 'Add' }: QuickAddFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {} as Record<string, string>)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = fields
    .filter(f => f.required)
    .every(f => formData[f.name]?.trim());

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border-2 border-dashed border-primary/30">
      <div className="space-y-3">
        {fields.map((field) => {
          if (field.type === 'textarea') {
            return (
              <Textarea
                key={field.name}
                label={field.label}
                value={formData[field.name]}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                placeholder={field.placeholder}
                rows={3}
                required={field.required}
              />
            );
          }

          if (field.type === 'select' && field.options) {
            return (
              <Select
                key={field.name}
                label={field.label}
                value={formData[field.name]}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                options={field.options}
              />
            );
          }

          return (
            <Input
              key={field.name}
              label={field.label}
              type={field.type === 'date' ? 'date' : 'text'}
              value={formData[field.name]}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              required={field.required}
            />
          );
        })}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid}>
            <Plus className="w-4 h-4 mr-1" />
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
