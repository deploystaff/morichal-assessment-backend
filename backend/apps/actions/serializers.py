from rest_framework import serializers
from .models import ActionItem


class ActionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionItem
        fields = [
            'id', 'action_code', 'title', 'description', 'assigned_to', 'due_date',
            'status', 'priority', 'from_meeting', 'completed_date', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'action_code', 'created_at', 'updated_at']


class ActionItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionItem
        fields = ['title', 'description', 'assigned_to', 'due_date', 'status', 'priority', 'from_meeting', 'notes']

    def create(self, validated_data):
        client = self.context['client']
        count = ActionItem.objects.filter(client=client).count()
        action_code = f"ACT-{count + 100}"
        return ActionItem.objects.create(
            client=client,
            action_code=action_code,
            **validated_data
        )
