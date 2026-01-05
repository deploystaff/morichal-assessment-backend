from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MeetingViewSet, UpdateViewSet, BlockerViewSet,
    AttachmentViewSet, MeetingSummaryView
)

router = DefaultRouter()
router.register('meetings', MeetingViewSet, basename='meetings')
router.register('updates', UpdateViewSet, basename='updates')
router.register('blockers', BlockerViewSet, basename='blockers')
router.register('attachments', AttachmentViewSet, basename='attachments')

urlpatterns = [
    path('', include(router.urls)),
    path('meetings/<uuid:meeting_id>/summary/', MeetingSummaryView.as_view(), name='meeting-summary'),
]
