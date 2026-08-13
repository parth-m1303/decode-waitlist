import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

/* ─── Shared utilities ─── */

function useFadeIn(margin = '-60px') {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin });
  return { ref, isInView };
}

function DecodeIcon({ size = 20 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center rounded-md flex-shrink-0" style={{ width: size, height: size, background: 'var(--decode-orange)' }}>
      <svg className="text-white" style={{ width: size * 0.6, height: size * 0.6 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  );
}

/* ─── Consistent feature-name label ─── */

function FeatureLabel({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className="text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] mb-5"
      style={{ color: light ? 'rgba(255,255,255,0.5)' : 'var(--decode-orange)' }}
    >
      {children}
    </p>
  );
}

/* ─── Media placeholder for video slots ─── */

function FeatureMedia({ alt }: { alt: string }) {
  return (
    <div
      className="w-full h-full min-h-[300px] sm:min-h-[380px] rounded-2xl flex items-center justify-center"
      style={{ background: 'var(--decode-dark)', border: '1px solid rgba(255,255,255,0.08)' }}
      role="img"
      aria-label={alt}
    >
      <div className="text-center px-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(242,101,34,0.12)', border: '1px solid rgba(242,101,34,0.2)' }}>
          <svg className="w-6 h-6" style={{ color: 'var(--decode-orange)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.25)' }}>Preview coming soon</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURES HERO
   ═══════════════════════════════════════════════════════ */

function FeaturesHero() {
  return (
    <section className="pt-24 pb-10 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-5">
          <div className="w-[3px] h-5 rounded-full" style={{ background: 'var(--decode-orange)' }} />
          <p
            className="text-lg sm:text-xl font-semibold uppercase tracking-[0.06em]"
            style={{ color: 'var(--decode-orange)' }}
          >
            Features
          </p>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-[3.75rem] font-bold tracking-[-0.03em] leading-[1.08] mb-6 max-w-2xl" style={{ color: 'var(--decode-text)' }}>
          Understand code in context.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base sm:text-lg leading-relaxed max-w-[38rem]" style={{ color: 'var(--decode-text-muted)' }}>
          Decode gives you multiple ways to understand unfamiliar software — from a single selection to the project around it.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   TIER 1 — PRIMARY MODE CAPSULE (Selection, Screenshot)
   ═══════════════════════════════════════════════════════ */

interface ModeCapsuleProps {
  label: string;
  headline: string;
  description: string;
  mediaAlt: string;
  reversed?: boolean;
}

function ModeCapsule({ label, headline, description, mediaAlt, reversed }: ModeCapsuleProps) {
  const { ref, isInView } = useFadeIn();

  return (
    <section ref={ref} className="px-6 sm:px-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto canvas canvas-warm"
        style={{ padding: 0, overflow: 'hidden' }}
      >
        <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
          <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <FeatureLabel>{label}</FeatureLabel>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.08] mb-6" style={{ color: 'var(--decode-text)' }}>
              {headline}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed max-w-md" style={{ color: 'var(--decode-text-dim)' }}>
              {description}
            </p>
          </div>
          <div className="flex-1 p-5 sm:p-8 lg:p-10 flex items-center">
            <FeatureMedia alt={mediaAlt} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   TIER 1 — SESSION MODE (with integrated Project Intelligence)
   ═══════════════════════════════════════════════════════ */

function SessionModeCapsule() {
  const { ref, isInView } = useFadeIn();

  return (
    <section ref={ref} className="px-6 sm:px-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto canvas canvas-warm"
        style={{ padding: 0, overflow: 'hidden' }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Content */}
          <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <FeatureLabel>Session Mode</FeatureLabel>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.08] mb-6" style={{ color: 'var(--decode-text)' }}>
              Understand beyond the file.
            </h2>
            <p className="text-base sm:text-lg leading-relaxed max-w-md mb-10" style={{ color: 'var(--decode-text-dim)' }}>
              Open a project and let Decode understand the code around what you're investigating&nbsp;&mdash; so your questions don't have to start from scratch.
            </p>

            {/* Project Intelligence — integrated sub-section */}
            <div
              className="rounded-xl p-6"
              style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid var(--decode-border)' }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.12em] mb-2"
                style={{ color: 'var(--decode-orange)' }}
              >
                Project Intelligence
              </p>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--decode-text)' }}>
                Your codebase is connected. Decode is too.
              </p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--decode-text-muted)' }}>
                Decode can reason across the files, modules, and relationships surrounding what you're investigating, so understanding doesn't stop at a single file.
              </p>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {['File', 'Module', 'Project'].map((level, i) => (
                  <div key={level} className="flex items-center gap-2 sm:gap-3">
                    <span
                      className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold"
                      style={{
                        background: i === 2 ? 'var(--decode-orange)' : 'rgba(0,0,0,0.06)',
                        color: i === 2 ? 'white' : 'var(--decode-text-dim)',
                      }}
                    >
                      {level}
                    </span>
                    {i < 2 && (
                      <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--decode-text-faint)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="flex-1 p-5 sm:p-8 lg:p-10 flex items-center">
            <FeatureMedia alt="Decode Session Mode — contextual project understanding" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   TIER 2 — CORE INTERACTION CAPABILITIES
   ═══════════════════════════════════════════════════════ */

function Tier2Section() {
  const { ref, isInView } = useFadeIn();

  return (
    <section ref={ref} className="py-20 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] leading-tight mb-4" style={{ color: 'var(--decode-text)' }}>
            Go deeper when you need to.
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--decode-text-muted)' }}>
            Decode doesn't stop at the first explanation. Keep asking, improve the code, reason through algorithms, and control how you want Decode to help.
          </p>
        </motion.div>

        {/* Follow-Up — largest Tier 2 item */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="canvas canvas-orange mb-5"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
              <FeatureLabel light>Follow-Up</FeatureLabel>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.1] text-white mb-5">
                Keep going.
              </h3>
              <p className="text-base sm:text-lg leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Ask the next question without starting over. Decode carries the relevant context forward so you can explore an idea instead of rebuilding it.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Reply to a specific part of an explanation and continue from there.
              </p>
            </div>
            <div className="lg:w-1/2 p-5 sm:p-8 lg:p-10 flex items-center">
              <FeatureMedia alt="Decode Follow-Up — continue your investigation" />
            </div>
          </div>
        </motion.div>

        {/* Virtual Session */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="canvas canvas-dark mb-5"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <div className="flex flex-col lg:flex-row-reverse">
            <div className="lg:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
              <FeatureLabel>Virtual Session</FeatureLabel>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.1] text-white mb-5">
                Keep the investigation alive.
              </h3>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--decode-text-on-dark-dim)' }}>
                Decode keeps the active investigation in memory as your questions evolve, so related questions build on what you've already explored.
              </p>
            </div>
            <div className="lg:w-1/2 p-5 sm:p-8 lg:p-10 flex items-center">
              <FeatureMedia alt="Decode Virtual Session — persistent investigation context" />
            </div>
          </div>
        </motion.div>

        {/* DSA — elevated to its own capsule */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="canvas canvas-peach mb-5"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
              <FeatureLabel>DSA</FeatureLabel>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.1] mb-5" style={{ color: 'var(--decode-text)' }}>
                Understand the algorithm.
              </h3>
              <p className="text-base sm:text-lg leading-relaxed max-w-md" style={{ color: 'var(--decode-text-dim)' }}>
                Break down data structures and algorithms into clear, step-by-step explanations so you understand not just what the code does, but why it works.
              </p>
            </div>
            <div className="lg:w-1/2 p-5 sm:p-8 lg:p-10 flex items-center">
              <FeatureMedia alt="Decode DSA — step-by-step algorithm explanations" />
            </div>
          </div>
        </motion.div>

        {/* Intent Bar + Improve — compact 2-column */}
        <div className="grid sm:grid-cols-2 gap-5">
          {([
            {
              label: 'Intent Bar',
              headline: 'Tell Decode what you want to understand.',
              description: 'Start with a default explanation or tell Decode exactly what you want to know\u00a0\u2014 without changing how you invoke it.',
            },
            {
              label: 'Improve',
              headline: 'Understand it. Then improve it.',
              description: 'Once you understand the code, Decode can help you improve it without losing the context of what you\u2019re working with.',
            },
          ] as const).map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              className="canvas canvas-warm p-8 sm:p-10 flex flex-col"
            >
              <FeatureLabel>{item.label}</FeatureLabel>
              <h3 className="text-xl sm:text-2xl font-bold tracking-[-0.025em] leading-tight mb-3" style={{ color: 'var(--decode-text)' }}>
                {item.headline}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--decode-text-dim)' }}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   TIER 3 — CONTEXT-AWARE
   ═══════════════════════════════════════════════════════ */

function ContextSection() {
  const { ref, isInView } = useFadeIn();
  const files = [
    { name: 'middleware.ts', active: true, desc: 'JWT validation' },
    { name: 'session.ts', active: false, desc: 'Session management' },
    { name: 'tokens.ts', active: false, desc: 'Token exchange' },
    { name: 'types.ts', active: false, desc: 'Auth interfaces' },
  ];

  return (
    <section ref={ref} className="px-6 sm:px-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto canvas canvas-dark p-10 sm:p-14"
      >
        <div className="max-w-xl mb-10">
          <FeatureLabel>Context-Aware</FeatureLabel>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.08] text-white mb-5">
            More than isolated snippets.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--decode-text-on-dark-dim)' }}>
            Decode looks beyond the lines you selected to understand the surrounding code, relationships, and project context that make those lines meaningful.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-semibold text-white/50 mb-4 font-mono">auth/</p>
            <div className="space-y-1 pl-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              {files.map((f, i) => (
                <motion.div key={f.name} initial={{ opacity: 0, x: -6 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.3, delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg font-mono text-sm"
                  style={f.active ? { background: 'rgba(242,101,34,0.12)' } : undefined}
                >
                  <span style={{ color: f.active ? 'var(--decode-orange-light)' : 'rgba(255,255,255,0.3)' }}>{f.name}</span>
                  <span className="text-xs text-white/20">{f.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.6 }}
            className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <DecodeIcon size={20} />
              <span className="text-xs font-semibold text-white/60">Context-aware explanation</span>
            </div>
            <p className="text-sm leading-relaxed text-white/45">
              This middleware imports <code className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(242,101,34,0.12)', color: 'var(--decode-orange-light)' }}>verifyToken</code> from tokens.ts, uses the <code className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(242,101,34,0.12)', color: 'var(--decode-orange-light)' }}>AuthUser</code> type from types.ts, and creates sessions via session.ts after successful validation.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   TIER 3 — PROFILE INTELLIGENCE
   ═══════════════════════════════════════════════════════ */

function ProfileSection() {
  const { ref, isInView } = useFadeIn();

  const aspects = [
    { title: 'How you ask', desc: 'The types of questions you tend to explore.' },
    { title: 'How you explore', desc: 'The patterns in how you navigate code.' },
    { title: 'What helps', desc: 'The explanation styles that work best for you.' },
  ];

  return (
    <section ref={ref} className="px-6 sm:px-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto canvas canvas-warm p-10 sm:p-14"
      >
        <div className="max-w-xl mb-8">
          <FeatureLabel>Profile Intelligence</FeatureLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.08] mb-5" style={{ color: 'var(--decode-text)' }}>
            Decode adapts to how you learn.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--decode-text-dim)' }}>
            Decode can learn patterns in how you explore software and use explanations, helping it provide more relevant guidance without overriding what you ask for.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {aspects.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className="rounded-xl p-5"
              style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid var(--decode-border)' }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--decode-text)' }}>{a.title}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--decode-text-muted)' }}>{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   TIER 4 — BUILT FOR DEVELOPERS
   ═══════════════════════════════════════════════════════ */

function BuiltForDevelopers() {
  const { ref, isInView } = useFadeIn();
  const items = [
    { title: 'macOS + Windows', desc: 'One product, wherever you build. Decode works across both supported desktop platforms.' },
    { title: 'Works where you work', desc: 'Use Decode across your editor, browser, terminal, and the places you already investigate code.' },
    { title: 'Private by design', desc: 'Your code stays yours. Decode does not store or use your code for training.' },
    { title: 'No API key required', desc: 'No model keys to manage. Decode handles the AI layer so you can focus on understanding your code.' },
  ];

  return (
    <section ref={ref} className="py-16 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] mb-8" style={{ color: 'var(--decode-text)' }}
        >
          Built for developers.
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-px rounded-xl overflow-hidden" style={{ border: '1px solid var(--decode-border)' }}>
          {items.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
              className="px-7 py-6 sm:px-8 sm:py-7"
              style={{ background: 'var(--decode-surface)', borderRight: i % 2 === 0 ? '1px solid var(--decode-border)' : undefined, borderBottom: i < 2 ? '1px solid var(--decode-border)' : undefined }}
            >
              <div className="w-1 h-4 rounded-full mb-4" style={{ background: 'var(--decode-orange)' }} />
              <h3 className="text-lg font-semibold mb-1.5 tracking-[-0.01em]" style={{ color: 'var(--decode-text)' }}>{c.title}</h3>
              <p className="text-[15px] leading-relaxed" style={{ color: 'var(--decode-text-muted)' }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════════════════ */

function FeaturesCTA({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  const { ref, isInView } = useFadeIn();

  return (
    <section ref={ref} className="px-6 sm:px-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto canvas canvas-dark py-24 sm:py-32 px-8 text-center"
      >
        <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-tight mb-6 text-white">
          Ready to stop<br /><span style={{ color: 'var(--decode-orange)' }}>context switching?</span>
        </h2>
        <p className="text-base mb-10 max-w-md mx-auto" style={{ color: 'var(--decode-text-on-dark-dim)' }}>
          Join the private alpha. Free, no credit card.
        </p>
        <button onClick={onOpenWaitlist} className="btn-primary text-base py-4 px-8">
          <span>Join the Alpha</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

interface FeaturesPageProps { onOpenWaitlist: () => void; }

export function FeaturesPage({ onOpenWaitlist }: FeaturesPageProps) {
  return (
    <>
      <FeaturesHero />

      {/* TIER 1 — Primary Modes */}
      <ModeCapsule
        label="Selection Mode"
        headline="Select. Understand."
        description="Select any code on your screen and Decode explains what it means, why it matters, and what's happening around it."
        mediaAlt="Decode Selection Mode — select code and receive an explanation"
      />
      <ModeCapsule
        label="Screenshot Mode"
        headline="See it. Understand it."
        description="Not everything you need to understand is selectable code. Capture what's on your screen and let Decode make sense of it."
        mediaAlt="Decode Screenshot Mode — capture your screen for understanding"
        reversed
      />
      <SessionModeCapsule />

      {/* TIER 2 — Core Interaction Capabilities */}
      <Tier2Section />

      {/* TIER 3 — Context & Intelligence */}
      <ContextSection />
      <ProfileSection />

      {/* TIER 4 — Built for Developers */}
      <BuiltForDevelopers />

      {/* CTA */}
      <FeaturesCTA onOpenWaitlist={onOpenWaitlist} />
    </>
  );
}
