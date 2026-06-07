import { Play, Sparkles } from 'lucide-react';
import { AnimatedCodeEditor } from './AnimatedCodeEditor';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface HeroProps {
  onOpenWaitlist: () => void;
  onOpenVideo: () => void;
}

export function Hero({ onOpenWaitlist, onOpenVideo }: HeroProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  // Scroll-based animations for floating text
  const { scrollY } = useScroll();
  const topLeftOpacity = useTransform(scrollY, [0, 200, 400], [0, 1, 0]);
  const topLeftX = useTransform(scrollY, [0, 200, 400], [-100, 0, 100]);
  const topRightOpacity = useTransform(scrollY, [0, 200, 400], [0, 1, 0]);
  const topRightX = useTransform(scrollY, [0, 200, 400], [100, 0, -100]);
  const bottomOpacity = useTransform(scrollY, [100, 300, 500], [0, 1, 0]);
  const bottomY = useTransform(scrollY, [100, 300, 500], [50, 0, -50]);

  return (
    <section ref={ref} className="relative pt-32 pb-24 px-6 overflow-hidden">
      {/* Central glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#FBBF24]/20 via-[#FB923C]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Curved flowing text - Top Left (Scroll-triggered) */}
      <motion.div
        style={{ opacity: topLeftOpacity, x: topLeftX }}
        className="absolute top-8 left-8 pointer-events-none"
      >
        <svg width="300" height="300" viewBox="0 0 300 300">
          <path
            id="curve-top-left"
            d="M 280 20 Q 150 20 80 90 Q 20 150 20 280"
            fill="none"
          />
          <text className="text-xs fill-gray-400/60 font-light tracking-wide">
            <textPath href="#curve-top-left" startOffset="0%">
              macOS native • Global Hotkey • Works on any app • Context aware •
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* Curved flowing text - Top Right (Scroll-triggered) */}
      <motion.div
        style={{ opacity: topRightOpacity, x: topRightX }}
        className="absolute top-8 right-8 pointer-events-none"
      >
        <svg width="300" height="300" viewBox="0 0 300 300">
          <path
            id="curve-top-right"
            d="M 20 20 Q 150 20 220 90 Q 280 150 280 280"
            fill="none"
          />
          <text className="text-xs fill-gray-400/60 font-light tracking-wide">
            <textPath href="#curve-top-right" startOffset="0%">
              Screenshot • Analyze • Understand • Learn • Build faster •
            </textPath>
          </text>
        </svg>
      </motion.div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FB923C]/10 to-[#F472B6]/10 backdrop-blur-xl border border-[#FB923C]/20 mb-8 hover:border-[#FB923C]/40 transition-all shadow-sm">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm text-gray-700 font-medium">macOS app • Private Alpha</span>
            </div>
          </motion.div>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1] text-gray-900"
          >
            Understand any code.
            <br />
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] bg-clip-text text-transparent">
                Without leaving
              </span>
              {/* Glow behind gradient text */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] blur-2xl opacity-20 -z-10" />
            </span>
            <br />
            your workflow.
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            Decode explains code from anywhere on your screen — in selection, screenshots, or sessions. No tab-switching required.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={onOpenWaitlist}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg shadow-[#FB923C]/30 overflow-hidden text-white"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                Join the Waitlist
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
          </motion.div>
        </div>
        
        {/* Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Glassmorphic container */}
          <div className="relative rounded-3xl overflow-hidden border border-gray-200/60 shadow-2xl shadow-[#FB923C]/10 bg-white/40 backdrop-blur-2xl">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FB923C]/5 via-transparent to-[#F472B6]/5 pointer-events-none" />
            
            <div className="relative p-2">
              <AnimatedCodeEditor />
            </div>
            
            {/* Floating explanation card - Right side only */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 30 }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 30, y: 30 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="absolute bottom-6 right-6 max-w-[320px]"
            >
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FBBF24]/30 to-[#F472B6]/30 blur-xl rounded-xl" />
              
              {/* Glassmorphic card - Right */}
              <div className="relative p-5 bg-white/95 backdrop-blur-2xl rounded-xl border border-gray-200 shadow-xl">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FBBF24] to-[#F472B6] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1.5">Selected function</h4>
                    <p className="text-sm text-gray-600 font-mono">
                      fetchUserData()
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mt-4">
                  <span className="text-[#F59E0B] font-medium flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F472B6] animate-pulse" />
                    Analyzing...
                  </span>
                  <span className="text-gray-600 text-xs font-mono">8 lines</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Bottom glow */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FB923C]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FB923C]/20 via-transparent to-transparent blur-3xl -z-10 translate-y-1/2" />
        </motion.div>
      </div>
    </section>
  );
}