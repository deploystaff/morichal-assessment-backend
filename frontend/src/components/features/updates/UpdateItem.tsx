import { Edit2, Trash2, User } from 'lucide-react';
import { Button, Card, CardBody } from '../../common';
import type { Update } from '../../../types';

interface UpdateItemProps {
  update: Update;
  onEdit: (update: Update) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<Update['category'], string> = {
  development: 'bg-blue-100 text-blue-700',
  design: 'bg-purple-100 text-purple-700',
  testing: 'bg-orange-100 text-orange-700',
  documentation: 'bg-green-100 text-green-700',
  infrastructure: 'bg-slate-100 text-slate-700',
  general: 'bg-gray-100 text-gray-700',
};

export function UpdateItem({ update, onEdit, onDelete }: UpdateItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <User className="w-4 h-4" />
                {update.author}
              </div>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors[update.category]}`}>
                {update.category}
              </span>
            </div>
            <p className="text-slate-700 whitespace-pre-wrap">{update.content}</p>
            <p className="text-xs text-slate-500 mt-2">{formatDate(update.created_at)}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(update)}
              className="p-1.5"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(update.id)}
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
