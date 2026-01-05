import { Calendar, Download, Upload, Trash2, BookOpen, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../common';
import type { Meeting, BusinessRule } from '../../types';

interface SidebarProps {
  meetings: Meeting[];
  businessRules: BusinessRule[];
  onMeetingClick: (meeting: Meeting) => void;
  onManageRules: () => void;
}

export function Sidebar({ meetings, businessRules, onMeetingClick, onManageRules }: SidebarProps) {
  const upcomingMeetings = meetings
    .filter((m) => m.status === 'scheduled' && new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <aside className="space-y-6">
      {/* Project Status */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-slate-900">Project Status</h3>
        </CardHeader>
        <CardBody className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Sprint 3 Progress</span>
              <span className="font-medium text-primary">82%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '82%' }} />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Status</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
              In Progress
            </span>
          </div>
        </CardBody>
      </Card>

      {/* Upcoming Meetings */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-slate-900">Upcoming Meetings</h3>
        </CardHeader>
        <CardBody className="p-0">
          {upcomingMeetings.length === 0 ? (
            <p className="p-4 text-sm text-slate-500 text-center">No upcoming meetings</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcomingMeetings.map((meeting) => (
                <li key={meeting.id}>
                  <button
                    onClick={() => onMeetingClick(meeting)}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {meeting.title}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(meeting.date)}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {/* Business Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Business Rules</h3>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {businessRules.length}
            </span>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {businessRules.length === 0 ? (
            <p className="p-4 text-sm text-slate-500 text-center">No rules defined yet</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {businessRules.slice(0, 3).map((rule) => (
                <li key={rule.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {rule.title}
                      </p>
                      {rule.category && (
                        <p className="text-xs text-slate-500">{rule.category}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={onManageRules}
            className="w-full flex items-center justify-center gap-1 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 border-t border-slate-100 transition-colors"
          >
            Manage Rules
            <ChevronRight className="w-4 h-4" />
          </button>
        </CardBody>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-slate-900">Data Management</h3>
        </CardHeader>
        <CardBody className="space-y-2">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            Import Data
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </button>
        </CardBody>
      </Card>
    </aside>
  );
}
