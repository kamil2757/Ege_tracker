from django.db import models
from subjects.models import Subject


class Test(models.Model):
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="tests"
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        help_text="Название пробника (например, Пробник №1)"
    )
    date_taken = models.DateField(
        auto_now_add=True,
        help_text="Дата прохождения пробника"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Пробник"
        verbose_name_plural = "Пробники"

    def __str__(self):
        return f"{self.title or 'Пробник'} ({self.subject.title})"




class TestTask(models.Model):

    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name="tasks"
    )
    number = models.PositiveSmallIntegerField(
        help_text="Номер задачи в пробнике"
    )
    score = models.PositiveSmallIntegerField(
        default=0,
        help_text="Полученные баллы за задачу"
    )

    class Meta:
        verbose_name = "Задача пробника"
        verbose_name_plural = "Задачи пробников"

    def __str__(self):
        return f"Задача {self.number} ({self.test.subject.title}) - {self.score}"