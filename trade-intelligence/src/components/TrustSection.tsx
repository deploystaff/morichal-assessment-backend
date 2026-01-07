import { Globe, Building, CheckCircle2, Code2 } from 'lucide-react';

const trustMetrics = [
  {
    icon: Globe,
    value: '13',
    label: 'Countries',
    description: 'Compliance tracking coverage',
  },
  {
    icon: Building,
    value: '45',
    label: 'Suppliers',
    description: 'In matching database',
  },
  {
    icon: CheckCircle2,
    value: '82%',
    label: 'Complete',
    description: 'Project delivery status',
  },
  {
    icon: Code2,
    value: '81,929',
    label: 'Lines of Code',
    description: 'Production-ready platform',
  },
];

export function TrustSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Built for Global Trade
          </h2>
          <p className="text-lg text-slate-600">
            A comprehensive platform designed specifically for paper trading companies
            operating across international markets.
          </p>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustMetrics.map((metric, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <metric.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-1">
                {metric.value}
              </div>
              <div className="text-lg font-semibold text-slate-700 mb-1">
                {metric.label}
              </div>
              <div className="text-sm text-slate-500">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-20 text-center">
          <p className="text-sm text-slate-500 mb-6">Powered by modern technology</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <span className="font-medium">React</span>
            <span className="text-slate-300">|</span>
            <span className="font-medium">Django</span>
            <span className="text-slate-300">|</span>
            <span className="font-medium">PostgreSQL</span>
            <span className="text-slate-300">|</span>
            <span className="font-medium">AI/ML</span>
            <span className="text-slate-300">|</span>
            <span className="font-medium">OCR</span>
            <span className="text-slate-300">|</span>
            <span className="font-medium">Zoho CRM</span>
          </div>
        </div>
      </div>
    </section>
  );
}
