from django.db import models

from static_exam_info.models import ExamSubject
from users.models import User
from django.core.validators import MaxValueValidator, MinValueValidator


class Subject(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subjects'
    )

    title = models.CharField(
        max_length=255,
        help_text='Название предмета, например, Математика',
    )

    target_score = models.PositiveSmallIntegerField(
        default=100,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Цель по баллам по этому предмету"
    )

    is_active = models.BooleanField(
        default=True,
        help_text="Активен ли предмет (выбран пользователем сейчас)"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'title'],
                name='unique_user_subject'
            )
        ]

    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        verbose_name = "Предмет"
        verbose_name_plural = "Предметы"

    def __str__(self):
        return f"{self.title} ({self.user.username})"


