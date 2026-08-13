import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';

interface NavProps {
  onOpenWaitlist: () => void;
}

export function Nav({ onOpenWaitlist }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const location = useLocation();
  const isLanding = location.pathname === '/';

  const links = isLanding
    ? [
        { label: 'Features', href: '/features', isRoute: true },
        { label: 'FAQ', href: '#faq', isRoute: false },
      ]
    : [
        { label: 'Home', href: '/', isRoute: true },
        { label: 'Features', href: '/features', isRoute: true },
      ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(250, 250, 247, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--decode-border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span
            className="font-bold text-xl tracking-tight"
            style={{ color: 'var(--decode-text)' }}
          >
            Decode
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            l.isRoute ? (
              <Link
                key={l.label}
                to={l.href}
                className="text-sm font-medium transition-colors hover:text-[var(--decode-text)]"
                style={{ color: 'var(--decode-text-muted)' }}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium transition-colors hover:text-[var(--decode-text)]"
                style={{ color: 'var(--decode-text-muted)' }}
              >
                {l.label}
              </a>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWaitlist}
            className="hidden sm:inline-flex btn-primary text-sm py-2.5 px-5"
          >
            Join Alpha
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            style={{ color: 'var(--decode-text-muted)' }}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 pt-2" style={{ background: 'var(--decode-bg)', borderBottom: '1px solid var(--decode-border)' }}>
          <div className="flex flex-col gap-1">
            {links.map((l) =>
              l.isRoute ? (
                <Link key={l.label} to={l.href} onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium" style={{ color: 'var(--decode-text-dim)' }}>{l.label}</Link>
              ) : (
                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium" style={{ color: 'var(--decode-text-dim)' }}>{l.label}</a>
              )
            )}
            <button onClick={() => { onOpenWaitlist(); setMobileOpen(false); }} className="sm:hidden btn-primary text-sm py-2.5 mt-3 justify-center">Join Alpha</button>
          </div>
        </div>
      )}
    </nav>
  );
}
