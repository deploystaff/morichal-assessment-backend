from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SprintViewSet, SprintItemViewSet, DeliveryMilestoneViewSet

router = DefaultRouter()
router.register(r'sprints', SprintViewSet, basename='sprints')
router.register(r'sprint-items', SprintItemViewSet, basename='sprint-items')
router.register(r'delivery-milestones', DeliveryMilestoneViewSet, basename='delivery-milestones')

urlpatterns = [
    path('', include(router.urls)),
]
