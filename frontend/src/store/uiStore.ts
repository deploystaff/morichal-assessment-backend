import { create } from 'zustand';

type ModalType =
  | 'question'
  | 'answer'
  | 'editQuestion'
  | 'meeting'
  | 'action'
  | 'rule'
  | 'transcript'
  | 'suggestions'
  | 'settings'
  | null;

type QuestionFilter = 'all' | 'pending' | 'answered' | 'high';

interface UIState {
  // Connection status
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;

  // Modal state
  activeModal: ModalType;
  modalData: Record<string, unknown> | undefined;
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Question filter
  questionFilter: QuestionFilter;
  setQuestionFilter: (filter: QuestionFilter) => void;

  // Save indicator
  showSaveIndicator: boolean;
  triggerSaveIndicator: () => void;

  // Selected items for editing
  selectedMeetingId: string | null;
  setSelectedMeetingId: (id: string | null) => void;
  selectedQuestionId: string | null;
  setSelectedQuestionId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Connection status
  isOnline: navigator.onLine,
  setIsOnline: (online) => set({ isOnline: online }),

  // Modal state
  activeModal: null,
  modalData: undefined,
  openModal: (modal, data) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: undefined }),

  // Question filter
  questionFilter: 'all',
  setQuestionFilter: (filter) => set({ questionFilter: filter }),

  // Save indicator
  showSaveIndicator: false,
  triggerSaveIndicator: () => {
    set({ showSaveIndicator: true });
    setTimeout(() => set({ showSaveIndicator: false }), 2000);
  },

  // Selected items
  selectedMeetingId: null,
  setSelectedMeetingId: (id) => set({ selectedMeetingId: id }),
  selectedQuestionId: null,
  setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),
}));
