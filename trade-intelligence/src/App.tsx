import {
  MarketingHeader,
  HeroSection,
  ProblemSection,
  ComparisonSection,
  AgentsShowcase,
  ROISection,
  TrustSection,
  CTASection,
  Footer,
} from './components';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <ComparisonSection />
        <AgentsShowcase />
        <ROISection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
