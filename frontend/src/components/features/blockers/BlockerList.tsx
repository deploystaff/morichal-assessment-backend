import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button, EmptyState } from '../../common';
import { BlockerItem } from './BlockerItem';
import { BlockerModal } from './BlockerModal';
import type { Blocker } from '../../../types';

interface BlockerListProps {
  blockers: Blocker[];
  onAdd: (data: Partial<Blocker>) => void;
  onUpdate: (id: string, data: Partial<Blocker>) => void;
  onDelete: (id: string) => void;
  onResolve?: (id: string, resolution: string) => void;
  meetingId?: string;
}

export function BlockerList({ blockers, onAdd, onUpdate, onDelete, onResolve, meetingId }: BlockerListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlocker, setEditingBlocker] = useState<Blocker | null>(null);
  const [resolvingBlockerId, setResolvingBlockerId] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');

  const handleEdit = (blocker: Blocker) => {
    setEditingBlocker(blocker);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Partial<Blocker>) => {
    if (editingBlocker) {
      onUpdate(editingBlocker.id, data);
    } else {
      onAdd(data);
    }
    setIsModalOpen(false);
    setEditingBlocker(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlocker(null);
  };

  const handleResolveClick = (id: string) => {
    setResolvingBlockerId(id);
    setResolution('');
  };

  const handleResolveSubmit = () => {
    if (resolvingBlockerId && onResolve && resolution.trim()) {
      onResolve(resolvingBlockerId, resolution);
      setResolvingBlockerId(null);
      setResolution('');
    }
  };

  const openBlockers = blockers.filter(b => b.status !== 'resolved');
  const resolvedBlockers = blockers.filter(b => b.status === 'resolved');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Blockers & Risks</h2>
          {openBlockers.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
              {openBlockers.length} open
            </span>
          )}
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="md"
          className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Add Blocker
        </Button>
      </div>

      {/* Resolution Modal */}
      {resolvingBlockerId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Resolve Blocker</h3>
            <textarea
              className="w-full border border-slate-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={4}
              placeholder="Describe how this blocker was resolved..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="secondary" onClick={() => setResolvingBlockerId(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleResolveSubmit}
                disabled={!resolution.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                Mark Resolved
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Blockers List */}
      {blockers.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No blockers"
          description="Track blockers and risks that may impact the project"
          action={
            <Button
              onClick={() => setIsModalOpen(true)}
              size="md"
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 mr-1.5" />
              Add Blocker
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Open Blockers */}
          {openBlockers.length > 0 && (
            <div className="space-y-3">
              {openBlockers.map((blocker) => (
                <BlockerItem
                  key={blocker.id}
                  blocker={blocker}
                  onEdit={handleEdit}
                  onDelete={onDelete}
                  onResolve={onResolve ? handleResolveClick : undefined}
                />
              ))}
            </div>
          )}

          {/* Resolved Blockers */}
          {resolvedBlockers.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-3">
                Resolved ({resolvedBlockers.length})
              </h3>
              <div className="space-y-3">
                {resolvedBlockers.map((blocker) => (
                  <BlockerItem
                    key={blocker.id}
                    blocker={blocker}
                    onEdit={handleEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <BlockerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        blocker={editingBlocker}
        meetingId={meetingId}
      />
    </div>
  );
}
