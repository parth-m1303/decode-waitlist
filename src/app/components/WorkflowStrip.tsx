import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface WorkflowStripProps {
  onOpenWaitlist: () => void;
}

const STEPS = [
  { label: 'You\'re coding', icon: '01' },
  { label: 'Hit something unfamiliar', icon: '02' },
  { label: 'Invoke Decode', icon: '03' },
  { label: 'Understand & continue', icon: '04' },
];

export function WorkflowStrip({ onOpenWaitlist }: WorkflowStripProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="px-6 sm:px-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto canvas canvas-peach p-10 sm:p-14"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
          {/* Left — message */}
          <div className="lg:w-2/5">
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] leading-tight mb-4"
              style={{ color: 'var(--decode-text)' }}
            >
              You never leave
              <br />your workflow.
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--decode-text-dim)' }}>
              Decode is a native macOS app that lives alongside your editor. Press a hotkey, get understanding, keep building.
            </p>
            <button onClick={onOpenWaitlist} className="btn-primary text-sm py-3 px-6">
              <span>Join the Alpha</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right — steps */}
          <div className="lg:w-3/5 flex flex-col sm:flex-row gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.icon}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="flex-1 rounded-2xl p-5"
                style={{
                  background: i === 2 ? 'var(--decode-orange)' : 'rgba(255,255,255,0.5)',
                }}
              >
                <span
                  className="text-xs font-bold mb-3 block"
                  style={{ color: i === 2 ? 'rgba(255,255,255,0.7)' : 'var(--decode-text-faint)' }}
                >
                  {step.icon}
                </span>
                <p
                  className="text-sm font-semibold leading-snug"
                  style={{ color: i === 2 ? 'white' : 'var(--decode-text)' }}
                >
                  {step.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
