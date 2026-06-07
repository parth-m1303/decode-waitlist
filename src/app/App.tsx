import { useState } from 'react';
import { Nav } from './components/Nav';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { InsightSection } from './components/InsightSection';
import { ModesSection } from './components/ModesSection';
import { DemoSection } from './components/DemoSection';
import { WhySection } from './components/WhySection';
import { IntegrationsSection } from './components/IntegrationsSection';
import { WaitlistSection } from './components/WaitlistSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTASection } from './components/FinalCTASection';
import { FooterSection } from './components/FooterSection';
import { WaitlistModal } from './components/WaitlistModal';
import { VideoModal } from './components/VideoModal';

export default function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#FB923C]/30 selection:text-white font-sans noise-overlay">
      <Nav onOpenWaitlist={() => setIsWaitlistOpen(true)} />
      
      <main>
        <HeroSection 
          onOpenWaitlist={() => setIsWaitlistOpen(true)}
          onOpenVideo={() => setIsVideoOpen(true)}
        />
        <ProblemSection />
        <InsightSection />
        <ModesSection />
        <DemoSection />
        <WhySection />
        <IntegrationsSection />
        <WaitlistSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
        <FAQSection />
        <FinalCTASection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
      </main>

      <FooterSection />

      <WaitlistModal 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
      />
      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
      />
    </div>
  );
}