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
}

interface FormErrors {
  name?: string;
  email?: string;
  device_type?: string;
  general?: string;
}

const INITIAL_FORM: FormData = { name: '', email: '', device_type: '' };

type SubmitState = 'idle' | 'loading' | 'success' | 'duplicate';

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Please enter a valid email.';
    if (!form.device_type) errs.device_type = 'Please select your device.';
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
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), device_type: form.device_type }),
      });
      const data = await res.json();
      if (res.status === 201) setSubmitState('success');
      else if (res.status === 409) setSubmitState('duplicate');
      else if (res.status === 400 && data.errors) { setErrors(data.errors); setSubmitState('idle'); }
      else { setErrors({ general: 'Something went wrong.' }); setSubmitState('idle'); }
    } catch { setErrors({ general: 'Could not connect to the server.' }); setSubmitState('idle'); }
  };

  const handleClose = () => { onClose(); setTimeout(() => { setForm(INITIAL_FORM); setErrors({}); setSubmitState('idle'); }, 300); };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative w-full max-w-md overflow-hidden"
            style={{ background: 'var(--decode-white)', border: '1px solid var(--decode-border)', borderRadius: 'var(--decode-radius-xl)', maxHeight: '92vh', overflowY: 'auto' }}
          >
            <button onClick={handleClose} className="absolute top-5 right-5 p-1.5 rounded-lg transition-colors z-10 hover:bg-black/[0.04]" style={{ color: 'var(--decode-text-faint)' }}>
              <X className="w-4 h-4" />
            </button>

            <div className="px-8 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10">
              <AnimatePresence mode="wait">
                {submitState === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="py-10 text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--decode-orange)' }}>
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--decode-text)' }}>You're on the list.</h3>
                    <p className="text-sm leading-relaxed max-w-[260px] mx-auto" style={{ color: 'var(--decode-text-muted)' }}>We'll reach out when your spot is ready.</p>
                  </motion.div>
                )}

                {submitState === 'duplicate' && (
                  <motion.div key="duplicate" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="py-10 text-center">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--decode-text)' }}>Already on the list.</h3>
                    <p className="text-sm leading-relaxed max-w-[260px] mx-auto" style={{ color: 'var(--decode-text-muted)' }}>You're already registered. We'll be in touch.</p>
                  </motion.div>
                )}

                {(submitState === 'idle' || submitState === 'loading') && (
                  <motion.div key="form">
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight mb-1.5" style={{ color: 'var(--decode-text)' }}>Join the Alpha</h3>
                    <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--decode-text-muted)' }}>Early access, small batches. We'll let you know when it's your turn.</p>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                      {errors.general && <p className="text-sm rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.05)', color: '#DC2626' }}>{errors.general}</p>}

                      <div>
                        <label className="block text-xs font-medium tracking-wide mb-2" style={{ color: 'var(--decode-text-dim)' }}>Name</label>
                        <input
                          type="text" value={form.name} onChange={set('name')} placeholder="Your name"
                          className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-colors"
                          style={{ background: 'var(--decode-surface)', border: `1px solid ${errors.name ? '#EF4444' : 'var(--decode-border)'}`, color: 'var(--decode-text)' }}
                        />
                        {errors.name && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium tracking-wide mb-2" style={{ color: 'var(--decode-text-dim)' }}>Email</label>
                        <input
                          type="email" value={form.email} onChange={set('email')} placeholder="you@example.com"
                          className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-colors"
                          style={{ background: 'var(--decode-surface)', border: `1px solid ${errors.email ? '#EF4444' : 'var(--decode-border)'}`, color: 'var(--decode-text)' }}
                        />
                        {errors.email && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium tracking-wide mb-2.5" style={{ color: 'var(--decode-text-dim)' }}>Platform</label>
                        <div className="grid gap-2">
                          {([
                            { value: 'macOS (Apple Silicon)', label: 'macOS', detail: 'Apple Silicon' },
                            { value: 'macOS (Intel)', label: 'macOS', detail: 'Intel' },
                            { value: 'Windows (Interested in future support)', label: 'Windows', detail: 'Coming soon' },
                          ] as const).map(({ value, label, detail }) => {
                            const selected = form.device_type === value;
                            return (
                              <button
                                key={value} type="button"
                                onClick={() => { setForm(prev => ({ ...prev, device_type: value })); if (errors.device_type) setErrors(prev => ({ ...prev, device_type: undefined })); }}
                                className="flex items-center w-full py-3 px-4 rounded-xl text-sm transition-all text-left"
                                style={{
                                  background: selected ? 'var(--decode-peach)' : 'var(--decode-surface)',
                                  border: `1px solid ${errors.device_type && !form.device_type ? '#EF4444' : selected ? 'var(--decode-orange)' : 'var(--decode-border)'}`,
                                  color: selected ? 'var(--decode-text)' : 'var(--decode-text-dim)',
                                }}
                              >
                                <span className="font-medium flex-1">{label}</span>
                                <span className="text-xs" style={{ color: selected ? 'var(--decode-orange)' : 'var(--decode-text-faint)' }}>{detail}</span>
                              </button>
                            );
                          })}
                        </div>
                        {errors.device_type && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.device_type}</p>}
                      </div>

                      <button type="submit" disabled={submitState === 'loading'} className="btn-primary w-full justify-center py-3.5 mt-3 disabled:opacity-60 disabled:cursor-not-allowed">
                        {submitState === 'loading'
                          ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Joining...</span>
                          : <span className="flex items-center gap-2">Join the Alpha<ArrowRight className="w-4 h-4" /></span>}
                      </button>
                    </form>
                    <p className="text-center text-xs mt-5" style={{ color: 'var(--decode-text-faint)' }}>Free during Alpha &middot; No spam</p>
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
