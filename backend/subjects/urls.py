from django.urls import path

from static_exam_info.views import SubjectSetupView, SubjectUpdateView
from subjects.views import UserSubjectsListView, SubjectDetailView

urlpatterns = [
    path('mySubjects/', UserSubjectsListView.as_view(), name='mySubjects'),
    path('setup/', SubjectSetupView.as_view(), name='setup'),
    path('getSubject/<int:pk>/', SubjectDetailView.as_view(), name="subject-detail"),
    path("update/", SubjectUpdateView.as_view())
]