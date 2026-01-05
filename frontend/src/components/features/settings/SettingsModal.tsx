import { useState, useEffect } from 'react';
import { Key, Mic, Bell } from 'lucide-react';
import { Modal, Button, Card, CardBody, Select } from '../../common';
import type { ClientSettings } from '../../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClientSettings | null;
  onSave: (settings: Partial<ClientSettings>) => void;
  isSaving?: boolean;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
  isSaving,
}: SettingsModalProps) {
  const [formData, setFormData] = useState({
    ai_provider: 'anthropic' as ClientSettings['ai_provider'],
    ai_model: 'claude-3-opus',
    transcription_provider: 'openai',
    auto_approve_threshold: 0.9,
    notify_new_suggestions: true,
    notify_pending_questions: true,
    notify_action_items_due: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        ai_provider: settings.ai_provider,
        ai_model: settings.ai_model || 'claude-3-opus',
        transcription_provider: settings.transcription_provider || 'openai',
        auto_approve_threshold: Number(settings.auto_approve_threshold) || 0.9,
        notify_new_suggestions: settings.notify_new_suggestions,
        notify_pending_questions: settings.notify_pending_questions,
        notify_action_items_due: settings.notify_action_items_due,
      });
    }
  }, [settings, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const aiProviderOptions = [
    { value: 'anthropic', label: 'Anthropic (Claude)' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'google', label: 'Google' },
  ];

  const aiModelOptions = [
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* AI Settings Section */}
        <Card>
          <CardBody className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-slate-600" />
              <h3 className="font-medium text-slate-900">AI Configuration</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="AI Provider"
                value={formData.ai_provider}
                onChange={(e) =>
                  setFormData({ ...formData, ai_provider: e.target.value as ClientSettings['ai_provider'] })
                }
                options={aiProviderOptions}
              />

              <Select
                label="AI Model"
                value={formData.ai_model}
                onChange={(e) =>
                  setFormData({ ...formData, ai_model: e.target.value })
                }
                options={aiModelOptions}
              />
            </div>

            {settings?.openai_api_key_configured && (
              <p className="text-xs text-emerald-600">OpenAI API key is configured</p>
            )}
          </CardBody>
        </Card>

        {/* Transcription Settings */}
        <Card>
          <CardBody className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-4 h-4 text-slate-600" />
              <h3 className="font-medium text-slate-900">Transcription</h3>
            </div>

            <Select
              label="Transcription Provider"
              value={formData.transcription_provider}
              onChange={(e) =>
                setFormData({ ...formData, transcription_provider: e.target.value })
              }
              options={[
                { value: 'openai', label: 'OpenAI Whisper' },
                { value: 'deepgram', label: 'Deepgram' },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Auto-approve Threshold: {(formData.auto_approve_threshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={formData.auto_approve_threshold}
                onChange={(e) =>
                  setFormData({ ...formData, auto_approve_threshold: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-slate-600" />
              <h3 className="font-medium text-slate-900">Notifications</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notify_new_suggestions}
                  onChange={(e) =>
                    setFormData({ ...formData, notify_new_suggestions: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-slate-700">
                  Notify on new AI suggestions
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notify_pending_questions}
                  onChange={(e) =>
                    setFormData({ ...formData, notify_pending_questions: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-slate-700">
                  Notify on pending questions
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notify_action_items_due}
                  onChange={(e) =>
                    setFormData({ ...formData, notify_action_items_due: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-slate-700">
                  Notify on action items due
                </span>
              </label>
            </div>
          </CardBody>
        </Card>

        {/* Usage Stats */}
        {settings && (
          <Card>
            <CardBody className="p-4">
              <h3 className="font-medium text-slate-900 mb-3">Usage This Month</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-semibold text-slate-900">{settings.api_calls_this_month ?? 0}</p>
                  <p className="text-xs text-slate-500">API Calls</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">
                    {((Number(settings.tokens_used_this_month) || 0) / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-slate-500">Tokens</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">
                    ${(Number(settings.estimated_cost_this_month) || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500">Est. Cost</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
