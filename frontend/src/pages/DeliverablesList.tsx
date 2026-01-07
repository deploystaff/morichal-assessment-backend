import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Plus, Eye, Edit2, Trash2, Check, X, ArrowLeft } from 'lucide-react';
import { deliverables } from '../services/api';
import { Header } from '../components/layout/Header';
import { Button, Card, CardBody } from '../components/common';
import { useCompanyName } from '../providers';
import type { DeliverablePage } from '../types';

export function DeliverablesList() {
  const companyName = useCompanyName();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['deliverables', filter],
    queryFn: () => {
      if (filter === 'all') return deliverables.list();
      return deliverables.list({ published: filter === 'published' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deliverables.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliverables'] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => deliverables.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliverables'] });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => deliverables.unpublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliverables'] });
    },
  });

  const handleDelete = (page: DeliverablePage) => {
    if (confirm(`Delete "${page.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(page.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Deliverables</h1>
            <p className="text-slate-600 mt-1">
              Manage {companyName} deliverable pages (PRD, UAP, proposals, etc.)
            </p>
          </div>
          <Link to="/deliverables/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-slate-500">Filter:</span>
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-slate-500 mt-3">Loading deliverables...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && pages.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-lg font-medium text-slate-900 mb-2">No deliverables yet</h2>
            <p className="text-slate-500 mb-6">
              Create your first deliverable page to get started.
            </p>
            <Link to="/deliverables/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create First Page
              </Button>
            </Link>
          </div>
        )}

        {/* Pages Grid */}
        {!isLoading && pages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Card key={page.id} className="hover:shadow-lg transition-shadow">
                <CardBody className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        <h3 className="font-semibold text-slate-900 truncate">
                          {page.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500">/{page.slug}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                        page.is_published
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {page.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {page.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {page.description}
                    </p>
                  )}

                  <div className="text-xs text-slate-400 mb-4">
                    Updated {formatDate(page.updated_at)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <Link to={`/deliverables/${page.slug}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/deliverables/${page.slug}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    {page.is_published ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => unpublishMutation.mutate(page.id)}
                        title="Unpublish"
                      >
                        <X className="w-3.5 h-3.5 text-amber-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => publishMutation.mutate(page.id)}
                        title="Publish"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(page)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
