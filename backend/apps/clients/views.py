from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Client
from .serializers import ClientSerializer


class ClientViewSet(viewsets.ModelViewSet):
    """ViewSet for Client CRUD operations."""
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def all(self, request, slug=None):
        """Get all data for a client (meetings, questions, etc.)."""
        client = self.get_object()

        # Import here to avoid circular imports
        from apps.meetings.models import Meeting
        from apps.meetings.serializers import MeetingSerializer
        from apps.questions.models import Question
        from apps.questions.serializers import QuestionSerializer
        from apps.rules.models import BusinessRule, Decision
        from apps.rules.serializers import BusinessRuleSerializer, DecisionSerializer
        from apps.actions.models import ActionItem
        from apps.actions.serializers import ActionItemSerializer

        return Response({
            'version': '2.0',
            'lastUpdated': client.updated_at,
            'meetings': MeetingSerializer(Meeting.objects.filter(client=client), many=True).data,
            'questions': QuestionSerializer(Question.objects.filter(client=client), many=True).data,
            'businessRules': BusinessRuleSerializer(BusinessRule.objects.filter(client=client), many=True).data,
            'decisions': DecisionSerializer(Decision.objects.filter(client=client), many=True).data,
            'actionItems': ActionItemSerializer(ActionItem.objects.filter(client=client), many=True).data,
        })

    @action(detail=True, methods=['get'])
    def export(self, request, slug=None):
        """Export all client data as JSON."""
        return self.all(request, slug)
