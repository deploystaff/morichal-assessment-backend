import uuid
from django.db import models


class ClientBranding(models.Model):
    """Extended branding configuration for clients.

    Separate model to extend the Client model (which has managed=False).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.OneToOneField(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='branding'
    )

    # Branding colors
    primary_color = models.CharField(max_length=7, default='#0f766e')
    secondary_color = models.CharField(max_length=7, default='#1e293b')
    accent_color = models.CharField(max_length=7, default='#f59e0b')

    # Logo and assets
    logo_url = models.URLField(blank=True, null=True)
    favicon_url = models.URLField(blank=True, null=True)

    # Display configuration
    company_name = models.CharField(max_length=100, blank=True)
    tagline = models.CharField(max_length=200, blank=True)
    website = models.URLField(blank=True, null=True)

    # Feature flags
    features = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'client_branding'
        verbose_name = 'Client Branding'
        verbose_name_plural = 'Client Branding'

    def __str__(self):
        return f"Branding for {self.client.name}"


class DeliverablePage(models.Model):
    """Client-specific deliverable pages (PRD, UAP, proposals, etc.)."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='deliverable_pages'
    )

    slug = models.SlugField(max_length=100)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    # Content can be HTML or reference a template
    content = models.TextField(blank=True)
    template = models.CharField(max_length=50, default='default')

    # Metadata for SEO, etc.
    meta = models.JSONField(default=dict, blank=True)

    # Publishing
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    # Navigation
    order = models.IntegerField(default=0)
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'deliverable_pages'
        unique_together = ['client', 'slug']
        ordering = ['order', 'title']

    def __str__(self):
        return f"{self.client.slug}/{self.slug}: {self.title}"


class DeliverableSection(models.Model):
    """Sections within a deliverable page for structured content."""
    SECTION_TYPES = [
        ('hero', 'Hero Section'),
        ('features', 'Features Grid'),
        ('pricing', 'Pricing Table'),
        ('timeline', 'Timeline'),
        ('content', 'Rich Content'),
        ('table', 'Data Table'),
        ('gallery', 'Image Gallery'),
        ('cta', 'Call to Action'),
        ('custom', 'Custom HTML'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.ForeignKey(
        DeliverablePage,
        on_delete=models.CASCADE,
        related_name='sections'
    )

    section_type = models.CharField(max_length=50, choices=SECTION_TYPES, default='content')
    title = models.CharField(max_length=200, blank=True)
    content = models.TextField(blank=True)
    meta = models.JSONField(default=dict, blank=True)

    order = models.IntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'deliverable_sections'
        ordering = ['order']

    def __str__(self):
        return f"{self.page.slug}/{self.section_type}: {self.title}"


class ClientDocument(models.Model):
    """Knowledge base documents (like DOCS folder) per client."""
    CATEGORIES = [
        ('architecture', 'Architecture'),
        ('status', 'Project Status'),
        ('changelog', 'Changelog'),
        ('design', 'Design'),
        ('ux', 'UX/UI'),
        ('api', 'API Documentation'),
        ('guide', 'User Guide'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='documents'
    )

    slug = models.SlugField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORIES, default='other')
    title = models.CharField(max_length=200)
    content = models.TextField()  # Markdown content

    # Visibility
    is_public = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False)

    # Version tracking
    version = models.CharField(max_length=20, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'client_documents'
        unique_together = ['client', 'slug']
        ordering = ['-is_pinned', '-updated_at']

    def __str__(self):
        return f"{self.client.slug}/{self.category}/{self.slug}"
