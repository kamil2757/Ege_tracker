from django.urls import path

from tasks.views import IncreaseTaskUnderstandingView, CreateTestView

urlpatterns = [
    path('review/', IncreaseTaskUnderstandingView.as_view(), name='mySubjects'),
    path("create/", CreateTestView.as_view(), name="create_test"),
]