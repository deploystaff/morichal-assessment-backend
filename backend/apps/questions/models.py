import uuid
from django.db import models


class Question(models.Model):
    """Question raised in meetings."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('answered', 'Answered'),
        ('needs-follow-up', 'Needs Follow-up'),
        ('deferred', 'Deferred'),
    ]
    PRIORITY_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='questions',
        db_column='client_id'
    )
    question_code = models.CharField(max_length=50)
    category = models.CharField(max_length=100, blank=True, null=True)
    question = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    asked_in_meeting = models.ForeignKey(
        'meetings.Meeting',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='questions',
        db_column='asked_in_meeting'
    )
    answer = models.TextField(blank=True, null=True)
    answered_by = models.CharField(max_length=255, blank=True, null=True)
    answered_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'questions'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.question_code}: {self.question[:50]}..."
