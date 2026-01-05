import { Check } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export function SaveIndicator() {
  const show = useUIStore((s) => s.showSaveIndicator);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-lg">
        <Check className="w-4 h-4" />
        <span className="text-sm font-medium">Saved</span>
      </div>
    </div>
  );
}
