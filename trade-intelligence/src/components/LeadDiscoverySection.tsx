import { Ship, Building2, UserCheck, Eye, ArrowRight, Database, Brain, Target } from 'lucide-react';
import { Card, CardBody } from './ui';

const features = [
  {
    icon: Ship,
    title: 'Global Port Coverage',
    description: 'Track cargo landings at ports in 200+ countries. Access real-time customs and shipping manifest data. Search through 2+ billion historical shipment records.',
  },
  {
    icon: Building2,
    title: 'Buyer Identification',
    description: 'See exactly who (consignee) received shipments. Access company profiles with complete trade history. Analyze transaction volumes, frequency, and patterns.',
  },
  {
    icon: UserCheck,
    title: 'Verified Contact Intelligence',
    description: 'Get decision-maker names and titles. Access direct email addresses and phone numbers. Understand past purchasing behavior and preferences.',
  },
  {
    icon: Eye,
    title: 'Competitive Intelligence',
    description: 'See who your competitors are shipping to. Identify customers switching suppliers. Track market share changes in real-time.',
  },
];

const howItWorks = [
  {
    icon: Database,
    title: 'Port Landing Data',
    items: ['Ship manifests', 'Customs records', 'HS codes', 'Volumes'],
  },
  {
    icon: Brain,
    title: 'AI Processing',
    items: ['Entity matching', 'Data enrichment', 'Lead scoring', 'Intent signals'],
  },
  {
    icon: Target,
    title: 'Qualified Leads',
    items: ['Company name', 'Contact info', 'Trade history', 'Purchase patterns'],
  },
];

export function LeadDiscoverySection() {
  return (
    <section id="lead-discovery" className="py-20 lg:py-28 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary-light text-sm font-medium mb-6">
            Key Differentiator
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Lead Discovery: Find Buyers Before They Find You
          </h2>
          <p className="text-lg text-slate-300">
            Know what landed at any port in the world, who bought it, and how to reach them.
            All before your competitors do.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20" hover>
              <CardBody className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-light/20 text-primary-light flex items-center justify-center">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-10">How It Works</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="flex items-center gap-4 md:gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 text-center min-w-[200px]">
                  <div className="w-12 h-12 rounded-xl bg-primary-light/20 text-primary-light flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-white mb-3">{step.title}</h4>
                  <ul className="space-y-1 text-sm text-slate-400">
                    {step.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="hidden md:block w-6 h-6 text-slate-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Use Case Example */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-sm font-medium text-primary-light mb-4">Real-World Example</div>
            <p className="text-xl text-slate-200 leading-relaxed mb-6">
              "A chemicals trader uses Trade Intelligence to identify every company that
              imported industrial solvents into Germany last month. Within minutes, they
              have a list of 847 verified buyers with contact information and purchase
              volumes, ready for their sales team to pursue."
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <span><strong className="text-white">847</strong> verified buyers</span>
              <span><strong className="text-white">Minutes</strong> to generate</span>
              <span><strong className="text-white">Direct</strong> contact info</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
