from rest_framework import serializers
from .models import ClientSettings


class ClientSettingsSerializer(serializers.ModelSerializer):
    openai_api_key_configured = serializers.SerializerMethodField()
    openai_api_key_masked = serializers.SerializerMethodField()
    anthropic_api_key_configured = serializers.SerializerMethodField()
    anthropic_api_key_masked = serializers.SerializerMethodField()

    class Meta:
        model = ClientSettings
        fields = [
            'id', 'ai_provider', 'ai_model', 'transcription_provider',
            'auto_approve_threshold', 'auto_approve_types',
            'notify_new_suggestions', 'notify_pending_questions', 'notify_action_items_due',
            'custom_question_categories', 'custom_rule_categories',
            'api_calls_this_month', 'api_calls_total', 'tokens_used_this_month',
            'estimated_cost_this_month', 'usage_reset_date',
            'openai_api_key_configured', 'openai_api_key_masked',
            'anthropic_api_key_configured', 'anthropic_api_key_masked',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'api_calls_this_month', 'api_calls_total', 'tokens_used_this_month',
            'estimated_cost_this_month', 'usage_reset_date', 'created_at', 'updated_at',
            'openai_api_key_configured', 'openai_api_key_masked',
            'anthropic_api_key_configured', 'anthropic_api_key_masked'
        ]

    def get_openai_api_key_configured(self, obj):
        return bool(obj.openai_api_key)

    def get_openai_api_key_masked(self, obj):
        return obj.mask_openai_key()

    def get_anthropic_api_key_configured(self, obj):
        return bool(obj.anthropic_api_key)

    def get_anthropic_api_key_masked(self, obj):
        return obj.mask_anthropic_key()


class ClientSettingsUpdateSerializer(serializers.ModelSerializer):
    openai_api_key = serializers.CharField(required=False, allow_blank=True, write_only=True)
    anthropic_api_key = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ClientSettings
        fields = [
            'ai_provider', 'ai_model', 'transcription_provider',
            'auto_approve_threshold', 'auto_approve_types',
            'notify_new_suggestions', 'notify_pending_questions', 'notify_action_items_due',
            'custom_question_categories', 'custom_rule_categories',
            'openai_api_key', 'anthropic_api_key'
        ]

    def update(self, instance, validated_data):
        # Only update API keys if provided and not empty
        openai_key = validated_data.pop('openai_api_key', None)
        if openai_key is not None and openai_key != '':
            instance.openai_api_key = openai_key

        anthropic_key = validated_data.pop('anthropic_api_key', None)
        if anthropic_key is not None and anthropic_key != '':
            instance.anthropic_api_key = anthropic_key

        return super().update(instance, validated_data)
