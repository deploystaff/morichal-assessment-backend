import { useState } from 'react';
import { Plus, Rocket, Calendar, Flag, Loader2 } from 'lucide-react';
import { useDeliveryMilestones, useCreateDeliveryMilestone, useUpdateDeliveryMilestone, useDeleteDeliveryMilestone } from '../../../hooks/useData';
import type { DeliveryMilestone } from '../../../types';
import { DeliveryMilestoneNode } from './DeliveryMilestoneNode';
import { DeliveryMilestoneModal } from './DeliveryMilestoneModal';

interface DeliveryTimelineProps {
  className?: string;
}

export function DeliveryTimeline({ className = '' }: DeliveryTimelineProps) {
  const { data: milestones = [], isLoading } = useDeliveryMilestones();
  const createMilestone = useCreateDeliveryMilestone();
  const updateMilestone = useUpdateDeliveryMilestone();
  const deleteMilestone = useDeleteDeliveryMilestone();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<DeliveryMilestone | null>(null);

  // Sort milestones by start_date
  const sortedMilestones = [...milestones].sort((a, b) =>
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  // Get date range for the timeline
  const dates = sortedMilestones.flatMap(m => [
    new Date(m.start_date),
    m.end_date ? new Date(m.end_date) : new Date(m.start_date)
  ]);
  const minDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
  const maxDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();

  // Add padding to date range
  const paddedMinDate = new Date(minDate);
  paddedMinDate.setDate(paddedMinDate.getDate() - 3);
  const paddedMaxDate = new Date(maxDate);
  paddedMaxDate.setDate(paddedMaxDate.getDate() + 3);

  const totalDays = Math.max(1, Math.ceil((paddedMaxDate.getTime() - paddedMinDate.getTime()) / (1000 * 60 * 60 * 24)));

  // Calculate position for a date (0-100%)
  const getPosition = (date: Date) => {
    const daysSinceStart = (date.getTime() - paddedMinDate.getTime()) / (1000 * 60 * 60 * 24);
    return (daysSinceStart / totalDays) * 100;
  };

  // Today marker position
  const today = new Date();
  const todayPosition = getPosition(today);
  const showTodayMarker = todayPosition >= 0 && todayPosition <= 100;

  const handleCreate = async (data: Partial<DeliveryMilestone>) => {
    await createMilestone.mutateAsync(data);
    setIsModalOpen(false);
  };

  const handleUpdate = async (id: string, data: Partial<DeliveryMilestone>) => {
    await updateMilestone.mutateAsync({ id, data });
    setEditingMilestone(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      await deleteMilestone.mutateAsync(id);
    }
  };

  const handleInlineUpdate = async (id: string, data: Partial<DeliveryMilestone>) => {
    await updateMilestone.mutateAsync({ id, data });
  };

  const handleEdit = (milestone: DeliveryMilestone) => {
    setEditingMilestone(milestone);
  };

  // Status summary
  const completed = milestones.filter(m => m.status === 'completed').length;
  const inProgress = milestones.filter(m => m.status === 'in_progress').length;
  const upcoming = milestones.filter(m => m.status === 'upcoming').length;
  const delayed = milestones.filter(m => m.status === 'delayed').length;

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-r from-indigo-500/5 via-white to-purple-500/5 rounded-xl border border-indigo-100 p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="ml-2 text-slate-500">Loading delivery timeline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-indigo-500/5 via-white to-purple-500/5 rounded-xl border border-indigo-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Rocket className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Delivery Timeline</h3>
            <p className="text-sm text-slate-500">Project delivery milestones and launch schedule</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Milestone
        </button>
      </div>

      {/* Timeline Content */}
      <div className="p-6">
        {milestones.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-2">No delivery milestones yet</p>
            <p className="text-sm text-slate-400">Add milestones to track your project delivery schedule</p>
          </div>
        ) : (
          <>
            {/* Timeline visualization */}
            <div className="relative mb-8">
              {/* Timeline bar */}
              <div className="h-2 bg-slate-200 rounded-full relative overflow-visible">
                {/* Progress fill based on completed milestones */}
                {todayPosition >= 0 && (
                  <div
                    className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, todayPosition)}%` }}
                  />
                )}

                {/* Today marker */}
                {showTodayMarker && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg z-20"
                    style={{ left: `${todayPosition}%`, transform: 'translate(-50%, -50%)' }}
                    title="Today"
                  >
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-red-600 whitespace-nowrap">
                      Today
                    </span>
                  </div>
                )}
              </div>

              {/* Milestone nodes */}
              <div className="relative mt-8" style={{ minHeight: '120px' }}>
                {sortedMilestones.map((milestone, index) => {
                  const startPos = getPosition(new Date(milestone.start_date));
                  const endPos = milestone.end_date
                    ? getPosition(new Date(milestone.end_date))
                    : startPos;
                  const isPeriod = milestone.milestone_type === 'period' && !!milestone.end_date;

                  return (
                    <DeliveryMilestoneNode
                      key={milestone.id}
                      milestone={milestone}
                      position={startPos}
                      endPosition={endPos}
                      isPeriod={isPeriod}
                      index={index}
                      onUpdate={handleInlineUpdate}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  );
                })}
              </div>
            </div>

            {/* Legend & Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                  <span className="text-sm text-slate-600">Completed ({completed})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="text-sm text-slate-600">In Progress ({inProgress})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-slate-400 rounded-full"></span>
                  <span className="text-sm text-slate-600">Upcoming ({upcoming})</span>
                </div>
                {delayed > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                    <span className="text-sm text-slate-600">Delayed ({delayed})</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Flag className="w-4 h-4" />
                <span>{milestones.length} milestones</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      <DeliveryMilestoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreate}
        existingCodes={milestones.map(m => m.milestone_code)}
      />

      {/* Edit Modal */}
      {editingMilestone && (
        <DeliveryMilestoneModal
          isOpen={true}
          onClose={() => setEditingMilestone(null)}
          onSave={(data) => handleUpdate(editingMilestone.id, data)}
          milestone={editingMilestone}
          existingCodes={milestones.filter(m => m.id !== editingMilestone.id).map(m => m.milestone_code)}
        />
      )}
    </div>
  );
}
