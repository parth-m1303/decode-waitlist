import { useState } from 'react';
import { Routes, Route } from 'react-router';
import { Nav } from './components/Nav';
import { HeroSection } from './components/HeroSection';
import { BentoFeatures } from './components/BentoFeatures';
import { ContextShowcase } from './components/ContextShowcase';
import { WorkflowStrip } from './components/WorkflowStrip';
import { FAQSection } from './components/FAQSection';
import { FinalCTASection } from './components/FinalCTASection';
import { FooterSection } from './components/FooterSection';
import { WaitlistModal } from './components/WaitlistModal';
import { FeaturesPage } from './components/FeaturesPage';

function LandingPage({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  return (
    <>
      <HeroSection onOpenWaitlist={onOpenWaitlist} />
      <BentoFeatures />
      <ContextShowcase />
      <WorkflowStrip onOpenWaitlist={onOpenWaitlist} />
      <FAQSection />
      <FinalCTASection onOpenWaitlist={onOpenWaitlist} />
    </>
  );
}

export default function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans">
      <Nav onOpenWaitlist={() => setIsWaitlistOpen(true)} />

      <main>
        <Routes>
          <Route
            path="/"
            element={<LandingPage onOpenWaitlist={() => setIsWaitlistOpen(true)} />}
          />
          <Route
            path="/features"
            element={<FeaturesPage onOpenWaitlist={() => setIsWaitlistOpen(true)} />}
          />
        </Routes>
      </main>

      <FooterSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
}
