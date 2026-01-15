from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.utils import timezone
from apps.clients.models import Client
from .models import AISuggestion
from .serializers import AISuggestionSerializer, SuggestionActionSerializer


class AISuggestionViewSet(viewsets.ModelViewSet):
    """ViewSet for AISuggestion operations."""
    serializer_class = AISuggestionSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']  # post for batch_approve action

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        queryset = AISuggestion.objects.filter(client__slug=client_slug)

        # Filter by status if provided
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by type if provided
        suggestion_type = self.request.query_params.get('type')
        if suggestion_type:
            queryset = queryset.filter(suggestion_type=suggestion_type)

        return queryset

    def partial_update(self, request, *args, **kwargs):
        """Handle approve/reject actions via PATCH."""
        instance = self.get_object()
        action_data = request.data.get('action')

        if action_data == 'approve':
            instance.status = 'approved'
            instance.reviewed_at = timezone.now()
            instance.reviewed_by = request.data.get('reviewed_by', '')
            instance.save()

            # Apply the suggestion based on type
            self._apply_suggestion(instance)

        elif action_data == 'reject':
            instance.status = 'rejected'
            instance.reviewed_at = timezone.now()
            instance.reviewed_by = request.data.get('reviewed_by', '')
            instance.save()

        return Response(AISuggestionSerializer(instance).data)

    def _apply_suggestion(self, suggestion):
        """Apply an approved suggestion to create/update records."""
        content = suggestion.suggested_content

        if suggestion.suggestion_type == 'answer' and suggestion.target_question:
            # Update the target question with the suggested answer
            question = suggestion.target_question
            question.answer = content.get('answer', '')
            question.answered_by = 'AI Suggestion'
            question.answered_date = timezone.now().date()
            question.status = 'answered'
            question.save()

        elif suggestion.suggestion_type == 'business_rule':
            # Create a new business rule
            from apps.rules.models import BusinessRule
            count = BusinessRule.objects.filter(client=suggestion.client).count()
            BusinessRule.objects.create(
                client=suggestion.client,
                rule_code=f"BR-{count + 100}",
                title=content.get('title', ''),
                description=content.get('description', ''),
                category=content.get('category', ''),
                discovered_in_meeting=suggestion.meeting,
                source='AI Suggestion',
            )

        elif suggestion.suggestion_type == 'action_item':
            # Create a new action item
            from apps.actions.models import ActionItem
            count = ActionItem.objects.filter(client=suggestion.client).count()
            ActionItem.objects.create(
                client=suggestion.client,
                action_code=f"ACT-{count + 100}",
                title=content.get('title', ''),
                description=content.get('description', ''),
                assigned_to=content.get('assignee', ''),
                priority=content.get('priority', 'medium'),
                from_meeting=suggestion.meeting,
            )

        elif suggestion.suggestion_type == 'decision':
            # Create a new decision
            from apps.rules.models import Decision
            count = Decision.objects.filter(client=suggestion.client).count()
            Decision.objects.create(
                client=suggestion.client,
                decision_code=f"DEC-{count + 100}",
                title=content.get('title', ''),
                description=content.get('description', ''),
                made_in_meeting=suggestion.meeting,
                made_by='AI Suggestion',
            )

    @action(detail=False, methods=['post'])
    def batch_approve(self, request, client_slug=None):
        """Batch approve multiple suggestions at once."""
        suggestion_ids = request.data.get('ids', [])
        reviewed_by = request.data.get('reviewed_by', '')

        if not suggestion_ids:
            return Response(
                {'error': 'No suggestion IDs provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get pending suggestions for this client
        suggestions = AISuggestion.objects.filter(
            id__in=suggestion_ids,
            client__slug=client_slug,
            status='pending'
        )

        approved_count = 0
        for suggestion in suggestions:
            suggestion.status = 'approved'
            suggestion.reviewed_at = timezone.now()
            suggestion.reviewed_by = reviewed_by
            suggestion.save()
            self._apply_suggestion(suggestion)
            approved_count += 1

        return Response({
            'success': True,
            'approved_count': approved_count
        })
