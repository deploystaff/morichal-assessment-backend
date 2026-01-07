export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TI</span>
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900">Trade</span>
              <span className="font-bold text-xl text-primary">Intelligence</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#workflow" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#lead-discovery" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Lead Discovery
            </a>
            <a href="#industries" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Industries
            </a>
            <a href="#agents" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              AI Agents
            </a>
            <a href="#roi" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              ROI
            </a>
          </nav>

          {/* Empty div to maintain layout balance */}
          <div className="w-10" />
        </div>
      </div>
    </header>
  );
}
