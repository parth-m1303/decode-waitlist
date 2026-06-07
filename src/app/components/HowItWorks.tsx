import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import { MousePointer2, Camera, FileText, ChevronRight } from 'lucide-react';

const modes = [
  {
    id: 'selection',
    icon: MousePointer2,
    label: 'Selection Mode',
    tagline: 'See something confusing? Select it.',
    steps: [
      'Highlight any code visible anywhere on your screen',
      'Press your Decode hotkey — no switching apps',
      'A floating panel explains it instantly in plain English',
      'Ask follow-up questions without losing your place',
    ],
    context: 'Works in VS Code, Xcode, Terminal, browser, anywhere.',
    mockup: {
      title: 'main.py',
      code: [
        { text: 'def', type: 'keyword' },
        { text: ' authenticate(', type: 'plain' },
        { text: 'token', type: 'param' },
        { text: '):', type: 'plain' },
        { text: '', type: 'blank' },
        { text: '  payload', type: 'plain' },
        { text: ' = ', type: 'plain' },
        { text: 'jwt.decode(', type: 'plain' },
        { text: '', type: 'blank' },
        { text: '    token, SECRET,', type: 'plain' },
        { text: '    algorithms', type: 'plain' },
        { text: '=[', type: 'plain' },
        { text: '"HS256"', type: 'string' },
        { text: ']', type: 'plain' },
        { text: '  )', type: 'plain' },
        { text: '  return', type: 'keyword' },
        { text: ' payload', type: 'plain' },
      ],
      explanation: 'This function verifies a JWT token using a shared secret key and the HS256 algorithm. If the token is valid and not expired, it returns the decoded payload — typically containing user ID and permissions.',
      selection: true,
    },
  },
  {
    id: 'screenshot',
    icon: Camera,
    label: 'Screenshot Mode',
    tagline: "Code doesn't have to be in your editor.",
    steps: [
      'Capture any code from a screenshot, video, PDF, or image',
      "Decode’s OCR extracts the code automatically — no manual copy-paste",
      'Works on documentation, tutorials, blog posts, Stack Overflow',
      'Even blurry or low-res screenshots are handled gracefully',
    ],
    context: 'Perfect for watching coding tutorials or reading PDFs.',
    mockup: {
      title: 'Screenshot captured',
      code: [
        { text: 'useEffect', type: 'keyword' },
        { text: '(() => {', type: 'plain' },
        { text: '  fetchData()', type: 'plain' },
        { text: '    .then(', type: 'plain' },
        { text: 'res', type: 'param' },
        { text: ' => setData(', type: 'plain' },
        { text: 'res', type: 'param' },
        { text: '))', type: 'plain' },
        { text: '}, []);', type: 'plain' },
      ],
      explanation: 'This React hook runs fetchData() once after the component mounts. The empty dependency array [] ensures it only runs on initial render, not on every update.',
      selection: false,
    },
  },
  {
    id: 'session',
    icon: FileText,
    label: 'Session Mode',
    tagline: 'Reading an entire file? Go deep.',
    steps: [
      'Load any file into a Decode session',
      'Ask questions about specific functions, patterns, or the whole file',
      'Context stays alive — Decode remembers what you\'ve already discussed',
      'Ideal for onboarding to a new codebase or reviewing AI-generated code',
    ],
    context: 'Understands entire files, not just individual snippets.',
    mockup: {
      title: 'Session · auth.service.ts',
      code: [],
      explanation: '',
      selection: false,
      sessionChat: [
        { role: 'user', text: 'What does this service do overall?' },
        { role: 'decode', text: 'This is an authentication service handling JWT creation, validation, and refresh token rotation. It exposes 4 public methods: login, logout, refreshToken, and validateSession.' },
        { role: 'user', text: 'Where does the refresh token get stored?' },
        { role: 'decode', text: 'Refresh tokens are stored in an HttpOnly cookie on line 47, which prevents JavaScript access. The access token is kept in-memory only.' },
      ],
    },
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeMode, setActiveMode] = useState(0);
  const [sessionStep, setSessionStep] = useState(0);

  return (
    <section ref={ref} className="py-32 px-6 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] bg-gradient-to-r from-[#FB923C]/6 via-[#FBBF24]/6 to-[#F472B6]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Three ways to{' '}
            <span className="bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] bg-clip-text text-transparent">
              understand code
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Decode meets you wherever the code is — in your editor, a video, a PDF, or an entire file.
          </p>
        </motion.div>

        {/* Mode Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center gap-2 mb-12"
        >
          {modes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => { setActiveMode(index); setSessionStep(0); }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition-all text-sm ${
                  activeMode === index
                    ? 'bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] text-white shadow-lg shadow-[#FB923C]/30'
                    : 'bg-white/70 backdrop-blur-xl border border-gray-200 text-gray-700 hover:border-[#FB923C]/40 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {mode.label}
              </button>
            );
          })}
        </motion.div>

        {/* Mode Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            {/* Left: Steps */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FB923C]/10 to-[#F472B6]/10 border border-[#FB923C]/20 mb-4">
                  {(() => { const Icon = modes[activeMode].icon; return <Icon className="w-4 h-4 text-[#F59E0B]" />; })()}
                  <span className="text-sm text-gray-700 font-medium">{modes[activeMode].label}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {modes[activeMode].tagline}
                </h3>
                <p className="text-gray-500 text-sm">{modes[activeMode].context}</p>
              </div>

              <div className="space-y-4">
                {modes[activeMode].steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#FB923C] to-[#FBBF24] flex items-center justify-center mt-0.5 shadow-sm">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed pt-0.5">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FB923C]/15 to-[#F472B6]/15 rounded-3xl blur-3xl" />

              {activeMode === 2 ? (
                /* Session Mode mockup — chat interface */
                <div className="relative rounded-2xl overflow-hidden border border-gray-200/60 shadow-2xl bg-white/60 backdrop-blur-2xl">
                  {/* Header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-50/80 to-white/80 border-b border-gray-200/60">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="text-xs text-gray-600 ml-2 font-mono font-medium">
                      {modes[2].mockup.title}
                    </span>
                  </div>

                  {/* Chat */}
                  <div className="p-5 space-y-4 min-h-[320px]">
                    {modes[2].mockup.sessionChat!.slice(0, sessionStep + 1).map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-[#FB923C] to-[#FBBF24] text-white rounded-br-sm'
                            : 'bg-white border border-gray-200 text-gray-700 rounded-bl-sm shadow-sm'
                        }`}>
                          {msg.role === 'decode' && (
                            <div className="flex items-center gap-1.5 mb-2">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold">D</span>
                              </div>
                              <span className="text-xs font-semibold text-[#F59E0B]">Decode</span>
                            </div>
                          )}
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Next button */}
                  {sessionStep < modes[2].mockup.sessionChat!.length - 1 && (
                    <div className="px-5 pb-5">
                      <button
                        onClick={() => setSessionStep(s => s + 1)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium transition-all group"
                      >
                        Continue conversation
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Selection / Screenshot mockup — editor with explanation panel */
                <div className="relative rounded-2xl overflow-hidden border border-gray-200/60 shadow-2xl bg-white/60 backdrop-blur-2xl">
                  {/* Header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-50/80 to-white/80 border-b border-gray-200/60">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="text-xs text-gray-600 ml-2 font-mono">
                      {modes[activeMode].mockup.title}
                    </span>
                    {activeMode === 1 && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#FB923C]/10 text-[#F59E0B] font-medium">
                        OCR · Code extracted
                      </span>
                    )}
                  </div>

                  {/* Code area */}
                  <div className="bg-gray-900 p-5 font-mono text-sm leading-7 relative">
                    {modes[activeMode].mockup.selection && (
                      <div className="absolute left-4 top-4 bottom-4 w-[calc(100%-2rem)] bg-[#FBBF24]/10 rounded-lg border border-[#FBBF24]/30 pointer-events-none" />
                    )}
                    <pre className="relative z-10">
                      {modes[activeMode].mockup.code.map((token, i) =>
                        token.type === 'blank' ? (
                          <br key={i} />
                        ) : (
                          <span
                            key={i}
                            className={
                              token.type === 'keyword'
                                ? 'text-[#FB923C]'
                                : token.type === 'string'
                                ? 'text-[#A5D6A7]'
                                : token.type === 'param'
                                ? 'text-[#FBBF24]'
                                : 'text-gray-200'
                            }
                          >
                            {token.text}
                          </span>
                        )
                      )}
                    </pre>
                  </div>

                  {/* Explanation panel */}
                  <div className="p-5 bg-white/90 border-t border-gray-200/60">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">D</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Decode</span>
                      <span className="ml-auto flex items-center gap-1.5 text-xs text-[#F59E0B] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F472B6] animate-pulse inline-block" />
                        Explained
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {modes[activeMode].mockup.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
