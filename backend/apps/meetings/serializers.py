from rest_framework import serializers
from .models import Meeting, Update, Blocker, Attachment, MeetingSummary


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


# Update Serializers
class UpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Update
        fields = [
            'id', 'update_code', 'meeting', 'author', 'content',
            'category', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'update_code', 'created_at', 'updated_at']


class UpdateCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Update
        fields = ['meeting', 'author', 'content', 'category']

    def create(self, validated_data):
        client = self.context['client']
        count = Update.objects.filter(client=client).count()
        update_code = f"UPD-{count + 1:03d}"
        return Update.objects.create(
            client=client,
            update_code=update_code,
            **validated_data
        )


# Blocker Serializers
class BlockerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blocker
        fields = [
            'id', 'blocker_code', 'meeting', 'title', 'description',
            'severity', 'status', 'owner', 'resolution', 'resolved_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'blocker_code', 'created_at', 'updated_at']


class BlockerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blocker
        fields = ['meeting', 'title', 'description', 'severity', 'status', 'owner']

    def create(self, validated_data):
        client = self.context['client']
        count = Blocker.objects.filter(client=client).count()
        blocker_code = f"BLK-{count + 1:03d}"
        return Blocker.objects.create(
            client=client,
            blocker_code=blocker_code,
            **validated_data
        )


# Attachment Serializers
class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = [
            'id', 'meeting', 'filename', 'file_type', 'file_url',
            'description', 'uploaded_by', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AttachmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['meeting', 'filename', 'file_type', 'file_url', 'description', 'uploaded_by']

    def create(self, validated_data):
        client = self.context['client']
        return Attachment.objects.create(client=client, **validated_data)


# Meeting Summary Serializers
class MeetingSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingSummary
        fields = [
            'id', 'meeting', 'content', 'generated_by', 'key_points',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MeetingSummaryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingSummary
        fields = ['meeting', 'content', 'generated_by', 'key_points']

    def create(self, validated_data):
        client = self.context['client']
        return MeetingSummary.objects.create(client=client, **validated_data)
