import { TrendingUp, Clock, Percent, Building2 } from 'lucide-react';
import { Card, CardBody } from './ui';

const stats = [
  {
    icon: TrendingUp,
    value: '307%',
    label: 'Average ROI',
    description: 'Within 18 months',
    source: 'All About AI Supply Chain Report',
  },
  {
    icon: Clock,
    value: '75%',
    label: 'Time Reduction',
    description: 'In processing time',
    source: 'McKinsey Global Institute',
  },
  {
    icon: Percent,
    value: '60%',
    label: 'Cost Savings',
    description: 'Vs manual processing',
    source: 'Cflow Automation Statistics',
  },
  {
    icon: Building2,
    value: '46%',
    label: 'Already Achieving ROI',
    description: 'Of organizations',
    source: 'GlobeNewswire 2025',
  },
];

export function ROISection() {
  return (
    <section id="roi" className="py-20 lg:py-28 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Value Prop */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            The Numbers Speak for Themselves
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div>
                <div className="text-5xl md:text-6xl font-bold text-primary-light mb-2">
                  EUR 104,850
                </div>
                <div className="text-slate-300">MorichalAI Total Cost</div>
              </div>
              <div className="text-4xl text-slate-500 font-light">vs</div>
              <div>
                <div className="text-5xl md:text-6xl font-bold text-slate-400 mb-2">
                  EUR 420K-1.09M
                </div>
                <div className="text-slate-400">DIY / Agency Approach</div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <span className="text-2xl font-bold text-emerald-400">75-90% Savings</span>
              <span className="text-slate-300 ml-3">compared to building with external agencies</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20" hover>
              <CardBody className="text-center p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light/20 text-primary-light mb-4">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="font-semibold text-slate-200 mb-1">{stat.label}</div>
                <div className="text-sm text-slate-400 mb-3">{stat.description}</div>
                <div className="text-xs text-slate-500">Source: {stat.source}</div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
