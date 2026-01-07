from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.clients.models import Client
from .models import ClientBranding, DeliverablePage, DeliverableSection, ClientDocument
from .serializers import (
    ClientBrandingSerializer,
    DeliverablePageSerializer,
    DeliverablePageListSerializer,
    DeliverableSectionSerializer,
    ClientDocumentSerializer,
    ClientDocumentListSerializer,
)


class ClientConfigView(APIView):
    """Get client configuration including branding."""

    def get(self, request, client_slug):
        client = get_object_or_404(Client, slug=client_slug)

        # Get or create branding
        branding, _ = ClientBranding.objects.get_or_create(
            client=client,
            defaults={
                'company_name': client.name,
            }
        )

        return Response({
            'id': str(client.id),
            'name': client.name,
            'slug': client.slug,
            'branding': ClientBrandingSerializer(branding).data,
        })


class ClientBrandingViewSet(viewsets.ModelViewSet):
    """Manage client branding configuration."""
    serializer_class = ClientBrandingSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        client = get_object_or_404(Client, slug=client_slug)
        return ClientBranding.objects.filter(client=client)

    def get_object(self):
        client_slug = self.kwargs.get('client_slug')
        client = get_object_or_404(Client, slug=client_slug)
        branding, _ = ClientBranding.objects.get_or_create(
            client=client,
            defaults={'company_name': client.name}
        )
        return branding

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DeliverablePageViewSet(viewsets.ModelViewSet):
    """Manage deliverable pages for a client."""

    def get_serializer_class(self):
        if self.action == 'list':
            return DeliverablePageListSerializer
        return DeliverablePageSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        client = get_object_or_404(Client, slug=client_slug)
        queryset = DeliverablePage.objects.filter(client=client)

        # Filter by published status if requested
        published = self.request.query_params.get('published')
        if published is not None:
            queryset = queryset.filter(is_published=published.lower() == 'true')

        # Filter by parent (for navigation)
        parent = self.request.query_params.get('parent')
        if parent == 'null':
            queryset = queryset.filter(parent__isnull=True)
        elif parent:
            queryset = queryset.filter(parent_id=parent)

        return queryset

    def perform_create(self, serializer):
        client_slug = self.kwargs.get('client_slug')
        client = get_object_or_404(Client, slug=client_slug)
        serializer.save(client=client)

    @action(detail=True, methods=['post'])
    def publish(self, request, client_slug=None, pk=None):
        """Publish a deliverable page."""
        page = self.get_object()
        page.is_published = True
        page.published_at = timezone.now()
        page.save()
        return Response(DeliverablePageSerializer(page).data)

    @action(detail=True, methods=['post'])
    def unpublish(self, request, client_slug=None, pk=None):
        """Unpublish a deliverable page."""
        page = self.get_object()
        page.is_published = False
        page.save()
        return Response(DeliverablePageSerializer(page).data)


class DeliverableSectionViewSet(viewsets.ModelViewSet):
    """Manage sections within a deliverable page."""
    serializer_class = DeliverableSectionSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        page_slug = self.kwargs.get('page_slug')
        client = get_object_or_404(Client, slug=client_slug)
        page = get_object_or_404(DeliverablePage, client=client, slug=page_slug)
        return DeliverableSection.objects.filter(page=page)

    def perform_create(self, serializer):
        client_slug = self.kwargs.get('client_slug')
        page_slug = self.kwargs.get('page_slug')
        client = get_object_or_404(Client, slug=client_slug)
        page = get_object_or_404(DeliverablePage, client=client, slug=page_slug)
        serializer.save(page=page)

    @action(detail=False, methods=['post'])
    def reorder(self, request, client_slug=None, page_slug=None):
        """Reorder sections within a page."""
        section_ids = request.data.get('section_ids', [])
        for index, section_id in enumerate(section_ids):
            DeliverableSection.objects.filter(id=section_id).update(order=index)
        return Response({'status': 'reordered'})


class ClientDocumentViewSet(viewsets.ModelViewSet):
    """Manage client knowledge base documents."""

    def get_serializer_class(self):
        if self.action == 'list':
            return ClientDocumentListSerializer
        return ClientDocumentSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        client = get_object_or_404(Client, slug=client_slug)
        queryset = ClientDocument.objects.filter(client=client)

        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        # Filter by public status
        is_public = self.request.query_params.get('public')
        if is_public is not None:
            queryset = queryset.filter(is_public=is_public.lower() == 'true')

        return queryset

    def perform_create(self, serializer):
        client_slug = self.kwargs.get('client_slug')
        client = get_object_or_404(Client, slug=client_slug)
        serializer.save(client=client)

    @action(detail=False, methods=['get'])
    def categories(self, request, client_slug=None):
        """Get all document categories with counts."""
        client = get_object_or_404(Client, slug=client_slug)
        categories = ClientDocument.objects.filter(client=client).values('category').distinct()
        result = []
        for cat in categories:
            count = ClientDocument.objects.filter(client=client, category=cat['category']).count()
            result.append({
                'category': cat['category'],
                'count': count,
            })
        return Response(result)
