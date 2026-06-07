import { Focus, Code2, GraduationCap, Globe } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function Benefits() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const benefits = [
    {
      icon: Focus,
      title: 'Stay in flow',
      description:
        "Every tab you don't open is 20 minutes of focus you keep. Decode brings the answers directly to your editor.",
    },
    {
      icon: Code2,
      title: 'Understand AI code',
      description:
        "Don't just run AI-generated code blindly. Actually know what it does, how it works, and why it was written that way.",
    },
    {
      icon: GraduationCap,
      title: 'Learn faster',
      description:
        "Understanding code in context beats any tutorial. Decode acts as your pair programmer, teaching you as you work.",
    },
    {
      icon: Globe,
      title: 'Works on everything',
      description:
        "Browser, IDE, PDF, video, image — if you can see it on your Mac screen, Decode can explain it.",
    },
  ];

  return (
    <section ref={ref} className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Why developers use Decode
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stop losing focus every time you hit confusing code.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FB923C]/10 to-[#F472B6]/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Glass card */}
                <div className="relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200/60 hover:border-[#FB923C]/30 hover:shadow-lg hover:shadow-[#FB923C]/10 transition-all h-full hover:scale-[1.02] duration-300">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FB923C]/15 to-[#F472B6]/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-[#F59E0B]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
