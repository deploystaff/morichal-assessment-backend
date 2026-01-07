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
    description: 'Monitors incoming customer emails 24/7. Extracts product specs with 95% confidence. Creates draft orders automatically.',
  },
  {
    icon: FileText,
    name: 'Specification Extraction Agent',
    description: 'Converts between units automatically (cm, inches, gsm, lbs). Validates specs against product categories. Flags impossible combinations.',
  },
  {
    icon: Users,
    name: 'Supplier Matching Agent',
    description: 'Matches specs against 45 suppliers. Ranks by on-time delivery percentage, quality score, and response time.',
  },
  {
    icon: DollarSign,
    name: 'Pricing & Margin Agent',
    description: 'Applies margin rules (7-14% by product/customer). Compares against historical pricing. Flags outliers above 15% deviation.',
  },
  {
    icon: FileCheck,
    name: 'Document Verification Agent',
    description: 'OCR extraction from invoices, packing lists, bills of lading, and certificates. 92-95% extraction confidence.',
  },
  {
    icon: Shield,
    name: 'Compliance Agent',
    description: 'Monitors document completeness for 13 countries. Tracks certificate types. Alerts 48hrs before vessel arrival if docs are incomplete.',
  },
  {
    icon: RefreshCw,
    name: 'CRM Sync Agent',
    description: 'Bidirectional Zoho CRM sync. Updates order status in real-time across 10+ states. Maintains contact database currency.',
  },
  {
    icon: Truck,
    name: 'Logistics Milestone Agent',
    description: 'Tracks 4 phases: Production, Origin Port, Transit, Destination. Triggers delay alerts at 5+ days behind schedule.',
  },
  {
    icon: BarChart3,
    name: 'Analytics Agent',
    description: 'Real-time KPI dashboards. Supplier performance scorecards. Complete audit trail for compliance and reporting.',
  },
  {
    icon: Zap,
    name: 'Processing Orchestrator',
    description: 'Central coordination engine. Confidence-based routing (>93% auto, <85% human review). Parallel processing and queue management.',
  },
];

export function AgentsShowcase() {
  return (
    <section id="agents" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Meet Your AI Workforce
          </h2>
          <p className="text-lg text-slate-600">
            10 specialized AI agents working together to automate your entire trade operation,
            from email intake to compliance tracking.
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
