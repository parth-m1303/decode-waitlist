import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Focus, Code2, GraduationCap, Monitor } from 'lucide-react';

const CARDS = [
  {
    icon: Focus,
    title: 'Stay in Flow',
    desc: 'Every tab you don\'t open is focus you keep. Decode answers happen where you are — not where Google is.',
    accent: '#FB923C',
  },
  {
    icon: Code2,
    title: 'Understand AI Code',
    desc: "Don't just run generated code blindly. Know what it does, why it was written that way, and what to watch out for.",
    accent: '#FBBF24',
  },
  {
    icon: GraduationCap,
    title: 'Learn Faster',
    desc: 'Understanding code in context beats any tutorial. Decode is the pair programmer who never gets frustrated.',
    accent: '#F472B6',
  },
  {
    icon: Monitor,
    title: 'Works Everywhere on Your Mac',
    desc: 'If you can see it on screen — editor, browser, PDF, video, terminal — Decode can explain it.',
    accent: '#FB923C',
  },
];

export function WhySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-32 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/8 to-transparent" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-5">
            Why developers use Decode
          </h2>
          <p className="text-white/40 text-lg max-w-lg mx-auto">
            Built around one goal: eliminate context switching.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.09 }}
                className="group relative rounded-2xl border border-white/6 p-8 overflow-hidden hover:border-white/12 transition-all cursor-default"
                style={{ background: '#0f0f0f' }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 20%, ${card.accent}08, transparent 70%)` }}
                />

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                  style={{ background: `${card.accent}15`, border: `1px solid ${card.accent}25` }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.accent }} />
                </div>

                <h3 className="text-lg font-bold text-white mb-3">{card.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
