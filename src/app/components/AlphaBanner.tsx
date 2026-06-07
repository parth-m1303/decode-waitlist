import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AlphaBannerProps {
  onOpenWaitlist: () => void;
}

export function AlphaBanner({ onOpenWaitlist }: AlphaBannerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FB923C]/20 via-[#FBBF24]/20 to-[#F472B6]/20 rounded-3xl blur-3xl" />

          {/* Card */}
          <div className="relative rounded-3xl border border-[#FB923C]/20 bg-white/80 backdrop-blur-2xl shadow-2xl shadow-[#FB923C]/10 overflow-hidden">
            {/* Top bar accent */}
            <div className="h-1 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6]" />

            <div className="px-10 py-14 text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FB923C]/10 to-[#F472B6]/10 border border-[#FB923C]/20 mb-8"
              >
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm font-semibold text-gray-800">Private Alpha · macOS</span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight"
              >
                Free during{' '}
                <span className="bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] bg-clip-text text-transparent">
                  Alpha
                </span>
              </motion.h2>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-gray-600 max-w-xl mx-auto mb-10 leading-relaxed"
              >
                No pricing. No tiers. No credit card. Just early access to a tool that might
                change how you read code.
              </motion.p>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onClick={onOpenWaitlist}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] rounded-2xl font-semibold text-white text-lg hover:scale-105 transition-all shadow-lg shadow-[#FB923C]/30 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                  Join the Waitlist — It's Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              {/* Fine print */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="text-xs text-gray-500 mt-6"
              >
                macOS only · Free during Alpha · No credit card required
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
