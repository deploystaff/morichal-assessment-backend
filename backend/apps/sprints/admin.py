from django.contrib import admin
from .models import Sprint, SprintItem


@admin.register(Sprint)
class SprintAdmin(admin.ModelAdmin):
    list_display = ['sprint_code', 'name', 'client', 'status', 'start_date', 'end_date', 'order']
    list_filter = ['status', 'client']
    search_fields = ['sprint_code', 'name', 'description']
    ordering = ['order', 'start_date']


@admin.register(SprintItem)
class SprintItemAdmin(admin.ModelAdmin):
    list_display = ['item_code', 'name', 'sprint', 'item_type', 'status', 'priority', 'order']
    list_filter = ['item_type', 'status', 'priority', 'sprint']
    search_fields = ['item_code', 'name', 'description']
    ordering = ['sprint__order', 'order']
