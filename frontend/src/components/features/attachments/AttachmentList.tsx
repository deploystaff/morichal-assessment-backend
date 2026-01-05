import { useState } from 'react';
import { Plus, Paperclip } from 'lucide-react';
import { Button, EmptyState } from '../../common';
import { AttachmentItem } from './AttachmentItem';
import { AttachmentModal } from './AttachmentModal';
import type { Attachment } from '../../../types';

interface AttachmentListProps {
  attachments: Attachment[];
  onAdd: (data: Partial<Attachment>) => void;
  onDelete: (id: string) => void;
  meetingId?: string;
}

export function AttachmentList({ attachments, onAdd, onDelete, meetingId }: AttachmentListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (data: Partial<Attachment>) => {
    onAdd(data);
    setIsModalOpen(false);
  };

  // Group attachments by type
  const groupedAttachments = attachments.reduce((acc, attachment) => {
    const type = attachment.file_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(attachment);
    return acc;
  }, {} as Record<string, Attachment[]>);

  const typeLabels: Record<string, string> = {
    link: 'Links',
    pdf: 'PDFs',
    doc: 'Documents',
    spreadsheet: 'Spreadsheets',
    presentation: 'Presentations',
    image: 'Images',
    other: 'Other Files',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Attachments</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="md"
          className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Add Attachment
        </Button>
      </div>

      {/* Attachments List */}
      {attachments.length === 0 ? (
        <EmptyState
          icon={Paperclip}
          title="No attachments"
          description="Link documents, files, and resources to this meeting"
          action={
            <Button
              onClick={() => setIsModalOpen(true)}
              size="md"
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 mr-1.5" />
              Add Attachment
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedAttachments).map(([type, items]) => (
            <div key={type}>
              <h3 className="text-sm font-medium text-slate-500 mb-3">
                {typeLabels[type] || type} ({items.length})
              </h3>
              <div className="space-y-3">
                {items.map((attachment) => (
                  <AttachmentItem
                    key={attachment.id}
                    attachment={attachment}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AttachmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        meetingId={meetingId}
      />
    </div>
  );
}
