import { ArrowLeft, Calendar, Clock, Users, Presentation } from 'lucide-react';
import { Button, StatusBadge } from '../../common';
import type { Meeting } from '../../../types';

interface PresentationHeaderProps {
  meeting: Meeting;
  onExit: () => void;
}

export function PresentationHeader({ meeting, onExit }: PresentationHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Exit + Meeting Info */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              className="text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Exit
            </Button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center shadow-md">
                <Presentation className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">{meeting.title}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(meeting.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(meeting.date)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Status + Attendees */}
          <div className="flex items-center gap-4">
            {meeting.attendees && meeting.attendees.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                <span className="max-w-xs truncate">
                  {meeting.attendees.slice(0, 3).join(', ')}
                  {meeting.attendees.length > 3 && ` +${meeting.attendees.length - 3}`}
                </span>
              </div>
            )}
            <StatusBadge status={meeting.status} />
          </div>
        </div>
      </div>
    </header>
  );
}
