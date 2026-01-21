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
    sprint = models.ForeignKey(
        'sprints.Sprint',
        on_delete=models.SET_NULL,
        related_name='meetings',
        db_column='sprint_id',
        blank=True,
        null=True
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


class Update(models.Model):
    """Progress update shared in a meeting."""
    CATEGORY_CHOICES = [
        ('development', 'Development'),
        ('design', 'Design'),
        ('testing', 'Testing'),
        ('documentation', 'Documentation'),
        ('infrastructure', 'Infrastructure'),
        ('general', 'General'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='updates',
        db_column='client_id'
    )
    meeting = models.ForeignKey(
        'Meeting',
        on_delete=models.CASCADE,
        related_name='updates',
        db_column='meeting_id'
    )
    update_code = models.CharField(max_length=50)
    author = models.CharField(max_length=100)
    content = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'updates'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.update_code}: {self.author}"


class Blocker(models.Model):
    """Blocker or risk raised in a meeting."""
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='blockers',
        db_column='client_id'
    )
    meeting = models.ForeignKey(
        'Meeting',
        on_delete=models.CASCADE,
        related_name='blockers',
        db_column='meeting_id'
    )
    blocker_code = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    owner = models.CharField(max_length=100, blank=True, null=True)
    resolution = models.TextField(blank=True, null=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blockers'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.blocker_code}: {self.title}"


class Attachment(models.Model):
    """File or link attached to a meeting."""
    FILE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('doc', 'Document'),
        ('image', 'Image'),
        ('spreadsheet', 'Spreadsheet'),
        ('presentation', 'Presentation'),
        ('link', 'External Link'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='attachments',
        db_column='client_id'
    )
    meeting = models.ForeignKey(
        'Meeting',
        on_delete=models.CASCADE,
        related_name='attachments',
        db_column='meeting_id'
    )
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=20, choices=FILE_TYPE_CHOICES, default='other')
    file_url = models.URLField(max_length=500)
    description = models.TextField(blank=True, null=True)
    uploaded_by = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'attachments'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return self.filename


class MeetingSummary(models.Model):
    """Summary of a meeting, either AI-generated or manual."""
    GENERATED_BY_CHOICES = [
        ('ai', 'AI Generated'),
        ('manual', 'Manual'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='meeting_summaries',
        db_column='client_id'
    )
    meeting = models.OneToOneField(
        'Meeting',
        on_delete=models.CASCADE,
        related_name='summary',
        db_column='meeting_id'
    )
    content = models.TextField(blank=True)
    generated_by = models.CharField(max_length=20, choices=GENERATED_BY_CHOICES, default='manual')
    key_points = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'meeting_summaries'
        managed = False

    def __str__(self):
        return f"Summary for {self.meeting.meeting_code}"
