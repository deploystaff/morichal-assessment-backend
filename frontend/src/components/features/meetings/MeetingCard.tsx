import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Users, Mic, MoreVertical, Play, CheckCircle } from 'lucide-react';
import { Button, Card, CardBody } from '../../common';
import type { Meeting } from '../../../types';

interface MeetingCardProps {
  meeting: Meeting;
  onClick: (meeting: Meeting) => void;
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Meeting['status']) => void;
}

export function MeetingCard({
  meeting,
  onClick,
  onEdit,
  onDelete,
  onStatusChange,
}: MeetingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled':
        return Calendar;
      case 'in_progress':
        return Play;
      case 'completed':
        return CheckCircle;
      default:
        return Calendar;
    }
  };

  const StatusIcon = getStatusIcon(meeting.status);
  const hasTranscript = Boolean(meeting.transcript_text);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0" onClick={() => onClick(meeting)}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}
              >
                <StatusIcon className="w-3 h-3" />
                {meeting.status.replace(/_/g, ' ')}
              </span>
              {hasTranscript && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  <Mic className="w-3 h-3" />
                  Transcribed
                </span>
              )}
            </div>

            <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors truncate">
              {meeting.title}
            </h3>

            {meeting.agenda && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{meeting.agenda}</p>
            )}

            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(meeting.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(meeting.date)}</span>
              </div>
              {meeting.attendees && meeting.attendees.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{meeting.attendees.length}</span>
                </div>
              )}
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <div className="dropdown">
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              <div className={`dropdown-menu absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 ${menuOpen ? '' : 'hidden'}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit(meeting);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50"
                >
                  Edit Meeting
                </button>
                {meeting.status === 'scheduled' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onStatusChange(meeting.id, 'in_progress');
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50"
                  >
                    Start Meeting
                  </button>
                )}
                {meeting.status === 'in_progress' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onStatusChange(meeting.id, 'completed');
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50"
                  >
                    End Meeting
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete(meeting.id);
                  }}
                  className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                >
                  Delete Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
