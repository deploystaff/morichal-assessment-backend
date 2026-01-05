import { Sparkles, CheckCircle } from 'lucide-react';
import type { MeetingSummary } from '../../../types';

interface PresentationSummaryProps {
  summary: MeetingSummary | null;
}

export function PresentationSummary({ summary }: PresentationSummaryProps) {
  if (!summary) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-lg font-medium text-slate-600">No summary available</p>
        <p className="text-sm">Add key points from the Summary tab to display here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Points */}
      {summary.key_points && summary.key_points.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Key Points
          </h3>
          <ul className="space-y-3">
            {summary.key_points.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
              >
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Full Summary (Collapsible) */}
      {summary.content && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Full Summary
            </h3>
            {summary.generated_by === 'ai' && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            )}
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {summary.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
