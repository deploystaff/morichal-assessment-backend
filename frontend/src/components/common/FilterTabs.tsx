interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterTabs({ options, value, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-colors
            ${
              value === option.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }
          `}
        >
          {option.label}
          {option.count !== undefined && (
            <span
              className={`
                ml-1.5 px-1.5 py-0.5 text-xs rounded-full
                ${value === option.value ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-600'}
              `}
            >
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
