from django.db import models


class ExamSubject(models.Model):
    code = models.CharField(
        max_length=50,
        unique=True,
        help_text="Уникальный код предмета, например: math_profile, russian, physics"
    )
    title = models.CharField(
        max_length=255,
        help_text="Название предмета, например: Русский"
    )
    max_score = models.PositiveIntegerField(
        help_text="Максимальное количество первичных баллов по предмету"
    )
    tasks_count = models.PositiveIntegerField(
        help_text="Количество заданий в экзамене"
    )
    year = models.PositiveSmallIntegerField(
        help_text="Год экзамена"
    )

    class Meta:
        verbose_name = "Экзаменационный предмет"
        verbose_name_plural = "Экзаменационные предметы"

    def __str__(self):
        return f"{self.title} ({self.year})"


class ExamTaskTemplate(models.Model):
    exam_subject = models.ForeignKey(
        ExamSubject,
        on_delete=models.CASCADE,
        related_name="task_templates",
        help_text="Предмет, к которому относится задание"
    )
    number = models.PositiveSmallIntegerField(
        help_text="Номер задания в экзамене"
    )
    title = models.CharField(
        max_length=255,
        help_text="Название задания, например: Планиметрия"
    )
    max_score = models.PositiveIntegerField(
        help_text="Максимальное количество баллов за задание"
    )

    class Meta:
        verbose_name = "Шаблон задания"
        verbose_name_plural = "Шаблоны заданий"
        ordering = ['exam_subject', 'number']  # сортировка по предмету и номеру задания

    def __str__(self):
        return f"{self.title} ({self.exam_subject.title})"


class ExamScoreConversion(models.Model):
    exam_subject = models.ForeignKey(
        ExamSubject,
        on_delete=models.CASCADE,
        related_name="score_conversions"
    )
    primary_score = models.PositiveIntegerField()
    secondary_score = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.exam_subject.title}: {self.primary_score} → {self.secondary_score}"