import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Eye, Check, Trash2 } from 'lucide-react';
import { deliverables } from '../services/api';
import { Header } from '../components/layout/Header';
import { Button, RichTextEditor } from '../components/common';
import type { DeliverablePage } from '../types';

export function DeliverableEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !slug || slug === 'new';

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    template: 'default',
    is_published: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch existing page if editing
  const { data: page, isLoading } = useQuery({
    queryKey: ['deliverable', slug],
    queryFn: () => deliverables.getBySlug(slug!),
    enabled: !isNew && !!slug,
  });

  // Populate form when page loads
  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        description: page.description || '',
        content: page.content || '',
        template: page.template || 'default',
        is_published: page.is_published,
      });
    }
  }, [page]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: Partial<DeliverablePage>) => deliverables.create(data),
    onSuccess: (newPage) => {
      queryClient.invalidateQueries({ queryKey: ['deliverables'] });
      navigate(`/deliverables/${newPage.slug}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<DeliverablePage>) => deliverables.update(page!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliverables'] });
      queryClient.invalidateQueries({ queryKey: ['deliverable', slug] });
      setHasChanges(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deliverables.delete(page!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliverables'] });
      navigate('/deliverables');
    },
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: () => deliverables.publish(page!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliverable', slug] });
      setFormData((prev) => ({ ...prev, is_published: true }));
    },
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSlugChange = (value: string) => {
    // Auto-generate slug from input, sanitizing it
    const sanitized = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    handleChange('slug', sanitized);
  };

  const handleSave = () => {
    const data = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description || undefined,
      content: formData.content || undefined,
      template: formData.template,
    };

    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  const handleDelete = () => {
    if (confirm('Delete this page? This cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const isValid = formData.title.trim() && formData.slug.trim();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (!isNew && isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-slate-500 mt-3">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to={isNew ? '/deliverables' : `/deliverables/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            {isNew ? 'Back to Deliverables' : 'Back to Page'}
          </Link>

          <div className="flex items-center gap-2">
            {!isNew && (
              <>
                <Link to={`/deliverables/${slug}`}>
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                </Link>
                {!formData.is_published && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => publishMutation.mutate()}
                    disabled={publishMutation.isPending}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Publish
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button onClick={handleSave} disabled={!isValid || isSaving}>
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? 'Saving...' : isNew ? 'Create Page' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Status indicator */}
        {hasChanges && !isNew && (
          <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
            You have unsaved changes
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Title & Slug */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    handleChange('title', e.target.value);
                    // Auto-generate slug for new pages
                    if (isNew && !formData.slug) {
                      handleSlugChange(e.target.value);
                    }
                  }}
                  placeholder="Page title"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <span className="text-slate-400 mr-1">/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="page-slug"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    disabled={!isNew}
                  />
                </div>
                {!isNew && (
                  <p className="text-xs text-slate-400 mt-1">Slug cannot be changed after creation</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of this page..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleChange('content', value)}
              placeholder="Start writing your content..."
              minHeight="400px"
            />
          </div>

          {/* Template Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Template
            </label>
            <select
              value={formData.template}
              onChange={(e) => handleChange('template', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="default">Default</option>
              <option value="document">Document</option>
              <option value="landing">Landing Page</option>
              <option value="proposal">Proposal</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Template affects how the page is rendered when viewed
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
