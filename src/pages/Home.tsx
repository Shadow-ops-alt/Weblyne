import { Link } from 'react-router-dom'

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: 'Website Design & Dev',
    desc: 'Pixel-perfect, fast-loading websites built with modern frameworks. Designed to impress and convert visitors into clients.',
    tag: 'Most popular',
    featured: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="12" cy="12" r="9"/><path d="M12 3a13 13 0 0 1 0 18M3 12h18"/>
      </svg>
    ),
    title: 'Landing Pages',
    desc: 'High-converting landing pages built to capture leads, launch products, and grow your audience fast.',
    tag: 'Quick turnaround',
    featured: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Web Applications',
    desc: 'Custom web apps and dashboards that automate your workflows and give you a real digital edge.',
    tag: 'Full-stack',
    featured: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Performance & SEO',
    desc: 'Speed optimization, Core Web Vitals fixes, and on-page SEO so your site ranks and loads blazing fast.',
    tag: 'Results-driven',
    featured: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Maintenance & Support',
    desc: 'Ongoing support, updates, and monitoring to keep your website secure, fresh, and running smooth.',
    tag: 'Ongoing',
    featured: false,
  },
]

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section style={{ minHeight: '91vh', padding: '0 6vw', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--blue-50) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--blue-50)', color: 'var(--blue-600)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', padding: '6px 14px', borderRadius: '100px', border: '1px solid var(--blue-100)', marginBottom: '24px', textTransform: 'uppercase' }}>
            <span style={{ width: '6px', height: '6px', background: 'var(--blue-400)', borderRadius: '50%', display: 'inline-block' }} />
            Web Agency · Biratnagar
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 'clamp(38px, 4.5vw, 62px)', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '20px' }}>
            We build websites that{' '}
            <em style={{ fontStyle: 'normal', color: 'var(--blue-400)' }}>actually work</em>{' '}
            for you
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--gray-600)', maxWidth: '460px', marginBottom: '36px' }}>
            Weblyne crafts fast, modern, and conversion-focused web experiences for businesses ready to grow their digital presence.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary">Start a project</Link>
            <Link to="/pricing" className="btn-ghost">See pricing →</Link>
          </div>
        </div>

        {/* Browser mockup */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 24px 80px rgba(55,138,221,0.12), 0 4px 16px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--gray-100)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['#FF5F57','#FFBD2E','#28C840'].map((c,i) => <span key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, display: 'inline-block' }} />)}
              </div>
              <div style={{ background: 'white', borderRadius: '6px', padding: '5px 12px', flex: 1, fontSize: '11px', color: 'var(--gray-400)', border: '1px solid rgba(0,0,0,0.08)' }}>yourclient.com</div>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ height: '10px', background: 'var(--blue-800)', borderRadius: '4px', width: '60%', marginBottom: '10px' }} />
              {[['70%'],['45%'],['100%']].map(([w],i) => <div key={i} style={{ height: '8px', background: 'var(--gray-100)', borderRadius: '4px', width: w, marginBottom: '8px' }} />)}
              <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                <div style={{ height: '32px', width: '100px', background: 'var(--blue-800)', borderRadius: '6px' }} />
                <div style={{ height: '32px', width: '80px', background: 'var(--gray-100)', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '20px' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ width: '24px', height: '24px', background: 'var(--blue-100)', borderRadius: '6px', marginBottom: '8px' }} />
                    <div style={{ height: '6px', background: 'var(--gray-200)', borderRadius: '3px', marginBottom: '6px' }} />
                    <div style={{ height: '6px', background: 'var(--gray-200)', borderRadius: '3px', width: '60%' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '-16px', left: '-24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[['12+','Projects delivered'],['100%','Client satisfaction']].map(([n,l],i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '10px 16px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px', color: 'var(--gray-600)' }}>
                <strong style={{ display: 'block', fontSize: '18px', fontFamily: 'var(--font-head)', color: 'var(--blue-800)' }}>{n}</strong>{l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: '100px 6vw', background: 'var(--gray-50)' }}>
        <div className="section-label">What we do</div>
        <div className="section-title">Everything your business needs online</div>
        <p className="section-sub">From landing pages to full web apps — we handle design, development, and deployment end to end.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {services.map((s) => (
            <div key={s.title} style={{
              background: s.featured ? 'var(--blue-800)' : 'white',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.07)',
              padding: '32px 28px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 48px rgba(55,138,221,0.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.featured ? 'rgba(255,255,255,0.12)' : 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                {s.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '18px', fontWeight: 600, color: s.featured ? 'white' : 'var(--gray-900)', marginBottom: '10px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: s.featured ? 'rgba(255,255,255,0.7)' : 'var(--gray-600)', lineHeight: 1.7, marginBottom: '20px' }}>{s.desc}</p>
              <span style={{ background: s.featured ? 'rgba(255,255,255,0.15)' : 'var(--blue-50)', color: s.featured ? 'white' : 'var(--blue-600)', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '100px' }}>{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 6vw', background: 'var(--blue-800)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(24px, 2.5vw, 36px)', fontWeight: 700, color: 'white', letterSpacing: '-0.8px', maxWidth: '480px' }}>
          Ready to build something <span style={{ color: 'var(--blue-100)' }}>great together?</span>
        </h2>
        <Link to="/contact" style={{ background: 'white', color: 'var(--blue-800)', padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap', transition: 'transform 0.15s, opacity 0.15s', display: 'inline-block' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = '')}
        >Let's talk →</Link>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 6vw', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div className="nav-logo">Web<span>lyne</span></div>
        <p style={{ fontSize: '13px', color: 'var(--gray-400)' }}>© 2025 Weblyne. All rights reserved.</p>
      </footer>
    </>
  )
}
