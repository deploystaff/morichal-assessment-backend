from rest_framework import serializers
from .models import Question


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id', 'question_code', 'category', 'question', 'status', 'priority',
            'asked_in_meeting', 'answer', 'answered_by', 'answered_date', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'question_code', 'created_at', 'updated_at']


class QuestionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['category', 'question', 'priority', 'asked_in_meeting', 'notes']

    def create(self, validated_data):
        client = self.context['client']
        count = Question.objects.filter(client=client).count()
        question_code = f"Q-{count + 100}"
        return Question.objects.create(
            client=client,
            question_code=question_code,
            **validated_data
        )


class AnswerQuestionSerializer(serializers.Serializer):
    answer = serializers.CharField()
    answered_by = serializers.CharField(required=False)
    status = serializers.ChoiceField(
        choices=['answered', 'needs-follow-up', 'deferred'],
        default='answered'
    )
