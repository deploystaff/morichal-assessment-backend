import { ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { Button, Badge } from './ui';

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
              Powered by 10 AI Agents
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 animate-fade-in-up">
            Trade Intelligence:{' '}
            <span className="gradient-text">AI That Works While You Sleep</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto animate-fade-in-up animate-delay-100">
            10 AI agents handling email intake, document verification, supplier matching,
            and compliance tracking. 24 hours a day. 365 days a year.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up animate-delay-200">
            <Button size="lg">
              Book a Demo
              <ArrowRight className="w-5 h-5" />
            </Button>
            <a
              href="https://dev.morichalai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:text-primary-dark transition-colors flex items-center gap-2"
            >
              See the Platform
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Trust Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm animate-fade-in-up animate-delay-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-slate-600">
                <span className="font-bold text-slate-900">95%</span> Email extraction accuracy
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-slate-600">
                <span className="font-bold text-slate-900">45</span> Suppliers in database
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-slate-600">
                <span className="font-bold text-slate-900">13</span> Countries compliance
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
