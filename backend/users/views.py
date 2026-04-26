import os

from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from users.serializers import RegisterSerializer, UserMeSerializer

User = get_user_model()


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh')
        if not refresh_token:
            return Response(
                {'detail': 'Refresh token required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = Response({"detail": "Successfully logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie("refresh")
        return response


def set_refresh_cookie(response, refresh_token):
    # Проверяем, в какой среде мы находимся (по наличию RENDER или DEBUG)
    is_production = os.environ.get('RENDER') or os.environ.get('DEBUG', 'False') == 'False'

    response.set_cookie(
        key="refresh",
        value=str(refresh_token),
        httponly=True,
        # В продакшене ВСЕГДА True, для localhost можно False
        secure=True if is_production else False,
        # В продакшене ВСЕГДА "None" для разных доменов
        samesite="None" if is_production else "Lax",
        max_age=7 * 24 * 60 * 60,
    )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # Валидация на пустые поля
        if not username or not password:
            return Response(
                {"detail": "Логин и пароль обязательны"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Неверный логин или пароль"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response = Response({
            "access": str(access),
            "user": UserMeSerializer(user).data,  # Используем сериализатор для единообразия
        }, status=status.HTTP_200_OK)

        set_refresh_cookie(response, refresh)
        return response


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Вся валидация полей (длина, уникальность) сидит внутри RegisterSerializer
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        response = Response({
            'user': UserMeSerializer(user).data,
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

        set_refresh_cookie(response, refresh)
        return response


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")

        if not refresh_token:
            return Response({"detail": "Refresh token missing"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            old_refresh = RefreshToken(refresh_token)

            # Пытаемся найти юзера. Если его удалили — токен невалиден.
            user_id = old_refresh.get('user_id')
            user = User.objects.filter(id=user_id).first()
            if not user:
                raise AuthenticationFailed("User not found")

            # Блеклист (если настроен)
            try:
                old_refresh.blacklist()
            except AttributeError:
                pass

            new_refresh = RefreshToken.for_user(user)

        except Exception:
            # Очищаем невалидную куку, если токен протух
            response = Response({"detail": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)
            response.delete_cookie("refresh")
            return response

        response = Response({"access": str(new_refresh.access_token)})
        set_refresh_cookie(response, new_refresh)
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        serializer = UserMeSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

    def patch(self, request):
        """
        Метод для настроек: изменение имени, логина или текста самому себе.
        """
        serializer = UserMeSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)