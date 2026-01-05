import { Calendar, HelpCircle, CheckCircle, BookOpen, ListTodo } from 'lucide-react';
import type { AllDataResponse } from '../../types';

interface StatsBarProps {
  data: AllDataResponse | undefined;
  isLoading: boolean;
}

export function StatsBar({ data, isLoading }: StatsBarProps) {
  const stats = [
    {
      label: 'Meetings',
      value: data?.meetings.length ?? 0,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Questions',
      value: data?.questions.length ?? 0,
      icon: HelpCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Answered',
      value: data?.questions.filter((q) => q.status === 'answered').length ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      label: 'Business Rules',
      value: data?.businessRules.length ?? 0,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Pending Actions',
      value: data?.actionItems.filter((a) => a.status === 'pending').length ?? 0,
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 h-16 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-slate-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
            >
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
