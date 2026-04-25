
from django.db import models
from django.contrib.auth.models import AbstractUser



class User(AbstractUser):
    motivation_text = models.TextField(
        blank=True,
        default="",
        help_text="Текст для себя, когда сдаёшься"
    )

    def __str__(self):
        return self.username
