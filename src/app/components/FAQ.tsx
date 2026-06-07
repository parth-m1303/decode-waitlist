import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is Decode a browser extension?',
    a: 'No. Decode is a native macOS desktop app that works system-wide — across every app on your Mac. VS Code, Xcode, Terminal, Chrome, PDF readers, video players — if you can see code on your screen, Decode can explain it.',
  },
  {
    q: 'What apps does it work with?',
    a: 'Any app you can see on screen. Decode reads code from your display directly, so it works anywhere: your editor, a browser tab, a YouTube tutorial, a PDF, a Slack message — no integration or plugin required.',
  },
  {
    q: 'Does Decode send my code anywhere?',
    a: 'Only the code you explicitly capture or select is sent for analysis. We do not store your code, log your sessions, or use your code to train any model. Your workflow stays private.',
  },
  {
    q: 'When is it launching?',
    a: "Decode is currently in private alpha. We're onboarding developers in small batches to make sure the experience is solid before a wider release. Join the waitlist to get early access.",
  },
  {
    q: 'Is it free?',
    a: "Completely free during the Alpha period. No credit card, no pricing tiers, no commitment. We'll be transparent about pricing before any paid plans are introduced.",
  },
  {
    q: 'Can I use it while watching a coding tutorial?',
    a: "Yes — this is one of the most popular use cases. Trigger Screenshot Mode to capture code from any video frame. Decode's OCR extracts the code and explains it instantly, so you can keep the video playing.",
  },
  {
    q: 'Does it work with AI-generated code?',
    a: "That's exactly what it was built for. AI-generated code is often correct but opaque — it runs but you don't know why. Decode explains what the code does, what patterns it uses, and highlights anything worth reviewing.",
  },
];

export function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 relative">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-[#FBBF24]/5 to-[#F472B6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-5 text-gray-900">
            Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know before joining the waitlist.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AccordionPrimitive.Root type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.07 }}
              >
                <AccordionPrimitive.Item
                  value={`item-${index}`}
                  className="group relative rounded-2xl border border-gray-200/80 bg-white/70 backdrop-blur-xl overflow-hidden hover:border-[#FB923C]/30 transition-colors shadow-sm hover:shadow-md"
                >
                  {/* Left accent bar on open */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#FB923C] via-[#FBBF24] to-[#F472B6] opacity-0 group-data-[state=open]:opacity-100 transition-opacity rounded-l-2xl" />

                  <AccordionPrimitive.Header asChild>
                    <AccordionPrimitive.Trigger className="flex w-full items-center justify-between px-6 py-5 text-left group/trigger">
                      <span className="font-semibold text-gray-900 text-base leading-snug pr-4 group-data-[state=open]/trigger:text-[#F59E0B] transition-colors">
                        {faq.q}
                      </span>
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 group-data-[state=open]/trigger:rotate-180 group-data-[state=open]/trigger:text-[#F59E0B]" />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>

                  <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-[2px] data-[state=open]:slide-down-[2px]">
                    <p className="px-6 pb-5 text-gray-600 leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              </motion.div>
            ))}
          </AccordionPrimitive.Root>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center text-sm text-gray-500 mt-10"
        >
          Still have questions?{' '}
          <a
            href="mailto:hello@decode.app"
            className="text-[#F59E0B] hover:underline font-medium"
          >
            Reach out →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
