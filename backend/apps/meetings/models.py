import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField


class Meeting(models.Model):
    """Meeting record with optional transcript."""
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    TRANSCRIPT_SOURCE_CHOICES = [
        ('text', 'Text'),
        ('pdf', 'PDF'),
        ('json', 'JSON'),
        ('whisper', 'Whisper'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='meetings',
        db_column='client_id'
    )
    meeting_code = models.CharField(max_length=50)
    date = models.DateField()
    title = models.CharField(max_length=500)
    attendees = ArrayField(models.CharField(max_length=255), blank=True, default=list)
    agenda = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='scheduled')

    # Transcript fields
    transcript_text = models.TextField(blank=True, null=True)
    transcript_filename = models.CharField(max_length=255, blank=True, null=True)
    transcript_uploaded_at = models.DateTimeField(blank=True, null=True)
    transcript_source = models.CharField(max_length=50, choices=TRANSCRIPT_SOURCE_CHOICES, blank=True, null=True)
    transcript_duration = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    transcript_language = models.CharField(max_length=10, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'meetings'
        managed = False
        ordering = ['-date']

    def __str__(self):
        return f"{self.meeting_code}: {self.title}"
