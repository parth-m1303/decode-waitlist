import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import { MousePointer2, Camera, FileText } from 'lucide-react';

const MODES = [
  {
    id: 'selection',
    icon: MousePointer2,
    label: 'Selection Mode',
    tag: 'Primary',
    tagColor: 'text-[#FB923C]',
    tagBg: 'bg-[#FB923C]/10 border-[#FB923C]/20',
    description: 'The fastest path from confusion to understanding.',
    flow: ['Select', 'Hotkey', 'Explanation'],
    visual: {
      code: [
        'function useDebounce<T>(value: T, delay: number) {',
        '  const [debounced, setDebounced] = useState(value);',
        '  useEffect(() => {',
        '    const timer = setTimeout(() => setDebounced(value), delay);',
        '    return () => clearTimeout(timer);',
        '  }, [value, delay]);',
        '  return debounced;',
        '}',
      ],
      highlightLines: [3, 4, 5],
    },
  },
  {
    id: 'screenshot',
    icon: Camera,
    label: 'Screenshot Mode',
    tag: 'Secondary',
    tagColor: 'text-[#FBBF24]',
    tagBg: 'bg-[#FBBF24]/10 border-[#FBBF24]/20',
    description: 'Works even when the code isn\'t in your editor.',
    flow: ['Capture', 'OCR', 'Explanation'],
    visual: {
      code: [
        '// From a YouTube tutorial',
        'const memoized = useMemo(() => {',
        '  return items.filter(x => x.active)',
        '             .sort((a, b) => b.score - a.score);',
        '}, [items]);',
      ],
      highlightLines: [],
    },
  },
  {
    id: 'session',
    icon: FileText,
    label: 'Session Mode',
    tag: 'Advanced',
    tagColor: 'text-[#F472B6]',
    tagBg: 'bg-[#F472B6]/10 border-[#F472B6]/20',
    description: 'Go deeper when a single snippet isn\'t enough.',
    flow: ['Open file', 'Ask questions', 'Stay in context'],
    visual: {
      code: [
        '// auth.service.ts — 340 lines',
        'class AuthService {',
        '  private readonly jwtService: JwtService;',
        '  private readonly userRepo: UserRepository;',
        '  ...',
        '}',
      ],
      highlightLines: [],
    },
  },
];

export function ModesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);

  return (
    <section ref={ref} className="py-32 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/8 to-transparent" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-5">
            How Decode works
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Three modes. One goal: stay where you are.
          </p>
        </motion.div>

        {/* Three cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {MODES.map((mode, idx) => {
            const Icon = mode.icon;
            const isActive = idx === active;
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => setActive(idx)}
                className={`relative rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden group ${
                  isActive
                    ? 'border-[#FB923C]/30 scale-[1.02]'
                    : 'border-white/6 hover:border-white/12 hover:scale-[1.01]'
                }`}
                style={{ background: '#0f0f0f' }}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FB923C]/5 via-[#FBBF24]/3 to-[#F472B6]/5 pointer-events-none" />
                )}

                {/* Top accent */}
                {isActive && (
                  <motion.div
                    layoutId="modeAccent"
                    className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FB923C]/60 to-transparent"
                  />
                )}

                <div className="relative p-7">
                  {/* Icon + tag */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive
                        ? 'bg-gradient-to-br from-[#FB923C] to-[#F472B6] shadow-lg shadow-[#FB923C]/20'
                        : 'bg-white/6'
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/40'}`} />
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full border ${mode.tagColor} ${mode.tagBg}`}>
                      {mode.tag}
                    </span>
                  </div>

                  {/* Label + desc */}
                  <h3 className={`text-base font-bold mb-2 transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
                    {mode.label}
                  </h3>
                  <p className="text-sm text-white/35 leading-relaxed mb-6">
                    {mode.description}
                  </p>

                  {/* Flow steps */}
                  <div className="flex items-center gap-2">
                    {mode.flow.map((step, si) => (
                      <div key={si} className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                          isActive ? 'bg-white/8 text-white/70' : 'bg-white/4 text-white/30'
                        }`}>
                          {step}
                        </span>
                        {si < mode.flow.length - 1 && (
                          <span className="text-white/15 text-xs">→</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Code preview */}
                  <div className="mt-5 rounded-xl border border-white/5 overflow-hidden" style={{ background: '#151515' }}>
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/4">
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                    </div>
                    <div className="p-3 font-mono text-[10px] leading-5 overflow-hidden max-h-[80px]">
                      {mode.visual.code.slice(0, 4).map((line, li) => (
                        <div
                          key={li}
                          className={`${
                            mode.visual.highlightLines.includes(li)
                              ? 'text-[#FBBF24]/70 bg-[#FBBF24]/5 px-1 -mx-1 rounded'
                              : 'text-white/25'
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
