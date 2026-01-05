from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SprintViewSet, SprintItemViewSet

router = DefaultRouter()
router.register(r'sprints', SprintViewSet, basename='sprints')
router.register(r'sprint-items', SprintItemViewSet, basename='sprint-items')

urlpatterns = [
    path('', include(router.urls)),
]
