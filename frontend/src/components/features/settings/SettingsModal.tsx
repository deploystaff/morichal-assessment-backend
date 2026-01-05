import { useState, useEffect } from 'react';
import { Key, Mic, Bell, Bot, BarChart3, Eye, EyeOff, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { Modal, Button, Card, CardBody, Select } from '../../common';
import type { ClientSettings } from '../../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClientSettings | null;
  onSave: (settings: Partial<ClientSettings> & { openai_api_key?: string; anthropic_api_key?: string }) => void;
  isSaving?: boolean;
}

interface ApiKeyInputProps {
  label: string;
  provider: 'anthropic' | 'openai';
  isConfigured: boolean;
  maskedKey: string | null;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
}

function ApiKeyInput({
  label,
  provider,
  isConfigured,
  maskedKey,
  value,
  onChange,
  placeholder,
  icon,
}: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const displayValue = isEditing ? value : (isConfigured && maskedKey ? maskedKey : value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${provider === 'anthropic' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isConfigured ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
              <Circle className="w-3 h-3" />
              Not configured
            </span>
          )}
        </div>
      </div>
      <div className="relative">
        <input
          type={showKey ? 'text' : 'password'}
          value={displayValue}
          onChange={(e) => {
            setIsEditing(true);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (isConfigured && !isEditing) {
              setIsEditing(true);
              onChange('');
            }
          }}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 pr-10 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {isConfigured && !isEditing && (
        <p className="text-xs text-slate-500">Click to update your API key</p>
      )}
    </div>
  );
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
    ai_model: 'claude-sonnet-4-20250514',
    transcription_provider: 'openai',
    auto_approve_threshold: 0.9,
    notify_new_suggestions: true,
    notify_pending_questions: true,
    notify_action_items_due: true,
  });

  const [apiKeys, setApiKeys] = useState({
    anthropic: '',
    openai: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        ai_provider: settings.ai_provider,
        ai_model: settings.ai_model || 'claude-sonnet-4-20250514',
        transcription_provider: settings.transcription_provider || 'openai',
        auto_approve_threshold: Number(settings.auto_approve_threshold) || 0.9,
        notify_new_suggestions: settings.notify_new_suggestions,
        notify_pending_questions: settings.notify_pending_questions,
        notify_action_items_due: settings.notify_action_items_due,
      });
      // Reset API key inputs when modal opens
      setApiKeys({ anthropic: '', openai: '' });
    }
  }, [settings, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<ClientSettings> & { openai_api_key?: string; anthropic_api_key?: string } = {
      ...formData,
    };
    if (apiKeys.openai) {
      payload.openai_api_key = apiKeys.openai;
    }
    if (apiKeys.anthropic) {
      payload.anthropic_api_key = apiKeys.anthropic;
    }
    onSave(payload);
  };

  const aiModelOptions = formData.ai_provider === 'anthropic'
    ? [
        { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
        { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
        { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
      ]
    : formData.ai_provider === 'openai'
    ? [
        { value: 'gpt-4o', label: 'GPT-4o' },
        { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      ]
    : [
        { value: 'gemini-pro', label: 'Gemini Pro' },
      ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* API Keys Section */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-100 text-amber-600">
                <Key className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">API Keys</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-8">Configure your LLM provider API keys for AI features</p>
          </div>
          <CardBody className="p-4 space-y-4">
            <ApiKeyInput
              label="Anthropic (Claude)"
              provider="anthropic"
              isConfigured={settings?.anthropic_api_key_configured ?? false}
              maskedKey={settings?.anthropic_api_key_masked ?? null}
              value={apiKeys.anthropic}
              onChange={(v) => setApiKeys({ ...apiKeys, anthropic: v })}
              placeholder="sk-ant-api03-..."
              icon={<Sparkles className="w-3.5 h-3.5" />}
            />
            <ApiKeyInput
              label="OpenAI"
              provider="openai"
              isConfigured={settings?.openai_api_key_configured ?? false}
              maskedKey={settings?.openai_api_key_masked ?? null}
              value={apiKeys.openai}
              onChange={(v) => setApiKeys({ ...apiKeys, openai: v })}
              placeholder="sk-proj-..."
              icon={<Bot className="w-3.5 h-3.5" />}
            />
          </CardBody>
        </Card>

        {/* AI Configuration Section */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-teal-100 text-teal-600">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">AI Configuration</h3>
            </div>
          </div>
          <CardBody className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="AI Provider"
                value={formData.ai_provider}
                onChange={(e) =>
                  setFormData({ ...formData, ai_provider: e.target.value as ClientSettings['ai_provider'] })
                }
                options={[
                  { value: 'anthropic', label: 'Anthropic (Claude)' },
                  { value: 'openai', label: 'OpenAI' },
                  { value: 'google', label: 'Google' },
                ]}
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
          </CardBody>
        </Card>

        {/* Transcription Settings */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-violet-100 text-violet-600">
                <Mic className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">Transcription</h3>
            </div>
          </div>
          <CardBody className="p-4 space-y-4">
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Auto-approve Threshold
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={formData.auto_approve_threshold}
                  onChange={(e) =>
                    setFormData({ ...formData, auto_approve_threshold: parseFloat(e.target.value) })
                  }
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <span className="text-sm font-semibold text-teal-600 min-w-[3rem] text-right">
                  {(formData.auto_approve_threshold * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">AI suggestions with confidence above this threshold will be auto-approved</p>
            </div>
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-100 text-blue-600">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">Notifications</h3>
            </div>
          </div>
          <CardBody className="p-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.notify_new_suggestions}
                  onChange={(e) =>
                    setFormData({ ...formData, notify_new_suggestions: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                  Notify on new AI suggestions
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.notify_pending_questions}
                  onChange={(e) =>
                    setFormData({ ...formData, notify_pending_questions: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                  Notify on pending questions
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.notify_action_items_due}
                  onChange={(e) =>
                    setFormData({ ...formData, notify_action_items_due: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                  Notify on action items due
                </span>
              </label>
            </div>
          </CardBody>
        </Card>

        {/* Usage Stats */}
        {settings && (
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-rose-100 text-rose-600">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-800">Usage This Month</h3>
              </div>
            </div>
            <CardBody className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800">{settings.api_calls_this_month ?? 0}</p>
                  <p className="text-xs text-slate-500 mt-1">API Calls</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800">
                    {((Number(settings.tokens_used_this_month) || 0) / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Tokens</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800">
                    ${(Number(settings.estimated_cost_this_month) || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Est. Cost</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
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
