import { FileSearch, AlertTriangle, Link2Off } from 'lucide-react';
import { Card, CardBody } from './ui';

const problems = [
  {
    icon: FileSearch,
    title: 'Drowning in Documents',
    stat: '2.5 hours',
    statLabel: 'per day searching',
    description: 'Employees spend 30% of their workday searching for documents. 4 billion paper documents remain active in global trade, creating chaos in operations.',
    source: 'MCC Office Technology Solutions',
  },
  {
    icon: AlertTriangle,
    title: 'The Hidden Cost of Excel',
    stat: '90%',
    statLabel: 'contain errors',
    description: 'Most spreadsheets contain errors that affect results. One copy-paste mistake cost JPMorgan $6 billion in the infamous London Whale incident.',
    source: 'Oracle Business Analytics',
  },
  {
    icon: Link2Off,
    title: 'Legacy System Lock-in',
    stat: '$25-50',
    statLabel: 'per document',
    description: '47% of commodity firms face major integration hurdles with legacy systems. Manual document processing drains resources and creates bottlenecks.',
    source: 'Credence Research',
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            The Hidden Cost of Manual Trade Operations
          </h2>
          <p className="text-lg text-slate-600">
            Trading companies lose millions annually to inefficient processes,
            spreadsheet errors, and integration challenges.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <Card key={index} hover className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardBody className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                  <problem.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {problem.title}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-red-600">{problem.stat}</span>
                  <span className="text-sm text-slate-500 ml-2">{problem.statLabel}</span>
                </div>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {problem.description}
                </p>
                <p className="text-xs text-slate-400">
                  Source: {problem.source}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
