import type { LucideIcon } from 'lucide-react';

interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
  hasAttention?: boolean;
}

interface PresentationProgressProps {
  sections: Section[];
  currentSection: string;
  onNavigate: (sectionId: string) => void;
}

export function PresentationProgress({ sections, currentSection, onNavigate }: PresentationProgressProps) {
  return (
    <nav className="sticky top-[76px] z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2 py-3 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = currentSection === section.id;
            const hasAttention = section.hasAttention && !isActive;

            return (
              <button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${isActive
                    ? 'bg-gradient-to-r from-primary to-teal-600 text-white shadow-md'
                    : hasAttention
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{section.label}</span>
                {section.count !== undefined && section.count > 0 && (
                  <span className={`
                    px-1.5 py-0.5 text-xs rounded-full
                    ${isActive
                      ? 'bg-white/20 text-white'
                      : hasAttention
                        ? 'bg-amber-200 text-amber-800'
                        : 'bg-slate-200 text-slate-600'
                    }
                  `}>
                    {section.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
