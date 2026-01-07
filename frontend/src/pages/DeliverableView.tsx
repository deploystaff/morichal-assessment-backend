import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit2, Calendar, Clock } from 'lucide-react';
import { deliverables } from '../services/api';
import { Header } from '../components/layout/Header';
import { Button, RichTextContent } from '../components/common';

export function DeliverableView() {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['deliverable', slug],
    queryFn: () => deliverables.getBySlug(slug!),
    enabled: !!slug,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (isLoading) {
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

  if (error || !page) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
            <p className="text-slate-600 mb-6">
              The deliverable page you're looking for doesn't exist.
            </p>
            <Link to="/deliverables">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Deliverables
              </Button>
            </Link>
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
            to="/deliverables"
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Deliverables
          </Link>
          <Link to={`/deliverables/${page.slug}/edit`}>
            <Button variant="secondary" size="sm">
              <Edit2 className="w-4 h-4 mr-1" />
              Edit Page
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                page.is_published
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {page.is_published ? 'Published' : 'Draft'}
            </span>
            <span className="text-sm text-slate-400">/{page.slug}</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">{page.title}</h1>

          {page.description && (
            <p className="text-lg text-slate-600 mb-6">{page.description}</p>
          )}

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(page.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>
                Updated {formatDate(page.updated_at)} at {formatTime(page.updated_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {page.content ? (
            <div className="prose max-w-none">
              <RichTextContent html={page.content} />
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>No content yet.</p>
              <Link to={`/deliverables/${page.slug}/edit`} className="text-primary hover:underline">
                Add content
              </Link>
            </div>
          )}
        </div>

        {/* Sections (if any) */}
        {page.sections && page.sections.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Sections</h2>
            {page.sections
              .filter((s) => s.is_visible)
              .map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded">
                      {section.section_type}
                    </span>
                    {section.title && (
                      <h3 className="font-semibold text-slate-900">{section.title}</h3>
                    )}
                  </div>
                  <div className="prose max-w-none">
                    <RichTextContent html={section.content} />
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
