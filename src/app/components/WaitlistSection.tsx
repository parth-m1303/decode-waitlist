import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface WaitlistSectionProps {
  onOpenWaitlist: () => void;
}

const PERKS = [
  'Free during alpha — no credit card',
  'Direct access to the founder',
  'Shape the product roadmap',
  'Limited invites only',
];

export function WaitlistSection({ onOpenWaitlist }: WaitlistSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="waitlist" ref={ref} className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/8 to-transparent" />

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#FB923C]/8 via-[#FBBF24]/5 to-[#F472B6]/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-pulse" />
            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Private Alpha</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-5">
            Join the first wave<br />of Decode users.
          </h2>
          <p className="text-white/40 text-lg leading-relaxed">
            We're onboarding developers in small batches. Get in early to shape the product.
          </p>
        </motion.div>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 gap-3 mb-10"
        >
          {PERKS.map((perk, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/6 glass"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex-shrink-0" />
              <span className="text-xs text-white/50 font-medium">{perk}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex justify-center"
        >
          <button
            id="waitlist-section-cta"
            onClick={onOpenWaitlist}
            className="group relative flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden shadow-2xl shadow-[#FB923C]/15 hover:shadow-[#FB923C]/30 transition-all hover:scale-[1.04]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
            <span className="relative z-10">Request Early Access</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-white/20 mt-4"
        >
          macOS · Free during Alpha · No spam
        </motion.p>
      </div>
    </section>
  );
}
