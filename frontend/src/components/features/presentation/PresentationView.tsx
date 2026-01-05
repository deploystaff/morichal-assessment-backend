import { useRef, useState } from 'react';
import { FileText, HelpCircle, CheckSquare, AlertTriangle, ArrowRight, Rocket } from 'lucide-react';
import { PresentationHeader } from './PresentationHeader';
import { PresentationProgress } from './PresentationProgress';
import { PresentationSection } from './PresentationSection';
import { PresentationSummary } from './PresentationSummary';
import { PresentationQuestions } from './PresentationQuestions';
import { PresentationActions } from './PresentationActions';
import { PresentationBlockers } from './PresentationBlockers';
import { PresentationNextSteps } from './PresentationNextSteps';
import { PresentationRoadmap } from '../sprints';
import { useRoadmap } from '../../../hooks/useData';
import type { Meeting, Question, ActionItem, Blocker, MeetingSummary } from '../../../types';

interface PresentationViewProps {
  meeting: Meeting;
  questions: Question[];
  actions: ActionItem[];
  blockers: Blocker[];
  summary: MeetingSummary | null;
  onExit: () => void;
  // Mutation handlers
  onQuestionUpdate: (id: string, data: Partial<Question>) => void;
  onActionUpdate: (id: string, data: Partial<ActionItem>) => void;
  onActionAdd: (data: Partial<ActionItem>) => void;
  onBlockerUpdate: (id: string, data: Partial<Blocker>) => void;
  onBlockerResolve: (id: string, resolution: string) => void;
}

export function PresentationView({
  meeting,
  questions,
  actions,
  blockers,
  summary,
  onExit,
  onQuestionUpdate,
  onActionUpdate,
  onActionAdd,
  onBlockerUpdate,
  onBlockerResolve,
}: PresentationViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState('summary');

  // Fetch roadmap data
  const { data: roadmap, isLoading: roadmapLoading } = useRoadmap();

  // Calculate counts and attention indicators
  const pendingQuestions = questions.filter(q => q.status === 'pending' || q.status === 'needs-follow-up').length;
  const pendingActions = actions.filter(a => a.status === 'pending' || a.status === 'in_progress').length;
  const overdueActions = actions.filter(a => {
    if (!a.due_date || a.status === 'completed' || a.status === 'cancelled') return false;
    return new Date(a.due_date) < new Date();
  }).length;
  const openBlockers = blockers.filter(b => b.status !== 'resolved').length;
  const criticalBlockers = blockers.filter(b => b.severity === 'critical' && b.status !== 'resolved').length;

  // Section navigation data
  const sections = [
    { id: 'summary', label: 'Summary', icon: FileText, count: summary?.key_points?.length || 0 },
    { id: 'questions', label: 'Questions', icon: HelpCircle, count: questions.length, hasAttention: pendingQuestions > 0 },
    { id: 'actions', label: 'Actions', icon: CheckSquare, count: actions.length, hasAttention: overdueActions > 0 },
    { id: 'blockers', label: 'Blockers', icon: AlertTriangle, count: blockers.length, hasAttention: criticalBlockers > 0 },
    { id: 'next-steps', label: 'Next Steps', icon: ArrowRight, count: 0 },
    { id: 'roadmap', label: 'Roadmap', icon: Rocket, count: roadmap?.sprints?.length || 0 },
  ];

  const scrollToSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handler wrappers
  const handleQuestionAnswer = (id: string, answer: string) => {
    onQuestionUpdate(id, { answer, status: 'answered' });
  };

  const handleQuestionStatusChange = (id: string, status: Question['status']) => {
    onQuestionUpdate(id, { status });
  };

  const handleBlockerResolve = (id: string, resolution: string) => {
    onBlockerResolve(id, resolution);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Sticky Header */}
      <PresentationHeader meeting={meeting} onExit={onExit} />

      {/* Progress Navigation */}
      <PresentationProgress
        sections={sections}
        currentSection={currentSection}
        onNavigate={scrollToSection}
      />

      {/* Main Content */}
      <main ref={contentRef} className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Section 1: Summary */}
        <PresentationSection
          id="summary"
          number={1}
          title="Key Points"
          icon={FileText}
          badgeCount={summary?.key_points?.length || 0}
          badgeVariant="success"
        >
          <PresentationSummary summary={summary} />
        </PresentationSection>

        {/* Section 2: Questions */}
        <PresentationSection
          id="questions"
          number={2}
          title="Questions"
          icon={HelpCircle}
          badgeCount={questions.length}
          badgeVariant={pendingQuestions > 0 ? 'attention' : 'default'}
          statusSummary={
            pendingQuestions > 0 ? (
              <span className="text-amber-600 font-medium">
                {pendingQuestions} need{pendingQuestions === 1 ? 's' : ''} answer
              </span>
            ) : null
          }
        >
          <PresentationQuestions
            questions={questions}
            onAnswer={handleQuestionAnswer}
            onStatusChange={handleQuestionStatusChange}
          />
        </PresentationSection>

        {/* Section 3: Action Items */}
        <PresentationSection
          id="actions"
          number={3}
          title="Action Items"
          icon={CheckSquare}
          badgeCount={actions.length}
          badgeVariant={overdueActions > 0 ? 'attention' : pendingActions > 0 ? 'default' : 'success'}
          statusSummary={
            overdueActions > 0 ? (
              <span className="text-red-600 font-medium">
                {overdueActions} overdue
              </span>
            ) : pendingActions > 0 ? (
              <span className="text-slate-600">
                {pendingActions} pending
              </span>
            ) : null
          }
        >
          <PresentationActions
            actions={actions}
            onUpdate={onActionUpdate}
          />
        </PresentationSection>

        {/* Section 4: Blockers */}
        <PresentationSection
          id="blockers"
          number={4}
          title="Blockers & Risks"
          icon={AlertTriangle}
          badgeCount={blockers.length}
          badgeVariant={criticalBlockers > 0 ? 'attention' : openBlockers > 0 ? 'default' : 'success'}
          statusSummary={
            criticalBlockers > 0 ? (
              <span className="text-red-600 font-medium animate-pulse">
                {criticalBlockers} critical
              </span>
            ) : openBlockers > 0 ? (
              <span className="text-slate-600">
                {openBlockers} open
              </span>
            ) : null
          }
        >
          <PresentationBlockers
            blockers={blockers}
            onResolve={handleBlockerResolve}
            onUpdate={onBlockerUpdate}
          />
        </PresentationSection>

        {/* Section 5: Next Steps */}
        <PresentationSection
          id="next-steps"
          number={5}
          title="Next Steps"
          icon={ArrowRight}
        >
          <PresentationNextSteps
            meetingId={meeting.id}
            onAddAction={onActionAdd}
          />
        </PresentationSection>

        {/* Section 6: Project Roadmap */}
        <PresentationSection
          id="roadmap"
          number={6}
          title="Project Roadmap"
          icon={Rocket}
          badgeCount={roadmap?.sprints?.length || 0}
          badgeVariant="success"
          statusSummary={
            roadmap?.current_sprint ? (
              <span className="text-blue-600 font-medium">
                {roadmap.overall_progress}% complete
              </span>
            ) : null
          }
        >
          <PresentationRoadmap roadmap={roadmap || null} isLoading={roadmapLoading} />
        </PresentationSection>

        {/* Footer Spacer */}
        <div className="h-16" />
      </main>
    </div>
  );
}
