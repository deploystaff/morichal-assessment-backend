"""
URL configuration for MorichalAI Meeting Portal API.
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response


def health_check(request):
    """Health check endpoint."""
    return JsonResponse({'status': 'ok'})


@api_view(['GET'])
def client_all_data(request, client_slug):
    """Get all data for a client (meetings, questions, etc.)."""
    from django.shortcuts import get_object_or_404
    from apps.clients.models import Client
    from apps.meetings.models import Meeting, Update, Blocker, Attachment
    from apps.meetings.serializers import (
        MeetingSerializer, UpdateSerializer, BlockerSerializer, AttachmentSerializer
    )
    from apps.questions.models import Question
    from apps.questions.serializers import QuestionSerializer
    from apps.rules.models import BusinessRule, Decision
    from apps.rules.serializers import BusinessRuleSerializer, DecisionSerializer
    from apps.actions.models import ActionItem
    from apps.actions.serializers import ActionItemSerializer

    client = get_object_or_404(Client, slug=client_slug)

    return Response({
        'version': '2.1',
        'lastUpdated': client.updated_at,
        'meetings': MeetingSerializer(Meeting.objects.filter(client=client), many=True).data,
        'questions': QuestionSerializer(Question.objects.filter(client=client), many=True).data,
        'businessRules': BusinessRuleSerializer(BusinessRule.objects.filter(client=client), many=True).data,
        'decisions': DecisionSerializer(Decision.objects.filter(client=client), many=True).data,
        'actionItems': ActionItemSerializer(ActionItem.objects.filter(client=client), many=True).data,
        'updates': UpdateSerializer(Update.objects.filter(client=client), many=True).data,
        'blockers': BlockerSerializer(Blocker.objects.filter(client=client), many=True).data,
        'attachments': AttachmentSerializer(Attachment.objects.filter(client=client), many=True).data,
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check, name='health'),
    path('api/health/', health_check, name='api-health'),

    # Authentication endpoints
    path('api/auth/', include('apps.authentication.urls')),

    # Client-level endpoints (no slug)
    path('api/', include('apps.clients.urls')),

    # Shortcut endpoint for getting all data
    path('api/<slug:client_slug>/all/', client_all_data, name='client-all'),
    path('api/<slug:client_slug>/export/', client_all_data, name='client-export'),

    # Client-scoped endpoints (with slug)
    path('api/<slug:client_slug>/', include([
        path('', include('apps.meetings.urls')),
        path('', include('apps.questions.urls')),
        path('', include('apps.actions.urls')),
        path('', include('apps.rules.urls')),
        path('', include('apps.suggestions.urls')),
        path('', include('apps.settings_app.urls')),
        path('', include('apps.sprints.urls')),
        path('', include('apps.deliverables.urls')),
    ])),
]
