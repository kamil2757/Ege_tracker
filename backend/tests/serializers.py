from django.db.models import Sum
from rest_framework import serializers
from tests.models import Test


class LastTestSerializer(serializers.ModelSerializer):
    score = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = ["id", "title", "date_taken", "score"]

    def get_score(self, obj):
        total_score = obj.tasks.aggregate(total=Sum("score"))["total"] or 0
        return total_score