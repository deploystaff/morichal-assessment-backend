import { ExternalLink, Trash2, FileText, Image, Sheet, Presentation, Link2, File, User } from 'lucide-react';
import { Button, Card, CardBody } from '../../common';
import type { Attachment } from '../../../types';

interface AttachmentItemProps {
  attachment: Attachment;
  onDelete: (id: string) => void;
}

const fileTypeIcons: Record<Attachment['file_type'], React.ElementType> = {
  pdf: FileText,
  doc: FileText,
  image: Image,
  spreadsheet: Sheet,
  presentation: Presentation,
  link: Link2,
  other: File,
};

const fileTypeColors: Record<Attachment['file_type'], string> = {
  pdf: 'bg-red-100 text-red-600',
  doc: 'bg-blue-100 text-blue-600',
  image: 'bg-purple-100 text-purple-600',
  spreadsheet: 'bg-green-100 text-green-600',
  presentation: 'bg-orange-100 text-orange-600',
  link: 'bg-slate-100 text-slate-600',
  other: 'bg-gray-100 text-gray-600',
};

export function AttachmentItem({ attachment, onDelete }: AttachmentItemProps) {
  const Icon = fileTypeIcons[attachment.file_type] || File;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg ${fileTypeColors[attachment.file_type]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <a
                  href={attachment.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slate-900 hover:text-blue-600 flex items-center gap-1.5 group"
                >
                  {attachment.filename}
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                {attachment.description && (
                  <p className="text-sm text-slate-600 mt-1">{attachment.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="capitalize">{attachment.file_type.replace('_', ' ')}</span>
                  {attachment.uploaded_by && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {attachment.uploaded_by}
                    </span>
                  )}
                  <span>{formatDate(attachment.created_at)}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(attachment.id)}
                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
