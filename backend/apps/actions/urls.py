from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActionItemViewSet

router = DefaultRouter()
router.register('action-items', ActionItemViewSet, basename='action-items')

urlpatterns = [
    path('', include(router.urls)),
]
