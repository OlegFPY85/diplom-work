from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class CustomUser(AbstractUser):
    username_validator = RegexValidator(
        regex=r'^[a-zA-Z][a-zA-Z0-9]{3,19}$',
        message='Логин должен содержать только латинские буквы и цифры, начинаться с буквы и быть от 4 до 20 символов'
    )
    
    username = models.CharField(
        max_length=20,
        unique=True,
        validators=[username_validator],
        error_messages={
            'unique': "Пользователь с таким логином уже существует.",
        },
    )
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    is_admin = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'full_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
    
    def __str__(self):
        return f"{self.username} ({self.full_name})"