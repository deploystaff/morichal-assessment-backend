from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.utils import timezone
from apps.clients.models import Client
from .models import Question
from .serializers import QuestionSerializer, QuestionCreateSerializer, AnswerQuestionSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    """ViewSet for Question CRUD operations."""
    serializer_class = QuestionSerializer

    def get_queryset(self):
        client_slug = self.kwargs.get('client_slug')
        queryset = Question.objects.filter(client__slug=client_slug)

        # Filter by status if provided
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by priority if provided
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)

        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return QuestionCreateSerializer
        return QuestionSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        client_slug = self.kwargs.get('client_slug')
        context['client'] = get_object_or_404(Client, slug=client_slug)
        return context

    def perform_create(self, serializer):
        # Client is already set in serializer context and handled in create()
        serializer.save()

    @action(detail=True, methods=['post'])
    def answer(self, request, client_slug=None, pk=None):
        """Answer a question."""
        question = self.get_object()
        serializer = AnswerQuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question.answer = serializer.validated_data['answer']
        question.answered_by = serializer.validated_data.get('answered_by', '')
        question.answered_date = timezone.now().date()
        question.status = serializer.validated_data.get('status', 'answered')
        question.save()

        return Response(QuestionSerializer(question).data)
