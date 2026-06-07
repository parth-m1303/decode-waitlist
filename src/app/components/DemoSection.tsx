import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const TABS = ['Selection Mode', 'Screenshot Mode', 'Session Mode'] as const;

const DEMOS: Record<typeof TABS[number], {
  input: string[];
  highlightLines: number[];
  label: string;
  chunks: string[];
  ocr?: boolean;
  chat?: { role: 'user' | 'ai'; text: string }[];
}> = {
  'Selection Mode': {
    input: [
      'function throttle(fn: Function, limit: number) {',
      '  let inThrottle = false;',
      '  return function(...args: any[]) {',
      '    if (!inThrottle) {',
      '      fn.apply(this, args);',
      '      inThrottle = true;',
      '      setTimeout(() => inThrottle = false, limit);',
      '    }',
      '  }',
      '}',
    ],
    highlightLines: [2, 3, 4, 5, 6, 7],
    label: 'Selected: throttle() — 10 lines',
    chunks: [
      'throttle() wraps a function so it can only fire once per time window. ',
      'inThrottle is a boolean flag — true means the function is "cooling down". ',
      'On the first call, it runs the original fn, then sets inThrottle = true. ',
      'After limit milliseconds, it resets the flag so the function can fire again. ',
      'This is useful for rate-limiting scroll handlers or resize listeners.',
    ],
  },
  'Screenshot Mode': {
    input: [
      '// Screenshot captured from YouTube tutorial',
      'const [state, dispatch] = useReducer(reducer, {',
      '  count: 0,',
      '  loading: false,',
      '  error: null,',
      '});',
    ],
    highlightLines: [],
    label: 'OCR extracted — 6 lines',
    ocr: true,
    chunks: [
      'useReducer is React\'s alternative to useState for complex state. ',
      'It takes a reducer function (handles actions) and an initial state object. ',
      'It returns state (current value) and dispatch (a function to send actions). ',
      'This pattern mirrors Redux — useful when state has multiple sub-values or ',
      'when the next state depends on the previous one in a complex way.',
    ],
  },
  'Session Mode': {
    input: [],
    highlightLines: [],
    label: 'Session · middleware/auth.ts',
    chunks: [],
    chat: [
      { role: 'user', text: 'What does this file do overall?' },
      {
        role: 'ai',
        text: 'This is Express middleware for JWT authentication. It validates tokens on incoming requests, attaches the decoded user to req.user, and calls next() to continue or returns 401 on failure.',
      },
      { role: 'user', text: 'Where are refresh tokens handled?' },
      {
        role: 'ai',
        text: 'Refresh tokens are handled in the /auth/refresh endpoint (not in this file). This middleware only validates access tokens — short-lived JWTs typically expiring in 15 minutes.',
      },
    ],
  },
};

export function DemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Selection Mode');
  const [streaming, setStreaming] = useState(false);
  const [text, setText] = useState('');
  const [chunkIdx, setChunkIdx] = useState(0);
  const [chatStep, setChatStep] = useState(0);

  const demo = DEMOS[activeTab];

  // Reset + stream when tab changes
  useEffect(() => {
    setText('');
    setChunkIdx(0);
    setStreaming(false);
    setChatStep(activeTab === 'Session Mode' ? 0 : 99);
    const t = setTimeout(() => setStreaming(true), 600);
    return () => clearTimeout(t);
  }, [activeTab]);

  useEffect(() => {
    if (!streaming || !demo.chunks.length) return;
    if (chunkIdx >= demo.chunks.length) return;
    const t = setTimeout(() => {
      setText(prev => prev + demo.chunks[chunkIdx]);
      setChunkIdx(i => i + 1);
    }, chunkIdx === 0 ? 200 : 500);
    return () => clearTimeout(t);
  }, [streaming, chunkIdx, demo]);

  return (
    <section id="demo" ref={ref} className="py-32 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/8 to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-[#FB923C]/5 via-[#FBBF24]/3 to-[#F472B6]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-5">
            See it in action
          </h2>
          <p className="text-white/40 text-lg">Switch modes to explore what Decode can do.</p>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex rounded-xl p-1 border border-white/8" style={{ background: '#0f0f0f' }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab ? 'text-white' : 'text-white/35 hover:text-white/60'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="demoTabBg"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FB923C]/20 via-[#FBBF24]/15 to-[#F472B6]/20 border border-white/10"
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Demo panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-[#FB923C]/8 via-[#FBBF24]/5 to-[#F472B6]/8 rounded-3xl blur-2xl" />
          <div className="relative rounded-2xl border border-white/8 overflow-hidden" style={{ background: '#0d0d0d' }}>
            {/* Title bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5" style={{ background: '#111' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]/70" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/70" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]/70" />
              </div>
              <span className="ml-3 text-xs text-white/25 font-mono">{demo.label}</span>
              {demo.ocr && (
                <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FBBF24]/10 text-[#FBBF24]/70 border border-[#FBBF24]/15">
                  OCR extracted
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex min-h-[380px]"
              >
                {activeTab === 'Session Mode' ? (
                  /* Chat interface */
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-6 space-y-4 overflow-auto">
                      {demo.chat?.slice(0, chatStep + 1).map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.role === 'ai' && (
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex items-center justify-center mr-2 flex-shrink-0 mt-0.5 shadow-sm shadow-[#FB923C]/20">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-white/6 text-white/70 rounded-br-sm'
                              : 'border border-white/6 text-white/60 rounded-bl-sm'
                          }`} style={msg.role === 'ai' ? { background: '#141414' } : {}}>
                            {msg.text}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {chatStep < (demo.chat?.length ?? 0) - 1 && (
                      <div className="p-4 border-t border-white/5">
                        <button
                          onClick={() => setChatStep(s => s + 1)}
                          className="w-full py-2.5 rounded-xl text-sm text-white/40 border border-white/6 hover:border-white/12 hover:text-white/60 transition-all"
                          style={{ background: '#111' }}
                        >
                          Continue conversation →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Code + Explanation */
                  <>
                    {/* Code */}
                    <div className="flex-1 p-6 font-mono text-xs leading-6 border-r border-white/5 overflow-hidden">
                      {demo.input.map((line, li) => (
                        <div
                          key={li}
                          className={`transition-all ${
                            demo.highlightLines.includes(li)
                              ? 'bg-[#FBBF24]/10 border-l-2 border-[#FBBF24]/50 pl-2 -ml-2 text-[#FBBF24]/80'
                              : 'text-white/30'
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                    </div>

                    {/* Output */}
                    <div className="w-72 p-6 flex flex-col gap-4" style={{ background: '#0a0a0a' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex items-center justify-center shadow-sm shadow-[#FB923C]/20">
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-white/40">Decode</span>
                        {streaming && chunkIdx < demo.chunks.length && (
                          <div className="ml-auto flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-[#FB923C] animate-pulse" />
                            <span className="text-[10px] text-white/25">analyzing</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-white/50 leading-5 flex-1">
                        {text}
                        {streaming && chunkIdx < demo.chunks.length && (
                          <span className="cursor-blink" />
                        )}
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
