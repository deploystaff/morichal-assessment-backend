import { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../../common';
import type { Meeting } from '../../../types';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Meeting>) => void;
  meeting?: Meeting | null;
}

export function MeetingModal({ isOpen, onClose, onSubmit, meeting }: MeetingModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    agenda: '',
    date: '',
    time: '',
    status: 'scheduled' as Meeting['status'],
    attendees: '',
    notes: '',
  });

  useEffect(() => {
    if (meeting) {
      const date = new Date(meeting.date);
      setFormData({
        title: meeting.title,
        agenda: meeting.agenda || '',
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5),
        status: meeting.status,
        attendees: meeting.attendees?.join(', ') || '',
        notes: meeting.notes || '',
      });
    } else {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
      setFormData({
        title: '',
        agenda: '',
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        status: 'scheduled',
        attendees: '',
        notes: '',
      });
    }
  }, [meeting, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    onSubmit({
      title: formData.title,
      agenda: formData.agenda || null,
      date: dateTime.toISOString(),
      status: formData.status,
      attendees: formData.attendees
        ? formData.attendees.split(',').map((a) => a.trim())
        : [],
      notes: formData.notes || null,
    });
  };

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={meeting ? 'Edit Meeting' : 'Schedule Meeting'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Meeting title..."
          required
        />

        <Textarea
          label="Agenda"
          value={formData.agenda}
          onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
          placeholder="Meeting agenda and topics..."
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Input
            label="Time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as Meeting['status'] })
          }
          options={statusOptions}
        />

        <Input
          label="Attendees"
          value={formData.attendees}
          onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
          placeholder="John Doe, Jane Smith (comma separated)"
        />

        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Meeting notes..."
          rows={2}
        />

        <div className="sticky bottom-0 bg-white flex justify-end gap-3 pt-4 pb-1 border-t border-slate-200 -mx-6 px-6 -mb-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{meeting ? 'Update' : 'Schedule'} Meeting</Button>
        </div>
      </form>
    </Modal>
  );
}
