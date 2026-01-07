import { ExternalLink } from 'lucide-react';
import { Button } from './ui';

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900">Morichal</span>
              <span className="font-bold text-xl text-primary">AI</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              The Problem
            </a>
            <a href="#comparison" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Compare
            </a>
            <a href="#agents" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              AI Agents
            </a>
            <a href="#roi" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              ROI
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="https://dev.morichalai.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                Go to Dashboard
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
