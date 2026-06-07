import { Sparkles } from 'lucide-react';

export function FooterSection() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 relative z-10" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex items-center justify-center opacity-80">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-white/60 font-semibold tracking-tight text-sm">Decode</span>
        </div>

        {/* Center: Copyright */}
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} Decode. All rights reserved.
        </p>

        {/* Right: Links */}
        <div className="flex items-center gap-6">
          <a href="https://twitter.com/decode" className="text-white/30 hover:text-white/60 transition-colors text-xs">Twitter</a>
          <a href="https://github.com/decode" className="text-white/30 hover:text-white/60 transition-colors text-xs">GitHub</a>
          <a href="mailto:hello@decode.app" className="text-white/30 hover:text-white/60 transition-colors text-xs">Contact</a>
        </div>
      </div>
    </footer>
  );
}
