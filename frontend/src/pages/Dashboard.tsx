import { useState } from 'react';
import { Header, StatsBar, Sidebar, SaveIndicator } from '../components/layout';
import {
  MeetingList,
  MeetingDetail,
  RuleList,
  SettingsModal,
  PresentationView,
} from '../components/features';
import { Modal } from '../components/common';
import { useUIStore } from '../store/uiStore';
import {
  useAllData,
  useCreateMeeting,
  useUpdateMeeting,
  useDeleteMeeting,
  useUploadTranscript,
  useAnalyzeTranscript,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useCreateActionItem,
  useUpdateActionItem,
  useDeleteActionItem,
  useCreateBusinessRule,
  useUpdateBusinessRule,
  useDeleteBusinessRule,
  useSuggestions,
  useApproveSuggestion,
  useRejectSuggestion,
  useBatchApproveSuggestions,
  useSettings,
  useUpdateSettings,
  useCreateUpdate,
  useUpdateUpdate,
  useDeleteUpdate,
  useCreateBlocker,
  useUpdateBlocker,
  useDeleteBlocker,
  useResolveBlocker,
  useCreateAttachment,
  useDeleteAttachment,
  useMeetingSummary,
  useSaveSummary,
  useDeleteSummary,
} from '../hooks/useData';
import type { Meeting, Question, ActionItem, BusinessRule, Decision, ClientSettings, Update, Blocker, Attachment, MeetingSummary } from '../types';

export function Dashboard() {
  const { data, isLoading } = useAllData();

  // Meeting mutations
  const createMeeting = useCreateMeeting();
  const updateMeeting = useUpdateMeeting();
  const deleteMeeting = useDeleteMeeting();
  const uploadTranscript = useUploadTranscript();
  const analyzeTranscript = useAnalyzeTranscript();

  // Question mutations
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  // Action mutations
  const createAction = useCreateActionItem();
  const updateAction = useUpdateActionItem();
  const deleteAction = useDeleteActionItem();

  // Rule mutations
  const createRule = useCreateBusinessRule();
  const updateRule = useUpdateBusinessRule();
  const deleteRule = useDeleteBusinessRule();

  // Update mutations
  const createUpdate = useCreateUpdate();
  const updateUpdate = useUpdateUpdate();
  const deleteUpdate = useDeleteUpdate();

  // Blocker mutations
  const createBlocker = useCreateBlocker();
  const updateBlocker = useUpdateBlocker();
  const deleteBlocker = useDeleteBlocker();
  const resolveBlocker = useResolveBlocker();

  // Attachment mutations
  const createAttachment = useCreateAttachment();
  const deleteAttachment = useDeleteAttachment();

  // Summary mutations
  const saveSummary = useSaveSummary();
  const deleteSummary = useDeleteSummary();

  // Suggestions mutations
  const approveSuggestion = useApproveSuggestion();
  const rejectSuggestion = useRejectSuggestion();
  const batchApproveSuggestions = useBatchApproveSuggestions();

  // Settings
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  const activeModal = useUIStore((s) => s.activeModal);
  const closeModal = useUIStore((s) => s.closeModal);

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);

  // Fetch suggestions for selected meeting
  const { data: suggestions } = useSuggestions(selectedMeeting?.id || '');

  // Fetch summary for selected meeting
  const { data: meetingSummary } = useMeetingSummary(selectedMeeting?.id || '');

  // Meeting handlers
  const handleAddMeeting = (meetingData: Partial<Meeting>) => {
    createMeeting.mutate(meetingData as Parameters<typeof createMeeting.mutate>[0]);
  };

  const handleUpdateMeeting = (id: string, meetingData: Partial<Meeting>) => {
    updateMeeting.mutate({ id, data: meetingData });
  };

  const handleDeleteMeeting = (id: string) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      deleteMeeting.mutate(id);
      if (selectedMeeting?.id === id) {
        setSelectedMeeting(null);
      }
    }
  };

  const handleSelectMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleMeetingStatusChange = (status: Meeting['status']) => {
    if (selectedMeeting) {
      updateMeeting.mutate({ id: selectedMeeting.id, data: { status } });
      setSelectedMeeting({ ...selectedMeeting, status });
    }
  };

  const handleTranscriptUpload = async (file: File) => {
    if (selectedMeeting) {
      await uploadTranscript.mutateAsync({ id: selectedMeeting.id, file });
    }
  };

  const handleAnalyze = async () => {
    if (selectedMeeting) {
      await analyzeTranscript.mutateAsync(selectedMeeting.id);
      // Suggestions will appear inline in the meeting tabs
    }
  };

  const handleApproveSuggestion = (id: string) => {
    approveSuggestion.mutate({ id });
  };

  const handleRejectSuggestion = (id: string) => {
    rejectSuggestion.mutate({ id });
  };

  const handleBatchApproveSuggestions = (ids: string[]) => {
    batchApproveSuggestions.mutate({ ids });
  };

  // Decision handlers (using the same approach as rules, but decisions come from AI suggestions)
  const handleAddDecision = (decisionData: Partial<Decision>) => {
    // Decisions are created through AI suggestions approval
    // This is a placeholder for manual decision creation if needed
    console.log('Decision add:', decisionData);
  };

  const handleUpdateDecision = (id: string, decisionData: Partial<Decision>) => {
    // TODO: Add decision update mutation if needed
    console.log('Decision update:', id, decisionData);
  };

  const handleDeleteDecision = (id: string) => {
    // TODO: Add decision delete mutation if needed
    console.log('Decision delete:', id);
  };

  // Question handlers
  const handleAddQuestion = (questionData: Partial<Question>) => {
    createQuestion.mutate(questionData as Parameters<typeof createQuestion.mutate>[0]);
  };

  const handleUpdateQuestion = (id: string, questionData: Partial<Question>) => {
    updateQuestion.mutate({ id, data: questionData });
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteQuestion.mutate(id);
    }
  };

  // Action handlers
  const handleAddAction = (actionData: Partial<ActionItem>) => {
    createAction.mutate(actionData as Parameters<typeof createAction.mutate>[0]);
  };

  const handleUpdateAction = (id: string, actionData: Partial<ActionItem>) => {
    updateAction.mutate({ id, data: actionData });
  };

  const handleDeleteAction = (id: string) => {
    if (confirm('Are you sure you want to delete this action item?')) {
      deleteAction.mutate(id);
    }
  };

  // Rule handlers
  const handleAddRule = (ruleData: Partial<BusinessRule>) => {
    createRule.mutate(ruleData as Parameters<typeof createRule.mutate>[0]);
  };

  const handleUpdateRule = (id: string, ruleData: Partial<BusinessRule>) => {
    updateRule.mutate({ id, data: ruleData });
  };

  const handleDeleteRule = (id: string) => {
    if (confirm('Are you sure you want to delete this business rule?')) {
      deleteRule.mutate(id);
    }
  };

  // Update handlers
  const handleAddUpdate = (updateData: Partial<Update>) => {
    createUpdate.mutate(updateData as Parameters<typeof createUpdate.mutate>[0]);
  };

  const handleUpdateUpdate = (id: string, updateData: Partial<Update>) => {
    updateUpdate.mutate({ id, data: updateData });
  };

  const handleDeleteUpdate = (id: string) => {
    if (confirm('Are you sure you want to delete this update?')) {
      deleteUpdate.mutate(id);
    }
  };

  // Blocker handlers
  const handleAddBlocker = (blockerData: Partial<Blocker>) => {
    createBlocker.mutate(blockerData as Parameters<typeof createBlocker.mutate>[0]);
  };

  const handleUpdateBlocker = (id: string, blockerData: Partial<Blocker>) => {
    updateBlocker.mutate({ id, data: blockerData });
  };

  const handleDeleteBlocker = (id: string) => {
    if (confirm('Are you sure you want to delete this blocker?')) {
      deleteBlocker.mutate(id);
    }
  };

  const handleResolveBlocker = (id: string, resolution: string) => {
    resolveBlocker.mutate({ id, resolution });
  };

  // Attachment handlers
  const handleAddAttachment = (attachmentData: Partial<Attachment>) => {
    createAttachment.mutate(attachmentData as Parameters<typeof createAttachment.mutate>[0]);
  };

  const handleDeleteAttachment = (id: string) => {
    if (confirm('Are you sure you want to delete this attachment?')) {
      deleteAttachment.mutate(id);
    }
  };

  // Summary handlers
  const handleSaveSummary = (summaryData: Partial<MeetingSummary>) => {
    if (selectedMeeting) {
      saveSummary.mutate({ meetingId: selectedMeeting.id, data: summaryData });
    }
  };

  const handleDeleteSummary = () => {
    if (selectedMeeting && confirm('Are you sure you want to delete this summary?')) {
      deleteSummary.mutate(selectedMeeting.id);
    }
  };

  // Settings handlers
  const handleSaveSettings = (settingsData: Partial<ClientSettings>) => {
    updateSettings.mutate(settingsData, {
      onSuccess: () => closeModal(),
    });
  };

  // Presentation mode handler
  const handleEnterPresentationMode = () => {
    setPresentationMode(true);
  };

  const handleExitPresentationMode = () => {
    setPresentationMode(false);
  };

  // Filter data for presentation view
  const meetingQuestions = selectedMeeting
    ? (data?.questions || []).filter((q) => q.asked_in_meeting === selectedMeeting.id)
    : [];
  const meetingActions = selectedMeeting
    ? (data?.actionItems || []).filter((a) => a.from_meeting === selectedMeeting.id)
    : [];
  const meetingBlockers = selectedMeeting
    ? (data?.blockers || []).filter((b) => b.meeting === selectedMeeting.id)
    : [];

  // Presentation mode handlers that add meeting ID
  const handlePresentationQuestionAdd = (data: Partial<Question>) => {
    if (selectedMeeting) {
      handleAddQuestion({ ...data, asked_in_meeting: selectedMeeting.id });
    }
  };

  const handlePresentationActionAdd = (data: Partial<ActionItem>) => {
    if (selectedMeeting) {
      handleAddAction({ ...data, from_meeting: selectedMeeting.id });
    }
  };

  const handlePresentationBlockerAdd = (data: Partial<Blocker>) => {
    if (selectedMeeting) {
      handleAddBlocker({ ...data, meeting: selectedMeeting.id });
    }
  };

  // Show presentation view when in presentation mode
  if (presentationMode && selectedMeeting) {
    return (
      <PresentationView
        meeting={selectedMeeting}
        questions={meetingQuestions}
        actions={meetingActions}
        blockers={meetingBlockers}
        summary={meetingSummary || null}
        onExit={handleExitPresentationMode}
        onQuestionAdd={handlePresentationQuestionAdd}
        onQuestionUpdate={handleUpdateQuestion}
        onQuestionDelete={handleDeleteQuestion}
        onActionAdd={handlePresentationActionAdd}
        onActionUpdate={handleUpdateAction}
        onActionDelete={handleDeleteAction}
        onBlockerAdd={handlePresentationBlockerAdd}
        onBlockerUpdate={handleUpdateBlocker}
        onBlockerDelete={handleDeleteBlocker}
        onBlockerResolve={handleResolveBlocker}
        onSummaryUpdate={handleSaveSummary}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <StatsBar data={data} isLoading={isLoading} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {selectedMeeting ? (
              <MeetingDetail
                meeting={selectedMeeting}
                questions={data?.questions || []}
                actions={data?.actionItems || []}
                updates={data?.updates || []}
                blockers={data?.blockers || []}
                attachments={data?.attachments || []}
                summary={meetingSummary || null}
                businessRules={data?.businessRules || []}
                decisions={data?.decisions || []}
                suggestions={suggestions || []}
                onBack={() => setSelectedMeeting(null)}
                onStatusChange={handleMeetingStatusChange}
                onTranscriptUpload={handleTranscriptUpload}
                onQuestionAdd={handleAddQuestion}
                onQuestionUpdate={handleUpdateQuestion}
                onQuestionDelete={handleDeleteQuestion}
                onActionAdd={handleAddAction}
                onActionUpdate={handleUpdateAction}
                onActionDelete={handleDeleteAction}
                onUpdateAdd={handleAddUpdate}
                onUpdateUpdate={handleUpdateUpdate}
                onUpdateDelete={handleDeleteUpdate}
                onBlockerAdd={handleAddBlocker}
                onBlockerUpdate={handleUpdateBlocker}
                onBlockerDelete={handleDeleteBlocker}
                onBlockerResolve={handleResolveBlocker}
                onAttachmentAdd={handleAddAttachment}
                onAttachmentDelete={handleDeleteAttachment}
                onRuleAdd={handleAddRule}
                onRuleUpdate={handleUpdateRule}
                onRuleDelete={handleDeleteRule}
                onDecisionAdd={handleAddDecision}
                onDecisionUpdate={handleUpdateDecision}
                onDecisionDelete={handleDeleteDecision}
                onSummarySave={handleSaveSummary}
                onSummaryDelete={handleDeleteSummary}
                onAnalyze={handleAnalyze}
                onSuggestionApprove={handleApproveSuggestion}
                onSuggestionReject={handleRejectSuggestion}
                onSuggestionBatchApprove={handleBatchApproveSuggestions}
                onPresentationMode={handleEnterPresentationMode}
                isUploading={uploadTranscript.isPending}
                isAnalyzing={analyzeTranscript.isPending}
                isSuggestionProcessing={approveSuggestion.isPending || rejectSuggestion.isPending || batchApproveSuggestions.isPending}
              />
            ) : (
              <MeetingList
                meetings={data?.meetings || []}
                onAdd={handleAddMeeting}
                onUpdate={handleUpdateMeeting}
                onDelete={handleDeleteMeeting}
                onSelect={handleSelectMeeting}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 flex-shrink-0 hidden lg:block">
            <Sidebar
              meetings={data?.meetings || []}
              businessRules={data?.businessRules || []}
              onMeetingClick={handleSelectMeeting}
              onManageRules={() => setShowRulesModal(true)}
            />
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={closeModal}
        settings={settings || null}
        onSave={handleSaveSettings}
        isSaving={updateSettings.isPending}
      />

      {/* Business Rules Modal */}
      <Modal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        title="Business Rules"
        size="xl"
      >
        <RuleList
          rules={data?.businessRules || []}
          onAdd={handleAddRule}
          onUpdate={handleUpdateRule}
          onDelete={handleDeleteRule}
        />
      </Modal>

      {/* Save Indicator */}
      <SaveIndicator />
    </div>
  );
}
