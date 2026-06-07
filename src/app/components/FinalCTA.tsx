import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface FinalCTAProps {
  onOpenWaitlist: () => void;
}

export function FinalCTA({ onOpenWaitlist }: FinalCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* Outer glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] rounded-[2.5rem] blur-3xl opacity-30" />
          
          {/* Main CTA container */}
          <div className="relative rounded-[2.5rem] overflow-hidden border border-[#FB923C]/20 shadow-2xl shadow-[#FB923C]/20">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FB923C] via-[#FBBF24] to-[#F472B6]" />
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50 animate-pulse" />
            
            {/* Content */}
            <div className="relative px-12 py-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 mb-8"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Private Alpha</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Stop losing your flow to confusion.
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-white/95 mb-10 max-w-2xl mx-auto"
              >
                Decode is in private alpha. Be among the first developers to try it on your Mac.
              </motion.p>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                onClick={onOpenWaitlist}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-[#F59E0B] rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl"
              >
                Join the Waitlist — It's Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-sm text-white/80 mt-6"
              >
                macOS · Free during Alpha · No credit card
              </motion.p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}