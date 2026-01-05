import uuid
from django.db import models


class ActionItem(models.Model):
    """Action item from meetings."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
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
        related_name='action_items',
        db_column='client_id'
    )
    action_code = models.CharField(max_length=50)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, null=True)
    assigned_to = models.CharField(max_length=255, blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    from_meeting = models.ForeignKey(
        'meetings.Meeting',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='action_items',
        db_column='from_meeting'
    )
    completed_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'action_items'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action_code}: {self.title}"
