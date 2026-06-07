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
    <section ref={ref} className="py-32 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/8 to-transparent" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C]/6 via-[#FBBF24]/4 to-[#F472B6]/6 rounded-full blur-3xl pointer-events-none" />

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6"
        >
          Stop leaving your workflow<br />
          <span className="text-white/30">just to understand code.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg text-white/40 max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Decode keeps you focused so you can keep building.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <button
            onClick={onOpenWaitlist}
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden shadow-2xl shadow-[#FB923C]/15 hover:shadow-[#FB923C]/30 transition-all hover:scale-[1.04]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
            <span className="relative z-10">Join Waitlist</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <p className="mt-4 text-xs text-white/20">macOS · Free during Alpha · No credit card</p>
        </motion.div>
      </div>
    </section>
  );
}
