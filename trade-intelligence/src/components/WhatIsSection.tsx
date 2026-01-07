import { Cpu, Globe, Target } from 'lucide-react';
import { Card, CardBody } from './ui';

const capabilities = [
  {
    icon: Cpu,
    title: 'Operations Automation',
    description: '10 AI agents handle email processing, document verification, supplier matching, pricing calculations, and compliance monitoring automatically. Your back office runs 24/7 without manual intervention.',
    features: ['Email intake and extraction', 'Document OCR verification', 'Supplier matching', 'Pricing and margin calculation'],
  },
  {
    icon: Globe,
    title: 'Global Port Intelligence',
    description: 'Real-time visibility into what cargo is landing at ports worldwide. Track shipments, monitor trade flows, and identify emerging market opportunities before your competitors.',
    features: ['200+ countries covered', 'Real-time customs data', 'Shipping manifest analysis', 'Trade flow monitoring'],
  },
  {
    icon: Target,
    title: 'Intelligent Lead Discovery',
    description: 'Convert shipping manifests and customs data into qualified sales prospects. Get verified contact information, purchase history, and buying patterns for decision-makers.',
    features: ['Buyer identification', 'Contact intelligence', 'Purchase behavior analysis', 'Competitive tracking'],
  },
];

export function WhatIsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            What Is Trade Intelligence?
          </h2>
          <p className="text-lg text-slate-600">
            Trade Intelligence is an AI-powered platform that transforms how trading companies
            operate. It combines three powerful capabilities into a single system.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <Card key={index} hover className="h-full">
              <CardBody className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center mb-6">
                  <capability.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {capability.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {capability.description}
                </p>
                <ul className="space-y-2">
                  {capability.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
