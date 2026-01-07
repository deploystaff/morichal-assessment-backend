import { AlertTriangle } from 'lucide-react';

const stats = [
  {
    value: '67%',
    label: 'Still Using Excel',
    description: 'of trading companies rely on spreadsheets as their primary system',
    source: 'Adelante SCM Survey',
  },
  {
    value: '90%',
    label: 'Contain Errors',
    description: 'of spreadsheets have mistakes that can cost millions',
    source: 'Industry Research',
  },
  {
    value: '79%',
    label: 'Leads Wasted',
    description: 'of sales leads never convert due to poor data quality',
    source: 'B2B Sales Research',
  },
  {
    value: '28%',
    label: 'Time Selling',
    description: 'Sales reps spend most of their time on admin, not closing deals',
    source: 'Sales Productivity Study',
  },
];

export function IndustryRealitySection() {
  return (
    <section className="py-16 lg:py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Industry Reality Check
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            The Trading Industry's Hidden Crisis
          </h2>
          <p className="text-lg text-slate-300">
            While the world has gone digital, most trading companies are still running on
            spreadsheets and manual processes. The cost? Lost deals, costly errors, and
            sales teams drowning in admin work.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="text-5xl md:text-6xl font-bold text-amber-400 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-white mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-slate-400 mb-3">
                {stat.description}
              </div>
              <div className="text-xs text-slate-500">
                Source: {stat.source}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="mt-12 text-center">
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            <span className="text-white font-semibold">JPMorgan lost $6 billion</span> due to
            spreadsheet errors. How much is at risk in your business?
          </p>
        </div>
      </div>
    </section>
  );
}
