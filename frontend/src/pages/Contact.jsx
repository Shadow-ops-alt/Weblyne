import { useState, useCallback } from 'react';
import Icon from '../components/Icon.jsx';
import { api } from '../lib/api.js';
import { useSeo } from '../lib/seo.js';
import {
  sanitizeName,    validateName,
  sanitizeEmail,   validateEmail,
  sanitizePhone,   validatePhone,
  sanitizeMessage, validateMessage,
} from '../utils/formValidation.js';

const SERVICES = ['Website Development', 'Web App', 'SEO & Local Search', 'Maintenance & Support', 'Social Media Setup', 'Other / Not sure'];
const BUDGETS  = ['Rs 10K – 30K', 'Rs 30K – 80K', 'Rs 80K+', 'Not sure yet'];

// ─── initial state helpers ───────────────────────────────────────────────────
const EMPTY_FORM = { name: '', email: '', phone: '', service: '', budget: '', desc: '', website: '' };
// null = untouched, string = error message, '' = valid (passed)
const EMPTY_ERRORS  = { name: null, email: null, phone: null, desc: null };
// tracks which fields the user has blurred at least once
const EMPTY_TOUCHED = { name: false, email: false, phone: false, desc: false };

// Maps field key → { sanitize, validate }
const FIELD_FNS = {
  name:  { sanitize: sanitizeName,    validate: validateName    },
  email: { sanitize: sanitizeEmail,   validate: validateEmail   },
  phone: { sanitize: sanitizePhone,   validate: validatePhone   },
  desc:  { sanitize: sanitizeMessage, validate: validateMessage },
};

// ─── helpers ─────────────────────────────────────────────────────────────────
/** Returns the CSS class to add to a .wb-field-wrap based on error/valid state */
function fieldState(touched, error) {
  if (!touched) return '';
  if (error)    return 'wb-field--error';
  return 'wb-field--valid';
}

export default function Contact() {
  useSeo({
    title: 'Contact Weblyne — Start a project',
    description: 'Tell us about your project. We reply to every enquiry within 24 hours. WhatsApp +977 9815 864 822 or email adityabhujel999@gmail.com.',
    path: '/contact',
  });

  const [form,    setForm]    = useState(EMPTY_FORM);
  const [errors,  setErrors]  = useState(EMPTY_ERRORS);
  const [touched, setTouched] = useState(EMPTY_TOUCHED);
  const [status,  setStatus]  = useState('idle'); // idle | sending | done | error
  const [serverError, setServerError] = useState('');

  // ── live update (clears error as soon as user types) ──────────────────────
  const update = useCallback((k) => (e) => {
    const raw = e.target.value;
    setForm(f => ({ ...f, [k]: raw }));

    // If this field has been touched and had an error, re-check on every keystroke
    if (touched[k] && FIELD_FNS[k]) {
      const { sanitize, validate } = FIELD_FNS[k];
      const err = validate(sanitize(raw));
      setErrors(prev => ({ ...prev, [k]: err }));
    } else if (touched[k]) {
      // For fields we track (but have no sanitize/validate pair) just clear
      setErrors(prev => ({ ...prev, [k]: null }));
    }
  }, [touched]);

  // ── on blur: sanitize → validate → show error ─────────────────────────────
  const onBlur = useCallback((k) => () => {
    if (!FIELD_FNS[k]) return;
    const { sanitize, validate } = FIELD_FNS[k];
    const sanitized = sanitize(form[k]);
    // Write sanitized value back so the input shows clean text
    setForm(f => ({ ...f, [k]: sanitized }));
    setTouched(t => ({ ...t, [k]: true }));
    setErrors(prev => ({ ...prev, [k]: validate(sanitized) }));
  }, [form]);

  // ── form submit ───────────────────────────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Mark all validated fields as touched and collect errors
    const allTouched = { name: true, email: true, phone: true, desc: true };
    setTouched(allTouched);

    const newErrors = {};
    for (const k of ['name', 'email', 'phone', 'desc']) {
      const { sanitize, validate } = FIELD_FNS[k];
      const sanitized = sanitize(form[k]);
      setForm(f => ({ ...f, [k]: sanitized }));
      newErrors[k] = validate(sanitized);
    }
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(e => e !== null);
    if (hasErrors) return;

    setStatus('sending');
    try {
      await api.contact(form);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setServerError(err?.message || 'Something went wrong. Please try again or use WhatsApp.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setForm(EMPTY_FORM);
    setErrors(EMPTY_ERRORS);
    setTouched(EMPTY_TOUCHED);
    setServerError('');
  };

  // Disable submit if any touched field has an error, or while sending
  const hasVisibleError = Object.values(errors).some(e => e !== null);
  const submitDisabled  = status === 'sending' || hasVisibleError;

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <header className="wb-pagehead" style={{ paddingBottom: 48 }}>
        <div className="wb-container wb-pagehead__inner">
          <span className="wb-eyebrow">Get in touch</span>
          <h1 style={{ marginTop: 14 }}>Let's build something.</h1>
          <p>Tell us about your project below. We respond to every inquiry within 24 hours — usually faster.</p>
        </div>
      </header>

      <section className="wb-section" style={{ paddingTop: 56 }}>
        <div className="wb-container">
          <div className="wb-stack-md" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56, alignItems: 'flex-start' }}>
            <div className="wb-card" style={{ padding: 40 }}>
              {status === 'done' ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--color-teal-soft)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <Icon name="check" size={32} stroke={3} />
                  </div>
                  <h2 style={{ marginBottom: 12 }}>Got it, {form.name || 'friend'}.</h2>
                  <p style={{ color: 'var(--color-text-muted)', maxWidth: 400, margin: '0 auto 24px', fontSize: 16 }}>
                    Thanks for reaching out. We'll review and reply to <strong>{form.email}</strong> within 24 hours.
                  </p>
                  <button onClick={reset} className="wb-btn wb-btn--ghost">Send another</button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  {/* Honeypot — hidden from real users, bots fill it. */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
                    <label>Website (leave empty)
                      <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
                    </label>
                  </div>

                  <h2 style={{ fontSize: 24, marginBottom: 4 }}>Project enquiry</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 28 }}>All fields are required unless marked optional.</p>

                  {/* ── Row 1: Name + Email ── */}
                  <div className="wb-stack-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 18 }}>

                    {/* Name */}
                    <div className={`wb-field-wrap ${fieldState(touched.name, errors.name)}`}>
                      <label className="wb-label" htmlFor="contact-name">
                        Full name
                        {touched.name && !errors.name && (
                          <span className="wb-field-check" aria-label="Valid">✓</span>
                        )}
                      </label>
                      <input
                        id="contact-name"
                        className="wb-input"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={update('name')}
                        onBlur={onBlur('name')}
                        placeholder="Anjana Karki"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'err-name' : undefined}
                      />
                      {errors.name && (
                        <span id="err-name" className="wb-field-error" role="alert">{errors.name}</span>
                      )}
                    </div>

                    {/* Email */}
                    <div className={`wb-field-wrap ${fieldState(touched.email, errors.email)}`}>
                      <label className="wb-label" htmlFor="contact-email">
                        Email
                        {touched.email && !errors.email && (
                          <span className="wb-field-check" aria-label="Valid">✓</span>
                        )}
                      </label>
                      <input
                        id="contact-email"
                        className="wb-input"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={update('email')}
                        onBlur={onBlur('email')}
                        placeholder="you@business.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'err-email' : undefined}
                      />
                      {errors.email && (
                        <span id="err-email" className="wb-field-error" role="alert">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  {/* ── Row 2: Phone ── */}
                  <div className={`wb-field-wrap ${fieldState(touched.phone, errors.phone)}`} style={{ marginBottom: 18 }}>
                    <label className="wb-label" htmlFor="contact-phone">
                      Phone <span style={{ color: 'var(--color-text-faint)', fontWeight: 400 }}>(WhatsApp preferred)</span>
                      {touched.phone && !errors.phone && (
                        <span className="wb-field-check" aria-label="Valid">✓</span>
                      )}
                    </label>
                    <input
                      id="contact-phone"
                      className="wb-input"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={update('phone')}
                      onBlur={onBlur('phone')}
                      placeholder="+977 98·· ···· ····"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'err-phone' : undefined}
                    />
                    {errors.phone && (
                      <span id="err-phone" className="wb-field-error" role="alert">{errors.phone}</span>
                    )}
                  </div>

                  {/* ── Row 3: Service + Budget ── */}
                  <div className="wb-stack-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 18 }}>
                    <div>
                      <label className="wb-label" htmlFor="contact-service">Service</label>
                      <select id="contact-service" className="wb-select" required value={form.service} onChange={update('service')}>
                        <option value="">Select a service…</option>
                        {SERVICES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="wb-label" htmlFor="contact-budget">Budget range</label>
                      <select id="contact-budget" className="wb-select" required value={form.budget} onChange={update('budget')}>
                        <option value="">Select budget…</option>
                        {BUDGETS.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* ── Row 4: Message ── */}
                  <div className={`wb-field-wrap ${fieldState(touched.desc, errors.desc)}`} style={{ marginBottom: 24 }}>
                    <label className="wb-label" htmlFor="contact-desc">
                      Tell us about your project
                      {touched.desc && !errors.desc && (
                        <span className="wb-field-check" aria-label="Valid">✓</span>
                      )}
                    </label>
                    <textarea
                      id="contact-desc"
                      className="wb-textarea"
                      rows={5}
                      value={form.desc}
                      onChange={update('desc')}
                      onBlur={onBlur('desc')}
                      placeholder="What does your business do? What do you need? Any deadlines?"
                      aria-invalid={!!errors.desc}
                      aria-describedby={errors.desc ? 'err-desc' : undefined}
                    />
                    <div className="wb-field-meta">
                      {errors.desc
                        ? <span id="err-desc" className="wb-field-error" role="alert">{errors.desc}</span>
                        : <span />
                      }
                      <span className={`wb-char-count ${form.desc.length > 950 ? 'wb-char-count--warn' : ''}`}>
                        {form.desc.length}/1000
                      </span>
                    </div>
                  </div>

                  {/* Server-level error */}
                  {status === 'error' && (
                    <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: '#fde8e8', color: '#9b2226', fontSize: 13 }}>
                      {serverError}
                    </div>
                  )}

                  <button
                    type="submit"
                    id="contact-submit"
                    disabled={submitDisabled}
                    className="wb-btn wb-btn--primary wb-btn--lg"
                    style={{ width: '100%' }}
                    title={hasVisibleError ? 'Please fix the errors above before submitting' : undefined}
                  >
                    {status === 'sending' ? 'Sending…' : <>Send enquiry <Icon name="arrow-right" size={14} /></>}
                  </button>

                  <p style={{ fontSize: 12, color: 'var(--color-text-faint)', marginTop: 16, textAlign: 'center' }}>
                    By submitting, you agree to be contacted by Weblyne. We never share your details.
                  </p>
                </form>
              )}
            </div>

            {/* ── Contact sidebar ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <a href="https://wa.me/9779815864822" target="_blank" rel="noreferrer" style={{ background: '#25D366', color: 'white', padding: 20, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.18)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="whatsapp" size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Chat on WhatsApp</div>
                  <div style={{ fontSize: 13, opacity: 0.9 }}>+977 9815 864 822 · Tap to chat</div>
                </div>
              </a>

              <div className="wb-card" style={{ padding: 24 }}>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Other ways</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { icon: 'mail',  label: 'Email',    val: 'adityabhujel999@gmail.com' },
                    { icon: 'phone', label: 'Phone',    val: '+977 9815 864 822' },
                    { icon: 'map',   label: 'Based in', val: 'Online · Biratnagar, Nepal' },
                  ].map(c => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--color-blue-light)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={c.icon} size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>{c.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--color-bg-soft)', padding: 24, borderRadius: 14 }}>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Office hours</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sun – Fri</span><strong>10:00 – 18:00</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}><span>Saturday</span><span>By appointment</span></div>
                </div>
                <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--color-teal-soft)', color: 'var(--color-teal)', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--color-teal)' }} />
                  We reply within 24 hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
