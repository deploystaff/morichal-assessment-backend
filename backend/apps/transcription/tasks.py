"""
Celery tasks for transcript analysis and audio transcription.
"""

import json
from celery import shared_task
from django.conf import settings
from django.utils import timezone


@shared_task(bind=True, max_retries=3)
def transcribe_audio_task(self, meeting_id: str, audio_data: bytes, filename: str, api_key: str = None):
    """
    Async audio transcription using OpenAI Whisper.
    """
    from apps.meetings.models import Meeting
    import openai

    try:
        meeting = Meeting.objects.get(id=meeting_id)
        effective_api_key = api_key or settings.OPENAI_API_KEY

        if not effective_api_key:
            raise ValueError('OpenAI API key not configured')

        client = openai.OpenAI(api_key=effective_api_key)

        # Create temp file for transcription
        import tempfile
        import os

        # Determine file extension
        ext = os.path.splitext(filename)[1] or '.mp3'

        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as f:
            f.write(audio_data)
            temp_path = f.name

        try:
            with open(temp_path, 'rb') as audio_file:
                transcription = client.audio.transcriptions.create(
                    model='whisper-1',
                    file=audio_file,
                    response_format='verbose_json'
                )

            meeting.transcript_text = transcription.text
            meeting.transcript_filename = filename
            meeting.transcript_uploaded_at = timezone.now()
            meeting.transcript_source = 'whisper'
            meeting.transcript_duration = getattr(transcription, 'duration', None)
            meeting.transcript_language = getattr(transcription, 'language', None)
            meeting.save()

            return {
                'success': True,
                'meeting_id': str(meeting_id),
                'text_length': len(transcription.text),
                'duration': getattr(transcription, 'duration', None),
                'language': getattr(transcription, 'language', None),
            }

        finally:
            os.unlink(temp_path)

    except Exception as e:
        self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=2)
def analyze_transcript_task(self, meeting_id: str):
    """
    Async transcript analysis using Claude.
    """
    from apps.meetings.models import Meeting
    from apps.questions.models import Question
    from apps.suggestions.models import AISuggestion
    import anthropic

    try:
        meeting = Meeting.objects.select_related('client').get(id=meeting_id)

        if not meeting.transcript_text:
            return {'error': 'No transcript available'}

        # Get pending questions for context
        pending_questions = list(Question.objects.filter(
            client=meeting.client,
            status='pending'
        ).values('id', 'question_code', 'question', 'priority'))

        # Build the analysis prompt
        system_context = """You are an AI assistant specialized in analyzing meeting transcripts for MorichalAI,
a trade and supply chain platform. Your job is to:

1. Find answers to pending questions
2. Discover business rules mentioned in the conversation
3. Identify decisions that were made
4. Extract action items with assignees and due dates

Return your analysis as JSON with the following structure:
{
    "answers": [{"question_id": "uuid", "answer": "...", "confidence": 0.0-1.0, "source_quote": "..."}],
    "businessRules": [{"title": "...", "description": "...", "category": "...", "confidence": 0.0-1.0}],
    "decisions": [{"title": "...", "description": "...", "confidence": 0.0-1.0}],
    "actionItems": [{"title": "...", "description": "...", "assignee": "...", "priority": "high|medium|low", "confidence": 0.0-1.0}]
}"""

        questions_context = ""
        if pending_questions:
            questions_context = "\n\nPending questions to look for answers:\n"
            for q in pending_questions:
                questions_context += f"- [{q['question_code']}] {q['question']}\n"

        prompt = f"""Analyze this meeting transcript and extract insights.

TRANSCRIPT:
{meeting.transcript_text[:15000]}  # Limit to ~15k chars for token limits

{questions_context}

Return ONLY valid JSON, no other text."""

        # Call Claude API
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

        message = client.messages.create(
            model='claude-sonnet-4-20250514',
            max_tokens=4096,
            system=system_context,
            messages=[{'role': 'user', 'content': prompt}]
        )

        # Parse the response
        response_text = message.content[0].text

        # Try to extract JSON from the response
        try:
            # Find JSON in the response
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            if start >= 0 and end > start:
                analysis = json.loads(response_text[start:end])
            else:
                analysis = {'answers': [], 'businessRules': [], 'decisions': [], 'actionItems': []}
        except json.JSONDecodeError:
            analysis = {'answers': [], 'businessRules': [], 'decisions': [], 'actionItems': []}

        # Create suggestions from the analysis
        suggestions_created = 0

        # Process answers
        for item in analysis.get('answers', []):
            question_id = item.get('question_id')
            if question_id:
                try:
                    question = Question.objects.get(id=question_id, client=meeting.client)
                    AISuggestion.objects.create(
                        meeting=meeting,
                        client=meeting.client,
                        suggestion_type='answer',
                        target_question=question,
                        suggested_content=item,
                        confidence=item.get('confidence', 0.8),
                    )
                    suggestions_created += 1
                except Question.DoesNotExist:
                    pass

        # Process business rules
        for item in analysis.get('businessRules', []):
            AISuggestion.objects.create(
                meeting=meeting,
                client=meeting.client,
                suggestion_type='business_rule',
                suggested_content=item,
                confidence=item.get('confidence', 0.8),
            )
            suggestions_created += 1

        # Process decisions
        for item in analysis.get('decisions', []):
            AISuggestion.objects.create(
                meeting=meeting,
                client=meeting.client,
                suggestion_type='decision',
                suggested_content=item,
                confidence=item.get('confidence', 0.8),
            )
            suggestions_created += 1

        # Process action items
        for item in analysis.get('actionItems', []):
            AISuggestion.objects.create(
                meeting=meeting,
                client=meeting.client,
                suggestion_type='action_item',
                suggested_content=item,
                confidence=item.get('confidence', 0.8),
            )
            suggestions_created += 1

        return {
            'success': True,
            'meeting_id': str(meeting_id),
            'suggestions_created': suggestions_created,
        }

    except Exception as e:
        self.retry(exc=e, countdown=120)
