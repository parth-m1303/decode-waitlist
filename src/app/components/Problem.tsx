import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const withoutDecode = [
  { emoji: '😕', label: 'Confused by unfamiliar code' },
  { emoji: '🔀', label: 'Switch to a new browser tab' },
  { emoji: '📋', label: 'Find ChatGPT or Stack Overflow' },
  { emoji: '📝', label: 'Copy code, paste, add context' },
  { emoji: '📖', label: 'Read the answer' },
  { emoji: '🔀', label: 'Switch back to your editor' },
  { emoji: '😵', label: 'Lost your train of thought' },
  { emoji: '🔁', label: 'Repeat 20× a day' },
];

const withDecode = [
  { emoji: '😕', label: 'Confused by unfamiliar code' },
  { emoji: '⌨️', label: 'Press your Decode hotkey' },
  { emoji: '✅', label: 'Understand it instantly' },
  { emoji: '🚀', label: 'Keep coding — flow intact' },
];

function WorkflowStep({
  emoji,
  label,
  index,
  isInView,
  bad,
}: {
  emoji: string;
  label: string;
  index: number;
  isInView: boolean;
  bad?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: bad ? -20 : 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: bad ? -20 : 20 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.09 }}
      className="flex items-center gap-3"
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm ${
          bad
            ? 'bg-red-50 border border-red-100'
            : 'bg-gradient-to-br from-[#FB923C]/10 to-[#FBBF24]/10 border border-[#FB923C]/20'
        }`}
      >
        {emoji}
      </div>
      <span
        className={`text-sm font-medium leading-snug ${
          bad ? 'text-gray-600' : 'text-gray-800'
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}

export function Problem() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 relative">
      {/* Subtle red/warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-r from-red-100/30 via-[#FBBF24]/10 to-[#FB923C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Every time you hit confusing code,{' '}
            <br className="hidden md:block" />
            <span className="text-red-500">you leave your flow.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The problem isn't understanding code. The problem is the context switch that breaks
            your concentration — dozens of times a day.
          </p>
        </motion.div>

        {/* Two-column workflow comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Without Decode */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            {/* Card */}
            <div className="relative h-full rounded-3xl bg-white/60 backdrop-blur-xl border border-red-200/60 shadow-sm p-8">
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 mb-7">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Right now</span>
              </div>

              <div className="space-y-3">
                {withoutDecode.map((step, i) => (
                  <div key={i}>
                    <WorkflowStep
                      emoji={step.emoji}
                      label={step.label}
                      index={i}
                      isInView={isInView}
                      bad
                    />
                    {i < withoutDecode.length - 1 && (
                      <div className="ml-5 mt-1.5 mb-0.5 h-3 w-[2px] bg-red-100 rounded-full" />
                    )}
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="mt-7 px-4 py-3 rounded-2xl bg-red-50/80 border border-red-100"
              >
                <p className="text-sm text-red-600 font-medium">
                  ≈ 20–40 context switches per day. Each one costs you 15–20 min of deep focus.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* With Decode */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FB923C]/15 to-[#F472B6]/15 rounded-3xl blur-2xl" />

            {/* Card */}
            <div className="relative h-full rounded-3xl bg-white/80 backdrop-blur-xl border border-[#FB923C]/25 shadow-lg p-8">
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FB923C]/10 to-[#F472B6]/10 border border-[#FB923C]/25 mb-7">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                <span className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wide">With Decode</span>
              </div>

              <div className="space-y-3">
                {withDecode.map((step, i) => (
                  <div key={i}>
                    <WorkflowStep
                      emoji={step.emoji}
                      label={step.label}
                      index={i}
                      isInView={isInView}
                    />
                    {i < withDecode.length - 1 && (
                      <div className="ml-5 mt-1.5 mb-0.5 h-3 w-[2px] bg-gradient-to-b from-[#FB923C] to-[#FBBF24] rounded-full opacity-40" />
                    )}
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="mt-7 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#FB923C]/8 to-[#FBBF24]/8 border border-[#FB923C]/15"
              >
                <p className="text-sm text-gray-700 font-medium">
                  Zero tabs opened. Zero flow lost. Just answers — inline, instant, always.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}