import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Mic,
  Play,
  Pause,
  CheckCircle,
  Sparkles,
  Loader2,
  Presentation,
} from 'lucide-react';
import { Button, Card, CardHeader, CardBody, StatusBadge, Badge } from '../../common';
import { QuestionList } from '../questions';
import { ActionList } from '../actions';
import { UpdateList } from '../updates';
import { BlockerList } from '../blockers';
import { AttachmentList } from '../attachments';
import { MeetingSummaryView } from '../summary';
import { TranscriptUpload } from './TranscriptUpload';
import type { Meeting, Question, ActionItem, Update, Blocker, Attachment, MeetingSummary } from '../../../types';

interface MeetingDetailProps {
  meeting: Meeting;
  questions: Question[];
  actions: ActionItem[];
  updates: Update[];
  blockers: Blocker[];
  attachments: Attachment[];
  summary: MeetingSummary | null;
  onBack: () => void;
  onStatusChange: (status: Meeting['status']) => void;
  onTranscriptUpload: (file: File) => Promise<void>;
  onQuestionAdd: (data: Partial<Question>) => void;
  onQuestionUpdate: (id: string, data: Partial<Question>) => void;
  onQuestionDelete: (id: string) => void;
  onActionAdd: (data: Partial<ActionItem>) => void;
  onActionUpdate: (id: string, data: Partial<ActionItem>) => void;
  onActionDelete: (id: string) => void;
  onUpdateAdd: (data: Partial<Update>) => void;
  onUpdateUpdate: (id: string, data: Partial<Update>) => void;
  onUpdateDelete: (id: string) => void;
  onBlockerAdd: (data: Partial<Blocker>) => void;
  onBlockerUpdate: (id: string, data: Partial<Blocker>) => void;
  onBlockerDelete: (id: string) => void;
  onBlockerResolve: (id: string, resolution: string) => void;
  onAttachmentAdd: (data: Partial<Attachment>) => void;
  onAttachmentDelete: (id: string) => void;
  onSummarySave: (data: Partial<MeetingSummary>) => void;
  onSummaryDelete: () => void;
  onAnalyze?: () => Promise<void>;
  onViewSuggestions?: () => void;
  onPresentationMode?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  isAnalyzing?: boolean;
  suggestionCount?: number;
}

export function MeetingDetail({
  meeting,
  questions,
  actions,
  updates,
  blockers,
  attachments,
  summary,
  onBack,
  onStatusChange,
  onTranscriptUpload,
  onQuestionAdd,
  onQuestionUpdate,
  onQuestionDelete,
  onActionAdd,
  onActionUpdate,
  onActionDelete,
  onUpdateAdd,
  onUpdateUpdate,
  onUpdateDelete,
  onBlockerAdd,
  onBlockerUpdate,
  onBlockerDelete,
  onBlockerResolve,
  onAttachmentAdd,
  onAttachmentDelete,
  onSummarySave,
  onSummaryDelete,
  onAnalyze,
  onViewSuggestions,
  onPresentationMode,
  isUploading,
  uploadProgress,
  isAnalyzing,
  suggestionCount,
}: MeetingDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'actions' | 'updates' | 'blockers' | 'attachments' | 'transcript' | 'summary'>(
    'overview'
  );

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

  const meetingQuestions = questions.filter((q) => q.asked_in_meeting === meeting.id);
  const meetingActions = actions.filter((a) => a.from_meeting === meeting.id);
  const meetingUpdates = updates.filter((u) => u.meeting === meeting.id);
  const meetingBlockers = blockers.filter((b) => b.meeting === meeting.id);
  const meetingAttachments = attachments.filter((a) => a.meeting === meeting.id);
  const openBlockers = meetingBlockers.filter((b) => b.status !== 'resolved');
  const hasTranscript = Boolean(meeting.transcript_text);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'questions', label: `Questions (${meetingQuestions.length})` },
    { id: 'actions', label: `Actions (${meetingActions.length})` },
    { id: 'updates', label: `Updates (${meetingUpdates.length})` },
    { id: 'blockers', label: `Blockers (${openBlockers.length})`, highlight: openBlockers.length > 0 },
    { id: 'attachments', label: `Attachments (${meetingAttachments.length})` },
    { id: 'transcript', label: 'Transcript' },
    { id: 'summary', label: 'Summary', highlight: Boolean(summary) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" onClick={onBack} className="mt-1">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={meeting.status} />
              {hasTranscript && (
                <Badge variant="info">
                  <Mic className="w-3 h-3 mr-1" />
                  Transcribed
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{meeting.title}</h1>
            {meeting.agenda && (
              <p className="text-slate-500 mt-1">{meeting.agenda}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onPresentationMode && (
            <Button variant="secondary" onClick={onPresentationMode}>
              <Presentation className="w-4 h-4 mr-1" />
              Present to Client
            </Button>
          )}
          {meeting.status === 'scheduled' && (
            <Button onClick={() => onStatusChange('in_progress')}>
              <Play className="w-4 h-4 mr-1" />
              Start Meeting
            </Button>
          )}
          {meeting.status === 'in_progress' && (
            <>
              <Button variant="secondary" onClick={() => onStatusChange('scheduled')}>
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
              <Button onClick={() => onStatusChange('completed')}>
                <CheckCircle className="w-4 h-4 mr-1" />
                End Meeting
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Meeting Info */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(meeting.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(meeting.date)}</span>
            </div>
            {meeting.attendees && meeting.attendees.length > 0 && (
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4" />
                <span>{meeting.attendees.join(', ')}</span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex gap-4 md:gap-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : tab.highlight
                      ? 'border-transparent text-amber-600 hover:text-amber-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900">Recent Questions</h3>
            </CardHeader>
            <CardBody>
              {meetingQuestions.length === 0 ? (
                <p className="text-sm text-slate-500">No questions yet</p>
              ) : (
                <ul className="space-y-2">
                  {meetingQuestions.slice(0, 5).map((q) => (
                    <li key={q.id} className="text-sm">
                      <span className="text-slate-700">{q.question}</span>
                      <StatusBadge status={q.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900">Pending Actions</h3>
            </CardHeader>
            <CardBody>
              {meetingActions.filter((a) => a.status === 'pending').length === 0 ? (
                <p className="text-sm text-slate-500">No pending actions</p>
              ) : (
                <ul className="space-y-2">
                  {meetingActions
                    .filter((a) => a.status === 'pending')
                    .slice(0, 5)
                    .map((a) => (
                      <li key={a.id} className="text-sm text-slate-700">
                        {a.title}
                      </li>
                    ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'questions' && (
        <QuestionList
          questions={meetingQuestions}
          onAdd={(data) => onQuestionAdd({ ...data, asked_in_meeting: meeting.id })}
          onUpdate={onQuestionUpdate}
          onDelete={onQuestionDelete}
        />
      )}

      {activeTab === 'actions' && (
        <ActionList
          actions={meetingActions}
          onAdd={(data) => onActionAdd({ ...data, from_meeting: meeting.id })}
          onUpdate={onActionUpdate}
          onDelete={onActionDelete}
        />
      )}

      {activeTab === 'updates' && (
        <UpdateList
          updates={meetingUpdates}
          onAdd={(data) => onUpdateAdd({ ...data, meeting: meeting.id })}
          onUpdate={onUpdateUpdate}
          onDelete={onUpdateDelete}
          meetingId={meeting.id}
        />
      )}

      {activeTab === 'blockers' && (
        <BlockerList
          blockers={meetingBlockers}
          onAdd={(data) => onBlockerAdd({ ...data, meeting: meeting.id })}
          onUpdate={onBlockerUpdate}
          onDelete={onBlockerDelete}
          onResolve={onBlockerResolve}
          meetingId={meeting.id}
        />
      )}

      {activeTab === 'attachments' && (
        <AttachmentList
          attachments={meetingAttachments}
          onAdd={(data) => onAttachmentAdd({ ...data, meeting: meeting.id })}
          onDelete={onAttachmentDelete}
          meetingId={meeting.id}
        />
      )}

      {activeTab === 'summary' && (
        <MeetingSummaryView
          summary={summary}
          onSave={onSummarySave}
          onDelete={onSummaryDelete}
        />
      )}

      {activeTab === 'transcript' && (
        <Card>
          <CardBody className="p-6">
            {meeting.transcript_text ? (
              <div className="space-y-4">
                {/* Analyze Button */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-slate-900">Transcript</h3>
                    {suggestionCount !== undefined && suggestionCount > 0 && (
                      <button
                        onClick={onViewSuggestions}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        {suggestionCount} suggestion{suggestionCount !== 1 ? 's' : ''}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {onViewSuggestions && suggestionCount !== undefined && suggestionCount > 0 && (
                      <Button variant="secondary" size="sm" onClick={onViewSuggestions}>
                        <Sparkles className="w-4 h-4 mr-1" />
                        View Suggestions
                      </Button>
                    )}
                    {onAnalyze && (
                      <Button
                        size="sm"
                        onClick={onAnalyze}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-1" />
                            Analyze with AI
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Transcript Content */}
                <div className="prose prose-slate max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-slate-50 p-4 rounded-lg">
                    {meeting.transcript_text}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <Mic className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Transcript Yet</h3>
                  <p className="text-slate-500">
                    Upload an audio file or text transcript to enable AI analysis
                  </p>
                </div>
                <TranscriptUpload
                  onUpload={onTranscriptUpload}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
