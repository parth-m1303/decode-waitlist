import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenWaitlist: () => void;
}

const CODE_LINES = [
  { text: 'async function processOAuthCallback(code: string) {', kind: 'keyword' },
  { text: '  const tokens = await exchangeCodeForTokens(code);', kind: 'normal' },
  { text: '  const { sub, email } = await decodeIdToken(tokens.id_token);', kind: 'normal' },
  { text: '  const user = await upsertUser({ sub, email, tokens });', kind: 'normal' },
  { text: '  return signSession(user.id, { rotate: true });', kind: 'highlight' },
  { text: '}', kind: 'keyword' },
];

const EXPLANATION_CHUNKS = [
  'This function handles the OAuth 2.0 callback flow. ',
  'It exchanges the authorization code for access and ID tokens, ',
  'decodes the JWT to extract user identity (sub, email), ',
  'upserts the user record, and creates a signed session. ',
  'The rotate: true flag rotates the session key for security.',
];

export function HeroSection({ onOpenWaitlist }: HeroSectionProps) {
  const [step, setStep] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [chunkIdx, setChunkIdx] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const loop = () => {
      setStep(0); setExplanation(''); setChunkIdx(0);
      timers.push(setTimeout(() => setStep(1), 600));
      timers.push(setTimeout(() => setStep(2), 1400));
      timers.push(setTimeout(() => setStep(3), 1800));
    };
    loop();
    const interval = setInterval(loop, 14000);
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (step !== 3) return;
    if (chunkIdx >= EXPLANATION_CHUNKS.length) { setStep(4); return; }
    const t = setTimeout(() => {
      setExplanation(prev => prev + EXPLANATION_CHUNKS[chunkIdx]);
      setChunkIdx(i => i + 1);
    }, chunkIdx === 0 ? 250 : 450);
    return () => clearTimeout(t);
  }, [step, chunkIdx]);

  return (
    <section className="pt-28 pb-8 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Headline area */}
        <div className="max-w-3xl mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-[3.75rem] font-bold tracking-[-0.03em] leading-[1.08] mb-6"
            style={{ color: 'var(--decode-text)' }}
          >
            Understand code in context.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl leading-relaxed mb-4 max-w-xl"
            style={{ color: 'var(--decode-text-muted)' }}
          >
            Decode understands the code around you, so you can understand unfamiliar software without leaving your workflow.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base leading-relaxed mb-8 max-w-xl"
            style={{ color: 'var(--decode-text-faint)' }}
          >
            No tab switching. No copy-pasting. No breaking your flow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button onClick={onOpenWaitlist} className="btn-primary text-base py-3.5 px-7">
              <span>Join the Alpha</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-sm" style={{ color: 'var(--decode-text-faint)' }}>
              Free &middot; macOS &amp; Windows &middot; No credit card
            </span>
          </motion.div>
        </div>

        {/* Product canvas — the visual hero */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="canvas canvas-dark"
          style={{ padding: '2rem 2rem 0 2rem' }}
        >
          <div className="mac-window" style={{ borderRadius: '12px 12px 0 0', boxShadow: 'none' }}>
            <div className="mac-window-bar">
              <div className="mac-dot mac-dot-red" />
              <div className="mac-dot mac-dot-yellow" />
              <div className="mac-dot mac-dot-green" />
              <span className="ml-4 text-xs font-mono text-white/25">auth.service.ts — VS Code</span>
            </div>

            <div className="flex flex-col md:flex-row" style={{ minHeight: 340 }}>
              {/* Editor pane */}
              <div className="flex-1 p-6 font-mono text-sm leading-7 overflow-hidden">
                <div className="flex gap-4">
                  <div className="flex flex-col text-right text-xs leading-7 select-none min-w-[20px] text-white/15">
                    {CODE_LINES.map((_, i) => <span key={i}>{i + 1}</span>)}
                  </div>
                  <div className="flex-1">
                    {CODE_LINES.map((line, i) => (
                      <div
                        key={i}
                        className="px-2 rounded transition-all duration-500"
                        style={line.kind === 'highlight' && step >= 1 ? {
                          background: 'rgba(242, 101, 34, 0.10)',
                          borderLeft: '2px solid rgba(242, 101, 34, 0.6)',
                          marginLeft: '-2px',
                        } : undefined}
                      >
                        <span style={{
                          color: line.kind === 'keyword'
                            ? '#C792EA'
                            : line.kind === 'highlight' && step >= 1
                              ? '#E0E0E0'
                              : 'rgba(255,255,255,0.35)',
                        }}>
                          {line.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decode explanation panel */}
              <AnimatePresence>
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 320 }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden flex flex-col gap-4 p-5"
                    style={{
                      borderLeft: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--decode-orange)' }}>
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-white/80">Decode</span>
                      {step === 3 && <span className="ml-auto text-[11px] text-white/30">analyzing...</span>}
                    </div>

                    <div className="text-[13px] leading-6 text-white/50 flex-1">
                      {explanation}
                      {step === 3 && chunkIdx < EXPLANATION_CHUNKS.length && <span className="cursor-blink" />}
                    </div>

                    {step === 4 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {['OAuth 2.0', 'JWT', 'Session', 'Security'].map(t => (
                          <span key={t} className="px-2.5 py-1 rounded-md text-[11px] font-medium text-white/35" style={{ background: 'rgba(255,255,255,0.05)' }}>{t}</span>
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
          transition={{ delay: 1.0 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-8"
        >
          <span className="text-xs font-medium uppercase tracking-[0.1em] mr-2" style={{ color: 'var(--decode-text-faint)' }}>Works with</span>
          {['VS Code', 'Cursor', 'Xcode', 'Chrome', 'Terminal', 'PDFs'].map(t => (
            <span key={t} className="text-xs font-medium" style={{ color: 'var(--decode-text-muted)' }}>{t}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
