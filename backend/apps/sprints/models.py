import uuid
from django.db import models


class Sprint(models.Model):
    """Sprint containing multiple deliverable items."""
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='sprints',
        db_column='client_id'
    )
    sprint_code = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    order = models.IntegerField(default=0)
    color = models.CharField(max_length=7, default='#3B82F6')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sprints'
        managed = False
        ordering = ['order', 'start_date']
        unique_together = [['client', 'sprint_code']]

    def __str__(self):
        return f"{self.sprint_code}: {self.name}"

    @property
    def progress(self):
        """Calculate progress based on completed items."""
        total = self.items.count()
        if total == 0:
            return 0
        completed = self.items.filter(status='completed').count()
        return round((completed / total) * 100)

    @property
    def total_items(self):
        return self.items.count()

    @property
    def completed_items(self):
        return self.items.filter(status='completed').count()


class SprintItem(models.Model):
    """Individual item within a sprint (agent, feature, task, etc.)."""
    ITEM_TYPE_CHOICES = [
        ('agent', 'Agent'),
        ('feature', 'Feature'),
        ('task', 'Task'),
        ('bugfix', 'Bug Fix'),
    ]
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('blocked', 'Blocked'),
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
        related_name='sprint_items',
        db_column='client_id'
    )
    sprint = models.ForeignKey(
        'Sprint',
        on_delete=models.CASCADE,
        related_name='items',
        db_column='sprint_id'
    )
    item_code = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES, default='feature')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    order = models.IntegerField(default=0)
    assigned_to = models.CharField(max_length=100, blank=True, null=True)
    estimated_hours = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    actual_hours = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sprint_items'
        managed = False
        ordering = ['order', 'created_at']
        unique_together = [['client', 'item_code']]

    def __str__(self):
        return f"{self.item_code}: {self.name}"
