from rest_framework import serializers


class SubjectItemSerializer(serializers.Serializer):
    subject = serializers.CharField()
    score = serializers.IntegerField(min_value=0, max_value=100)


class SubjectSetupSerializer(serializers.Serializer):
    subjects = SubjectItemSerializer(many=True)
