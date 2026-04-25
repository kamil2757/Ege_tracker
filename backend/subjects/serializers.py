from rest_framework import serializers
from subjects.models import Subject
from tests.serializers import LastTestSerializer


def primary_to_secondary(conversions, primary_score: int) -> int:
    """Конвертирует первичный балл во вторичный на основе таблицы."""
    secondary = 0
    for row in conversions:
        if primary_score >= row.primary_score:
            secondary = row.secondary_score
        else:
            break
    return secondary


class SubjectListSerializer(serializers.ModelSerializer):
    last_test = serializers.SerializerMethodField()
    average_understanding = serializers.FloatField(read_only=True)

    # Добавим валидацию для target_score, если ты решишь обновлять его через этот сериализатор
    target_score = serializers.IntegerField(min_value=0, max_value=100, required=False)

    class Meta:
        model = Subject
        fields = ["id", "title", "target_score", "created_at", "average_understanding", "last_test"]

    def get_last_test(self, obj):
        # Оптимизация: берем из prefetch, чтобы не лезть в базу в цикле
        tests = getattr(obj, "prefetched_tests", [])
        last_test = tests[0] if tests else None

        if not last_test:
            return None

        # Важно: здесь мы используем .all(), так как tasks должны быть уже prefetched во вьюхе
        primary_score = sum(t.score for t in last_test.tasks.all())

        # Берем карту конвертации из контекста (подготовлена во вьюхе одним запросом)
        conversions_map = self.context.get("conversions_map", {})
        conversions = conversions_map.get(obj.title, [])
        secondary_score = primary_to_secondary(conversions, primary_score)

        # Собираем данные
        return {
            "id": last_test.id,
            "title": last_test.title,
            "date_taken": last_test.date_taken,
            "score": secondary_score,
            "primary_score": primary_score
        }