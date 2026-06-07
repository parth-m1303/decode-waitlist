import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  device_type: string;
  primary_use_case: string;
  preferred_ide: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  device_type?: string;
  primary_use_case?: string;
  general?: string;
}

const USE_CASES = [
  'Student Learning Programming',
  'DSA / Competitive Programming',
  'Web Development',
  'Mobile Development',
  'Backend Development',
  'AI / ML',
  'Blockchain',
  'Other',
];

const IDES = ['VS Code', 'Cursor', 'Xcode', 'Windsurf', 'Other'];

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  device_type: '',
  primary_use_case: '',
  preferred_ide: '',
};

type SubmitState = 'idle' | 'loading' | 'success' | 'duplicate';

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!form.device_type) errs.device_type = 'Please select your device type.';
    if (!form.primary_use_case) errs.primary_use_case = 'Please select your primary use case.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitState('loading');
    setErrors({});

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          device_type: form.device_type,
          primary_use_case: form.primary_use_case,
          preferred_ide: form.preferred_ide || null,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setSubmitState('success');
      } else if (res.status === 409) {
        setSubmitState('duplicate');
      } else if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setSubmitState('idle');
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
        setSubmitState('idle');
      }
    } catch {
      setErrors({ general: 'Could not connect to the server. Please try again.' });
      setSubmitState('idle');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation completes
    setTimeout(() => {
      setForm(INITIAL_FORM);
      setErrors({});
      setSubmitState('idle');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
            style={{ background: '#0a0a0a', maxHeight: '92vh', overflowY: 'auto' }}
          >
            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[160px] bg-gradient-to-r from-[#FB923C]/20 to-[#F472B6]/20 blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 relative z-10">
              <AnimatePresence mode="wait">

                {/* ── Success state ── */}
                {submitState === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#FB923C]/20">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">You're on the waitlist.</h3>
                    <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
                      Thanks for your interest in Decode. We'll reach out when alpha access becomes available.
                    </p>
                  </motion.div>
                )}

                {/* ── Duplicate state ── */}
                {submitState === 'duplicate' && (
                  <motion.div
                    key="duplicate"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl">📋</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Already registered.</h3>
                    <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
                      You have already joined the waitlist. We'll be in touch soon.
                    </p>
                  </motion.div>
                )}

                {/* ── Form state ── */}
                {(submitState === 'idle' || submitState === 'loading') && (
                  <motion.div key="form" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                    {/* Header */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FB923C] to-[#F472B6] flex items-center justify-center mb-6 shadow-lg shadow-[#FB923C]/20">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Join the waitlist</h3>
                    <p className="text-white/40 text-sm mb-8 leading-relaxed">
                      Get early access to Decode. We onboard developers in small batches.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                      {/* General error */}
                      {errors.general && (
                        <p className="text-[#F87171] text-sm bg-[#F87171]/10 border border-[#F87171]/20 rounded-xl px-4 py-3">
                          {errors.general}
                        </p>
                      )}

                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                          Name <span className="text-[#FB923C]">*</span>
                        </label>
                        <input
                          id="wl-name"
                          type="text"
                          value={form.name}
                          onChange={set('name')}
                          placeholder="Your full name"
                          className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                            errors.name
                              ? 'border-[#F87171]/60 focus:border-[#F87171]/80'
                              : 'border-white/10 focus:border-[#FB923C]/50'
                          }`}
                        />
                        {errors.name && <p className="text-[#F87171] text-xs mt-1.5">{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                          Email <span className="text-[#FB923C]">*</span>
                        </label>
                        <input
                          id="wl-email"
                          type="email"
                          value={form.email}
                          onChange={set('email')}
                          placeholder="you@example.com"
                          className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                            errors.email
                              ? 'border-[#F87171]/60 focus:border-[#F87171]/80'
                              : 'border-white/10 focus:border-[#FB923C]/50'
                          }`}
                        />
                        {errors.email && <p className="text-[#F87171] text-xs mt-1.5">{errors.email}</p>}
                      </div>

                      {/* Device Type */}
                      <div>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                          Device Type <span className="text-[#FB923C]">*</span>
                        </label>
                        <div className="flex flex-col gap-2">
                          {([
                            { value: 'macOS (Apple Silicon)', label: '🍎 macOS (Apple Silicon)', sub: 'M1, M2, M3, M4 chips' },
                            { value: 'macOS (Intel)',         label: '🍎 macOS (Intel)',         sub: 'Intel-based Mac' },
                            { value: 'Windows (Interested in future support)', label: '🪟 Windows', sub: 'Interested in future support' },
                          ] as const).map(({ value, label, sub }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => {
                                setForm(prev => ({ ...prev, device_type: value }));
                                if (errors.device_type) setErrors(prev => ({ ...prev, device_type: undefined }));
                              }}
                              className={`flex items-center gap-3 w-full py-3 px-4 rounded-xl border text-sm font-medium transition-all text-left ${
                                form.device_type === value
                                  ? 'border-[#FB923C]/60 bg-[#FB923C]/10 text-white'
                                  : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                              }`}
                            >
                              <span className="flex-1">{label}</span>
                              <span className={`text-xs ${ form.device_type === value ? 'text-white/50' : 'text-white/25' }`}>{sub}</span>
                            </button>
                          ))}
                        </div>
                        {errors.device_type && <p className="text-[#F87171] text-xs mt-1.5">{errors.device_type}</p>}
                      </div>

                      {/* Primary Use Case */}
                      <div>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                          Primary Use Case <span className="text-[#FB923C]">*</span>
                        </label>
                        <select
                          id="wl-use-case"
                          value={form.primary_use_case}
                          onChange={set('primary_use_case')}
                          className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white focus:outline-none transition-colors appearance-none cursor-pointer ${
                            errors.primary_use_case
                              ? 'border-[#F87171]/60 focus:border-[#F87171]/80'
                              : 'border-white/10 focus:border-[#FB923C]/50'
                          } ${!form.primary_use_case ? 'text-white/25' : 'text-white'}`}
                          style={{ background: 'rgba(255,255,255,0.05)', colorScheme: 'dark' }}
                        >
                          <option value="" disabled style={{ background: '#111', color: 'rgba(255,255,255,0.5)' }}>
                            Select your primary use case
                          </option>
                          {USE_CASES.map(uc => (
                            <option key={uc} value={uc} style={{ background: '#111', color: '#fff' }}>
                              {uc}
                            </option>
                          ))}
                        </select>
                        {errors.primary_use_case && (
                          <p className="text-[#F87171] text-xs mt-1.5">{errors.primary_use_case}</p>
                        )}
                      </div>

                      {/* Preferred IDE (optional) */}
                      <div>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                          Preferred IDE <span className="text-white/25 font-normal normal-case">(optional)</span>
                        </label>
                        <select
                          id="wl-ide"
                          value={form.preferred_ide}
                          onChange={set('preferred_ide')}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#FB923C]/50 text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                          style={{ background: 'rgba(255,255,255,0.05)', colorScheme: 'dark' }}
                        >
                          <option value="" style={{ background: '#111', color: 'rgba(255,255,255,0.5)' }}>
                            Select your preferred IDE
                          </option>
                          {IDES.map(ide => (
                            <option key={ide} value={ide} style={{ background: '#111', color: '#fff' }}>
                              {ide}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={submitState === 'loading'}
                        className="group relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-opacity mt-2"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FB923C] via-[#FBBF24] to-[#F472B6] blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                        <span className="relative z-10 flex items-center gap-2">
                          {submitState === 'loading' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Joining…
                            </>
                          ) : (
                            <>
                              Join Waitlist
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </span>
                      </button>
                    </form>

                    <p className="text-center text-xs text-white/20 mt-4">
                      Free during Alpha · No spam · No credit card
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}