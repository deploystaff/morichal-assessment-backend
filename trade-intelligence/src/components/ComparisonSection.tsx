import { Check, X, Minus } from 'lucide-react';

interface ComparisonRow {
  feature: string;
  excel: { value: string; status: 'bad' | 'neutral' | 'good' };
  erp: { value: string; status: 'bad' | 'neutral' | 'good' };
  tradeIntelligence: { value: string; status: 'bad' | 'neutral' | 'good' };
}

const comparisons: ComparisonRow[] = [
  {
    feature: 'Setup Time',
    excel: { value: 'Hours', status: 'good' },
    erp: { value: '6-12 months', status: 'bad' },
    tradeIntelligence: { value: 'Days', status: 'good' },
  },
  {
    feature: 'Error Rate',
    excel: { value: '90%+ errors', status: 'bad' },
    erp: { value: 'Data silos', status: 'neutral' },
    tradeIntelligence: { value: '<5% AI-verified', status: 'good' },
  },
  {
    feature: '24/7 Operations',
    excel: { value: 'No', status: 'bad' },
    erp: { value: 'Limited', status: 'neutral' },
    tradeIntelligence: { value: 'Yes, 10 AI agents', status: 'good' },
  },
  {
    feature: 'Document Processing',
    excel: { value: 'Manual', status: 'bad' },
    erp: { value: 'Partial', status: 'neutral' },
    tradeIntelligence: { value: 'Intelligent OCR', status: 'good' },
  },
  {
    feature: 'Compliance Tracking',
    excel: { value: 'Manual checklists', status: 'bad' },
    erp: { value: 'Basic alerts', status: 'neutral' },
    tradeIntelligence: { value: '13-country monitoring', status: 'good' },
  },
  {
    feature: 'Monthly Cost',
    excel: { value: '"Free"*', status: 'neutral' },
    erp: { value: '$625+/user', status: 'bad' },
    tradeIntelligence: { value: 'From EUR 14,950', status: 'good' },
  },
];

function StatusIcon({ status }: { status: 'bad' | 'neutral' | 'good' }) {
  if (status === 'good') return <Check className="w-5 h-5 text-emerald-500" />;
  if (status === 'bad') return <X className="w-5 h-5 text-red-500" />;
  return <Minus className="w-5 h-5 text-amber-500" />;
}

export function ComparisonSection() {
  return (
    <section id="comparison" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            From Chaos to Control
          </h2>
          <p className="text-lg text-slate-600">
            See how Trade Intelligence compares to traditional solutions
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
            <div className="p-6 font-semibold text-slate-600">Feature</div>
            <div className="p-6 text-center border-l border-slate-200">
              <div className="font-semibold text-slate-600">Excel Spreadsheets</div>
              <div className="text-sm text-slate-400 mt-1">Traditional approach</div>
            </div>
            <div className="p-6 text-center border-l border-slate-200">
              <div className="font-semibold text-slate-600">Legacy ERP</div>
              <div className="text-sm text-slate-400 mt-1">SAP, Oracle, etc.</div>
            </div>
            <div className="p-6 text-center border-l border-slate-200 bg-primary/5">
              <div className="font-bold text-primary">Trade Intelligence</div>
              <div className="text-sm text-primary/70 mt-1">MorichalAI</div>
            </div>
          </div>

          {/* Table Body */}
          {comparisons.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-4 ${index !== comparisons.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              <div className="p-6 font-medium text-slate-900">{row.feature}</div>
              <div className="p-6 border-l border-slate-100 flex items-center justify-center gap-2">
                <StatusIcon status={row.excel.status} />
                <span className={`text-sm ${row.excel.status === 'bad' ? 'text-red-600' : row.excel.status === 'good' ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {row.excel.value}
                </span>
              </div>
              <div className="p-6 border-l border-slate-100 flex items-center justify-center gap-2">
                <StatusIcon status={row.erp.status} />
                <span className={`text-sm ${row.erp.status === 'bad' ? 'text-red-600' : row.erp.status === 'good' ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {row.erp.value}
                </span>
              </div>
              <div className="p-6 border-l border-slate-100 bg-primary/5 flex items-center justify-center gap-2">
                <StatusIcon status={row.tradeIntelligence.status} />
                <span className="text-sm font-medium text-primary">
                  {row.tradeIntelligence.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <p className="text-center text-sm text-slate-500 mt-6">
          *"Free" Excel has hidden costs: errors, time spent, compliance risks, and data loss.
          Oracle ERP pricing based on minimum 20 users at $625/user/month with 3-year contract.
        </p>
      </div>
    </section>
  );
}
