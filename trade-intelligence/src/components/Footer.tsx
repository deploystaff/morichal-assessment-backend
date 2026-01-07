export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TI</span>
            </div>
            <span className="font-semibold text-white">Trade Intelligence</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-8 text-sm">
            <a href="#workflow" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#lead-discovery" className="hover:text-white transition-colors">
              Lead Discovery
            </a>
            <a href="#industries" className="hover:text-white transition-colors">
              Industries
            </a>
            <a href="#agents" className="hover:text-white transition-colors">
              AI Agents
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm">
            &copy; {currentYear} Trade Intelligence
          </div>
        </div>

        {/* Sources Attribution */}
        <div className="mt-8 pt-8 border-t border-slate-800 text-xs text-slate-500">
          <p className="mb-2">Industry research sources:</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>McKinsey Global Institute</span>
            <span>GlobeNewswire</span>
            <span>All About AI</span>
            <span>Cflow</span>
            <span>Trade Finance Global</span>
            <span>ImportGenius</span>
            <span>Panjiva</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
