from django.db import transaction
from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from tests.models import TestTask, Test
from .models import Task
from .serializers import TaskReviewSerializer, TestCreateSerializer
from subjects.views import get_subject_detail_response  # Предположим, этот метод оптимизирован


class IncreaseTaskUnderstandingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Передаем request в контекст для валидации владельца
        serializer = TaskReviewSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        # Берем уже найденный в процессе валидации объект
        task = serializer.context['task_obj']

        # Логика обновления
        task.understanding_percent = min(task.understanding_percent + 15, 100)
        task.save(update_fields=['understanding_percent'])  # update_fields быстрее

        # Считаем среднее по предмету
        subject_avg = task.subject.tasks.aggregate(
            avg=Avg("understanding_percent")
        )["avg"] or 0

        return Response({
            'task_id': task.id,
            "task_understanding": task.understanding_percent,
            "subject_understanding": round(subject_avg, 2)
        })


class CreateTestView(APIView):
    permission_classes = [IsAuthenticated]  # Добавил обязательную проверку!

    def post(self, request):
        serializer = TestCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        subject = data["subject_obj"]
        tasks_data = data["tasks"]["scores"]
        title = data.get("title")

        if not title:
            tests_count = Test.objects.filter(subject=subject).count()
            title = f"Пробник {tests_count + 1}"

        with transaction.atomic():
            # 1. Создаем пробник
            test = Test.objects.create(subject=subject, title=title)

            # 2. Создаем записи о баллах
            TestTask.objects.bulk_create([
                TestTask(test=test, number=int(num), score=score)
                for num, score in tasks_data.items()
            ])

            # 3. Обновляем проценты понимания
            self._update_understanding(subject, tasks_data)

        # Возвращаем обновленные данные по предмету
        response_data = get_subject_detail_response(subject, request.user)
        return Response(
            {"message": "Пробник сохранен", **response_data},
            status=status.HTTP_201_CREATED
        )

    def _update_understanding(self, subject, tasks_data):
        # Оптимизированный запрос: только нужные задачи
        user_tasks = Task.objects.filter(
            subject=subject,
            exam_task_template__number__in=tasks_data.keys()
        ).select_related("exam_task_template")

        tasks_to_update = []
        for task in user_tasks:
            num_str = str(task.exam_task_template.number)
            score = tasks_data.get(num_str)
            max_score = task.exam_task_template.max_score

            if max_score <= 0: continue

            # Твоя формула
            current = task.understanding_percent
            if score * 2 > max_score:
                delta = 20
            elif score * 2 == max_score:
                delta = 10
            else:
                delta = -50

            task.understanding_percent = max(0, min(100, current + delta))
            tasks_to_update.append(task)

        if tasks_to_update:
            Task.objects.bulk_update(tasks_to_update, ["understanding_percent"])