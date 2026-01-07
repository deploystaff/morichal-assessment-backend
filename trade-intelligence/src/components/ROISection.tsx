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
    <section id="roi" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            The Numbers Speak for Themselves
          </h2>
          <p className="text-lg text-slate-600">
            Companies implementing AI in supply chain and trade operations report
            significant improvements across all key metrics.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} hover>
              <CardBody className="text-center p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="font-semibold text-slate-700 mb-1">{stat.label}</div>
                <div className="text-sm text-slate-500 mb-3">{stat.description}</div>
                <div className="text-xs text-slate-400">Source: {stat.source}</div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Industry Context */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 max-w-2xl mx-auto">
            These statistics represent industry-wide adoption of AI in supply chain operations.
            Early adopters report logistics cost improvements of 15%, inventory level improvements
            of 35%, and service level improvements of 65%.
          </p>
        </div>
      </div>
    </section>
  );
}
