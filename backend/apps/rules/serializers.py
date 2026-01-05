from rest_framework import serializers
from .models import BusinessRule, Decision


class BusinessRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessRule
        fields = [
            'id', 'rule_code', 'title', 'description', 'category',
            'discovered_in_meeting', 'source', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'rule_code', 'created_at', 'updated_at']


class BusinessRuleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessRule
        fields = ['title', 'description', 'category', 'discovered_in_meeting', 'source']

    def create(self, validated_data):
        client = self.context['client']
        count = BusinessRule.objects.filter(client=client).count()
        rule_code = f"BR-{count + 100}"
        return BusinessRule.objects.create(
            client=client,
            rule_code=rule_code,
            **validated_data
        )


class DecisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Decision
        fields = [
            'id', 'decision_code', 'title', 'description', 'made_in_meeting',
            'made_by', 'status', 'implementation_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'decision_code', 'created_at', 'updated_at']


class DecisionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Decision
        fields = ['title', 'description', 'made_in_meeting', 'made_by', 'implementation_notes']

    def create(self, validated_data):
        client = self.context['client']
        count = Decision.objects.filter(client=client).count()
        decision_code = f"DEC-{count + 100}"
        return Decision.objects.create(
            client=client,
            decision_code=decision_code,
            **validated_data
        )
