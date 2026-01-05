import { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../../common';
import type { BusinessRule } from '../../../types';

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BusinessRule>) => void;
  rule?: BusinessRule | null;
}

export function RuleModal({ isOpen, onClose, onSubmit, rule }: RuleModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    source: '',
    status: 'draft' as BusinessRule['status'],
  });

  useEffect(() => {
    if (rule) {
      setFormData({
        title: rule.title,
        description: rule.description || '',
        category: rule.category || '',
        source: rule.source || '',
        status: rule.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        source: '',
        status: 'draft',
      });
    }
  }, [rule, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description || null,
      category: formData.category || null,
      source: formData.source || null,
      status: formData.status,
    });
  };

  const categoryOptions = [
    { value: '', label: 'Select category' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'process', label: 'Process' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'technical', label: 'Technical' },
    { value: 'communication', label: 'Communication' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'deprecated', label: 'Deprecated' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rule ? 'Edit Business Rule' : 'Add Business Rule'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Rule title..."
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the business rule..."
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categoryOptions}
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as BusinessRule['status'] })}
            options={statusOptions}
          />
        </div>

        <Input
          label="Source"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          placeholder="e.g., Meeting 2024-01-15"
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{rule ? 'Update' : 'Add'} Rule</Button>
        </div>
      </form>
    </Modal>
  );
}
