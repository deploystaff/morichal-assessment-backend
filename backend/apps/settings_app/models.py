import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField


class ClientSettings(models.Model):
    """Per-client settings and preferences."""
    AI_PROVIDER_CHOICES = [
        ('anthropic', 'Anthropic'),
        ('openai', 'OpenAI'),
        ('google', 'Google'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.OneToOneField(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='settings',
        db_column='client_id'
    )

    # AI Provider Selection
    ai_provider = models.CharField(max_length=50, choices=AI_PROVIDER_CHOICES, default='anthropic')
    ai_model = models.CharField(max_length=100, default='claude-sonnet-4-20250514')
    transcription_provider = models.CharField(max_length=50, default='openai')

    # Auto-Approval Settings
    auto_approve_threshold = models.DecimalField(max_digits=3, decimal_places=2, default=1.00)
    auto_approve_types = ArrayField(models.CharField(max_length=50), blank=True, default=list)

    # Notification Settings
    notify_new_suggestions = models.BooleanField(default=True)
    notify_pending_questions = models.BooleanField(default=True)
    notify_action_items_due = models.BooleanField(default=True)

    # Custom Categories
    custom_question_categories = models.JSONField(default=list)
    custom_rule_categories = models.JSONField(default=list)

    # Usage Tracking
    api_calls_this_month = models.IntegerField(default=0)
    api_calls_total = models.IntegerField(default=0)
    tokens_used_this_month = models.IntegerField(default=0)
    estimated_cost_this_month = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    usage_reset_date = models.DateField(auto_now_add=True)

    # API Keys (encrypted in production)
    openai_api_key = models.TextField(blank=True, null=True)
    anthropic_api_key = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'client_settings'
        managed = False
        verbose_name_plural = 'Client settings'

    def __str__(self):
        return f"Settings for {self.client.name}"

    def mask_openai_key(self):
        """Return masked OpenAI API key for display."""
        if not self.openai_api_key:
            return None
        if len(self.openai_api_key) <= 8:
            return '****'
        return self.openai_api_key[:7] + '...' + self.openai_api_key[-4:]

    def mask_anthropic_key(self):
        """Return masked Anthropic API key for display."""
        if not self.anthropic_api_key:
            return None
        if len(self.anthropic_api_key) <= 8:
            return '****'
        return self.anthropic_api_key[:10] + '...' + self.anthropic_api_key[-4:]
