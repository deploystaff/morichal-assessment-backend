from rest_framework import serializers
from .models import Sprint, SprintItem, DeliveryMilestone


class SprintItemSerializer(serializers.ModelSerializer):
    """Full serializer for sprint items."""

    class Meta:
        model = SprintItem
        fields = [
            'id', 'client', 'sprint', 'item_code', 'name', 'description',
            'item_type', 'status', 'priority', 'order', 'assigned_to',
            'estimated_hours', 'actual_hours', 'notes', 'start_date', 'end_date',
            'completed_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'client', 'created_at', 'updated_at']


class SprintItemCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating sprint items."""

    class Meta:
        model = SprintItem
        fields = [
            'sprint', 'item_code', 'name', 'description', 'item_type',
            'status', 'priority', 'order', 'assigned_to', 'estimated_hours',
            'actual_hours', 'notes', 'start_date', 'end_date'
        ]


class SprintSerializer(serializers.ModelSerializer):
    """Full serializer for sprints with nested items."""
    items = SprintItemSerializer(many=True, read_only=True)
    progress = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    completed_items = serializers.ReadOnlyField()

    class Meta:
        model = Sprint
        fields = [
            'id', 'client', 'sprint_code', 'name', 'description',
            'start_date', 'end_date', 'status', 'order', 'color',
            'progress', 'total_items', 'completed_items', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'client', 'progress', 'total_items', 'completed_items', 'created_at', 'updated_at']


class SprintCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating sprints."""

    class Meta:
        model = Sprint
        fields = [
            'sprint_code', 'name', 'description', 'start_date', 'end_date',
            'status', 'order', 'color'
        ]


class SprintSummarySerializer(serializers.ModelSerializer):
    """Summary serializer for sprints (without nested items)."""
    progress = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    completed_items = serializers.ReadOnlyField()

    class Meta:
        model = Sprint
        fields = [
            'id', 'sprint_code', 'name', 'description', 'start_date',
            'end_date', 'status', 'order', 'color', 'progress',
            'total_items', 'completed_items'
        ]


class RoadmapSerializer(serializers.Serializer):
    """Serializer for roadmap summary response."""
    sprints = SprintSerializer(many=True)
    overall_progress = serializers.IntegerField()
    total_items = serializers.IntegerField()
    completed_items = serializers.IntegerField()
    milestone_total = serializers.IntegerField()
    milestone_completed = serializers.IntegerField()
    current_sprint = SprintSummarySerializer(allow_null=True)


class ReorderSerializer(serializers.Serializer):
    """Serializer for reorder operations."""
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )


class MoveItemSerializer(serializers.Serializer):
    """Serializer for moving item to different sprint."""
    sprint_id = serializers.UUIDField()
    order = serializers.IntegerField(required=False, default=0)


class DeliveryMilestoneSerializer(serializers.ModelSerializer):
    """Full serializer for delivery milestones."""

    class Meta:
        model = DeliveryMilestone
        fields = [
            'id', 'client', 'milestone_code', 'name', 'description',
            'milestone_type', 'start_date', 'end_date', 'status',
            'order', 'color', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'client', 'created_at', 'updated_at']


class DeliveryMilestoneCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating delivery milestones."""

    class Meta:
        model = DeliveryMilestone
        fields = [
            'milestone_code', 'name', 'description', 'milestone_type',
            'start_date', 'end_date', 'status', 'order', 'color', 'notes'
        ]
