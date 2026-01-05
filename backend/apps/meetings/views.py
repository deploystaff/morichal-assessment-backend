from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from apps.clients.models import Client
from .models import Meeting
from .serializers import MeetingSerializer, MeetingCreateSerializer


class MeetingViewSet(viewsets.ModelViewSet):
    """ViewSet for Meeting CRUD operations."""
    serializer_class = MeetingSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        return Meeting.objects.filter(client__slug=client_slug)

    def get_serializer_class(self):
        if self.action == 'create':
            return MeetingCreateSerializer
        return MeetingSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        client_slug = self.kwargs.get('client_slug')
        context['client'] = get_object_or_404(Client, slug=client_slug)
        return context

    def perform_create(self, serializer):
        client_slug = self.kwargs.get('client_slug')
        client = get_object_or_404(Client, slug=client_slug)
        serializer.save(client=client)

    @action(detail=True, methods=['post'])
    def transcript(self, request, client_slug=None, pk=None):
        """Upload transcript for a meeting."""
        meeting = self.get_object()
        file = request.FILES.get('transcript')

        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Read file content
        content = file.read()
        try:
            text = content.decode('utf-8')
        except UnicodeDecodeError:
            text = content.decode('latin-1')

        # Determine source type
        filename = file.name.lower()
        if filename.endswith('.pdf'):
            source = 'pdf'
        elif filename.endswith('.json'):
            source = 'json'
        else:
            source = 'text'

        meeting.transcript_text = text
        meeting.transcript_filename = file.name
        meeting.transcript_uploaded_at = timezone.now()
        meeting.transcript_source = source
        meeting.save()

        return Response({
            'success': True,
            'message': 'Transcript uploaded successfully',
            'source': source,
            'filename': file.name,
            'length': len(text)
        })

    @action(detail=True, methods=['post'])
    def analyze(self, request, client_slug=None, pk=None):
        """Analyze transcript with AI."""
        meeting = self.get_object()

        if not meeting.transcript_text:
            return Response(
                {'error': 'No transcript available for analysis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Queue async analysis task
        from apps.transcription.tasks import analyze_transcript_task
        task = analyze_transcript_task.delay(str(meeting.id))

        return Response({
            'success': True,
            'message': 'Analysis queued',
            'task_id': task.id,
            'meeting_id': str(meeting.id)
        }, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=['get'])
    def suggestions(self, request, client_slug=None, pk=None):
        """Get AI suggestions for a meeting."""
        meeting = self.get_object()

        from apps.suggestions.models import AISuggestion
        from apps.suggestions.serializers import AISuggestionSerializer

        suggestions = AISuggestion.objects.filter(meeting=meeting)
        return Response(AISuggestionSerializer(suggestions, many=True).data)
