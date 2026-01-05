from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AISuggestionViewSet

router = DefaultRouter()
router.register('suggestions', AISuggestionViewSet, basename='suggestions')

urlpatterns = [
    path('', include(router.urls)),
]
