import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Starter',
    price: 'NPR 15,000',
    usd: '~$110',
    desc: 'Perfect for small businesses and individuals needing a clean online presence fast.',
    features: [
      '3-page website (Home, About, Contact)',
      'Mobile responsive design',
      'Contact form integration',
      'Basic SEO setup',
      '1 round of revisions',
      '2 weeks delivery',
    ],
    cta: 'Get started',
    featured: false,
  },
  {
    name: 'Growth',
    price: 'NPR 35,000',
    usd: '~$260',
    desc: 'For growing businesses that want a powerful web presence with custom features.',
    features: [
      'Up to 7 pages',
      'Custom design system',
      'CMS integration (blog/products)',
      'Contact form + email notifications',
      'On-page SEO + sitemap',
      '3 rounds of revisions',
      '4 weeks delivery',
      '1 month post-launch support',
    ],
    cta: 'Most popular',
    featured: true,
  },
  {
    name: 'Pro',
    price: 'Custom',
    usd: 'Let\'s talk',
    desc: 'Full-scale web applications, complex integrations, and long-term partnerships.',
    features: [
      'Unlimited pages',
      'Full-stack web application',
      'Database design & API',
      'Admin panel / dashboard',
      'Authentication system',
      'Performance optimization',
      'Ongoing maintenance',
      'Priority support',
    ],
    cta: 'Contact us',
    featured: false,
  },
]

const faqs = [
  { q: 'How does the payment work?', a: '50% upfront to begin work, 50% on final delivery. For custom projects, we discuss a milestone-based payment plan.' },
  { q: 'Do you work with clients outside Biratnagar?', a: 'Absolutely. We work with clients across Nepal and internationally. Everything is handled online — designs, reviews, and handoff.' },
  { q: 'What do I need to provide?', a: 'Your brand assets (logo, colors if any), copy/content for the pages, and a clear idea of what you want. We help you figure out the rest.' },
  { q: 'Can I upgrade my plan later?', a: 'Yes. Many clients start with Starter or Growth and scale up as their business grows. We keep the codebase clean for easy expansion.' },
]

export default function Pricing() {
  return (
    <>
      <section style={{ padding: '80px 6vw 60px', textAlign: 'center' }}>
        <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>Pricing</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: '16px' }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--gray-600)', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto 64px' }}>
          No hidden fees. No surprises. Pick a plan that fits your goals — or let's build something custom.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
          {plans.map((p) => (
            <div key={p.name} style={{
              background: p.featured ? 'var(--blue-800)' : 'white',
              border: p.featured ? 'none' : '1px solid rgba(0,0,0,0.08)',
              borderRadius: '20px',
              padding: '36px 28px',
              textAlign: 'left',
              position: 'relative',
              transform: p.featured ? 'scale(1.03)' : 'none',
              boxShadow: p.featured ? '0 24px 64px rgba(12,68,124,0.25)' : 'none',
            }}>
              {p.featured && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--blue-400)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '5px 16px', borderRadius: '100px', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  ★ MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: p.featured ? 'rgba(255,255,255,0.6)' : 'var(--gray-500)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '34px', fontWeight: 700, color: p.featured ? 'white' : 'var(--gray-900)', letterSpacing: '-1px', lineHeight: 1 }}>{p.price}</div>
                <div style={{ fontSize: '13px', color: p.featured ? 'rgba(255,255,255,0.5)' : 'var(--gray-400)', marginTop: '4px' }}>{p.usd}</div>
                <p style={{ fontSize: '14px', color: p.featured ? 'rgba(255,255,255,0.7)' : 'var(--gray-600)', lineHeight: 1.6, marginTop: '14px' }}>{p.desc}</p>
              </div>

              <ul style={{ listStyle: 'none', marginBottom: '28px' }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: p.featured ? 'rgba(255,255,255,0.85)' : 'var(--gray-600)', marginBottom: '10px' }}>
                    <span style={{ color: p.featured ? 'var(--blue-100)' : 'var(--blue-400)', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/contact"
                style={{
                  display: 'block', textAlign: 'center', padding: '13px', borderRadius: '10px',
                  fontWeight: 600, fontSize: '14px',
                  background: p.featured ? 'white' : 'transparent',
                  color: p.featured ? 'var(--blue-800)' : 'var(--blue-800)',
                  border: p.featured ? 'none' : '1.5px solid var(--blue-200)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.opacity = '0.85'; el.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.opacity = '1'; el.style.transform = '' }}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 6vw', background: 'var(--gray-50)', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>FAQs</div>
          <div className="section-title" style={{ textAlign: 'center' }}>Questions we get asked</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map(f => (
            <div key={f.q} style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '14px', padding: '24px 28px' }}>
              <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--gray-900)', marginBottom: '10px' }}>{f.q}</p>
              <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: 1.7 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 6vw', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div className="nav-logo">Web<span>lyne</span></div>
        <p style={{ fontSize: '13px', color: 'var(--gray-400)' }}>© 2025 Weblyne. All rights reserved.</p>
      </footer>
    </>
  )
}
