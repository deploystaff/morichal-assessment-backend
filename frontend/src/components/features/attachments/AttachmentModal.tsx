import { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../../common';
import type { Attachment } from '../../../types';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Attachment>) => void;
  meetingId?: string;
}

export function AttachmentModal({ isOpen, onClose, onSubmit, meetingId }: AttachmentModalProps) {
  const [formData, setFormData] = useState({
    filename: '',
    file_type: 'link' as Attachment['file_type'],
    file_url: '',
    description: '',
    uploaded_by: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        filename: '',
        file_type: 'link',
        file_url: '',
        description: '',
        uploaded_by: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      filename: formData.filename,
      file_type: formData.file_type,
      file_url: formData.file_url,
      description: formData.description || null,
      uploaded_by: formData.uploaded_by || null,
      meeting: meetingId,
    });
  };

  const fileTypeOptions = [
    { value: 'link', label: 'External Link' },
    { value: 'pdf', label: 'PDF Document' },
    { value: 'doc', label: 'Word Document' },
    { value: 'spreadsheet', label: 'Spreadsheet' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'image', label: 'Image' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Attachment"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          value={formData.filename}
          onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
          placeholder="Document or link name"
          required
        />

        <Select
          label="Type"
          value={formData.file_type}
          onChange={(e) => setFormData({ ...formData, file_type: e.target.value as Attachment['file_type'] })}
          options={fileTypeOptions}
        />

        <Input
          label="URL"
          type="url"
          value={formData.file_url}
          onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
          placeholder="https://..."
          required
        />

        <Input
          label="Uploaded By"
          value={formData.uploaded_by}
          onChange={(e) => setFormData({ ...formData, uploaded_by: e.target.value })}
          placeholder="Who is sharing this?"
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the attachment..."
          rows={3}
        />

        <div className="sticky bottom-0 bg-white flex justify-end gap-3 pt-4 pb-1 border-t border-slate-200 -mx-6 px-6 -mb-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Attachment</Button>
        </div>
      </form>
    </Modal>
  );
}
