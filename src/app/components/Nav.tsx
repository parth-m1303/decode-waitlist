import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface NavProps {
  onOpenWaitlist: () => void;
}

export function Nav({ onOpenWaitlist }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'Demo', href: '#demo' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div
        className={`mx-auto max-w-6xl px-6 transition-all duration-500 ${
          scrolled
            ? 'bg-[#080808]/80 backdrop-blur-2xl border border-white/5 rounded-2xl shadow-2xl'
            : ''
        }`}
      >
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex items-center justify-center shadow-lg shadow-[#FB923C]/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">Decode</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-white/50 hover:text-white/90 transition-colors font-medium"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onOpenWaitlist}
            className="group relative px-4 py-2 rounded-xl text-sm font-semibold overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 text-white flex items-center gap-1.5">
              Join Waitlist
            </span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
