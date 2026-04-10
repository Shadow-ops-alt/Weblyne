import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

interface FormData {
  name: string
  email: string
  service: string
  budget: string
  message: string
}

const initialForm: FormData = { name: '', email: '', service: '', budget: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validate = () => {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.service) e.service = 'Please select a service'
    if (!form.message.trim() || form.message.trim().length < 20) e.message = 'Please write at least 20 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { error } = await supabase.from('inquiries').insert([{
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        service: form.service,
        budget: form.budget || 'Not specified',
        message: form.message.trim(),
        status: 'new',
      }])
      if (error) throw error
      setToast({ message: 'Message sent! We\'ll get back to you within 24 hours.', type: 'success' })
      setForm(initialForm)
      setErrors({})
    } catch {
      setToast({ message: 'Something went wrong. Please try again or email us directly.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: undefined }))
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <section style={{ padding: '80px 6vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', maxWidth: '1100px', margin: '0 auto', alignItems: 'start' }}>
        {/* Left */}
        <div>
          <div className="section-label">Contact</div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(30px, 3.5vw, 46px)', fontWeight: 700, letterSpacing: '-1.2px', marginBottom: '16px', lineHeight: 1.15 }}>
            Let's build something great
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '48px' }}>
            Tell us about your project and we'll get back to you within 24 hours with a tailored proposal.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {[
              { icon: '📍', label: 'Location', value: 'Biratnagar, Nepal' },
              { icon: '✉️', label: 'Email', value: 'hello@weblyne.com' },
              { icon: '⏱️', label: 'Response time', value: 'Within 24 hours' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', background: 'var(--blue-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{item.label}</p>
                  <p style={{ fontSize: '15px', color: 'var(--gray-900)', fontWeight: 500 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.08)', padding: '36px 32px', boxShadow: '0 4px 32px rgba(0,0,0,0.05)' }}>
          <div className="form-row">
            <div className="form-group">
              <label>Your name *</label>
              <input value={form.name} onChange={set('name')} placeholder="Aarav Sharma" />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label>Email address *</label>
              <input value={form.email} onChange={set('email')} placeholder="you@company.com" type="email" />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Service needed *</label>
              <select value={form.service} onChange={set('service')}>
                <option value="">Select a service...</option>
                <option value="Website Design & Dev">Website Design & Dev</option>
                <option value="Landing Page">Landing Page</option>
                <option value="Web Application">Web Application</option>
                <option value="Performance & SEO">Performance & SEO</option>
                <option value="Maintenance & Support">Maintenance & Support</option>
                <option value="Other">Other</option>
              </select>
              {errors.service && <p className="form-error">{errors.service}</p>}
            </div>
            <div className="form-group">
              <label>Budget range</label>
              <select value={form.budget} onChange={set('budget')}>
                <option value="">Select range...</option>
                <option value="Under NPR 15,000">Under NPR 15,000</option>
                <option value="NPR 15,000 – 35,000">NPR 15,000 – 35,000</option>
                <option value="NPR 35,000 – 70,000">NPR 35,000 – 70,000</option>
                <option value="NPR 70,000+">NPR 70,000+</option>
                <option value="Let's discuss">Let's discuss</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Project details *</label>
            <textarea value={form.message} onChange={set('message')} placeholder="Tell us about your project — what you need, your goals, any references or inspirations..." />
            {errors.message && <p className="form-error">{errors.message}</p>}
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '15px' }}>
            {loading ? 'Sending...' : 'Send message →'}
          </button>
        </div>
      </section>

      <footer style={{ padding: '40px 6vw', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div className="nav-logo">Web<span>lyne</span></div>
        <p style={{ fontSize: '13px', color: 'var(--gray-400)' }}>© 2025 Weblyne. All rights reserved.</p>
      </footer>
    </>
  )
}
