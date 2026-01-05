import { useState } from 'react';
import { Header, StatsBar, Sidebar, SaveIndicator } from '../components/layout';
import {
  MeetingList,
  MeetingDetail,
  RuleList,
  SettingsModal,
  SuggestionsModal,
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
  useSettings,
  useUpdateSettings,
} from '../hooks/useData';
import type { Meeting, Question, ActionItem, BusinessRule, ClientSettings } from '../types';

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

  // Suggestions mutations
  const approveSuggestion = useApproveSuggestion();
  const rejectSuggestion = useRejectSuggestion();

  // Settings
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  const activeModal = useUIStore((s) => s.activeModal);
  const closeModal = useUIStore((s) => s.closeModal);

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Fetch suggestions for selected meeting
  const { data: suggestions, isLoading: suggestionsLoading } = useSuggestions(selectedMeeting?.id || '');

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
      setShowSuggestions(true);
    }
  };

  const handleApproveSuggestion = (id: string) => {
    approveSuggestion.mutate({ id });
  };

  const handleRejectSuggestion = (id: string) => {
    rejectSuggestion.mutate({ id });
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

  // Settings handlers
  const handleSaveSettings = (settingsData: Partial<ClientSettings>) => {
    updateSettings.mutate(settingsData, {
      onSuccess: () => closeModal(),
    });
  };

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
                onBack={() => setSelectedMeeting(null)}
                onStatusChange={handleMeetingStatusChange}
                onTranscriptUpload={handleTranscriptUpload}
                onQuestionAdd={handleAddQuestion}
                onQuestionUpdate={handleUpdateQuestion}
                onQuestionDelete={handleDeleteQuestion}
                onActionAdd={handleAddAction}
                onActionUpdate={handleUpdateAction}
                onActionDelete={handleDeleteAction}
                onAnalyze={handleAnalyze}
                onViewSuggestions={() => setShowSuggestions(true)}
                isUploading={uploadTranscript.isPending}
                isAnalyzing={analyzeTranscript.isPending}
                suggestionCount={suggestions?.length || 0}
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

      {/* Suggestions Modal */}
      <SuggestionsModal
        isOpen={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        suggestions={suggestions || []}
        meetingTitle={selectedMeeting?.title}
        onApprove={handleApproveSuggestion}
        onReject={handleRejectSuggestion}
        isLoading={suggestionsLoading}
        isProcessing={approveSuggestion.isPending || rejectSuggestion.isPending}
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
