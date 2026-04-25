from django.db.models import Avg, Prefetch
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from .models import Subject
from .serializers import SubjectListSerializer
from static_exam_info.models import ExamScoreConversion, ExamSubject
from tests.models import Test


class UserSubjectsListView(ListAPIView):
    serializer_class = SubjectListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Валидация: берем только активные предметы текущего юзера
        last_test_qs = (
            Test.objects
            .order_by("-date_taken", "-id")
            .prefetch_related("tasks")
        )

        return (
            Subject.objects
            .filter(user=self.request.user, is_active=True)
            .annotate(average_understanding=Avg("tasks__understanding_percent"))
            .prefetch_related(
                Prefetch("tests", queryset=last_test_qs, to_attr="prefetched_tests")
            )
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        # Избегаем повторного тяжелого запроса через values_list
        subjects_titles = self.get_queryset().values_list('title', flat=True)

        exam_subjects = (
            ExamSubject.objects
            .filter(title__in=subjects_titles)
            .prefetch_related(
                Prefetch(
                    "score_conversions",
                    queryset=ExamScoreConversion.objects.order_by("primary_score"),
                    to_attr="prefetched_score_conversions",
                )
            )
        )

        context["conversions_map"] = {
            es.title: getattr(es, "prefetched_score_conversions", [])
            for es in exam_subjects
        }
        return context


def get_subject_detail_response(subject, user):
    """
    Улучшенная версия сбора данных по предмету.
    """
    # Валидация: гарантируем, что предмет принадлежит пользователю
    # Используем prefetch для всех связанных данных
    subject = get_object_or_404(
        Subject.objects.filter(user=user).prefetch_related(
            "tasks__exam_task_template",
            Prefetch(
                "tests",
                queryset=Test.objects.prefetch_related("tasks").order_by("-date_taken", "-id")
            )
        ),
        pk=subject.pk
    )

    # Валидация среднего значения (если задач еще нет)
    average_understanding = subject.tasks.aggregate(
        avg=Avg("understanding_percent")
    )["avg"] or 0

    tasks_qs = subject.tasks.all().order_by("exam_task_template__number")

    tasks_data = [
        {
            "id": task.id,
            "number": task.exam_task_template.number,
            "title": task.exam_task_template.title,
            "max_score": task.exam_task_template.max_score,
            "understanding_percent": task.understanding_percent,
        }
        for task in tasks_qs
    ]

    # Безопасный подсчет максимального балла
    max_score = sum(t.exam_task_template.max_score for t in tasks_qs)

    all_tests = list(subject.tests.all()[:5])
    last_test_data = None
    tests_data = []

    for i, test in enumerate(all_tests):
        total_score = sum(task.score for task in test.tasks.all())

        test_dict = {
            "id": test.id,
            "title": test.title,
            "date_taken": test.date_taken,
            "score": total_score,
            "max_score": max_score,
            "tasks": [
                {"number": task.number, "score": task.score}
                for task in test.tasks.all().order_by("number")
            ]
        }
        if i == 0:
            last_test_data = test_dict
        else:
            tests_data.append(test_dict)

    # Валидация наличия статической инфы по предмету
    exam_subject = ExamSubject.objects.filter(title=subject.title).first()
    score_conversion_data = []

    if exam_subject:
        score_conversion_data = [
            {
                "primary_score": sc.primary_score,
                "secondary_score": sc.secondary_score,
            }
            for sc in ExamScoreConversion.objects.filter(exam_subject=exam_subject).order_by("primary_score")
        ]

    return {
        "id": subject.id,
        "title": subject.title,
        "target_score": subject.target_score,
        "average_understanding": round(average_understanding),
        "tasks": tasks_data,
        "last_test": last_test_data,
        "tests": tests_data,
        "score_conversions": score_conversion_data,
    }


class SubjectDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Валидация владения объектом (pk + user)
        subject = get_object_or_404(Subject, pk=pk, user=request.user)
        data = get_subject_detail_response(subject, request.user)
        return Response(data)