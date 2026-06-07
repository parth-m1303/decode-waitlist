import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const WITHOUT = [
  { label: 'Confused by code', emotion: '😕' },
  { label: 'Open ChatGPT', emotion: '🔀' },
  { label: 'Paste code', emotion: '📋' },
  { label: 'Add context', emotion: '✍️' },
  { label: 'Read answer', emotion: '📖' },
  { label: 'Return to editor', emotion: '🔀' },
  { label: 'Lost your train of thought', emotion: '😵' },
  { label: 'Repeat, again', emotion: '🔁' },
];

const WITH = [
  { label: 'Confused by code', emotion: '😕' },
  { label: 'Press hotkey', emotion: '⌨️' },
  { label: 'Understand it', emotion: '✅' },
  { label: 'Keep building', emotion: '🚀' },
];

function FlowStep({ emoji, label, index, isInView, variant }: {
  emoji: string; label: string; index: number; isInView: boolean; variant: 'bad' | 'good';
}) {
  const isBad = variant === 'bad';
  return (
    <motion.div
      initial={{ opacity: 0, x: isBad ? -16 : 16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
      className="flex items-center gap-3"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
        isBad ? 'bg-white/4 border border-white/8' : 'bg-gradient-to-br from-[#FB923C]/15 to-[#FBBF24]/10 border border-[#FB923C]/20'
      }`}>
        {emoji}
      </div>
      <span className={`text-sm leading-snug font-medium ${
        isBad ? 'text-white/40' : 'text-white/80'
      }`}>
        {label}
      </span>
    </motion.div>
  );
}

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" ref={ref} className="py-32 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Every confusing line of code<br />
            <span className="text-white/30">breaks your flow.</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            It's not the confusion that costs you. It's the interruption.
          </p>
        </motion.div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Without */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="h-full rounded-2xl border border-white/6 p-7" style={{ background: '#0f0f0f' }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <span className="text-xs font-semibold text-white/25 uppercase tracking-widest">Right now</span>
              </div>
              <div className="space-y-2.5">
                {WITHOUT.map((s, i) => (
                  <div key={i}>
                    <FlowStep emoji={s.emotion} label={s.label} index={i} isInView={isInView} variant="bad" />
                    {i < WITHOUT.length - 1 && (
                      <div className="ml-4.5 mt-1 mb-0.5 h-2.5 w-px bg-white/8 ml-[18px]" />
                    )}
                  </div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
                className="mt-6 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10"
              >
                <p className="text-xs text-red-400/70 leading-relaxed">
                  20–40 context switches per day. Each one fragments your focus for 15–20 minutes.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* With Decode */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FB923C]/8 via-[#FBBF24]/5 to-[#F472B6]/8 rounded-2xl blur-xl" />
            <div className="relative h-full rounded-2xl border border-[#FB923C]/15 p-7" style={{ background: '#0f0f0f' }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#FB923C]" />
                <span className="text-xs font-semibold text-[#FB923C]/70 uppercase tracking-widest">With Decode</span>
              </div>
              <div className="space-y-2.5">
                {WITH.map((s, i) => (
                  <div key={i}>
                    <FlowStep emoji={s.emotion} label={s.label} index={i} isInView={isInView} variant="good" />
                    {i < WITH.length - 1 && (
                      <div className="mt-1 mb-0.5 h-2.5 w-px bg-gradient-to-b from-[#FB923C]/30 to-[#FBBF24]/20 ml-[18px]" />
                    )}
                  </div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
                className="mt-6 px-4 py-3 rounded-xl bg-[#FB923C]/6 border border-[#FB923C]/12"
              >
                <p className="text-xs text-[#FBBF24]/70 leading-relaxed">
                  Zero tabs opened. Zero flow broken. Understanding, inline, the moment you need it.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
