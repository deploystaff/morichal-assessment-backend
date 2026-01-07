import { Mail, Calculator, FileCheck, Truck, FileText, Shield, ArrowRight } from 'lucide-react';

const workflowSteps = [
  {
    number: 1,
    title: 'Inquiry',
    description: 'Customer emails specification requests',
    agent: 'Email Intake + Spec Extraction Agent',
    icon: Mail,
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: 2,
    title: 'Quotation',
    description: 'Pricing and margin calculation',
    agent: 'Pricing & Margin Agent',
    icon: Calculator,
    color: 'from-violet-500 to-violet-600',
  },
  {
    number: 3,
    title: 'Order',
    description: 'Contract confirmation and CRM update',
    agent: 'CRM Sync Agent',
    icon: FileCheck,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    number: 4,
    title: 'Shipment',
    description: 'Logistics coordination and tracking',
    agent: 'Logistics Milestone Agent',
    icon: Truck,
    color: 'from-amber-500 to-amber-600',
  },
  {
    number: 5,
    title: 'Documents',
    description: 'BOL, invoices, certificates verification',
    agent: 'Document Verification Agent',
    icon: FileText,
    color: 'from-rose-500 to-rose-600',
  },
  {
    number: 6,
    title: 'Delivery',
    description: 'Customs clearance and compliance',
    agent: 'Compliance Agent',
    icon: Shield,
    color: 'from-primary to-primary-light',
  },
];

export function TradeWorkflowSection() {
  return (
    <section id="workflow" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            The Complete Trade Workflow
          </h2>
          <p className="text-lg text-slate-600">
            Every trading company follows this workflow, whether you trade paper, metals,
            chemicals, agricultural products, or textiles. Trade Intelligence automates
            each stage with specialized AI agents that work 24/7.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
            >
              {/* Step Number */}
              <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br ${step.color} text-white text-lg font-bold flex items-center justify-center shadow-lg`}>
                {step.number}
              </div>

              {/* Arrow to next (hidden on last of each row) */}
              {index < workflowSteps.length - 1 && (index + 1) % 3 !== 0 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-slate-300" />
                </div>
              )}

              <div className="flex items-start gap-4 pt-2">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {step.description}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                    {step.agent}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 max-w-2xl mx-auto">
            From the moment a customer inquiry arrives to final delivery and compliance verification,
            Trade Intelligence keeps your operations running smoothly without manual intervention.
          </p>
        </div>
      </div>
    </section>
  );
}
