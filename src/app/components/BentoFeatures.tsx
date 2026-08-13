import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

/* ─── Feature capsule data ─── */

interface FeatureCapsule {
  label: string;
  headline: string;
  description: string;
  mediaAlt: string;
  mediaReversed: boolean;
}

const CAPSULES: FeatureCapsule[] = [
  {
    label: 'Selection Mode',
    headline: 'Select. Understand.',
    description:
      'Select any code on your screen and Decode explains what it means, why it matters, and what\u2019s happening around it.',
    mediaAlt: 'Decode Selection Mode — select code and receive an explanation',
    mediaReversed: false,
  },
  {
    label: 'Screenshot Mode',
    headline: 'See it. Understand it.',
    description:
      'Not everything you need to understand is selectable code. Capture what\u2019s on your screen and let Decode make sense of it.',
    mediaAlt: 'Decode Screenshot Mode — capture your screen for understanding',
    mediaReversed: true,
  },
  {
    label: 'Session Mode',
    headline: 'Understand beyond the file.',
    description:
      'Open a project and let Decode understand the code around what you\u2019re investigating\u00a0\u2014 so your questions don\u2019t have to start from scratch.',
    mediaAlt: 'Decode Session Mode — contextual project understanding',
    mediaReversed: false,
  },
];

/* ─── Media placeholder ─── */

function FeatureMedia({ alt }: { alt: string }) {
  return (
    <div
      className="w-full h-full min-h-[280px] sm:min-h-[340px] rounded-2xl flex items-center justify-center"
      style={{
        background: 'var(--decode-dark)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      role="img"
      aria-label={alt}
    >
      <div className="text-center px-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--decode-orange)' }}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p
          className="text-sm font-medium"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Product video coming soon
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURES SECTION
   ═══════════════════════════════════════════════════════ */

export function BentoFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-24 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.12em] mb-4"
            style={{ color: 'var(--decode-orange)' }}
          >
            How Decode Works
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] leading-tight mb-4"
            style={{ color: 'var(--decode-text)' }}
          >
            Understand code without leaving your flow.
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: 'var(--decode-text-muted)' }}
          >
            Three ways to bring Decode into whatever you're working on.
          </p>
        </motion.div>

        {/* Feature capsules */}
        <div className="space-y-8">
          {CAPSULES.map((capsule, i) => (
            <motion.div
              key={capsule.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15 }}
              className="canvas canvas-warm"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div
                className={`flex flex-col ${
                  capsule.mediaReversed
                    ? 'lg:flex-row-reverse'
                    : 'lg:flex-row'
                }`}
              >
                {/* Content */}
                <div className="flex-1 flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.12em] mb-4"
                    style={{ color: 'var(--decode-orange)' }}
                  >
                    {capsule.label}
                  </p>
                  <h3
                    className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] leading-tight mb-4"
                    style={{ color: 'var(--decode-text)' }}
                  >
                    {capsule.headline}
                  </h3>
                  <p
                    className="text-base leading-relaxed max-w-md"
                    style={{ color: 'var(--decode-text-dim)' }}
                  >
                    {capsule.description}
                  </p>
                </div>

                {/* Media */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                  <FeatureMedia alt={capsule.mediaAlt} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
