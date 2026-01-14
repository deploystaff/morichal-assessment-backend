import axios from 'axios';
import type {
  AllDataResponse,
  Meeting,
  Question,
  ActionItem,
  BusinessRule,
  AISuggestion,
  ClientSettings,
  Client,
  ClientConfig,
  ClientBranding,
  DeliverablePage,
  DeliverableSection,
  ClientDocument,
  User,
  Update,
  Blocker,
  Attachment,
  MeetingSummary,
  Sprint,
  SprintItem,
  RoadmapSummary,
  DeliveryMilestone,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Dynamic client slug - imported from store
import { getClientSlug as getClientSlugFromStore } from '../store/clientStore';

// Helper to get current client slug
const getClientSlugInternal = () => getClientSlugFromStore();

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth
export const auth = {
  login: async (username: string, password: string) => {
    const { data } = await api.post<{ user: User }>('/auth/login/', { username, password });
    return data;
  },
  logout: async () => {
    await api.post('/auth/logout/');
  },
  getMe: async () => {
    const { data } = await api.get<{ user: User }>('/auth/me/');
    return data.user;
  },
  getCsrf: async () => {
    const { data } = await api.get<{ csrfToken: string }>('/auth/csrf/');
    return data.csrfToken;
  },
};

// All Data
export const getAllData = async (): Promise<AllDataResponse> => {
  const { data } = await api.get<AllDataResponse>(`/${getClientSlugInternal()}/all/`);
  return data;
};

// Clients
export const clients = {
  list: async () => {
    const { data } = await api.get<Client[]>('/clients/');
    return data;
  },
  get: async (slug: string) => {
    const { data } = await api.get<Client>(`/clients/${slug}/`);
    return data;
  },
};

// Meetings
export const meetings = {
  list: async () => {
    const { data } = await api.get<Meeting[]>(`/${getClientSlugInternal()}/meetings/`);
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<Meeting>(`/${getClientSlugInternal()}/meetings/${id}/`);
    return data;
  },
  create: async (meeting: Partial<Meeting>) => {
    const { data } = await api.post<Meeting>(`/${getClientSlugInternal()}/meetings/`, meeting);
    return data;
  },
  update: async (id: string, meeting: Partial<Meeting>) => {
    const { data } = await api.patch<Meeting>(`/${getClientSlugInternal()}/meetings/${id}/`, meeting);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/meetings/${id}/`);
  },
  uploadTranscript: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('transcript', file);
    const { data } = await api.post(`/${getClientSlugInternal()}/meetings/${id}/transcript/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  analyze: async (id: string) => {
    const { data } = await api.post(`/${getClientSlugInternal()}/meetings/${id}/analyze/`);
    return data;
  },
  getSuggestions: async (id: string) => {
    const { data } = await api.get<AISuggestion[]>(`/${getClientSlugInternal()}/meetings/${id}/suggestions/`);
    return data;
  },
};

// Questions
export const questions = {
  list: async (status?: string) => {
    const params = status ? { status } : {};
    const { data } = await api.get<Question[]>(`/${getClientSlugInternal()}/questions/`, { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<Question>(`/${getClientSlugInternal()}/questions/${id}/`);
    return data;
  },
  create: async (question: Partial<Question>) => {
    const { data } = await api.post<Question>(`/${getClientSlugInternal()}/questions/`, question);
    return data;
  },
  update: async (id: string, question: Partial<Question>) => {
    const { data } = await api.patch<Question>(`/${getClientSlugInternal()}/questions/${id}/`, question);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/questions/${id}/`);
  },
  answer: async (id: string, answer: string, answeredBy?: string) => {
    const { data } = await api.post<Question>(`/${getClientSlugInternal()}/questions/${id}/answer/`, {
      answer,
      answered_by: answeredBy,
    });
    return data;
  },
};

// Action Items
export const actionItems = {
  list: async (status?: string) => {
    const params = status ? { status } : {};
    const { data } = await api.get<ActionItem[]>(`/${getClientSlugInternal()}/action-items/`, { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<ActionItem>(`/${getClientSlugInternal()}/action-items/${id}/`);
    return data;
  },
  create: async (actionItem: Partial<ActionItem>) => {
    const { data } = await api.post<ActionItem>(`/${getClientSlugInternal()}/action-items/`, actionItem);
    return data;
  },
  update: async (id: string, actionItem: Partial<ActionItem>) => {
    const { data } = await api.patch<ActionItem>(`/${getClientSlugInternal()}/action-items/${id}/`, actionItem);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/action-items/${id}/`);
  },
  complete: async (id: string) => {
    const { data } = await api.post<ActionItem>(`/${getClientSlugInternal()}/action-items/${id}/complete/`);
    return data;
  },
};

// Business Rules
export const businessRules = {
  list: async () => {
    const { data } = await api.get<BusinessRule[]>(`/${getClientSlugInternal()}/business-rules/`);
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<BusinessRule>(`/${getClientSlugInternal()}/business-rules/${id}/`);
    return data;
  },
  create: async (rule: Partial<BusinessRule>) => {
    const { data } = await api.post<BusinessRule>(`/${getClientSlugInternal()}/business-rules/`, rule);
    return data;
  },
  update: async (id: string, rule: Partial<BusinessRule>) => {
    const { data } = await api.patch<BusinessRule>(`/${getClientSlugInternal()}/business-rules/${id}/`, rule);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/business-rules/${id}/`);
  },
};

// Suggestions
export const suggestions = {
  list: async (status?: string) => {
    const params = status ? { status } : {};
    const { data } = await api.get<AISuggestion[]>(`/${getClientSlugInternal()}/suggestions/`, { params });
    return data;
  },
  approve: async (id: string, reviewedBy?: string) => {
    const { data } = await api.patch<AISuggestion>(`/${getClientSlugInternal()}/suggestions/${id}/`, {
      action: 'approve',
      reviewed_by: reviewedBy,
    });
    return data;
  },
  reject: async (id: string, reviewedBy?: string) => {
    const { data } = await api.patch<AISuggestion>(`/${getClientSlugInternal()}/suggestions/${id}/`, {
      action: 'reject',
      reviewed_by: reviewedBy,
    });
    return data;
  },
};

// Settings
export const settings = {
  get: async () => {
    const { data } = await api.get<ClientSettings>(`/${getClientSlugInternal()}/settings/`);
    return data;
  },
  update: async (settings: Partial<ClientSettings> & { openai_api_key?: string; anthropic_api_key?: string }) => {
    const { data } = await api.patch<ClientSettings>(`/${getClientSlugInternal()}/settings/`, settings);
    return data;
  },
  getProviders: async () => {
    const { data } = await api.get(`/${getClientSlugInternal()}/settings/providers/`);
    return data;
  },
  resetUsage: async () => {
    const { data } = await api.post(`/${getClientSlugInternal()}/settings/reset-usage/`);
    return data;
  },
  validateApiKey: async (apiKey: string, provider: 'openai' | 'anthropic' = 'openai') => {
    const { data } = await api.post<{ valid: boolean; provider: string }>(`/${getClientSlugInternal()}/transcription/validate-key/`, {
      api_key: apiKey,
      provider,
    });
    return data;
  },
};

// Updates (Progress Reports)
export const updates = {
  list: async (meetingId?: string) => {
    const params = meetingId ? { meeting: meetingId } : {};
    const { data } = await api.get<Update[]>(`/${getClientSlugInternal()}/updates/`, { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<Update>(`/${getClientSlugInternal()}/updates/${id}/`);
    return data;
  },
  create: async (update: Partial<Update>) => {
    const { data } = await api.post<Update>(`/${getClientSlugInternal()}/updates/`, update);
    return data;
  },
  update: async (id: string, update: Partial<Update>) => {
    const { data } = await api.patch<Update>(`/${getClientSlugInternal()}/updates/${id}/`, update);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/updates/${id}/`);
  },
};

// Blockers (Risks)
export const blockers = {
  list: async (meetingId?: string, status?: string) => {
    const params: Record<string, string> = {};
    if (meetingId) params.meeting = meetingId;
    if (status) params.status = status;
    const { data } = await api.get<Blocker[]>(`/${getClientSlugInternal()}/blockers/`, { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<Blocker>(`/${getClientSlugInternal()}/blockers/${id}/`);
    return data;
  },
  create: async (blocker: Partial<Blocker>) => {
    const { data } = await api.post<Blocker>(`/${getClientSlugInternal()}/blockers/`, blocker);
    return data;
  },
  update: async (id: string, blocker: Partial<Blocker>) => {
    const { data } = await api.patch<Blocker>(`/${getClientSlugInternal()}/blockers/${id}/`, blocker);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/blockers/${id}/`);
  },
  resolve: async (id: string, resolution: string) => {
    const { data } = await api.post<Blocker>(`/${getClientSlugInternal()}/blockers/${id}/resolve/`, { resolution });
    return data;
  },
};

// Attachments
export const attachments = {
  list: async (meetingId?: string) => {
    const params = meetingId ? { meeting: meetingId } : {};
    const { data } = await api.get<Attachment[]>(`/${getClientSlugInternal()}/attachments/`, { params });
    return data;
  },
  create: async (attachment: Partial<Attachment>) => {
    const { data } = await api.post<Attachment>(`/${getClientSlugInternal()}/attachments/`, attachment);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/attachments/${id}/`);
  },
};

// Meeting Summary
export const summary = {
  get: async (meetingId: string) => {
    const { data } = await api.get<MeetingSummary>(`/${getClientSlugInternal()}/meetings/${meetingId}/summary/`);
    return data;
  },
  save: async (meetingId: string, summaryData: Partial<MeetingSummary>) => {
    const { data } = await api.post<MeetingSummary>(`/${getClientSlugInternal()}/meetings/${meetingId}/summary/`, summaryData);
    return data;
  },
  delete: async (meetingId: string) => {
    await api.delete(`/${getClientSlugInternal()}/meetings/${meetingId}/summary/`);
  },
};

// Sprints
export const sprints = {
  list: async () => {
    const { data } = await api.get<Sprint[]>(`/${getClientSlugInternal()}/sprints/`);
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<Sprint>(`/${getClientSlugInternal()}/sprints/${id}/`);
    return data;
  },
  create: async (sprint: Partial<Sprint>) => {
    const { data } = await api.post<Sprint>(`/${getClientSlugInternal()}/sprints/`, sprint);
    return data;
  },
  update: async (id: string, sprint: Partial<Sprint>) => {
    const { data } = await api.patch<Sprint>(`/${getClientSlugInternal()}/sprints/${id}/`, sprint);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/sprints/${id}/`);
  },
  reorder: async (items: { id: string; order: number }[]) => {
    const { data } = await api.post(`/${getClientSlugInternal()}/sprints/reorder/`, { items });
    return data;
  },
  roadmap: async () => {
    const { data } = await api.get<RoadmapSummary>(`/${getClientSlugInternal()}/sprints/roadmap/`);
    return data;
  },
};

// Sprint Items
export const sprintItems = {
  list: async (sprintId?: string) => {
    const params = sprintId ? { sprint: sprintId } : {};
    const { data } = await api.get<SprintItem[]>(`/${getClientSlugInternal()}/sprint-items/`, { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<SprintItem>(`/${getClientSlugInternal()}/sprint-items/${id}/`);
    return data;
  },
  create: async (item: Partial<SprintItem>) => {
    const { data } = await api.post<SprintItem>(`/${getClientSlugInternal()}/sprint-items/`, item);
    return data;
  },
  update: async (id: string, item: Partial<SprintItem>) => {
    const { data } = await api.patch<SprintItem>(`/${getClientSlugInternal()}/sprint-items/${id}/`, item);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/sprint-items/${id}/`);
  },
  complete: async (id: string) => {
    const { data } = await api.post<SprintItem>(`/${getClientSlugInternal()}/sprint-items/${id}/complete/`);
    return data;
  },
  move: async (id: string, sprintId: string, order?: number) => {
    const { data } = await api.post<SprintItem>(`/${getClientSlugInternal()}/sprint-items/${id}/move/`, {
      sprint_id: sprintId,
      order,
    });
    return data;
  },
  reorder: async (items: { id: string; order: number; sprint_id?: string }[]) => {
    const { data } = await api.post(`/${getClientSlugInternal()}/sprint-items/reorder/`, { items });
    return data;
  },
};

// Delivery Milestones
export const deliveryMilestones = {
  list: async () => {
    const { data } = await api.get<DeliveryMilestone[]>(`/${getClientSlugInternal()}/delivery-milestones/`);
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<DeliveryMilestone>(`/${getClientSlugInternal()}/delivery-milestones/${id}/`);
    return data;
  },
  create: async (milestone: Partial<DeliveryMilestone>) => {
    const { data } = await api.post<DeliveryMilestone>(`/${getClientSlugInternal()}/delivery-milestones/`, milestone);
    return data;
  },
  update: async (id: string, milestone: Partial<DeliveryMilestone>) => {
    const { data } = await api.patch<DeliveryMilestone>(`/${getClientSlugInternal()}/delivery-milestones/${id}/`, milestone);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/delivery-milestones/${id}/`);
  },
  reorder: async (items: { id: string; order: number }[]) => {
    const { data } = await api.post(`/${getClientSlugInternal()}/delivery-milestones/reorder/`, { items });
    return data;
  },
};

// Client Configuration (includes branding)
export const clientConfig = {
  get: async () => {
    const { data } = await api.get<ClientConfig>(`/${getClientSlugInternal()}/config/`);
    return data;
  },
};

// Client Branding
export const branding = {
  get: async () => {
    const { data } = await api.get<ClientBranding>(`/${getClientSlugInternal()}/branding/`);
    return data;
  },
  update: async (brandingData: Partial<ClientBranding>) => {
    const { data } = await api.patch<ClientBranding>(`/${getClientSlugInternal()}/branding/`, brandingData);
    return data;
  },
};

// Deliverable Pages
export const deliverables = {
  list: async (params?: { published?: boolean; parent?: string | null }) => {
    const queryParams: Record<string, string> = {};
    if (params?.published !== undefined) queryParams.published = String(params.published);
    if (params?.parent !== undefined) queryParams.parent = params.parent === null ? 'null' : params.parent;
    const { data } = await api.get<DeliverablePage[]>(`/${getClientSlugInternal()}/deliverables/`, { params: queryParams });
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<DeliverablePage>(`/${getClientSlugInternal()}/deliverables/${id}/`);
    return data;
  },
  getBySlug: async (slug: string) => {
    const { data } = await api.get<DeliverablePage>(`/${getClientSlugInternal()}/deliverables/by-slug/${slug}/`);
    return data;
  },
  create: async (page: Partial<DeliverablePage>) => {
    const { data } = await api.post<DeliverablePage>(`/${getClientSlugInternal()}/deliverables/`, page);
    return data;
  },
  update: async (id: string, page: Partial<DeliverablePage>) => {
    const { data } = await api.patch<DeliverablePage>(`/${getClientSlugInternal()}/deliverables/${id}/`, page);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/deliverables/${id}/`);
  },
  publish: async (id: string) => {
    const { data } = await api.post<DeliverablePage>(`/${getClientSlugInternal()}/deliverables/${id}/publish/`);
    return data;
  },
  unpublish: async (id: string) => {
    const { data } = await api.post<DeliverablePage>(`/${getClientSlugInternal()}/deliverables/${id}/unpublish/`);
    return data;
  },
};

// Deliverable Sections
export const deliverableSections = {
  list: async (pageSlug: string) => {
    const { data } = await api.get<DeliverableSection[]>(`/${getClientSlugInternal()}/deliverables/${pageSlug}/sections/`);
    return data;
  },
  create: async (pageSlug: string, section: Partial<DeliverableSection>) => {
    const { data } = await api.post<DeliverableSection>(`/${getClientSlugInternal()}/deliverables/${pageSlug}/sections/`, section);
    return data;
  },
  update: async (pageSlug: string, id: string, section: Partial<DeliverableSection>) => {
    const { data } = await api.patch<DeliverableSection>(`/${getClientSlugInternal()}/deliverables/${pageSlug}/sections/${id}/`, section);
    return data;
  },
  delete: async (pageSlug: string, id: string) => {
    await api.delete(`/${getClientSlugInternal()}/deliverables/${pageSlug}/sections/${id}/`);
  },
  reorder: async (pageSlug: string, sectionIds: string[]) => {
    const { data } = await api.post(`/${getClientSlugInternal()}/deliverables/${pageSlug}/sections/reorder/`, { section_ids: sectionIds });
    return data;
  },
};

// Client Documents (Knowledge Base)
export const documents = {
  list: async (params?: { category?: string; public?: boolean }) => {
    const queryParams: Record<string, string> = {};
    if (params?.category) queryParams.category = params.category;
    if (params?.public !== undefined) queryParams.public = String(params.public);
    const { data } = await api.get<ClientDocument[]>(`/${getClientSlugInternal()}/docs/`, { params: queryParams });
    return data;
  },
  categories: async () => {
    const { data } = await api.get<{ category: string; count: number }[]>(`/${getClientSlugInternal()}/docs/categories/`);
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<ClientDocument>(`/${getClientSlugInternal()}/docs/${id}/`);
    return data;
  },
  getBySlug: async (slug: string) => {
    const { data } = await api.get<ClientDocument>(`/${getClientSlugInternal()}/docs/by-slug/${slug}/`);
    return data;
  },
  create: async (doc: Partial<ClientDocument>) => {
    const { data } = await api.post<ClientDocument>(`/${getClientSlugInternal()}/docs/`, doc);
    return data;
  },
  update: async (id: string, doc: Partial<ClientDocument>) => {
    const { data } = await api.patch<ClientDocument>(`/${getClientSlugInternal()}/docs/${id}/`, doc);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/${getClientSlugInternal()}/docs/${id}/`);
  },
};

// Export client slug for use in other parts of the app
export const getClientSlug = () => getClientSlugInternal();

export default api;
