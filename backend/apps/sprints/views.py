from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Q
from .models import Sprint, SprintItem
from .serializers import (
    SprintSerializer, SprintCreateSerializer, SprintSummarySerializer,
    SprintItemSerializer, SprintItemCreateSerializer,
    RoadmapSerializer, ReorderSerializer, MoveItemSerializer
)


class SprintViewSet(viewsets.ModelViewSet):
    """ViewSet for Sprint CRUD operations."""

    def get_serializer_class(self):
        if self.action == 'create':
            return SprintCreateSerializer
        return SprintSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        return Sprint.objects.filter(
            client__slug=client_slug
        ).prefetch_related('items').order_by('order', 'start_date')

    def perform_create(self, serializer):
        from apps.clients.models import Client
        client_slug = self.kwargs.get('client_slug')
        client = Client.objects.get(slug=client_slug)
        serializer.save(client=client)

    @action(detail=False, methods=['post'])
    def reorder(self, request, client_slug=None):
        """Reorder sprints."""
        serializer = ReorderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        for item in serializer.validated_data['items']:
            Sprint.objects.filter(
                id=item['id'],
                client__slug=client_slug
            ).update(order=int(item['order']))

        return Response({'status': 'reordered'})

    @action(detail=False, methods=['get'])
    def roadmap(self, request, client_slug=None):
        """Get roadmap summary for presentations."""
        sprints = self.get_queryset()

        # Development item types (exclude milestones from main progress)
        dev_types = ['agent', 'feature', 'task', 'bugfix']

        # Calculate DEVELOPMENT progress only
        dev_total = SprintItem.objects.filter(
            client__slug=client_slug,
            item_type__in=dev_types
        ).exclude(status='cancelled').count()

        dev_completed = SprintItem.objects.filter(
            client__slug=client_slug,
            item_type__in=dev_types,
            status='completed'
        ).count()

        dev_progress = round((dev_completed / dev_total) * 100) if dev_total > 0 else 0

        # Calculate MILESTONE progress separately
        milestone_total = SprintItem.objects.filter(
            client__slug=client_slug,
            item_type='milestone'
        ).exclude(status='cancelled').count()

        milestone_completed = SprintItem.objects.filter(
            client__slug=client_slug,
            item_type='milestone',
            status='completed'
        ).count()

        # Find current sprint (in_progress or the next planned one)
        current_sprint = sprints.filter(status='in_progress').first()
        if not current_sprint:
            current_sprint = sprints.filter(
                status='planned',
                start_date__gte=timezone.now().date()
            ).first()

        data = {
            'sprints': SprintSerializer(sprints, many=True).data,
            # Development stats (main display)
            'overall_progress': dev_progress,
            'total_items': dev_total,
            'completed_items': dev_completed,
            # Milestone stats (secondary display)
            'milestone_total': milestone_total,
            'milestone_completed': milestone_completed,
            'current_sprint': SprintSummarySerializer(current_sprint).data if current_sprint else None
        }

        return Response(data)


class SprintItemViewSet(viewsets.ModelViewSet):
    """ViewSet for SprintItem CRUD operations."""

    def get_serializer_class(self):
        if self.action == 'create':
            return SprintItemCreateSerializer
        return SprintItemSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        queryset = SprintItem.objects.filter(
            client__slug=client_slug
        ).select_related('sprint').order_by('sprint__order', 'order')

        # Allow filtering by sprint
        sprint_id = self.request.query_params.get('sprint')
        if sprint_id:
            queryset = queryset.filter(sprint_id=sprint_id)

        return queryset

    def perform_create(self, serializer):
        from apps.clients.models import Client
        client_slug = self.kwargs.get('client_slug')
        client = Client.objects.get(slug=client_slug)
        serializer.save(client=client)

    @action(detail=True, methods=['post'])
    def complete(self, request, client_slug=None, pk=None):
        """Mark item as completed."""
        item = self.get_object()
        item.status = 'completed'
        item.completed_at = timezone.now()
        item.save()
        return Response(SprintItemSerializer(item).data)

    @action(detail=True, methods=['post'])
    def move(self, request, client_slug=None, pk=None):
        """Move item to a different sprint."""
        item = self.get_object()
        serializer = MoveItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Verify sprint belongs to same client
        new_sprint = Sprint.objects.filter(
            id=serializer.validated_data['sprint_id'],
            client__slug=client_slug
        ).first()

        if not new_sprint:
            return Response(
                {'error': 'Sprint not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        item.sprint = new_sprint
        item.order = serializer.validated_data.get('order', 0)
        item.save()

        return Response(SprintItemSerializer(item).data)

    @action(detail=False, methods=['post'])
    def reorder(self, request, client_slug=None):
        """Bulk reorder items (supports moving between sprints)."""
        serializer = ReorderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        for item_data in serializer.validated_data['items']:
            update_fields = {'order': int(item_data['order'])}
            if 'sprint_id' in item_data:
                update_fields['sprint_id'] = item_data['sprint_id']

            SprintItem.objects.filter(
                id=item_data['id'],
                client__slug=client_slug
            ).update(**update_fields)

        return Response({'status': 'reordered'})
