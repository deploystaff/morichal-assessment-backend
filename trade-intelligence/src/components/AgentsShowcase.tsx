import {
  Mail,
  FileText,
  Users,
  DollarSign,
  FileCheck,
  Shield,
  RefreshCw,
  Truck,
  BarChart3,
  Zap,
} from 'lucide-react';
import { AgentCard } from './ui';

const agents = [
  {
    icon: Mail,
    name: 'Email Intake Agent',
    description: 'Never miss a sales opportunity. Respond to inquiries instantly, not hours later. Stop losing deals because emails sat unread.',
    impact: '9x higher conversion on leads responded to within 5 minutes',
  },
  {
    icon: FileText,
    name: 'Specification Extraction Agent',
    description: 'Eliminate costly specification errors. No more wrong orders from misread specs. Automatic unit conversion prevents expensive mistakes.',
    impact: 'Prevent the $6B+ mistakes that happen with manual spreadsheets',
  },
  {
    icon: Users,
    name: 'Supplier Matching Agent',
    description: 'Find the right supplier instantly. Best price, best delivery, best quality match. Stop leaving money on the table with suboptimal choices.',
    impact: 'Optimize across 45+ suppliers in seconds, not hours',
  },
  {
    icon: DollarSign,
    name: 'Pricing & Margin Agent',
    description: 'Protect your margins automatically. Never accidentally quote below cost. Instant historical comparison catches pricing anomalies.',
    impact: 'Safeguard the 7-14% margins that keep you profitable',
  },
  {
    icon: FileCheck,
    name: 'Document Verification Agent',
    description: 'Process documents in seconds, not hours. Free your team from paperwork. Invoices, packing lists, BOLs verified automatically.',
    impact: '80% reduction in document processing time',
  },
  {
    icon: Shield,
    name: 'Compliance Agent',
    description: 'Never get stuck at customs. Stay compliant across 13 countries without the headaches. Proactive alerts prevent last-minute crises.',
    impact: 'Avoid costly delays and penalties that kill deals',
  },
  {
    icon: RefreshCw,
    name: 'CRM Sync Agent',
    description: 'Your sales team always has current info. No more "let me check on that." Real-time status updates across your entire operation.',
    impact: '82% of buyers find sales reps unprepared. Be the exception.',
  },
  {
    icon: Truck,
    name: 'Logistics Milestone Agent',
    description: 'Know exactly where every shipment is. Proactively manage customer expectations. Early delay alerts let you stay ahead of problems.',
    impact: 'Turn logistics visibility into customer trust and repeat business',
  },
  {
    icon: BarChart3,
    name: 'Analytics Agent',
    description: 'See your business clearly. Make decisions with confidence, not guesswork. Supplier scorecards reveal who delivers and who disappoints.',
    impact: 'Companies with visibility achieve 50% more sales-ready leads',
  },
  {
    icon: Zap,
    name: 'Processing Orchestrator',
    description: 'Everything works together seamlessly. Your AI workforce, coordinated 24/7. High-confidence tasks auto-complete while exceptions get human review.',
    impact: '500% operational efficiency improvement',
  },
];

export function AgentsShowcase() {
  return (
    <section id="agents" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Your AI Workforce: 10 Agents Closing Deals While You Sleep
          </h2>
          <p className="text-lg text-slate-600">
            Stop losing deals to slow responses and manual errors. These 10 AI agents handle
            the busywork 24/7 so your team can focus on what matters: building relationships
            and closing deals.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent, index) => (
            <AgentCard
              key={index}
              icon={<agent.icon className="w-6 h-6" />}
              name={agent.name}
              description={agent.description}
              impact={agent.impact}
              number={index + 1}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
