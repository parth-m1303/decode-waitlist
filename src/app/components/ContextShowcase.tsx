import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const BENEFITS = [
  { title: 'Works across your workflow', desc: 'VS Code, Cursor, Xcode, Chrome, Terminal, PDFs, and more.' },
  { title: 'No API key needed', desc: 'Decode handles inference. Zero config, zero keys.' },
  { title: 'Private by design', desc: 'Nothing stored after the session. Nothing used for training.' },
  { title: 'Understands AI code', desc: 'Don\'t run generated code blindly. Know what it does first.' },
];

export function ContextShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-28 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] leading-[1.1]"
            style={{ color: 'var(--decode-text)' }}
          >
            The problem isn't writing code anymore. It's understanding code generated faster than you can read it.
          </h2>
        </motion.div>

        {/* 2×2 benefit grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {BENEFITS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className="rounded-2xl p-7 sm:p-8"
              style={{ background: 'var(--decode-surface)', border: '1px solid var(--decode-border)' }}
            >
              <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--decode-text)' }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--decode-text-muted)' }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
