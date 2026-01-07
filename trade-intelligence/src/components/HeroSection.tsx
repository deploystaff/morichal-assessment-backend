import { Zap, Globe, Ship, Users } from 'lucide-react';
import { Badge } from './ui';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
            <Badge variant="primary">
              <Zap className="w-3 h-3 mr-1" />
              Global Port Intelligence + 10 AI Agents
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 animate-fade-in-up">
            Trade Intelligence:{' '}
            <span className="gradient-text">See Every Deal Before Your Competitors</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto animate-fade-in-up animate-delay-100">
            AI-powered trade operations platform with global port intelligence.
            Know what landed, who bought it, and close deals faster.
          </p>

          {/* Trust Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10 text-sm animate-fade-in-up animate-delay-200">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Ship className="w-5 h-5 text-primary" />
              </div>
              <span className="text-slate-600">
                <span className="font-bold text-2xl text-slate-900">2B+</span>
                <span className="block text-xs">Shipments Tracked</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <span className="text-slate-600">
                <span className="font-bold text-2xl text-slate-900">200+</span>
                <span className="block text-xs">Countries Covered</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-slate-600">
                <span className="font-bold text-2xl text-slate-900">10M+</span>
                <span className="block text-xs">Company Profiles</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-slate-600">
                <span className="font-bold text-2xl text-slate-900">10</span>
                <span className="block text-xs">AI Agents</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
