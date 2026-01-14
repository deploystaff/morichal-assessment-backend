import { useState } from 'react';
import { Rocket, Plus, TrendingUp } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SprintProgressRing } from './SprintProgressRing';
import { SortableSprintCard } from './SortableSprintCard';
import { SprintModal } from './SprintModal';
import { SprintItemModal } from './SprintItemModal';
import { DeliveryTimeline } from '../delivery';
import {
  useCreateSprint,
  useUpdateSprint,
  useDeleteSprint,
  useCreateSprintItem,
  useUpdateSprintItem,
  useCompleteSprintItem,
  useDeleteSprintItem,
  useReorderSprints,
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
  const deleteSprintItem = useDeleteSprintItem();
  const reorderSprints = useReorderSprints();

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Start drag after 8px movement
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Inline update handlers (for auto-save functionality)
  const handleInlineSprintUpdate = async (id: string, data: Partial<Sprint>) => {
    await updateSprint.mutateAsync({ id, data });
  };

  const handleInlineItemUpdate = async (id: string, data: Partial<SprintItem>) => {
    await updateSprintItem.mutateAsync({ id, data });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteSprintItem.mutate(id);
    }
  };

  // Drag & Drop handler for sprints
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && roadmap) {
      const sortedSprints = [...roadmap.sprints].sort((a, b) => a.order - b.order);
      const oldIndex = sortedSprints.findIndex((s) => s.id === active.id);
      const newIndex = sortedSprints.findIndex((s) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Calculate new order values
        const reorderedSprints = arrayMove(sortedSprints, oldIndex, newIndex);
        const orderUpdates = reorderedSprints.map((sprint, index) => ({
          id: sprint.id,
          order: index,
        }));

        reorderSprints.mutate(orderUpdates);
      }
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

  const sortedSprints = [...roadmap.sprints].sort((a, b) => a.order - b.order);
  const currentSprintIndex = sortedSprints.findIndex(
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
            <p className="text-slate-600 mb-1">
              {roadmap.completed_items} of {roadmap.total_items} development items complete
            </p>
            {/* Milestone indicator */}
            {roadmap.milestone_total > 0 && (
              <p className="text-sm text-slate-500 mb-2">
                Plus {roadmap.milestone_completed} of {roadmap.milestone_total} launch milestones
              </p>
            )}

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

      {/* Vertical Timeline with Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedSprints.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="pl-4">
            {sortedSprints.map((sprint, index) => (
              <SortableSprintCard
                key={sprint.id}
                sprint={sprint}
                isCurrent={index === currentSprintIndex}
                isLast={index === sortedSprints.length - 1}
                onEditSprint={handleEditSprint}
                onDeleteSprint={handleDeleteSprint}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onToggleItemComplete={handleToggleItemComplete}
                onInlineSprintUpdate={handleInlineSprintUpdate}
                onInlineItemUpdate={handleInlineItemUpdate}
                onDeleteItem={handleDeleteItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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

      {/* Delivery Timeline - Project delivery milestones */}
      <DeliveryTimeline className="mt-8" />

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

// Helper function to reorder array
function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array];
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
}
