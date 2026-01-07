import {
  MarketingHeader,
  HeroSection,
  WhatIsSection,
  TradeWorkflowSection,
  LeadDiscoverySection,
  IndustriesSection,
  ProblemSection,
  ComparisonSection,
  AgentsShowcase,
  ROISection,
  TrustSection,
  Footer,
} from './components';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />
      <main>
        <HeroSection />
        <WhatIsSection />
        <TradeWorkflowSection />
        <LeadDiscoverySection />
        <IndustriesSection />
        <ProblemSection />
        <ComparisonSection />
        <AgentsShowcase />
        <ROISection />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
