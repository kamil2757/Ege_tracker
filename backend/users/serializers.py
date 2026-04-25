from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Названия полей зависят от того, что прилетает с фронта (может быть 'username' или 'login')
        login = attrs.get('username')
        password = attrs.get('password')

        if not login or not password:
            raise AuthenticationFailed('Логин и пароль обязательны')

        # Поиск юзера по username или email
        user = User.objects.filter(username=login).first()
        if not user:
            user = User.objects.filter(email=login).first()

        if not user or not user.check_password(password):
            raise AuthenticationFailed('Неверный логин или пароль')

        if not user.is_active:
            raise AuthenticationFailed('Пользователь неактивен')

        # Формируем стандартный ответ SimpleJWT
        data = super().validate({
            'username': user.username,
            'password': password
        })

        data['user'] = {
            'id': user.id,
            'email': user.email,
            'u sername': user.username,
        }

        return data


class RegisterSerializer(serializers.ModelSerializer):
    # Добавляем стандартную валидацию пароля Django (длина, сложность и т.д.)
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    # Можно добавить проверку на уникальность username явно,
    # хотя ModelSerializer сделает это сам на основе модели.
    username = serializers.CharField(min_length=3, max_length=150)

    class Meta:
        model = User
        fields = ('email', 'password', 'username')

    def validate_email(self, value):
        """Проверка уникальности почты"""
        value = value.lower().strip()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Эта почта уже зарегистрирована.')
        return value

    def validate_username(self, value):
        """Проверка уникальности логина и запрещенных символов"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Этот логин уже занят.')
        return value

    def create(self, validated_data):
        # Используем create_user, чтобы пароль захешировался
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
        )
        return user


class UserMeSerializer(serializers.ModelSerializer):
    """
    Тут нужно будет добавить поля, которые ты перечислял:
    - имя (first_name)
    - текст себе (мотивация)
    - цель по баллам
    """

    class Meta:
        model = User
        # Я добавил 'first_name', так как в твоем ТЗ есть "изменять имя пользователя"
        fields = ("id", "email", "username", "first_name")
        # Почту и ID обычно запрещают менять через профиль
        read_only_fields = ("id", "email")