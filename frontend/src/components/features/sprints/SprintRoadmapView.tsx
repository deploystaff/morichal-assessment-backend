import { useState } from 'react';
import { Rocket, Plus, TrendingUp } from 'lucide-react';
import { SprintProgressRing } from './SprintProgressRing';
import { SprintMilestoneCard } from './SprintMilestoneCard';
import { SprintModal } from './SprintModal';
import { SprintItemModal } from './SprintItemModal';
import {
  useCreateSprint,
  useUpdateSprint,
  useDeleteSprint,
  useCreateSprintItem,
  useUpdateSprintItem,
  useCompleteSprintItem,
} from '../../../hooks/useData';
import type { RoadmapSummary, Sprint, SprintItem } from '../../../types';

interface SprintRoadmapViewProps {
  roadmap: RoadmapSummary | null;
  isLoading?: boolean;
}

export function SprintRoadmapView({ roadmap, isLoading }: SprintRoadmapViewProps) {
  // Modal states
  const [sprintModalOpen, setSprintModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [editingItem, setEditingItem] = useState<SprintItem | null>(null);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

  // Mutations
  const createSprint = useCreateSprint();
  const updateSprint = useUpdateSprint();
  const deleteSprint = useDeleteSprint();
  const createSprintItem = useCreateSprintItem();
  const updateSprintItem = useUpdateSprintItem();
  const completeSprintItem = useCompleteSprintItem();

  // Handlers
  const handleEditSprint = (sprint: Sprint) => {
    setEditingSprint(sprint);
    setSprintModalOpen(true);
  };

  const handleAddSprint = () => {
    setEditingSprint(null);
    setSprintModalOpen(true);
  };

  const handleDeleteSprint = (id: string) => {
    if (confirm('Are you sure you want to delete this sprint?')) {
      deleteSprint.mutate(id);
    }
  };

  const handleSaveSprint = (data: Partial<Sprint>) => {
    if (editingSprint) {
      updateSprint.mutate({ id: editingSprint.id, data });
    } else {
      createSprint.mutate(data as Omit<Sprint, 'id' | 'created_at' | 'updated_at' | 'progress' | 'total_items' | 'completed_items' | 'items'>);
    }
    setSprintModalOpen(false);
    setEditingSprint(null);
  };

  const handleAddItem = (sprintId: string) => {
    setSelectedSprintId(sprintId);
    setEditingItem(null);
    setItemModalOpen(true);
  };

  const handleEditItem = (item: SprintItem) => {
    setEditingItem(item);
    setSelectedSprintId(item.sprint);
    setItemModalOpen(true);
  };

  const handleSaveItem = (data: Partial<SprintItem>) => {
    if (editingItem) {
      updateSprintItem.mutate({ id: editingItem.id, data });
    } else if (selectedSprintId) {
      createSprintItem.mutate({ ...data, sprint: selectedSprintId } as Omit<SprintItem, 'id' | 'created_at' | 'updated_at'>);
    }
    setItemModalOpen(false);
    setEditingItem(null);
    setSelectedSprintId(null);
  };

  const handleToggleItemComplete = (id: string, completed: boolean) => {
    if (completed) {
      completeSprintItem.mutate(id);
    } else {
      updateSprintItem.mutate({ id, data: { status: 'in_progress' } });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Empty state
  if (!roadmap || !roadmap.sprints || roadmap.sprints.length === 0) {
    return (
      <div className="text-center py-16">
        <Rocket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600 mb-2">No sprints yet</h3>
        <p className="text-slate-500 mb-6">Create your first sprint to start tracking progress</p>
        <button
          onClick={handleAddSprint}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-teal-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Create First Sprint
        </button>
      </div>
    );
  }

  const currentSprintIndex = roadmap.sprints.findIndex(
    (s) => s.status === 'in_progress'
  );

  return (
    <div className="space-y-8">
      {/* Overall Progress Header */}
      <div className="bg-gradient-to-r from-primary/5 via-white to-teal-500/5 rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-6">
          {/* Progress Ring */}
          <SprintProgressRing
            progress={roadmap.overall_progress}
            size={100}
            strokeWidth={10}
            color="primary"
          />

          {/* Stats */}
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              MorichalAI Development Roadmap
            </h2>
            <p className="text-slate-600 mb-3">
              {roadmap.completed_items} of {roadmap.total_items} items complete
            </p>

            {/* Current Sprint Badge */}
            {roadmap.current_sprint && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">
                  Currently: {roadmap.current_sprint.name}
                </span>
                <span className="text-blue-500">
                  ({roadmap.current_sprint.progress}%)
                </span>
              </div>
            )}
          </div>

          {/* Add Sprint Button */}
          <button
            onClick={handleAddSprint}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Sprint
          </button>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="pl-4">
        {roadmap.sprints
          .sort((a, b) => a.order - b.order)
          .map((sprint, index) => (
            <SprintMilestoneCard
              key={sprint.id}
              sprint={sprint}
              isCurrent={index === currentSprintIndex}
              isLast={index === roadmap.sprints.length - 1}
              onEditSprint={handleEditSprint}
              onDeleteSprint={handleDeleteSprint}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onToggleItemComplete={handleToggleItemComplete}
            />
          ))}
      </div>

      {/* Add Sprint at Bottom */}
      <div className="flex justify-center">
        <button
          onClick={handleAddSprint}
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-slate-300 text-slate-500 font-medium rounded-xl hover:border-primary hover:text-primary transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Another Sprint
        </button>
      </div>

      {/* Modals */}
      <SprintModal
        isOpen={sprintModalOpen}
        onClose={() => {
          setSprintModalOpen(false);
          setEditingSprint(null);
        }}
        sprint={editingSprint}
        onSave={handleSaveSprint}
      />

      <SprintItemModal
        isOpen={itemModalOpen}
        onClose={() => {
          setItemModalOpen(false);
          setEditingItem(null);
          setSelectedSprintId(null);
        }}
        item={editingItem}
        sprintId={selectedSprintId || ''}
        onSave={handleSaveItem}
      />
    </div>
  );
}
