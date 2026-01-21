from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from apps.clients.models import Client
from .models import Meeting, Update, Blocker, Attachment, MeetingSummary
from .serializers import (
    MeetingSerializer, MeetingCreateSerializer,
    UpdateSerializer, UpdateCreateSerializer,
    BlockerSerializer, BlockerCreateSerializer,
    AttachmentSerializer, AttachmentCreateSerializer,
    MeetingSummarySerializer, MeetingSummaryCreateSerializer
)


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
        """Analyze transcript with AI - runs synchronously."""
        from apps.transcription.tasks import run_transcript_analysis

        meeting = self.get_object()

        if not meeting.transcript_text:
            return Response(
                {'error': 'No transcript available for analysis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Run analysis synchronously (no Celery/Redis required)
            result = run_transcript_analysis(str(meeting.id))
            return Response({
                'success': True,
                'message': 'Analysis complete',
                'meeting_id': str(meeting.id),
                'answers_applied': result.get('answers_applied', 0),
                'suggestions_created': result.get('suggestions_created', 0),
                'summary_generated': result.get('summary_generated', False),
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def suggestions(self, request, client_slug=None, pk=None):
        """Get AI suggestions for a meeting."""
        meeting = self.get_object()

        from apps.suggestions.models import AISuggestion
        from apps.suggestions.serializers import AISuggestionSerializer

        suggestions = AISuggestion.objects.filter(meeting=meeting)
        return Response(AISuggestionSerializer(suggestions, many=True).data)


class UpdateViewSet(viewsets.ModelViewSet):
    """ViewSet for Update CRUD operations."""
    serializer_class = UpdateSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        meeting_id = self.request.query_params.get('meeting')
        queryset = Update.objects.filter(client__slug=client_slug)
        if meeting_id:
            queryset = queryset.filter(meeting_id=meeting_id)
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return UpdateCreateSerializer
        return UpdateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        client_slug = self.kwargs.get('client_slug')
        context['client'] = get_object_or_404(Client, slug=client_slug)
        return context


class BlockerViewSet(viewsets.ModelViewSet):
    """ViewSet for Blocker CRUD operations."""
    serializer_class = BlockerSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        meeting_id = self.request.query_params.get('meeting')
        status_filter = self.request.query_params.get('status')
        queryset = Blocker.objects.filter(client__slug=client_slug)
        if meeting_id:
            queryset = queryset.filter(meeting_id=meeting_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return BlockerCreateSerializer
        return BlockerSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        client_slug = self.kwargs.get('client_slug')
        context['client'] = get_object_or_404(Client, slug=client_slug)
        return context

    @action(detail=True, methods=['post'])
    def resolve(self, request, client_slug=None, pk=None):
        """Mark a blocker as resolved."""
        blocker = self.get_object()
        resolution = request.data.get('resolution', '')
        blocker.status = 'resolved'
        blocker.resolution = resolution
        blocker.resolved_at = timezone.now()
        blocker.save()
        return Response(BlockerSerializer(blocker).data)


class AttachmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Attachment CRUD operations."""
    serializer_class = AttachmentSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        meeting_id = self.request.query_params.get('meeting')
        queryset = Attachment.objects.filter(client__slug=client_slug)
        if meeting_id:
            queryset = queryset.filter(meeting_id=meeting_id)
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return AttachmentCreateSerializer
        return AttachmentSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        client_slug = self.kwargs.get('client_slug')
        context['client'] = get_object_or_404(Client, slug=client_slug)
        return context


class MeetingSummaryView(APIView):
    """View for Meeting Summary (single per meeting)."""

    def get(self, request, client_slug, meeting_id):
        """Get summary for a meeting."""
        client = get_object_or_404(Client, slug=client_slug)
        meeting = get_object_or_404(Meeting, id=meeting_id, client=client)
        try:
            summary = MeetingSummary.objects.get(meeting=meeting)
            return Response(MeetingSummarySerializer(summary).data)
        except MeetingSummary.DoesNotExist:
            return Response({'detail': 'No summary found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, client_slug, meeting_id):
        """Create or update summary for a meeting."""
        client = get_object_or_404(Client, slug=client_slug)
        meeting = get_object_or_404(Meeting, id=meeting_id, client=client)

        data = request.data.copy()
        data['meeting'] = meeting.id

        try:
            summary = MeetingSummary.objects.get(meeting=meeting)
            serializer = MeetingSummarySerializer(summary, data=data, partial=True)
        except MeetingSummary.DoesNotExist:
            serializer = MeetingSummaryCreateSerializer(
                data=data,
                context={'client': client}
            )

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(MeetingSummarySerializer(serializer.instance).data)

    def delete(self, request, client_slug, meeting_id):
        """Delete summary for a meeting."""
        client = get_object_or_404(Client, slug=client_slug)
        meeting = get_object_or_404(Meeting, id=meeting_id, client=client)
        try:
            summary = MeetingSummary.objects.get(meeting=meeting)
            summary.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except MeetingSummary.DoesNotExist:
            return Response({'detail': 'No summary found'}, status=status.HTTP_404_NOT_FOUND)
