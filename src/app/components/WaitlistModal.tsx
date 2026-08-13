import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Loader2 } from 'lucide-react';
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

const INITIAL_FORM: FormData = { name: '', email: '', device_type: '', primary_use_case: '', preferred_ide: '' };

type SubmitState = 'idle' | 'loading' | 'success' | 'duplicate';

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Please enter a valid email.';
    if (!form.device_type) errs.device_type = 'Please select your device type.';
    if (!form.primary_use_case) errs.primary_use_case = 'Please select your primary use case.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitState('loading');
    setErrors({});
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), device_type: form.device_type, primary_use_case: form.primary_use_case, preferred_ide: form.preferred_ide || null }),
      });
      const data = await res.json();
      if (res.status === 201) setSubmitState('success');
      else if (res.status === 409) setSubmitState('duplicate');
      else if (res.status === 400 && data.errors) { setErrors(data.errors); setSubmitState('idle'); }
      else { setErrors({ general: 'Something went wrong.' }); setSubmitState('idle'); }
    } catch { setErrors({ general: 'Could not connect to the server.' }); setSubmitState('idle'); }
  };

  const handleClose = () => { onClose(); setTimeout(() => { setForm(INITIAL_FORM); setErrors({}); setSubmitState('idle'); }, 300); };

  const inputCls = "w-full px-4 py-3 rounded-xl focus:outline-none transition-all text-sm";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-black/25 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-xl"
            style={{ background: 'var(--decode-white)', border: '1px solid var(--decode-border)', maxHeight: '92vh', overflowY: 'auto' }}
          >
            <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full z-10" style={{ color: 'var(--decode-text-muted)', background: 'var(--decode-surface)' }}>
              <X className="w-4 h-4" />
            </button>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {submitState === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--decode-orange)' }}>
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--decode-text)' }}>You're on the waitlist.</h3>
                    <p className="text-sm max-w-xs mx-auto" style={{ color: 'var(--decode-text-muted)' }}>We'll reach out when alpha access is ready.</p>
                  </motion.div>
                )}

                {submitState === 'duplicate' && (
                  <motion.div key="duplicate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
                    <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--decode-text)' }}>Already registered.</h3>
                    <p className="text-sm max-w-xs mx-auto" style={{ color: 'var(--decode-text-muted)' }}>You're already on the waitlist. We'll be in touch.</p>
                  </motion.div>
                )}

                {(submitState === 'idle' || submitState === 'loading') && (
                  <motion.div key="form">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--decode-text)' }}>Join the waitlist</h3>
                    <p className="text-sm mb-8" style={{ color: 'var(--decode-text-muted)' }}>Get early access. We onboard in small batches.</p>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                      {errors.general && <p className="text-sm text-red-600 rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.06)' }}>{errors.general}</p>}

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--decode-text-dim)' }}>Name <span style={{ color: 'var(--decode-orange)' }}>*</span></label>
                        <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" className={inputCls} style={{ background: 'var(--decode-surface)', border: `1px solid ${errors.name ? '#EF4444' : 'var(--decode-border)'}` }} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--decode-text-dim)' }}>Email <span style={{ color: 'var(--decode-orange)' }}>*</span></label>
                        <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={inputCls} style={{ background: 'var(--decode-surface)', border: `1px solid ${errors.email ? '#EF4444' : 'var(--decode-border)'}` }} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--decode-text-dim)' }}>Device <span style={{ color: 'var(--decode-orange)' }}>*</span></label>
                        <div className="flex flex-col gap-2">
                          {([
                            { value: 'macOS (Apple Silicon)', label: 'macOS (Apple Silicon)', sub: 'M1–M4' },
                            { value: 'macOS (Intel)', label: 'macOS (Intel)', sub: 'Intel Mac' },
                            { value: 'Windows (Interested in future support)', label: 'Windows', sub: 'Future support' },
                          ] as const).map(({ value, label, sub }) => (
                            <button
                              key={value} type="button"
                              onClick={() => { setForm(prev => ({ ...prev, device_type: value })); if (errors.device_type) setErrors(prev => ({ ...prev, device_type: undefined })); }}
                              className="flex items-center w-full py-3 px-4 rounded-xl text-sm font-medium transition-all text-left"
                              style={{
                                background: form.device_type === value ? 'var(--decode-peach)' : 'var(--decode-surface)',
                                border: `1px solid ${form.device_type === value ? 'var(--decode-orange)' : 'var(--decode-border)'}`,
                                color: form.device_type === value ? 'var(--decode-text)' : 'var(--decode-text-dim)',
                              }}
                            >
                              <span className="flex-1">{label}</span>
                              <span className="text-xs" style={{ color: 'var(--decode-text-faint)' }}>{sub}</span>
                            </button>
                          ))}
                        </div>
                        {errors.device_type && <p className="text-red-500 text-xs mt-1">{errors.device_type}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--decode-text-dim)' }}>Use Case <span style={{ color: 'var(--decode-orange)' }}>*</span></label>
                        <select value={form.primary_use_case} onChange={set('primary_use_case')} className={`${inputCls} appearance-none cursor-pointer`} style={{ background: 'var(--decode-surface)', border: `1px solid ${errors.primary_use_case ? '#EF4444' : 'var(--decode-border)'}`, color: form.primary_use_case ? 'var(--decode-text)' : 'var(--decode-text-faint)' }}>
                          <option value="" disabled>Select use case</option>
                          {USE_CASES.map(uc => <option key={uc} value={uc}>{uc}</option>)}
                        </select>
                        {errors.primary_use_case && <p className="text-red-500 text-xs mt-1">{errors.primary_use_case}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--decode-text-dim)' }}>IDE <span className="font-normal normal-case" style={{ color: 'var(--decode-text-faint)' }}>(optional)</span></label>
                        <select value={form.preferred_ide} onChange={set('preferred_ide')} className={`${inputCls} appearance-none cursor-pointer`} style={{ background: 'var(--decode-surface)', border: '1px solid var(--decode-border)' }}>
                          <option value="">Select IDE</option>
                          {IDES.map(ide => <option key={ide} value={ide}>{ide}</option>)}
                        </select>
                      </div>

                      <button type="submit" disabled={submitState === 'loading'} className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        {submitState === 'loading' ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Joining...</span> : <span className="flex items-center gap-2">Join Waitlist<ArrowRight className="w-4 h-4" /></span>}
                      </button>
                    </form>
                    <p className="text-center text-xs mt-4" style={{ color: 'var(--decode-text-faint)' }}>Free during Alpha &middot; No spam</p>
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
