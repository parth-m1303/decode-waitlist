import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

interface FooterSectionProps {
  onOpenWaitlist?: () => void;
}

export function FooterSection({ onOpenWaitlist }: FooterSectionProps) {
  return (
    <footer
      className="px-6 sm:px-8 pt-20 pb-10"
      style={{ background: 'var(--decode-dark)', color: 'var(--decode-text-on-dark)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top area: branding + navigation */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-16 mb-16">
          {/* Brand column */}
          <div className="flex flex-col gap-4 max-w-xs">
            <span className="font-bold text-xl tracking-tight text-white">Decode</span>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--decode-text-on-dark-dim)' }}>
              Understand code without leaving your workflow.
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.08em]" style={{ color: 'var(--decode-orange)' }}>
              macOS + Windows
            </p>
          </div>

          {/* Nav columns + CTA */}
          <div className="flex flex-col sm:flex-row gap-16 sm:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Product</p>
              <div className="flex flex-col gap-3">
                <Link to="/features" className="text-sm transition-colors hover:text-white" style={{ color: 'var(--decode-text-on-dark-dim)' }}>Features</Link>
                <a href="#faq" className="text-sm transition-colors hover:text-white" style={{ color: 'var(--decode-text-on-dark-dim)' }}>FAQ</a>
                {onOpenWaitlist && (
                  <button
                    onClick={onOpenWaitlist}
                    className="text-sm font-medium text-left transition-colors hover:text-white flex items-center gap-1.5"
                    style={{ color: 'var(--decode-orange)' }}
                  >
                    Join the Alpha
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Connect</p>
              <div className="flex flex-col gap-3">
                <span className="text-sm" style={{ color: 'var(--decode-text-on-dark-dim)' }}>GitHub</span>
                <span className="text-sm" style={{ color: 'var(--decode-text-on-dark-dim)' }}>X</span>
                <span className="text-sm" style={{ color: 'var(--decode-text-on-dark-dim)' }}>Contact</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            &copy; {new Date().getFullYear()} Decode. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            macOS + Windows &middot; Private Alpha
          </p>
        </div>
      </div>
    </footer>
  );
}
