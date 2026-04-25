from django.db import models

from static_exam_info.models import ExamTaskTemplate
from subjects.models import Subject
from django.core.validators import MaxValueValidator, MinValueValidator

class Task(models.Model):
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="tasks"
    )
    exam_task_template = models.ForeignKey(
        ExamTaskTemplate,
        on_delete=models.CASCADE,
        related_name="user_tasks",
    )

    understanding_percent = models.PositiveSmallIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Процент понимания задачи пользователем"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"

    def __str__(self):
        return f"Задача {self.exam_task_template.number} ({self.subject.title})"