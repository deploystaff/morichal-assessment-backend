from rest_framework import serializers
from .models import ClientBranding, DeliverablePage, DeliverableSection, ClientDocument


class ClientBrandingSerializer(serializers.ModelSerializer):
    """Serializer for client branding configuration."""

    class Meta:
        model = ClientBranding
        fields = [
            'id',
            'primary_color',
            'secondary_color',
            'accent_color',
            'logo_url',
            'favicon_url',
            'company_name',
            'tagline',
            'website',
            'features',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DeliverableSectionSerializer(serializers.ModelSerializer):
    """Serializer for deliverable page sections."""

    class Meta:
        model = DeliverableSection
        fields = [
            'id',
            'section_type',
            'title',
            'content',
            'meta',
            'order',
            'is_visible',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DeliverablePageSerializer(serializers.ModelSerializer):
    """Serializer for deliverable pages."""
    sections = DeliverableSectionSerializer(many=True, read_only=True)
    children = serializers.SerializerMethodField()

    class Meta:
        model = DeliverablePage
        fields = [
            'id',
            'slug',
            'title',
            'description',
            'content',
            'template',
            'meta',
            'is_published',
            'published_at',
            'order',
            'parent',
            'children',
            'sections',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_children(self, obj):
        children = obj.children.filter(is_published=True)
        return DeliverablePageListSerializer(children, many=True).data


class DeliverablePageListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing pages without sections."""

    class Meta:
        model = DeliverablePage
        fields = [
            'id',
            'slug',
            'title',
            'description',
            'template',
            'is_published',
            'order',
            'parent',
            'updated_at',
        ]


class ClientDocumentSerializer(serializers.ModelSerializer):
    """Serializer for client knowledge base documents."""

    class Meta:
        model = ClientDocument
        fields = [
            'id',
            'slug',
            'category',
            'title',
            'content',
            'is_public',
            'is_pinned',
            'version',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClientDocumentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing documents without content."""

    class Meta:
        model = ClientDocument
        fields = [
            'id',
            'slug',
            'category',
            'title',
            'is_public',
            'is_pinned',
            'version',
            'updated_at',
        ]


class ClientConfigSerializer(serializers.Serializer):
    """Combined client configuration including branding."""
    id = serializers.UUIDField()
    name = serializers.CharField()
    slug = serializers.SlugField()
    branding = ClientBrandingSerializer()
    features = serializers.JSONField()
