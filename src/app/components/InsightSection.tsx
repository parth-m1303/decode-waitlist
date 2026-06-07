import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function InsightSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="py-36 px-6 relative overflow-hidden">
      {/* Decorative glow */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-[#FBBF24]/6 via-[#FB923C]/4 to-[#F472B6]/6 rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-10"
        >
          The real problem
        </motion.p>

        {/* Main statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            The problem isn&apos;t writing code anymore.
          </p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            <span className="gradient-text">It&apos;s understanding code generated faster than you can read it.</span>
          </p>
        </motion.div>

        {/* Supporting points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-16 grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto"
        >
          {[
            { stat: 'AI agents', desc: 'generate thousands of lines of code you didn\'t write and may not understand' },
            { stat: 'Tutorials', desc: 'move fast — pausing, rewinding, and copying is friction that kills momentum' },
            { stat: 'Codebases', desc: 'are unfamiliar — reading someone else\'s patterns is a skill bottleneck' },
            { stat: 'Developers', desc: 'spend more time understanding code than actually writing it' },
          ].map(({ stat, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
              className="p-5 rounded-xl border border-white/6 glass"
            >
              <p className="text-sm font-semibold text-white/80 mb-1.5">{stat}</p>
              <p className="text-xs text-white/35 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bridge to Decode */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-[#FB923C]/50 mx-auto mb-8" />
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            Decode is the bridge between confusion and understanding — without leaving where you work.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
