from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from apps.clients.models import Client
from .models import BusinessRule, Decision
from .serializers import (
    BusinessRuleSerializer, BusinessRuleCreateSerializer,
    DecisionSerializer, DecisionCreateSerializer
)


class BusinessRuleViewSet(viewsets.ModelViewSet):
    """ViewSet for BusinessRule CRUD operations."""
    serializer_class = BusinessRuleSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        queryset = BusinessRule.objects.filter(client__slug=client_slug)

        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return BusinessRuleCreateSerializer
        return BusinessRuleSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        client_slug = self.kwargs.get('client_slug')
        context['client'] = get_object_or_404(Client, slug=client_slug)
        return context

    def perform_create(self, serializer):
        client_slug = self.kwargs.get('client_slug')
        client = get_object_or_404(Client, slug=client_slug)
        serializer.save(client=client)


class DecisionViewSet(viewsets.ModelViewSet):
    """ViewSet for Decision CRUD operations."""
    serializer_class = DecisionSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        return Decision.objects.filter(client__slug=client_slug)

    def get_serializer_class(self):
        if self.action == 'create':
            return DecisionCreateSerializer
        return DecisionSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        client_slug = self.kwargs.get('client_slug')
        context['client'] = get_object_or_404(Client, slug=client_slug)
        return context

    def perform_create(self, serializer):
        client_slug = self.kwargs.get('client_slug')
        client = get_object_or_404(Client, slug=client_slug)
        serializer.save(client=client)
