import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "Is Decode a browser extension?",
    a: "No. Decode is a native macOS desktop app. It runs system-wide and works across every app on your Mac — VS Code, Xcode, Chrome, Terminal, PDF readers, video players. No browser extension, no plugin.",
  },
  {
    q: "What apps does it work with?",
    a: "Any app you can see on your Mac screen. Decode reads from your display directly, so it works in your editor, a browser tab, a YouTube tutorial, a PDF, Slack, or anywhere else code appears.",
  },
  {
    q: "Is it free?",
    a: "Completely free during the Alpha period. No credit card, no tiers, no commitment. We'll be transparent about pricing before any paid plans are introduced.",
  },
  {
    q: "Do I need an API key?",
    a: "No. Decode handles all AI inference on the backend. You don't need to bring your own API key or manage any configuration.",
  },
  {
    q: "Does Decode store my code?",
    a: "Only the code you explicitly capture or select is sent for analysis. We don't store your code after the session, log your workflow, or use your code for training.",
  },
  {
    q: "When will alpha launch?",
    a: "We're onboarding developers in small batches right now. Join the waitlist and you'll be notified when your invite is ready.",
  },
];

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} className="py-32 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/8 to-transparent" />
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Questions
          </h2>
          <p className="text-white/35 text-lg">Everything before you join.</p>
        </motion.div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.06 }}
              className="rounded-xl border border-white/6 overflow-hidden transition-all hover:border-white/10"
              style={{ background: '#0f0f0f' }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 group"
              >
                <span className={`text-sm font-medium transition-colors ${
                  open === i ? 'text-white' : 'text-white/55 group-hover:text-white/75'
                }`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-all ${
                    open === i
                      ? 'rotate-180 text-[#FB923C]'
                      : 'text-white/20 group-hover:text-white/40'
                  }`}
                />
              </button>

              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-sm text-white/35 leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-white/20 mt-10"
        >
          More questions?{' '}
          <a href="mailto:hello@decode.app" className="text-[#FB923C]/60 hover:text-[#FB923C] transition-colors">
            Reach out →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
