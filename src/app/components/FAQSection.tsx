import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: "Is Decode a browser extension?", a: "No. Decode is a native macOS desktop app. It runs system-wide and works across every app on your Mac — VS Code, Xcode, Chrome, Terminal, PDF readers, video players. No browser extension, no plugin." },
  { q: "What apps does it work with?", a: "Any app you can see on your Mac screen. Decode reads from your display directly, so it works in your editor, a browser tab, a YouTube tutorial, a PDF, Slack, or anywhere else code appears." },
  { q: "Is it free?", a: "Completely free during the Alpha period. No credit card, no tiers, no commitment. We'll be transparent about pricing before any paid plans are introduced." },
  { q: "Do I need an API key?", a: "No. Decode handles all AI inference on the backend. You don't need to bring your own API key or manage any configuration." },
  { q: "Does Decode store my code?", a: "Only the code you explicitly capture or select is sent for analysis. We don't store your code after the session, log your workflow, or use your code for training." },
  { q: "When will alpha launch?", a: "We're onboarding developers in small batches right now. Join the waitlist and you'll be notified when your invite is ready." },
];

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} className="py-28 px-6 sm:px-8" style={{ background: 'var(--decode-surface)' }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-3" style={{ color: 'var(--decode-text)' }}>
            Questions
          </h2>
          <p className="text-base" style={{ color: 'var(--decode-text-muted)' }}>Everything before you join.</p>
        </motion.div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
              className="rounded-xl overflow-hidden"
              style={{
                border: '1px solid var(--decode-border)',
                background: open === i ? 'var(--decode-white)' : 'transparent',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              >
                <span className="text-sm font-medium" style={{ color: open === i ? 'var(--decode-text)' : 'var(--decode-text-dim)' }}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                  style={{ color: open === i ? 'var(--decode-orange)' : 'var(--decode-text-faint)' }}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--decode-text-muted)' }}>{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} className="text-xs mt-8" style={{ color: 'var(--decode-text-faint)' }}>
          More questions? <a href="mailto:hello@decode.app" className="font-medium" style={{ color: 'var(--decode-orange)' }}>Reach out</a>
        </motion.p>
      </div>
    </section>
  );
}
