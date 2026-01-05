import { useState } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { Button, EmptyState } from '../../common';
import { UpdateItem } from './UpdateItem';
import { UpdateModal } from './UpdateModal';
import type { Update } from '../../../types';

interface UpdateListProps {
  updates: Update[];
  onAdd: (data: Partial<Update>) => void;
  onUpdate: (id: string, data: Partial<Update>) => void;
  onDelete: (id: string) => void;
  meetingId?: string;
}

export function UpdateList({ updates, onAdd, onUpdate, onDelete, meetingId }: UpdateListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);

  const handleEdit = (update: Update) => {
    setEditingUpdate(update);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Partial<Update>) => {
    if (editingUpdate) {
      onUpdate(editingUpdate.id, data);
    } else {
      onAdd(data);
    }
    setIsModalOpen(false);
    setEditingUpdate(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUpdate(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Progress Updates</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="md"
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Add Update
        </Button>
      </div>

      {/* Updates List */}
      {updates.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No updates yet"
          description="Share progress updates from team members"
          action={
            <Button
              onClick={() => setIsModalOpen(true)}
              size="md"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 mr-1.5" />
              Add Update
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {updates.map((update) => (
            <UpdateItem
              key={update.id}
              update={update}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <UpdateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        update={editingUpdate}
        meetingId={meetingId}
      />
    </div>
  );
}
