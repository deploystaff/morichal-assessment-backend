import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from './ui';

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Trade Operations?
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Join paper trading companies automating their operations with intelligent AI agents.
          See measurable results in days, not months.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-slate-100 shadow-xl"
          >
            Book a Demo
            <ArrowRight className="w-5 h-5" />
          </Button>
          <a
            href="https://dev.morichalai.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="lg"
              className="text-white border-2 border-white/30 hover:bg-white/10"
            >
              Explore the Platform
              <ExternalLink className="w-5 h-5" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
