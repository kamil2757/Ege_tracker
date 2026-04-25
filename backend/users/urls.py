from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import LogoutView, LoginView, RegisterView, RefreshView, MeView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', RefreshView.as_view(), name='refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me')
]