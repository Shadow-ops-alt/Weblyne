import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, type Inquiry, type InquiryStatus } from '../../lib/supabase'
import Toast from '../../components/Toast'

const STATUS_LABELS: Record<InquiryStatus, string> = { new: 'New', read: 'Read', replied: 'Replied' }

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [filter, setFilter] = useState<InquiryStatus | 'all'>('all')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const navigate = useNavigate()

  const fetchInquiries = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setInquiries(data as Inquiry[])
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin/login')
      else fetchInquiries()
    })
  }, [navigate, fetchInquiries])

  const updateStatus = async (id: string, status: InquiryStatus) => {
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id)
    if (!error) {
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
      if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
      setToast({ message: `Marked as ${status}`, type: 'success' })
    }
  }

  const deleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return
    const { error } = await supabase.from('inquiries').delete().eq('id', id)
    if (!error) {
      setInquiries(prev => prev.filter(i => i.id !== id))
      if (selected?.id === id) setSelected(null)
      setToast({ message: 'Inquiry deleted', type: 'success' })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter)
  const counts = { all: inquiries.length, new: inquiries.filter(i => i.status === 'new').length, read: inquiries.filter(i => i.status === 'read').length, replied: inquiries.filter(i => i.status === 'replied').length }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', flexDirection: 'column' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Top bar */}
      <div style={{ background: 'white', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '0 32px', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="nav-logo">Web<span>lyne</span></div>
          <span style={{ fontSize: '13px', color: 'var(--gray-400)', borderLeft: '1px solid var(--gray-200)', paddingLeft: '12px' }}>Admin Panel</span>
        </div>
        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Sign out</button>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: 0, maxHeight: 'calc(100vh - 62px)', overflow: 'hidden' }}>
        {/* Main list */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Stats + filters */}
          <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(0,0,0,0.07)', background: 'white' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {[['all', 'All inquiries'], ['new', 'New'], ['read', 'Read'], ['replied', 'Replied']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val as any)} style={{
                  padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  background: filter === val ? 'var(--blue-800)' : 'var(--gray-50)',
                  color: filter === val ? 'white' : 'var(--gray-600)',
                  border: '1px solid', borderColor: filter === val ? 'var(--blue-800)' : 'var(--gray-200)',
                  cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                }}>
                  {label} <span style={{ opacity: 0.7, fontWeight: 400 }}>({counts[val as keyof typeof counts]})</span>
                </button>
              ))}
              <button onClick={fetchInquiries} style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: '8px', fontSize: '13px', background: 'none', border: '1px solid var(--gray-200)', color: 'var(--gray-500)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>↻ Refresh</button>
            </div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '20px', fontWeight: 700, color: 'var(--gray-900)' }}>
              {filter === 'all' ? 'All Inquiries' : STATUS_LABELS[filter as InquiryStatus]} ({filtered.length})
            </h2>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-400)' }}>Loading inquiries...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-400)' }}>No {filter !== 'all' ? filter : ''} inquiries yet.</div>
            ) : filtered.map(inq => (
              <div key={inq.id}
                onClick={() => { setSelected(inq); if (inq.status === 'new') updateStatus(inq.id, 'read') }}
                style={{
                  background: selected?.id === inq.id ? 'var(--blue-50)' : 'white',
                  border: '1px solid',
                  borderColor: selected?.id === inq.id ? 'var(--blue-200)' : 'rgba(0,0,0,0.07)',
                  borderRadius: '14px', padding: '18px 20px', marginBottom: '10px',
                  cursor: 'pointer', transition: 'all 0.15s',
                  borderLeft: inq.status === 'new' ? '3px solid var(--blue-400)' : '1px solid rgba(0,0,0,0.07)',
                }}
                onMouseEnter={e => { if (selected?.id !== inq.id) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--blue-200)' }}
                onMouseLeave={e => { if (selected?.id !== inq.id) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,0,0,0.07)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--gray-900)' }}>{inq.name}</span>
                    <span className={`badge badge-${inq.status}`}><span className="badge-dot" />{STATUS_LABELS[inq.status]}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{fmtDate(inq.created_at)}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '4px' }}>{inq.email} · {inq.service}</p>
                <p style={{ fontSize: '13px', color: 'var(--gray-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ borderLeft: '1px solid rgba(0,0,0,0.07)', background: 'white', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '17px', fontWeight: 700 }}>Inquiry Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--gray-400)', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '24px', flex: 1 }}>
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontSize: '18px', fontWeight: 700, color: 'var(--blue-800)', flexShrink: 0 }}>
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '16px', color: 'var(--gray-900)' }}>{selected.name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--blue-600)' }}>{selected.email}</p>
                </div>
              </div>

              {/* Details grid */}
              {[
                { label: 'Service', value: selected.service },
                { label: 'Budget', value: selected.budget },
                { label: 'Status', value: STATUS_LABELS[selected.status] },
                { label: 'Received', value: fmtDate(selected.created_at) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '14px' }}>
                  <span style={{ color: 'var(--gray-400)', fontWeight: 500 }}>{label}</span>
                  <span style={{ color: 'var(--gray-900)', fontWeight: 500 }}>{value}</span>
                </div>
              ))}

              {/* Message */}
              <div style={{ marginTop: '24px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Message</p>
                <p style={{ fontSize: '14px', color: 'var(--gray-700)', lineHeight: 1.8, background: 'var(--gray-50)', padding: '16px', borderRadius: '10px' }}>{selected.message}</p>
              </div>

              {/* Actions */}
              <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href={`mailto:${selected.email}?subject=Re: Your inquiry to Weblyne`}
                  onClick={() => updateStatus(selected.id, 'replied')}
                  className="btn-primary"
                  style={{ textAlign: 'center', justifyContent: 'center', display: 'flex' }}>
                  Reply via email →
                </a>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {(['new', 'read', 'replied'] as InquiryStatus[]).filter(s => s !== selected.status).map(s => (
                    <button key={s} className="btn-outline" onClick={() => updateStatus(selected.id, s)} style={{ fontSize: '13px', padding: '9px' }}>
                      Mark as {s}
                    </button>
                  ))}
                  <button onClick={() => deleteInquiry(selected.id)} style={{ background: 'none', border: '1.5px solid #FCA5A5', borderRadius: '10px', padding: '9px', fontSize: '13px', color: 'var(--red)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
