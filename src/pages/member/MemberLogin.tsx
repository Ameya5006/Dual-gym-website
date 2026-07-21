// src/pages/member/MemberLogin.tsx
// Login with Membership ID + phone number
// No OTP, no SMS, no billing needed — 100% free

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { loginMember } from '../../firebase/auth';
import { getMember } from '../../firebase/db';

export default function MemberLogin() {
  const navigate = useNavigate();
  const [membershipId, setMembershipId] = useState('');
  const [phone,        setPhone]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  // Already logged in — go straight to dashboard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const member = await getMember(user.uid);
        if (member) navigate('/member/dashboard', { replace: true });
      }
    });
    return unsub;
  }, [navigate]);

  async function handleLogin() {
    setError('');
    const cleanId    = membershipId.trim().toUpperCase();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (!cleanId)                       return setError('Please enter your Membership ID');
    if (!cleanPhone.match(/^[0-9]{10}$/)) return setError('Enter your 10-digit phone number');

    setLoading(true);
    try {
      const uid    = await loginMember(cleanId, cleanPhone);
      const member = await getMember(uid);
      if (!member) {
        setError('No membership found. Please register first.');
        return;
      }
      navigate('/member/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
        setError('Incorrect Membership ID or phone number. Please check and try again.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-boxing-dark flex items-center justify-center font-body px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="font-boxing font-black uppercase text-white text-3xl leading-none">Member</div>
          <div className="text-boxing-red text-sm uppercase tracking-widest">Portal</div>
        </div>

        <div className="bg-boxing-gray/40 border border-white/10 rounded p-6">
          <h2 className="font-boxing font-bold uppercase text-xl text-white mb-1">Login</h2>
          <p className="text-white/40 text-sm mb-6">Use your Membership ID and phone number</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">
                Membership ID
              </label>
              <input
                type="text"
                value={membershipId}
                onChange={e => setMembershipId(e.target.value.toUpperCase())}
                placeholder="e.g. FFBC-202506-1234"
                className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 font-mono tracking-wider"
              />
            </div>

            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">
                Phone Number (10 digits)
              </label>
              <div className="flex">
                <span className="bg-white/10 border border-r-0 border-white/20 px-3 py-3 text-white/50 rounded-l text-sm">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Your registered number"
                  className="flex-1 bg-white/5 border border-white/20 rounded-r px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-950/40 px-3 py-2 rounded">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-boxing-red text-white font-boxing font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </div>

          {/* Help text */}
          <div className="mt-4 p-3 bg-white/5 rounded border border-white/10">
            <p className="text-white/40 text-xs leading-relaxed">
              Your Membership ID was shown when you registered (e.g. <span className="font-mono text-white/60">FFBC-202506-1234</span>). Your password is your 10-digit phone number.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
  <button
    onClick={() => navigate('/boxing')}
    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-xs font-semibold uppercase tracking-widest rounded transition-all"
  >
    ← Boxing Club
  </button>
  <button
    onClick={() => navigate('/nisha')}
    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-xs font-semibold uppercase tracking-widest rounded transition-all"
  >
    Nisha Fitness →
  </button>
</div>


        <p className="text-center mt-4 text-white/30 text-sm">
          New member?{' '}
          <button onClick={() => navigate('/register')} className="text-boxing-red hover:underline font-semibold">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
