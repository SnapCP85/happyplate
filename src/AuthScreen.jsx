import { useState } from 'react';
import { supabase } from './lib/supabase';

const B    = '#FF6B35';
const BG   = '#FFB800';
const BL   = '#FFF4EE';
const DARK = '#1A1410';
const MID  = '#6B5E52';
const SOFT = '#A8998C';
const CREAM = '#FEFCF7';

const CSS_AUTH = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes logoSpring {
    0%   { transform: scale(0.3) rotate(-12deg); opacity: 0; }
    55%  { transform: scale(1.1) rotate(3deg); opacity: 1; }
    75%  { transform: scale(0.95) rotate(-1deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-8px); }
    40%     { transform: translateX(8px); }
    60%     { transform: translateX(-5px); }
    80%     { transform: translateX(5px); }
  }
  .auth-btn { cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; transition: transform 0.12s ease, opacity 0.12s; }
  .auth-btn:active { transform: scale(0.96); }
  .auth-input:focus { border-color: ${B} !important; box-shadow: 0 0 0 3px ${B}22 !important; }
`;

function Logo() {
  return (
    <svg width="83" height="68" viewBox="0 0 68 56" fill="none">
      <defs>
        <radialGradient id="apg" cx="32%" cy="26%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#EDE5DA"/>
        </radialGradient>
        <linearGradient id="arg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={B}/>
          <stop offset="100%" stopColor={BG}/>
        </linearGradient>
        <filter id="aps">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.14)"/>
        </filter>
      </defs>
      <g transform="translate(4,13) rotate(-14,6,22)" opacity="0.9">
        <rect x="4" y="18" width="3.5" height="18" rx="1.75" fill={B}/>
        <rect x="4" y="6"  width="3.5" height="14" rx="1.75" fill={B}/>
        <rect x="2"   y="4" width="2" height="10" rx="1" fill={B}/>
        <rect x="4.5" y="4" width="2" height="10" rx="1" fill={B}/>
        <rect x="7"   y="4" width="2" height="10" rx="1" fill={B}/>
      </g>
      <g transform="translate(49,13) rotate(14,6,22)" opacity="0.9">
        <rect x="4" y="20" width="3.5" height="18" rx="1.75" fill={BG}/>
        <ellipse cx="5.75" cy="12.5" rx="5.5" ry="7.5" fill={BG}/>
        <ellipse cx="5.75" cy="12.5" rx="3.5" ry="5.5" fill="#FFD54F" opacity="0.6"/>
      </g>
      <ellipse cx="32" cy="53" rx="20" ry="3" fill="rgba(0,0,0,0.1)"/>
      <circle cx="32" cy="28" r="25" fill="url(#apg)" filter="url(#aps)"/>
      <circle cx="32" cy="28" r="25" stroke="url(#arg)" strokeWidth="2.8"/>
      <circle cx="32" cy="28" r="20" stroke="#EDE0D0" strokeWidth="1.5" fill="none"/>
      <circle cx="32" cy="28" r="16" fill="white"/>
      <ellipse cx="17" cy="33" rx="7" ry="5.5" fill="#FCA5A5" opacity="0.65"/>
      <ellipse cx="47" cy="33" rx="7" ry="5.5" fill="#FCA5A5" opacity="0.65"/>
      <circle cx="14.5" cy="30.5" r="1.3" fill="#FBBF24" opacity="0.9"/>
      <circle cx="49.5" cy="30.5" r="1.3" fill="#FBBF24" opacity="0.9"/>
      <circle cx="24" cy="23" r="5.5" fill={B}/>
      <circle cx="40" cy="23" r="5.5" fill={B}/>
      <circle cx="25.8" cy="21" r="2.1" fill="white"/>
      <circle cx="41.8" cy="21" r="2.1" fill="white"/>
      <circle cx="23.2" cy="25" r="1" fill="white" opacity="0.7"/>
      <circle cx="39.2" cy="25" r="1" fill="white" opacity="0.7"/>
      <path d="M 19.5 17.5 Q 24 15 28.5 17.5" stroke={B} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M 35.5 17.5 Q 40 15 44.5 17.5" stroke={B} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M 18 30 Q 32 47 46 30" strokeWidth="4" stroke={B} fill={B} strokeLinecap="round"/>
      <path d="M 20.5 31 Q 32 44.5 43.5 31" fill="white"/>
      <path d="M 57 4 L 58.5 9 L 63.5 10.5 L 58.5 12 L 57 17 L 55.5 12 L 50.5 10.5 L 55.5 9 Z" fill={BG}/>
      <path d="M 7 3 L 8 5.8 L 11 7 L 8 8.2 L 7 11 L 6 8.2 L 3 7 L 6 5.8 Z" fill={B} opacity="0.55"/>
    </svg>
  );
}

const SHADOW = '0 1px 2px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.07), 0 8px 24px rgba(0,0,0,.03), inset 0 1px 0 rgba(255,255,255,.85)';

export default function AuthScreen() {
  const [mode, setMode]       = useState('login');   // 'login' | 'signup' | 'forgot'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [shake, setShake]     = useState(false);

  function triggerShake(msg) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!email.trim()) { triggerShake('Please enter your email.'); return; }

    setLoading(true);
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setSuccess('Check your email for a reset link!');
        setLoading(false);
        return;
      }

      if (!password) { triggerShake('Please enter your password.'); setLoading(false); return; }

      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      } else {
        if (password.length < 6) { triggerShake('Password must be at least 6 characters.'); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm, then log in.');
        setMode('login');
      }
    } catch (err) {
      triggerShake(err.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 16,
    border: '2px solid #EDE5DA', fontSize: 16,
    fontFamily: "'Baloo 2', sans-serif", outline: 'none',
    background: 'white', color: DARK,
    boxShadow: SHADOW, transition: 'border-color 0.18s, box-shadow 0.18s',
  };

  return (
    <div style={{
      maxWidth: 390, margin: '0 auto', height: '100dvh',
      display: 'flex', flexDirection: 'column',
      background: CREAM, fontFamily: "'Baloo 2', sans-serif",
      boxShadow: '0 0 120px rgba(0,0,0,0.2)', position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{CSS_AUTH}</style>

      {/* Warm background glow */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${BL} 0%, transparent 60%)`, pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ padding: '56px 32px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ animation: 'logoSpring 0.7s cubic-bezier(0.34,1.56,0.64,1)', display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <Logo />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: DARK, lineHeight: 1.1, animation: 'fadeUp 0.4s 0.15s ease both' }}>
          Happy<span style={{ color: B }}>Plate</span>
        </h1>
        <p style={{ color: MID, fontSize: 13, marginTop: 5, fontWeight: 600, animation: 'fadeUp 0.4s 0.22s ease both' }}>
          {mode === 'login'  ? 'Welcome back! 👋' :
           mode === 'signup' ? 'Create your family account 🎉' :
           'Reset your password 🔑'}
        </p>
      </div>

      {/* Form card */}
      <div style={{ flex: 1, padding: '0 24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <div style={{
          background: 'white', borderRadius: 28, padding: '28px 24px',
          boxShadow: SHADOW, animation: 'fadeUp 0.4s 0.28s ease both',
          ...(shake ? { animation: 'shake 0.4s ease' } : {}),
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: MID, display: 'block', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Email</label>
              <input
                className="auth-input"
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: MID, display: 'block', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
                <input
                  className="auth-input"
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={inputStyle}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#DC2626', fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#16A34A', fontWeight: 600 }}>
                ✅ {success}
              </div>
            )}

            {/* Submit button */}
            <button type="submit" disabled={loading} className="auth-btn"
              style={{ padding: '16px', borderRadius: 18, border: 'none', marginTop: 4, background: loading ? '#D6CFC4' : `linear-gradient(135deg,${B},${BG})`, color: 'white', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 6px 24px ${B}44` }}>
              {loading ? '…' :
               mode === 'login'  ? 'Log In →' :
               mode === 'signup' ? 'Create Account 🎉' :
               'Send Reset Link'}
            </button>
          </form>

          {/* Mode switchers */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            {mode === 'login' && (
              <>
                <button onClick={() => { setMode('signup'); setError(''); setSuccess(''); }} className="auth-btn"
                  style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 700, color: B, cursor: 'pointer' }}>
                  New here? Create a free account →
                </button>
                <button onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }} className="auth-btn"
                  style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: SOFT, cursor: 'pointer' }}>
                  Forgot password?
                </button>
              </>
            )}
            {mode === 'signup' && (
              <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="auth-btn"
                style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 700, color: B, cursor: 'pointer' }}>
                Already have an account? Log in →
              </button>
            )}
            {mode === 'forgot' && (
              <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="auth-btn"
                style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 700, color: B, cursor: 'pointer' }}>
                ← Back to login
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: SOFT, fontFamily: "'Baloo 2'", fontWeight: 600, marginTop: 20 }}>
          Your family's data is saved privately to your account.
        </p>
      </div>
    </div>
  );
}
