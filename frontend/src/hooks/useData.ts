import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { useUIStore } from '../store/uiStore';

// All data hook (for initial load)
export function useAllData() {
  return useQuery({
    queryKey: ['allData'],
    queryFn: api.getAllData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Meetings hooks
export function useMeetings() {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: () => api.meetings.list(),
  });
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: ['meetings', id],
    queryFn: () => api.meetings.get(id),
    enabled: !!id,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: api.meetings.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.meetings.update>[1] }) =>
      api.meetings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.meetings.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}

export function useUploadTranscript() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => api.meetings.uploadTranscript(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      triggerSave();
    },
  });
}

export function useAnalyzeTranscript() {
  return useMutation({
    mutationFn: api.meetings.analyze,
  });
}

// Questions hooks
export function useQuestions(status?: string) {
  return useQuery({
    queryKey: ['questions', status],
    queryFn: () => api.questions.list(status),
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: api.questions.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.questions.update>[1] }) =>
      api.questions.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.questions.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}

export function useAnswerQuestion() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: ({ id, answer, answeredBy }: { id: string; answer: string; answeredBy?: string }) =>
      api.questions.answer(id, answer, answeredBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

// Action Items hooks
export function useActionItems(status?: string) {
  return useQuery({
    queryKey: ['actionItems', status],
    queryFn: () => api.actionItems.list(status),
  });
}

export function useCreateActionItem() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: api.actionItems.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useUpdateActionItem() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.actionItems.update>[1] }) =>
      api.actionItems.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useCompleteActionItem() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: api.actionItems.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useDeleteActionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.actionItems.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}

// Business Rules hooks
export function useBusinessRules() {
  return useQuery({
    queryKey: ['businessRules'],
    queryFn: api.businessRules.list,
  });
}

export function useCreateBusinessRule() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: api.businessRules.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessRules'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useUpdateBusinessRule() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.businessRules.update>[1] }) =>
      api.businessRules.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessRules'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useDeleteBusinessRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.businessRules.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessRules'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}

// Suggestions hooks
export function useSuggestions(meetingId: string) {
  return useQuery({
    queryKey: ['suggestions', meetingId],
    queryFn: () => api.meetings.getSuggestions(meetingId),
    enabled: !!meetingId,
  });
}

export function useApproveSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reviewedBy }: { id: string; reviewedBy?: string }) =>
      api.suggestions.approve(id, reviewedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}

export function useRejectSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reviewedBy }: { id: string; reviewedBy?: string }) =>
      api.suggestions.reject(id, reviewedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
  });
}

// Settings hooks
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: api.settings.get,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: api.settings.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      triggerSave();
    },
  });
}

// Updates hooks
export function useUpdates(meetingId?: string) {
  return useQuery({
    queryKey: ['updates', meetingId],
    queryFn: () => api.updates.list(meetingId),
  });
}

export function useCreateUpdate() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: api.updates.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['updates'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useUpdateUpdate() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.updates.update>[1] }) =>
      api.updates.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['updates'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useDeleteUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updates.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['updates'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}

// Blockers hooks
export function useBlockers(meetingId?: string, status?: string) {
  return useQuery({
    queryKey: ['blockers', meetingId, status],
    queryFn: () => api.blockers.list(meetingId, status),
  });
}

export function useCreateBlocker() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: api.blockers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockers'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useUpdateBlocker() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.blockers.update>[1] }) =>
      api.blockers.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockers'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useDeleteBlocker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.blockers.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockers'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}

export function useResolveBlocker() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      api.blockers.resolve(id, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockers'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

// Attachments hooks
export function useAttachments(meetingId?: string) {
  return useQuery({
    queryKey: ['attachments', meetingId],
    queryFn: () => api.attachments.list(meetingId),
  });
}

export function useCreateAttachment() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: api.attachments.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
      triggerSave();
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.attachments.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
      queryClient.invalidateQueries({ queryKey: ['allData'] });
    },
  });
}

// Meeting Summary hooks
export function useMeetingSummary(meetingId: string) {
  return useQuery({
    queryKey: ['summary', meetingId],
    queryFn: () => api.summary.get(meetingId),
    enabled: !!meetingId,
  });
}

export function useSaveSummary() {
  const queryClient = useQueryClient();
  const triggerSave = useUIStore((s) => s.triggerSaveIndicator);

  return useMutation({
    mutationFn: ({ meetingId, data }: { meetingId: string; data: Parameters<typeof api.summary.save>[1] }) =>
      api.summary.save(meetingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      triggerSave();
    },
  });
}

export function useDeleteSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.summary.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}
