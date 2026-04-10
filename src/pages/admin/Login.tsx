import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Toast from '../../components/Toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' } | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/admin/dashboard')
    } catch {
      setToast({ message: 'Invalid credentials. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: '24px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="nav-logo" style={{ fontSize: '26px', justifyContent: 'center', display: 'flex' }}>Web<span>lyne</span></div>
          <p style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '8px' }}>Admin panel — sign in to continue</p>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.08)', padding: '36px', boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@weblyne.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin(e as any)} />
          </div>
          <button className="btn-primary" onClick={handleLogin} disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '14px' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
