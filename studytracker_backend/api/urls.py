from django.urls import path
from .views import (
    HomePage,
    RegisterView,
    DashboardView,
    SaveRoadmap,
    GetUserRoadmaps,
    DeleteRoadmap,GetRoadmapDetail,MarkTopicCompleted,LogoutView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', HomePage.as_view(), name='home'),
    path('register', RegisterView.as_view(), name='register'),
    path('dashboard', DashboardView.as_view(), name='dashboard'),

    path("save-roadmap", SaveRoadmap.as_view(), name="save-roadmap"),
    path("get-roadmaps", GetUserRoadmaps.as_view(), name="get-roadmaps"),
    path("roadmap/<str:course_id>", GetRoadmapDetail.as_view(), name="get-roadmap-detail"),
    path('roadmap/<str:course_id>/complete-day', MarkTopicCompleted.as_view(), name='complete-day'),
    path("delete-roadmap/<str:course_id>", DeleteRoadmap.as_view(), name="delete-roadmap"),

    path('login', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout', LogoutView.as_view(), name='logout'),
]
