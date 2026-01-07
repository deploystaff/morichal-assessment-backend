from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ClientConfigView,
    ClientBrandingViewSet,
    DeliverablePageViewSet,
    DeliverableSectionViewSet,
    ClientDocumentViewSet,
)

router = DefaultRouter()

urlpatterns = [
    # Client configuration (includes branding)
    path('config/', ClientConfigView.as_view(), name='client-config'),

    # Branding management (single object per client)
    path('branding/', ClientBrandingViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
    }), name='client-branding'),

    # Deliverable pages
    path('deliverables/', DeliverablePageViewSet.as_view({
        'get': 'list',
        'post': 'create',
    }), name='deliverable-list'),
    path('deliverables/<uuid:pk>/', DeliverablePageViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    }), name='deliverable-detail'),
    path('deliverables/<uuid:pk>/publish/', DeliverablePageViewSet.as_view({
        'post': 'publish',
    }), name='deliverable-publish'),
    path('deliverables/<uuid:pk>/unpublish/', DeliverablePageViewSet.as_view({
        'post': 'unpublish',
    }), name='deliverable-unpublish'),

    # Deliverable page by slug (for public access)
    path('deliverables/by-slug/<slug:slug>/', DeliverablePageViewSet.as_view({
        'get': 'retrieve',
    }), name='deliverable-by-slug'),

    # Sections within a page
    path('deliverables/<slug:page_slug>/sections/', DeliverableSectionViewSet.as_view({
        'get': 'list',
        'post': 'create',
    }), name='section-list'),
    path('deliverables/<slug:page_slug>/sections/<uuid:pk>/', DeliverableSectionViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    }), name='section-detail'),
    path('deliverables/<slug:page_slug>/sections/reorder/', DeliverableSectionViewSet.as_view({
        'post': 'reorder',
    }), name='section-reorder'),

    # Knowledge base documents
    path('docs/', ClientDocumentViewSet.as_view({
        'get': 'list',
        'post': 'create',
    }), name='document-list'),
    path('docs/categories/', ClientDocumentViewSet.as_view({
        'get': 'categories',
    }), name='document-categories'),
    path('docs/<uuid:pk>/', ClientDocumentViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    }), name='document-detail'),
    path('docs/by-slug/<slug:slug>/', ClientDocumentViewSet.as_view({
        'get': 'retrieve',
    }), name='document-by-slug'),
]
