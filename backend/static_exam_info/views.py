from django.contrib.auth import get_user_model
from django.shortcuts import render

from django.db import transaction
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from static_exam_info.models import ExamSubject, ExamTaskTemplate
from static_exam_info.serializers import SubjectSetupSerializer
from subjects.models import Subject
from tasks.models import Task

from django.shortcuts import get_object_or_404
from django.db import transaction



User = get_user_model()
class SubjectUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def patch(self, request):
        user = request.user
        subjects_data = request.data.get("subjects", None)
        new_username = request.data.get("username", None)

        if subjects_data is None and new_username is None:
            return Response({"detail": "Передайте subjects и/или username"}, status=400)

        username_changed = False
        subjects_changed = False

        # ---------- username ----------
        if new_username is not None:
            new_username = str(new_username).strip()
            if not new_username:
                return Response({"detail": "username не может быть пустым"}, status=400)

            if new_username != user.username:
                if User.objects.filter(username=new_username).exclude(pk=user.pk).exists():
                    return Response({"detail": "username уже занят"}, status=400)
                user.username = new_username
                user.save(update_fields=["username"])
                username_changed = True

        # ---------- subjects ----------
        if subjects_data is not None:
            if not isinstance(subjects_data, list) or len(subjects_data) == 0:
                return Response({"detail": "subjects не может быть пустым"}, status=400)

            # защита от дублей по code
            codes = [item.get("subject") for item in subjects_data]
            if len(codes) != len(set(codes)):
                return Response({"detail": "Предметы должны быть разные"}, status=400)

            # подтягиваем exam subjects пачкой
            exam_by_code = ExamSubject.objects.in_bulk(codes, field_name="code")
            if len(exam_by_code) != len(codes):
                unknown = [c for c in codes if c not in exam_by_code]
                return Response({"detail": f"Неизвестные subject code: {unknown}"}, status=400)

            # входящие: title -> score(int)
            incoming = {}
            for item in subjects_data:
                code = item.get("subject")
                score = item.get("score")

                if code is None or score is None or code == '' or score == '':
                    return Response({"detail": "Все поля должны быть заполнены"}, status=400)

                try:
                    score = int(score)
                except (TypeError, ValueError):
                    return Response({"detail": f"score должен быть числом (subject={code})"}, status=400)

                if score > 100:
                    return Response({"detail": f"Балл не может быть больше 100"}, status=400)
                if score < 0:
                    return Response({"detail": f"Балл не может быть отрицательным"}, status=400)

                title = exam_by_code[code].title
                incoming[title] = score

            # текущие активные: title -> score(int)
            existing_active = Subject.objects.filter(user=user, is_active=True)
            existing = {s.title: s.target_score for s in existing_active}

            # проверяем изменилось ли хоть что-то по предметам
            if set(incoming.keys()) != set(existing.keys()):
                subjects_changed = True
            else:
                for title, score in incoming.items():
                    if existing.get(title) != score:
                        subjects_changed = True
                        break

            # если изменились — синкаем (твой старый алгоритм)
            if subjects_changed:
                existing_subjects = Subject.objects.filter(user=user)
                existing_by_title = {s.title: s for s in existing_subjects}
                active_titles = set(incoming.keys())

                for title, score in incoming.items():
                    if title in existing_by_title:
                        subject = existing_by_title[title]
                        subject.target_score = score
                        subject.is_active = True
                        subject.save()
                    else:
                        new_subject = Subject.objects.create(
                            user=user,
                            title=title,
                            target_score=score,
                            is_active=True
                        )

                        # нужно знать exam_subject для шаблонов:
                        # найдём code по title через incoming (проще хранить title->exam_subject выше, но так тоже ок)
                        # лучше: сделать map title->exam_subject при построении incoming
                        exam_subject = ExamSubject.objects.get(title=title)

                        templates = ExamTaskTemplate.objects.filter(exam_subject=exam_subject)
                        Task.objects.bulk_create([
                            Task(subject=new_subject, exam_task_template=template)
                            for template in templates
                        ])

                # деактивация
                for subject in existing_subjects:
                    if subject.title not in active_titles:
                        subject.is_active = False
                        subject.save()

        # ---------- итог ----------
        if not username_changed and not subjects_changed:
            return Response({"detail": "Ничего не изменилось"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"detail": "Обновлено", "username_updated": username_changed, "subjects_updated": subjects_changed},
            status=status.HTTP_200_OK
        )

class SubjectSetupView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        user = request.user
        subjects_data = request.data.get("subjects", None)

        # ---------- базовая проверка ----------
        if subjects_data is None:
            return Response(
                {"detail": "Передайте subjects"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not isinstance(subjects_data, list) or len(subjects_data) == 0:
            return Response(
                {"detail": "subjects не может быть пустым"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------- уже выбраны ----------
        if Subject.objects.filter(user=user).exists():
            return Response(
                {"detail": "Предметы уже выбраны"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------- проверка дублей ----------
        codes = [item.get("subject") for item in subjects_data]
        if len(codes) != len(set(codes)):
            return Response(
                {"detail": "Предметы должны быть разные"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------- получаем ExamSubject пачкой ----------
        exam_by_code = ExamSubject.objects.in_bulk(codes, field_name="code")

        if len(exam_by_code) != len(codes):
            unknown = [c for c in codes if c not in exam_by_code]
            return Response(
                {"detail": f"Неизвестные subject code: {unknown}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------- валидация score ----------
        validated_data = []

        for item in subjects_data:
            code = item.get("subject")
            score = item.get("score")

            if not code or score in (None, ""):
                return Response(
                    {"detail": "Все поля должны быть заполнены"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                score = int(score)
            except (TypeError, ValueError):
                return Response(
                    {"detail": f"score должен быть числом (subject={code})"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if score < 0:
                return Response(
                    {"detail": "Балл не может быть отрицательным"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if score > 100:
                return Response(
                    {"detail": "Балл не может быть больше 100"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            validated_data.append({
                "exam_subject": exam_by_code[code],
                "score": score
            })

        # ---------- создаём Subject ----------
        created_subjects = []

        for item in validated_data:
            subject = Subject.objects.create(
                user=user,
                title=item["exam_subject"].title,
                target_score=item["score"],
                is_active=True
            )
            created_subjects.append(subject)

        # ---------- создаём задачи ----------
        # Получаем все шаблоны сразу
        exam_subjects = [item["exam_subject"] for item in validated_data]
        templates = ExamTaskTemplate.objects.filter(
            exam_subject__in=exam_subjects
        ).select_related("exam_subject")

        tasks_to_create = []

        # связываем subject и шаблоны
        subject_by_exam = {
            item["exam_subject"].id: subject
            for item, subject in zip(validated_data, created_subjects)
        }

        for template in templates:
            subject = subject_by_exam.get(template.exam_subject.id)
            if subject:
                tasks_to_create.append(
                    Task(
                        subject=subject,
                        exam_task_template=template
                    )
                )

        Task.objects.bulk_create(tasks_to_create)

        return Response(
            {"detail": "Предметы успешно созданы"},
            status=status.HTTP_201_CREATED
        )

