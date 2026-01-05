from django.urls import path
from .views import ClientSettingsView, ProvidersView, ResetUsageView, ValidateKeyView

urlpatterns = [
    path('settings/', ClientSettingsView.as_view(), name='settings'),
    path('settings/providers/', ProvidersView.as_view(), name='providers'),
    path('settings/reset-usage/', ResetUsageView.as_view(), name='reset-usage'),
    path('transcription/validate-key/', ValidateKeyView.as_view(), name='validate-key'),
]
