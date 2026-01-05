import { Edit2, Trash2, User, CheckCircle } from 'lucide-react';
import { Button, Card, CardBody } from '../../common';
import type { Blocker } from '../../../types';

interface BlockerItemProps {
  blocker: Blocker;
  onEdit: (blocker: Blocker) => void;
  onDelete: (id: string) => void;
  onResolve?: (id: string) => void;
}

const severityColors: Record<Blocker['severity'], string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
};

const statusColors: Record<Blocker['status'], string> = {
  open: 'bg-red-50 text-red-600',
  in_progress: 'bg-amber-50 text-amber-600',
  resolved: 'bg-green-50 text-green-600',
};

const severityIcons: Record<Blocker['severity'], string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🔵',
};

export function BlockerItem({ blocker, onEdit, onDelete, onResolve }: BlockerItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${blocker.status === 'resolved' ? 'opacity-75' : ''}`}>
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${severityColors[blocker.severity]}`}>
                {severityIcons[blocker.severity]} {blocker.severity}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[blocker.status]}`}>
                {blocker.status.replace('_', ' ')}
              </span>
              {blocker.owner && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <User className="w-3 h-3" />
                  {blocker.owner}
                </div>
              )}
            </div>
            <h3 className="font-medium text-slate-900 mb-1">{blocker.title}</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{blocker.description}</p>
            {blocker.resolution && (
              <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-100">
                <p className="text-xs font-medium text-green-700 mb-1">Resolution:</p>
                <p className="text-sm text-green-600">{blocker.resolution}</p>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2">
              Created {formatDate(blocker.created_at)}
              {blocker.resolved_at && ` • Resolved ${formatDate(blocker.resolved_at)}`}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {blocker.status !== 'resolved' && onResolve && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResolve(blocker.id)}
                className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50"
                title="Mark as resolved"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(blocker)}
              className="p-1.5"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(blocker.id)}
              className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
