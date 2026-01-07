interface SprintProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'emerald' | 'blue' | 'slate';
  showLabel?: boolean;
  className?: string;
}

const colorMap = {
  primary: { stroke: '#0f766e', bg: '#e0f2f1' },
  emerald: { stroke: '#10b981', bg: '#d1fae5' },
  blue: { stroke: '#3b82f6', bg: '#dbeafe' },
  slate: { stroke: '#64748b', bg: '#e2e8f0' },
};

export function SprintProgressRing({
  progress,
  size = 64,
  strokeWidth = 6,
  color = 'primary',
  showLabel = true,
  className = '',
}: SprintProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const colors = colorMap[color];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.bg}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold text-slate-700"
            style={{ fontSize: size * 0.25 }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}
