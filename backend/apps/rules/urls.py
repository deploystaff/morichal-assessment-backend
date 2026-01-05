from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BusinessRuleViewSet, DecisionViewSet

router = DefaultRouter()
router.register('business-rules', BusinessRuleViewSet, basename='business-rules')
router.register('decisions', DecisionViewSet, basename='decisions')

urlpatterns = [
    path('', include(router.urls)),
]
