import { BookOpen, Code2, PlaySquare } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function Demo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#FBBF24]/10 to-[#F472B6]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            See it in action
          </h2>
          <p className="text-xl text-gray-600">
            Watch how Decode transforms complex code into instant clarity.
          </p>
        </motion.div>

        {/* Two column layout: Mockup + Info */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
          {/* Left: Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-2 lg:order-1"
          >
            {/* Outer epic glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#FB923C]/20 via-[#FBBF24]/20 to-[#F472B6]/20 rounded-3xl blur-3xl"
              animate={{
                opacity: 0.6,
                scale: 1,
              }}
            />

            {/* Main container */}
            <div className="relative rounded-3xl overflow-hidden border border-gray-200/60 shadow-2xl shadow-[#FB923C]/20 bg-gray-900">
              {/* Fake IDE Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-xs text-gray-400 ml-2 font-mono">
                  api_handler.ts
                </span>
              </div>

              {/* Fake IDE Content & Decode Popover */}
              <div className="relative p-6 font-mono text-sm leading-relaxed text-gray-300 min-h-[350px]">
                <pre>
                  <span className="text-purple-400">export</span> <span className="text-purple-400">async</span> <span className="text-blue-400">function</span> <span className="text-yellow-200">processWebhook</span>(payload: <span className="text-teal-300">any</span>) {'{'}
                  {'\n  '}
                  <div className="relative inline-block bg-blue-500/20 outline outline-1 outline-blue-400/50 rounded-sm">
                    <span className="text-purple-400">const</span> signature = req.headers[<span className="text-green-300">'x-webhook-signature'</span>];
                    {'\n  '}
                    <span className="text-purple-400">if</span> (!<span className="text-yellow-200">verifySignature</span>(payload, signature)) {'{'}
                    {'\n    '}
                    <span className="text-purple-400">throw</span> <span className="text-blue-400">new</span> <span className="text-yellow-200">Error</span>(<span className="text-green-300">'Invalid signature'</span>);
                    {'\n  '}
                    {'}'}
                  </div>
                  {'\n  '}
                  <span className="text-gray-500">// Process payload safely</span>
                  {'\n  '}
                  <span className="text-purple-400">return</span> <span className="text-yellow-200">handleEvent</span>(payload.event_type, payload.data);
                  {'\n'}
                  {'}'}
                </pre>

                {/* Animated Decode Popover */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="absolute top-16 left-20 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">D</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Decode</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.4, delay: 1.2 }}
                      className="text-sm text-gray-700 leading-relaxed font-sans"
                    >
                      This code extracts a webhook signature from the headers and verifies it against the payload.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.4, delay: 2.0 }}
                      className="text-sm text-gray-700 leading-relaxed font-sans"
                    >
                      If the signature doesn't match, it throws an error immediately, protecting the endpoint from unauthorized requests.
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right: Info/Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8 order-1 lg:order-2"
          >
            {/* Section title */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Perfect for every{' '}
                <span className="bg-gradient-to-r from-[#FB923C] to-[#F472B6] bg-clip-text text-transparent">
                  use case
                </span>
              </h3>
              <p className="text-lg text-gray-600">
                Decode adapts to what you're doing, providing context exactly when you need it.
              </p>
            </div>

            {/* Feature list with animated items */}
            <div className="space-y-4">
              {[
                {
                  icon: BookOpen,
                  title: 'Reading a new codebase?',
                  description: 'Quickly understand architecture, unfamiliar patterns, or internal utility functions without digging through files.',
                  delay: 0.6,
                },
                {
                  icon: Code2,
                  title: "Got AI-generated code you don't understand?",
                  description: "Decode acts as your second pair of eyes, explaining why AI made certain choices and what the code actually does.",
                  delay: 0.7,
                },
                {
                  icon: PlaySquare,
                  title: 'Watching a coding tutorial?',
                  description: 'Screenshot the video frame. Decode extracts the code and explains it while the video keeps playing.',
                  delay: 0.8,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.6, delay: item.delay }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-200/60 hover:border-[#FB923C]/30 hover:bg-white/80 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FB923C] to-[#FBBF24] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}