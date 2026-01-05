from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.utils import timezone
from apps.clients.models import Client
from .models import ClientSettings
from .serializers import ClientSettingsSerializer, ClientSettingsUpdateSerializer


class ClientSettingsView(APIView):
    """View for client settings (GET/PATCH only)."""

    def get(self, request, client_slug):
        """Get settings for a client, creating defaults if needed."""
        client = get_object_or_404(Client, slug=client_slug)

        settings, created = ClientSettings.objects.get_or_create(client=client)
        return Response(ClientSettingsSerializer(settings).data)

    def patch(self, request, client_slug):
        """Update settings for a client."""
        client = get_object_or_404(Client, slug=client_slug)
        settings = get_object_or_404(ClientSettings, client=client)

        serializer = ClientSettingsUpdateSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(ClientSettingsSerializer(settings).data)


class ProvidersView(APIView):
    """View for available AI providers."""

    def get(self, request, client_slug):
        """List available AI providers."""
        import os
        providers = []

        # Check for Anthropic
        if os.environ.get('ANTHROPIC_API_KEY'):
            providers.append({
                'id': 'anthropic',
                'name': 'Anthropic',
                'models': [
                    {'id': 'claude-sonnet-4-20250514', 'name': 'Claude Sonnet 4'},
                    {'id': 'claude-3-5-sonnet-20241022', 'name': 'Claude 3.5 Sonnet'},
                    {'id': 'claude-3-haiku-20240307', 'name': 'Claude 3 Haiku'},
                ],
                'configured': True
            })

        # Check for OpenAI
        if os.environ.get('OPENAI_API_KEY'):
            providers.append({
                'id': 'openai',
                'name': 'OpenAI',
                'models': [
                    {'id': 'gpt-4o', 'name': 'GPT-4o'},
                    {'id': 'gpt-4o-mini', 'name': 'GPT-4o Mini'},
                ],
                'configured': True
            })

        return Response(providers)


class ResetUsageView(APIView):
    """View to reset usage statistics."""

    def post(self, request, client_slug):
        """Reset monthly usage statistics."""
        client = get_object_or_404(Client, slug=client_slug)
        settings = get_object_or_404(ClientSettings, client=client)

        settings.api_calls_this_month = 0
        settings.tokens_used_this_month = 0
        settings.estimated_cost_this_month = 0
        settings.usage_reset_date = timezone.now().date()
        settings.save()

        return Response({
            'success': True,
            'message': 'Usage statistics reset successfully'
        })


class ValidateKeyView(APIView):
    """View to validate API keys for OpenAI and Anthropic."""

    def post(self, request, client_slug):
        """Validate an API key based on provider."""
        api_key = request.data.get('api_key', '')
        provider = request.data.get('provider', 'openai')

        if not api_key:
            return Response(
                {'valid': False, 'error': 'No API key provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate based on provider
        if provider == 'openai':
            # OpenAI keys start with sk-
            if not api_key.startswith('sk-'):
                return Response(
                    {'valid': False, 'error': 'Invalid OpenAI API key format. Keys should start with "sk-"'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        elif provider == 'anthropic':
            # Anthropic keys start with sk-ant-
            if not api_key.startswith('sk-ant-'):
                return Response(
                    {'valid': False, 'error': 'Invalid Anthropic API key format. Keys should start with "sk-ant-"'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(
                {'valid': False, 'error': f'Unknown provider: {provider}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # TODO: Actually validate with provider APIs
        # For now, just check format
        return Response({'valid': True, 'provider': provider})
