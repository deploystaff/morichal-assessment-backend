from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.utils import timezone
from apps.clients.models import Client
from .models import ActionItem
from .serializers import ActionItemSerializer, ActionItemCreateSerializer


class ActionItemViewSet(viewsets.ModelViewSet):
    """ViewSet for ActionItem CRUD operations."""
    serializer_class = ActionItemSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        queryset = ActionItem.objects.filter(client__slug=client_slug)

        # Filter by status if provided
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by assignee if provided
        assigned_to = self.request.query_params.get('assigned_to')
        if assigned_to:
            queryset = queryset.filter(assigned_to__icontains=assigned_to)

        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return ActionItemCreateSerializer
        return ActionItemSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        client_slug = self.kwargs.get('client_slug')
        context['client'] = get_object_or_404(Client, slug=client_slug)
        return context

    def perform_create(self, serializer):
        # Client is already in serializer context (from get_serializer_context)
        # Just call save() - the serializer's create() handles client
        serializer.save()

    @action(detail=True, methods=['post'])
    def complete(self, request, client_slug=None, pk=None):
        """Mark an action item as complete."""
        action_item = self.get_object()
        action_item.status = 'completed'
        action_item.completed_date = timezone.now().date()
        action_item.save()

        return Response(ActionItemSerializer(action_item).data)
