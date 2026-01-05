from rest_framework import serializers
from .models import Meeting


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = [
            'id', 'meeting_code', 'date', 'title', 'attendees', 'agenda', 'notes',
            'status', 'transcript_text', 'transcript_filename', 'transcript_uploaded_at',
            'transcript_source', 'transcript_duration', 'transcript_language',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'meeting_code', 'created_at', 'updated_at']


class MeetingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['date', 'title', 'attendees', 'agenda', 'notes', 'status']

    def create(self, validated_data):
        client = self.context['client']
        count = Meeting.objects.filter(client=client).count()
        meeting_code = f"MTG-{count + 100}"
        return Meeting.objects.create(
            client=client,
            meeting_code=meeting_code,
            **validated_data
        )
