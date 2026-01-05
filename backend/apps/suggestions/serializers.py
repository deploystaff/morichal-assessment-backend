from rest_framework import serializers
from .models import AISuggestion


class AISuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISuggestion
        fields = [
            'id', 'meeting', 'suggestion_type', 'target_question',
            'suggested_content', 'confidence', 'status', 'reviewed_at',
            'reviewed_by', 'created_at'
        ]
        read_only_fields = ['id', 'meeting', 'suggestion_type', 'suggested_content', 'confidence', 'created_at']


class SuggestionActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    reviewed_by = serializers.CharField(required=False)
