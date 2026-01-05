import uuid
from django.db import models


class BusinessRule(models.Model):
    """Business rule discovered in meetings."""
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('draft', 'Draft'),
        ('deprecated', 'Deprecated'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='business_rules',
        db_column='client_id'
    )
    rule_code = models.CharField(max_length=50)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    discovered_in_meeting = models.ForeignKey(
        'meetings.Meeting',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='business_rules',
        db_column='discovered_in_meeting'
    )
    source = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'business_rules'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.rule_code}: {self.title}"


class Decision(models.Model):
    """Decision made in meetings."""
    STATUS_CHOICES = [
        ('approved', 'Approved'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='decisions',
        db_column='client_id'
    )
    decision_code = models.CharField(max_length=50)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, null=True)
    made_in_meeting = models.ForeignKey(
        'meetings.Meeting',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='decisions',
        db_column='made_in_meeting'
    )
    made_by = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='approved')
    implementation_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'decisions'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.decision_code}: {self.title}"
