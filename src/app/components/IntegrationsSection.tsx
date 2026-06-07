import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const TOOLS = [
  { name: 'Cursor', category: 'editor' },
  { name: 'VS Code', category: 'editor' },
  { name: 'Xcode', category: 'editor' },
  { name: 'Claude Code', category: 'ai' },
  { name: 'GitHub Copilot', category: 'ai' },
  { name: 'Chrome', category: 'browser' },
  { name: 'Safari', category: 'browser' },
  { name: 'Terminal', category: 'system' },
  { name: 'Documentation', category: 'docs' },
  { name: 'PDFs', category: 'docs' },
  { name: 'YouTube', category: 'video' },
  { name: 'Notion', category: 'docs' },
];

const CATEGORY_COLORS: Record<string, string> = {
  editor:  'text-[#FB923C]/70 bg-[#FB923C]/8  border-[#FB923C]/15',
  ai:      'text-[#F472B6]/70 bg-[#F472B6]/8  border-[#F472B6]/15',
  browser: 'text-[#FBBF24]/70 bg-[#FBBF24]/8  border-[#FBBF24]/15',
  system:  'text-white/40     bg-white/5       border-white/10',
  docs:    'text-white/40     bg-white/5       border-white/10',
  video:   'text-[#F472B6]/60 bg-[#F472B6]/6  border-[#F472B6]/10',
};

export function IntegrationsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/8 to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-[#FBBF24]/4 to-transparent blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-5">
            Built for modern development
          </h2>
          <p className="text-white/40 text-lg max-w-md mx-auto">
            Decode works wherever learning happens.
          </p>
        </motion.div>

        {/* Tool chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {TOOLS.map((tool, i) => (
            <motion.span
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 cursor-default ${CATEGORY_COLORS[tool.category]}`}
            >
              {tool.name}
            </motion.span>
          ))}
        </motion.div>

        {/* Bottom statement */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-14 text-white/25 text-sm"
        >
          If you can see it on your Mac screen, Decode can explain it.
        </motion.p>
      </div>
    </section>
  );
}
