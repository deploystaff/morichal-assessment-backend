// Client
export interface Client {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

// Meeting
export interface Meeting {
  id: string;
  meeting_code: string;
  date: string;
  title: string;
  attendees: string[];
  agenda: string | null;
  notes: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  sprint: string | null;
  transcript_text: string | null;
  transcript_filename: string | null;
  transcript_uploaded_at: string | null;
  transcript_source: 'text' | 'pdf' | 'json' | 'whisper' | null;
  transcript_duration: number | null;
  transcript_language: string | null;
  created_at: string;
  updated_at: string;
}

// Question
export interface Question {
  id: string;
  question_code: string;
  category: string | null;
  question: string;
  status: 'pending' | 'answered' | 'needs-follow-up' | 'deferred';
  priority: 'high' | 'medium' | 'low';
  asked_in_meeting: string | null;
  answer: string | null;
  answered_by: string | null;
  answered_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Action Item
export interface ActionItem {
  id: string;
  action_code: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  due_date: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  from_meeting: string | null;
  completed_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Business Rule
export interface BusinessRule {
  id: string;
  rule_code: string;
  title: string;
  description: string | null;
  category: string | null;
  discovered_in_meeting: string | null;
  source: string | null;
  status: 'confirmed' | 'draft' | 'deprecated';
  created_at: string;
  updated_at: string;
}

// Decision
export interface Decision {
  id: string;
  decision_code: string;
  title: string;
  description: string | null;
  made_in_meeting: string | null;
  made_by: string | null;
  status: 'approved' | 'pending' | 'rejected';
  implementation_notes: string | null;
  created_at: string;
  updated_at: string;
}

// AI Suggestion
export interface AISuggestion {
  id: string;
  meeting: string;
  suggestion_type: 'answer' | 'business_rule' | 'decision' | 'action_item';
  target_question: string | null;
  suggested_content: Record<string, unknown>;
  confidence: number | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
}

// Settings
export interface ClientSettings {
  id: string;
  ai_provider: 'anthropic' | 'openai' | 'google';
  ai_model: string;
  transcription_provider: string;
  auto_approve_threshold: number;
  auto_approve_types: string[];
  notify_new_suggestions: boolean;
  notify_pending_questions: boolean;
  notify_action_items_due: boolean;
  custom_question_categories: string[];
  custom_rule_categories: string[];
  api_calls_this_month: number;
  api_calls_total: number;
  tokens_used_this_month: number;
  estimated_cost_this_month: number;
  usage_reset_date: string;
  openai_api_key_configured: boolean;
  openai_api_key_masked: string | null;
  anthropic_api_key_configured: boolean;
  anthropic_api_key_masked: string | null;
  created_at: string;
  updated_at: string;
}

// Update (Progress Report)
export interface Update {
  id: string;
  update_code: string;
  meeting: string;
  author: string;
  content: string;
  category: 'development' | 'design' | 'testing' | 'documentation' | 'infrastructure' | 'general';
  created_at: string;
  updated_at: string;
}

// Blocker/Risk
export interface Blocker {
  id: string;
  blocker_code: string;
  meeting: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  owner: string | null;
  resolution: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

// Attachment
export interface Attachment {
  id: string;
  meeting: string;
  filename: string;
  file_type: 'pdf' | 'doc' | 'image' | 'spreadsheet' | 'presentation' | 'link' | 'other';
  file_url: string;
  description: string | null;
  uploaded_by: string | null;
  created_at: string;
}

// Meeting Summary
export interface MeetingSummary {
  id: string;
  meeting: string;
  content: string;
  generated_by: 'ai' | 'manual';
  key_points: string[];
  created_at: string;
  updated_at: string;
}

// Sprint
export interface Sprint {
  id: string;
  sprint_code: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: 'planned' | 'in_progress' | 'delivered' | 'cancelled';
  order: number;
  color: string;
  progress: number;
  total_items: number;
  completed_items: number;
  items: SprintItem[];
  created_at: string;
  updated_at: string;
}

// Sprint Item
export interface SprintItem {
  id: string;
  sprint: string;
  item_code: string;
  name: string;
  description: string | null;
  item_type: 'agent' | 'feature' | 'task' | 'bugfix';
  status: 'planned' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  order: number;
  assigned_to: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Roadmap Summary
export interface RoadmapSummary {
  sprints: Sprint[];
  overall_progress: number;
  total_items: number;
  completed_items: number;
  current_sprint: Omit<Sprint, 'items'> | null;
}

// All Data Response
export interface AllDataResponse {
  version: string;
  lastUpdated: string;
  meetings: Meeting[];
  questions: Question[];
  businessRules: BusinessRule[];
  decisions: Decision[];
  actionItems: ActionItem[];
  updates: Update[];
  blockers: Blocker[];
  attachments: Attachment[];
}

// User
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
