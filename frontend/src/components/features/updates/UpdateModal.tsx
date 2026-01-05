import { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../../common';
import type { Update } from '../../../types';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Update>) => void;
  update?: Update | null;
  meetingId?: string;
}

export function UpdateModal({ isOpen, onClose, onSubmit, update, meetingId }: UpdateModalProps) {
  const [formData, setFormData] = useState({
    author: '',
    content: '',
    category: 'general' as Update['category'],
  });

  useEffect(() => {
    if (update) {
      setFormData({
        author: update.author,
        content: update.content,
        category: update.category,
      });
    } else {
      setFormData({
        author: '',
        content: '',
        category: 'general',
      });
    }
  }, [update, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      author: formData.author,
      content: formData.content,
      category: formData.category,
      meeting: update?.meeting || meetingId,
    });
  };

  const categoryOptions = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'testing', label: 'Testing' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'general', label: 'General' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={update ? 'Edit Update' : 'Add Update'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          placeholder="Who is sharing this update?"
          required
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as Update['category'] })}
          options={categoryOptions}
        />

        <Textarea
          label="Update"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Share your progress update..."
          rows={5}
          required
        />

        <div className="sticky bottom-0 bg-white flex justify-end gap-3 pt-4 pb-1 border-t border-slate-200 -mx-6 px-6 -mb-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{update ? 'Update' : 'Add'} Update</Button>
        </div>
      </form>
    </Modal>
  );
}
