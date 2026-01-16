import { useState, useMemo } from 'react';
import { Plus, Search, Calendar } from 'lucide-react';
import { Button, FilterTabs, EmptyState } from '../../common';
import { MeetingCard } from './MeetingCard';
import { MeetingModal } from './MeetingModal';
import type { Meeting } from '../../../types';

interface MeetingListProps {
  meetings: Meeting[];
  onAdd: (data: Partial<Meeting>) => void;
  onUpdate: (id: string, data: Partial<Meeting>) => void;
  onDelete: (id: string) => void;
  onSelect: (meeting: Meeting) => void;
}

export function MeetingList({ meetings, onAdd, onUpdate, onDelete, onSelect }: MeetingListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((m) => {
        const matchesFilter = filter === 'all' || m.status === filter;
        const matchesSearch =
          searchQuery === '' ||
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.agenda?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [meetings, filter, searchQuery]);

  // Get the most recent meeting for template (auto-fill when creating new)
  const lastMeeting = useMemo(() => {
    if (meetings.length === 0) return null;
    return [...meetings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [meetings]);

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Partial<Meeting>) => {
    if (editingMeeting) {
      onUpdate(editingMeeting.id, data);
    } else {
      onAdd(data);
    }
    setIsModalOpen(false);
    setEditingMeeting(null);
  };

  const handleStatusChange = (id: string, status: Meeting['status']) => {
    onUpdate(id, { status });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMeeting(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Meetings</h2>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Schedule Meeting
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <FilterTabs options={filterOptions} value={filter} onChange={setFilter} />
      </div>

      {/* Meetings Grid */}
      {filteredMeetings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No meetings found"
          description={
            filter !== 'all' || searchQuery
              ? 'Try adjusting your filters or search query'
              : 'Schedule your first meeting to get started'
          }
          action={
            filter === 'all' && !searchQuery ? (
              <Button onClick={() => setIsModalOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Schedule Meeting
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onClick={onSelect}
              onEdit={handleEdit}
              onDelete={onDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <MeetingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        meeting={editingMeeting}
        templateMeeting={!editingMeeting ? lastMeeting : null}
      />
    </div>
  );
}
