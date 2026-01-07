from django.contrib import admin
from .models import ClientBranding, DeliverablePage, DeliverableSection, ClientDocument


class DeliverableSectionInline(admin.TabularInline):
    model = DeliverableSection
    extra = 0
    ordering = ['order']


@admin.register(ClientBranding)
class ClientBrandingAdmin(admin.ModelAdmin):
    list_display = ['client', 'company_name', 'primary_color', 'updated_at']
    list_filter = ['created_at']
    search_fields = ['client__name', 'company_name']


@admin.register(DeliverablePage)
class DeliverablePageAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'slug', 'is_published', 'template', 'order', 'updated_at']
    list_filter = ['is_published', 'template', 'client']
    search_fields = ['title', 'slug', 'content']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [DeliverableSectionInline]
    ordering = ['client', 'order', 'title']


@admin.register(DeliverableSection)
class DeliverableSectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'page', 'section_type', 'order', 'is_visible']
    list_filter = ['section_type', 'is_visible', 'page__client']
    search_fields = ['title', 'content']
    ordering = ['page', 'order']


@admin.register(ClientDocument)
class ClientDocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'category', 'is_public', 'is_pinned', 'updated_at']
    list_filter = ['category', 'is_public', 'is_pinned', 'client']
    search_fields = ['title', 'content', 'slug']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['client', '-is_pinned', '-updated_at']
