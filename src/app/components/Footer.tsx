import { Sparkles } from 'lucide-react';

export function Footer() {
  const links = {
    Product: ['Features', 'Demo', 'FAQ'],
    Company: ['About', 'Contact'],
    Legal: ['Privacy', 'Terms'],
    Social: ['Twitter', 'GitHub', 'Discord']
  };

  return (
    <footer className="relative py-20 px-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Decode</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Understand any code instantly. Without leaving your workflow.
            </p>
          </div>
          
          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-gray-900 font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © 2025 Decode. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
              Made for macOS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}