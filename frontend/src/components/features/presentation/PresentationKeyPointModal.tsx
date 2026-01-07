import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Trash2 } from 'lucide-react';

interface PresentationKeyPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyPoint: string | null;
  index: number | null;
  onSave: (text: string, index: number | null) => void;
  onDelete?: (index: number) => void;
}

export function PresentationKeyPointModal({
  isOpen,
  onClose,
  keyPoint,
  index,
  onSave,
  onDelete,
}: PresentationKeyPointModalProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (keyPoint !== null) {
      setText(keyPoint);
    } else {
      setText('');
    }
  }, [keyPoint, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSave(text.trim(), index);
    }
  };

  const handleDelete = () => {
    if (index !== null && onDelete && confirm('Are you sure you want to delete this key point?')) {
      onDelete(index);
      onClose();
    }
  };

  const isValid = text.trim().length > 0;
  const isEditing = keyPoint !== null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Key Point' : 'Add Key Point'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Key Point <span className="text-red-500">*</span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a key point from this meeting..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            autoFocus
            required
          />
          <p className="mt-1 text-xs text-slate-500">
            Summarize an important decision, outcome, or insight from the meeting
          </p>
        </div>

        <ModalFooter>
          {isEditing && onDelete && (
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
            {isEditing ? 'Update' : 'Add'} Key Point
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
