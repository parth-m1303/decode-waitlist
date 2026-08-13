import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface FinalCTASectionProps {
  onOpenWaitlist: () => void;
}

export function FinalCTASection({ onOpenWaitlist }: FinalCTASectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="px-6 sm:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto canvas canvas-dark py-24 sm:py-32 px-8 text-center"
      >
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.03em] leading-tight mb-6 text-white"
        >
          Understand your code.
          <br />
          <span style={{ color: 'var(--decode-orange)' }}>Keep building.</span>
        </h2>

        <p className="text-base mb-10 max-w-md mx-auto" style={{ color: 'var(--decode-text-on-dark-dim)' }}>
          Join the private alpha. Free, no credit card required.
        </p>

        <button onClick={onOpenWaitlist} className="btn-primary text-base py-4 px-8">
          <span>Join the Alpha</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </section>
  );
}
