import { motion, useInView, animate, AnimatePresence } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onOpenWaitlist: () => void;
  onOpenVideo: () => void;
}

const TOOLS = ['VS Code', 'Cursor', 'Xcode', 'Chrome', 'Safari', 'Terminal'];

const CODE_LINES = [
  { text: 'async function processOAuthCallback(code: string) {', type: 'fn' },
  { text: '  const tokens = await exchangeCodeForTokens(code);', type: 'normal' },
  { text: '  const { sub, email } = await decodeIdToken(tokens.id_token);', type: 'normal' },
  { text: '  const user = await upsertUser({ sub, email, tokens });', type: 'normal' },
  { text: '  return signSession(user.id, { rotate: true });', type: 'highlight' },
  { text: '}', type: 'fn' },
];

const EXPLANATION_CHUNKS = [
  'This function handles the OAuth 2.0 callback flow. ',
  'It exchanges the authorization code for access and ID tokens, ',
  'then decodes the JWT identity token to get user info (sub = user ID). ',
  'It upserts the user record (creates or updates) and creates a signed session. ',
  'The rotate: true flag rotates the session key on login for security.',
];

export function HeroSection({ onOpenWaitlist, onOpenVideo }: HeroSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [animStep, setAnimStep] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [chunkIdx, setChunkIdx] = useState(0);

  // Loop animation: 0=idle, 1=highlight, 2=panel appears, 3=streaming, 4=done
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const loop = () => {
      setAnimStep(0);
      setExplanation('');
      setChunkIdx(0);
      timers.push(setTimeout(() => setAnimStep(1), 800));
      timers.push(setTimeout(() => setAnimStep(2), 1800));
      timers.push(setTimeout(() => setAnimStep(3), 2200));
    };
    loop();
    const interval = setInterval(loop, 9000);
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (animStep !== 3) return;
    if (chunkIdx >= EXPLANATION_CHUNKS.length) { setAnimStep(4); return; }
    const t = setTimeout(() => {
      setExplanation(prev => prev + EXPLANATION_CHUNKS[chunkIdx]);
      setChunkIdx(i => i + 1);
    }, chunkIdx === 0 ? 300 : 600);
    return () => clearTimeout(t);
  }, [animStep, chunkIdx]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-6">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-[#FB923C]/12 via-[#FBBF24]/6 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-[600px] h-[600px] bg-gradient-radial from-[#F472B6]/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-[#FBBF24]/6 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-pulse" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">macOS App • Private Alpha</span>
          </div>
        </motion.div>

        {/* Headline */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[1.04] text-white mb-0"
          >
            Understand code.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[1.04] gradient-text"
          >
            Without leaving
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[1.04] text-white"
          >
            your workflow.
          </motion.h1>
        </div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-lg sm:text-xl text-white/50 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Decode explains unfamiliar code directly on your screen so you never have to stop, switch tabs, and lose your train of thought.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20"
        >
          <button
            onClick={onOpenWaitlist}
            className="group relative px-7 py-3.5 rounded-2xl text-base font-semibold text-white overflow-hidden shadow-2xl shadow-[#FB923C]/20 hover:shadow-[#FB923C]/40 transition-all hover:scale-[1.03]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <span className="relative z-10">Join Waitlist</span>
          </button>
          <button
            onClick={onOpenVideo}
            className="group px-7 py-3.5 rounded-2xl text-base font-medium text-white/70 hover:text-white glass border border-white/8 hover:border-white/15 transition-all hover:scale-[1.03] flex items-center gap-2"
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-white/70 ml-0.5" />
            </div>
            Watch 20 Second Demo
          </button>
        </motion.div>

        {/* macOS Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Glow under mockup */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#FB923C]/15 via-[#FBBF24]/10 to-[#F472B6]/15 rounded-3xl blur-3xl" />

          {/* macOS window */}
          <div className="relative rounded-2xl overflow-hidden border border-white/8 shadow-2xl" style={{ background: '#161616' }}>
            {/* Window title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{ background: '#1c1c1c' }}>
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="ml-3 text-xs text-white/30 font-mono">auth.service.ts — VS Code</span>
            </div>

            {/* Content: editor + panel */}
            <div className="flex min-h-[340px] relative">
              {/* Editor left */}
              <div className="flex-1 p-6 font-mono text-sm leading-7 overflow-hidden">
                {/* Sidebar line numbers */}
                <div className="flex gap-5">
                  <div className="flex flex-col text-right text-white/20 text-xs leading-7 select-none min-w-[20px]">
                    {CODE_LINES.map((_, i) => <span key={i}>{i + 1}</span>)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {CODE_LINES.map((line, i) => (
                      <div
                        key={i}
                        className={`relative px-1.5 rounded transition-all duration-500 ${
                          line.type === 'highlight' && animStep >= 1
                            ? 'bg-[#FBBF24]/15 border border-[#FBBF24]/30'
                            : ''
                        }`}
                      >
                        <span className={
                          line.type === 'fn' ? 'text-[#FB923C]' : 'text-white/70'
                        }>
                          {line.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decode panel right */}
              <AnimatePresence>
                {animStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-72 border-l border-white/5 p-5 flex flex-col gap-4"
                    style={{ background: '#111111' }}
                  >
                    {/* Panel header */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex items-center justify-center shadow-lg shadow-[#FB923C]/20">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-white/60">Decode</span>
                      {animStep === 3 && (
                        <div className="ml-auto flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-[#FB923C] animate-pulse" />
                          <span className="text-[10px] text-white/30">analyzing</span>
                        </div>
                      )}
                    </div>

                    {/* Explanation */}
                    <div className="text-xs text-white/60 leading-5 flex-1">
                      {explanation}
                      {animStep === 3 && chunkIdx < EXPLANATION_CHUNKS.length && (
                        <span className="cursor-blink" />
                      )}
                    </div>

                    {/* Chips */}
                    {animStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5"
                      >
                        {['OAuth 2.0', 'JWT', 'Session', 'Security'].map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/40 border border-white/8">
                            {t}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Works with */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-16 text-center"
        >
          <p className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-5">Works with</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {TOOLS.map((t) => (
              <span key={t} className="text-sm font-medium text-white/30 hover:text-white/60 transition-colors cursor-default">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
