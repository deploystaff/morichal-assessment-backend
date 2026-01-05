import uuid
from django.db import models


class AISuggestion(models.Model):
    """AI-generated suggestion from transcript analysis."""
    TYPE_CHOICES = [
        ('answer', 'Answer'),
        ('business_rule', 'Business Rule'),
        ('decision', 'Decision'),
        ('action_item', 'Action Item'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meeting = models.ForeignKey(
        'meetings.Meeting',
        on_delete=models.CASCADE,
        related_name='suggestions',
        db_column='meeting_id'
    )
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='suggestions',
        db_column='client_id'
    )
    suggestion_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    target_question = models.ForeignKey(
        'questions.Question',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='suggestions',
        db_column='target_question_id'
    )
    suggested_content = models.JSONField()
    confidence = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reviewed_at = models.DateTimeField(blank=True, null=True)
    reviewed_by = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_suggestions'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.suggestion_type}: {self.confidence}"
