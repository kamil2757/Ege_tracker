from rest_framework import serializers
from subjects.models import Subject
from tasks.models import Task


class TaskReviewSerializer(serializers.Serializer):
    task_id = serializers.IntegerField()

    def validate_task_id(self, value):
        # Проверяем, существует ли задача и принадлежит ли она текущему юзеру
        user = self.context['request'].user
        try:
            task = Task.objects.select_related("subject").get(id=value, subject__user=user)
        except Task.DoesNotExist:
            raise serializers.ValidationError("Задача не найдена или не принадлежит вам.")

        # Сохраняем объект в контекст, чтобы не искать его второй раз в view
        self.context['task_obj'] = task
        return value


class TestCreateSerializer(serializers.Serializer):
    subject_id = serializers.IntegerField()
    title = serializers.CharField(required=False, allow_blank=True, max_length=255, default="")
    # Ожидаем структуру {"scores": {"1": 5, "2": 10}}
    tasks = serializers.DictField(
        child=serializers.DictField(
            child=serializers.IntegerField(min_value=0)
        )
    )

    def validate(self, data):
        request = self.context.get("request")
        subject_id = data.get("subject_id")

        # 1. Валидация предмета
        try:
            subject = Subject.objects.get(id=subject_id, user=request.user)
        except Subject.DoesNotExist:
            raise serializers.ValidationError({"subject_id": "Предмет не найден."})

        # 2. Валидация структуры scores
        scores = data.get("tasks", {}).get("scores", {})
        if not scores:
            raise serializers.ValidationError({"tasks": "Необходимо передать баллы в ключе 'scores'"})

        # 3. Валидация номеров заданий и баллов
        # Достаем все задачи этого предмета одним запросом
        user_tasks = Task.objects.filter(subject=subject).select_related("exam_task_template")
        valid_tasks_map = {
            str(t.exam_task_template.number): t.exam_task_template.max_score
            for t in user_tasks
        }

        errors = {}
        for number_str, score in scores.items():
            if number_str not in valid_tasks_map:
                errors[number_str] = f"Задание №{number_str} не входит в этот предмет."
                continue

            max_val = valid_tasks_map[number_str]
            if score > max_val:
                errors[number_str] = f"Балл ({score}) больше максимального ({max_val})."

        if errors:
            raise serializers.ValidationError({"tasks": {"scores": errors}})

        # Передаем объект subject дальше, чтобы вьюха не делала лишний запрос
        data["subject_obj"] = subject
        return data