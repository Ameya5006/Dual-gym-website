// src/pages/payment/PaymentPortal.tsx
// Payment portal for existing members — both gyms
// Detects gym from URL param (?gym=nisha) or member profile
// After payment, sends WhatsApp notification to uncle

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { loginMember } from '../../firebase/auth';
import { getMember, submitRenewalRequest } from '../../firebase/db';
import { BOXING_PLANS, NISHA_PLANS, GYM_UPI } from '../../constants/plans';
import { buildUpiLink } from '../../utils/upiLink';
import type { Member, MembershipPlan, GymType } from '../../types';

type Step = 'login' | 'select-plan' | 'pay' | 'done';

export default function PaymentPortal() {
  const navigate      = useNavigate();
  const [searchParams]= useSearchParams();

  // Detect gym from URL param — /pay?gym=nisha comes from Nisha navbar
  const gymParam = searchParams.get('gym') as GymType | null;

  const [step,         setStep]         = useState<Step>('login');
  const [membershipId, setMembershipId] = useState('');
  const [phone,        setPhone]        = useState('');
  const [member,       setMember]       = useState<Member | null>(null);
  const [plan,         setPlan]         = useState<MembershipPlan | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');

  // Already logged in — skip login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const m = await getMember(user.uid);
        if (m) { setMember(m); setStep('select-plan'); }
      }
    });
    return unsub;
  }, []);

  // Gym is from member profile (most reliable) or URL param
  const gym       = member?.gym ?? gymParam ?? 'boxing';
  const isBoxing  = gym === 'boxing';
  const accent    = isBoxing ? 'bg-boxing-red'   : 'bg-nisha-rose';
  const accentT   = isBoxing ? 'text-boxing-red' : 'text-nisha-rose';
  const gymName   = isBoxing ? 'Fitness First Boxing Club' : 'Nisha Fitness';
  const plans     = (isBoxing ? BOXING_PLANS : NISHA_PLANS).filter(p => !p.isPersonalTraining);

  const inputCls = 'w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40';

  async function handleLogin() {
    setError('');
    const cleanId    = membershipId.trim().toUpperCase();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanId)                         return setError('Enter your Membership ID');
    if (!cleanPhone.match(/^[0-9]{10}$/)) return setError('Enter your 10-digit phone number');
    setLoading(true);
    try {
      const uid = await loginMember(cleanId, cleanPhone);
      const m   = await getMember(uid);
      if (!m) { setError('No membership found. Please register first.'); return; }
      setMember(m);
      setStep('select-plan');
    } catch {
      setError('Incorrect Membership ID or phone number.');
    } finally { setLoading(false); }
  }

  async function handleSubmitPayment() {
    if (!member || !plan) return;
    setSubmitting(true);
    try {
      await submitRenewalRequest(member.uid, plan.id, plan.name, plan.price);
      setStep('done');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally { setSubmitting(false); }
  }

  function newExpiryPreview(): string {
    if (!member || !plan) return '';
    const base = new Date(member.expiryDate) > new Date()
      ? new Date(member.expiryDate) : new Date();
    base.setDate(base.getDate() + plan.durationDays);
    return base.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <div className="min-h-screen bg-boxing-dark text-white font-body">

      {/* Header */}
      <div className={`border-b border-white/10 px-6 py-4 flex items-center justify-between ${
        isBoxing ? 'bg-boxing-red/20' : 'bg-nisha-rose/20'
      }`}>
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest">{gymName}</p>
          <h1 className="font-boxing font-bold uppercase text-xl">Payment Portal</h1>
        </div>
        <div className="flex items-center gap-2">
          {member && (
            <button onClick={() => navigate(isBoxing ? '/boxing' : '/nisha')}
              className={`text-xs border px-3 py-1.5 rounded transition-all font-semibold ${
                isBoxing
                  ? 'border-boxing-red/50 text-boxing-red hover:bg-boxing-red hover:text-white'
                  : 'border-nisha-rose/50 text-nisha-rose hover:bg-nisha-rose hover:text-white'
              }`}>
              ← {isBoxing ? 'Boxing Club' : 'Nisha Fitness'}
            </button>
          )}
          <button onClick={() => navigate('/')}
            className="text-white/40 hover:text-white text-xs border border-white/10 px-3 py-1.5 rounded">
            Home
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-10">

        {/* ── LOGIN ── */}
        {step === 'login' && (
          <div>
            <h2 className="font-boxing font-bold uppercase text-2xl mb-2">Member Login</h2>
            <p className="text-white/50 text-sm mb-6">Enter your registered details to pay</p>

            {/* Gym hint from URL */}
            {gymParam && (
              <div className={`mb-4 px-4 py-2 rounded border text-xs font-semibold ${
                gymParam === 'nisha'
                  ? 'bg-nisha-rose/10 border-nisha-rose/30 text-nisha-rose'
                  : 'bg-boxing-red/10 border-boxing-red/30 text-boxing-red'
              }`}>
                Paying for: {gymParam === 'nisha' ? 'Nisha Fitness' : 'Fitness First Boxing Club'}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Membership ID</label>
                <input type="text" value={membershipId}
                  onChange={e => setMembershipId(e.target.value.toUpperCase())}
                  placeholder="e.g. FFBC-202506-1234 or NF-202506-1234"
                  className={`${inputCls} font-mono tracking-wider`} />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Phone Number</label>
                <div className="flex">
                  <span className="bg-white/10 border border-r-0 border-white/20 px-3 py-3 text-white/50 rounded-l text-sm">+91</span>
                  <input type="tel" value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="10-digit number"
                    className="flex-1 bg-white/5 border border-white/20 rounded-r px-4 py-3 text-white placeholder-white/30 focus:outline-none" />
                </div>
              </div>
              {error && <p className="text-red-400 text-sm bg-red-950/40 px-3 py-2 rounded">{error}</p>}
              <button onClick={handleLogin} disabled={loading}
                className="w-full py-4 bg-boxing-red text-white font-boxing font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-all disabled:opacity-50">
                {loading ? 'Logging in...' : 'Continue →'}
              </button>
            </div>
            <p className="text-center mt-5 text-white/30 text-sm">
              New member?{' '}
              <button
                onClick={() => navigate('/register', { state: { gym: gymParam ?? 'boxing' } })}
                className={`font-semibold hover:underline ${gymParam === 'nisha' ? 'text-nisha-rose' : 'text-boxing-red'}`}>
                Register here
              </button>
            </p>
          </div>
        )}

        {/* ── SELECT PLAN ── */}
        {step === 'select-plan' && member && (
          <div>
            {/* Member card */}
            <div className={`border ${isBoxing ? 'border-boxing-red/40' : 'border-nisha-rose/40'} rounded p-4 mb-6 bg-white/5`}>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{gymName}</p>
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-semibold">{member.name}</span>
                <span className={`font-mono text-sm font-bold ${accentT}`}>{member.membershipId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40 text-xs">Current expiry</span>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                  new Date(member.expiryDate) < new Date()
                    ? 'bg-red-900/60 text-red-300'
                    : 'bg-green-900/60 text-green-300'
                }`}>
                  {new Date(member.expiryDate).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            <h2 className="font-boxing font-bold uppercase text-2xl mb-2">Select Plan</h2>
            <div className={`mb-4 px-4 py-2 ${isBoxing ? 'bg-red-950/60 border-boxing-red/40 text-red-300' : 'bg-rose-950/60 border-nisha-rose/40 text-rose-300'} border rounded text-xs font-semibold`}>
              ⚠️ Prices are fixed. No discounts.
            </div>

            <div className="space-y-3">
              {plans.map(p => (
                <div key={p.id} onClick={() => setPlan(p)}
                  className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${
                    plan?.id === p.id
                      ? `${isBoxing ? 'border-boxing-red bg-boxing-red/10' : 'border-nisha-rose bg-nisha-rose/10'} scale-[1.01]`
                      : 'border-white/10 hover:border-white/30 bg-white/5'
                  }`}>
                  <div>
                    <p className={`text-xs uppercase tracking-widest mb-1 ${accentT}`}>
                      {p.duration === 'monthly' ? '1 Month' : p.duration === '3month' ? '3 Months' : p.duration === '6month' ? '6 Months' : '1 Year'}
                    </p>
                    <p className="font-boxing font-bold text-lg uppercase text-white">{p.name}</p>
                    {plan?.id === p.id && <p className="text-white/40 text-xs mt-1">New expiry: {newExpiryPreview()}</p>}
                  </div>
                  <p className="font-boxing font-black text-3xl text-white">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            <button onClick={() => { if (plan) setStep('pay'); }} disabled={!plan}
              className={`w-full mt-5 py-4 ${accent} font-boxing font-bold uppercase tracking-widest text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40`}>
              Continue →
            </button>
          </div>
        )}

        {/* ── PAY ── */}
        {step === 'pay' && member && plan && (
          <div>
            <button onClick={() => setStep('select-plan')} className="text-white/40 text-sm hover:text-white/60 mb-4">← Back</button>
            <h2 className="font-boxing font-bold uppercase text-2xl mb-5">Pay Now</h2>

            {/* Summary */}
            <div className="border border-white/10 rounded p-4 mb-5 bg-white/5 space-y-2">
              {[
                { label: 'Name',         value: member.name },
                { label: 'Membership ID',value: member.membershipId },
                { label: 'Gym',          value: gymName },
                { label: 'Plan',         value: plan.name },
                { label: 'New Expiry',   value: newExpiryPreview() },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-white/40 text-xs uppercase tracking-widest">{r.label}</span>
                  <span className={`font-semibold ${r.label === 'Membership ID' ? `font-mono ${accentT}` : 'text-white'}`}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Amount */}
            <div className="text-center border border-white/10 rounded p-5 mb-5 bg-white/5">
              <p className="text-white/40 text-sm mb-1">Amount to Pay</p>
              <p className="font-boxing font-black text-5xl text-white">₹{plan.price.toLocaleString('en-IN')}</p>
            </div>

            {/* QR */}
            <div className="text-center mb-5">
              <div className="inline-block border-4 border-white p-2 bg-white rounded">
                <img src={GYM_UPI[gym].qrPath}
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/180x180/FFFFFF/000000?text=UPI+QR'; }}
                  alt="UPI QR" className="w-44 h-44 object-contain" />
              </div>
              <p className="text-white/50 text-xs mt-2">GPay · PhonePe · Paytm · Any UPI</p>
              {!GYM_UPI[gym].upiId.startsWith('TODO') && (
                <p className="text-white font-semibold mt-1 text-sm">{GYM_UPI[gym].upiId}</p>
              )}
            </div>
            {!GYM_UPI[gym].upiId.startsWith('TODO') && (
  <a href={buildUpiLink({
    upiId:     GYM_UPI[gym].upiId,
    payeeName: gymName,
    amount:    plan.price,
    note:      `${member.membershipId} - ${plan.name}`,
  })}
    className="flex items-center justify-center gap-2 w-full py-3 mb-5 border border-white/20 hover:border-white/40 text-white text-sm font-semibold rounded transition-all">
    📱 Pay via UPI App
  </a>
)}

            <p className="text-white/30 text-xs text-center mb-5">
              After paying, tap below. Staff will verify and activate.
            </p>

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <button onClick={handleSubmitPayment} disabled={submitting}
              className={`w-full py-4 ${accent} font-boxing font-bold uppercase tracking-widest text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50`}>
              {submitting ? 'Submitting...' : "I've Paid — Notify Gym →"}
            </button>
          </div>
        )}

        {/* ── DONE ── */}
        {step === 'done' && member && plan && (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-boxing font-bold uppercase text-2xl mb-2">Payment Submitted!</h2>
            <p className="text-white/50 mb-6">
              The gym has been notified. Staff will verify and activate your membership.
            </p>

            {/* Summary */}
            <div className="border border-white/10 rounded p-4 mb-5 text-left space-y-2">
              {[
                { label: 'Name',         value: member.name },
                { label: 'Membership ID',value: member.membershipId },
                { label: 'Gym',          value: gymName },
                { label: 'Plan',         value: plan.name },
                { label: 'New Expiry',   value: newExpiryPreview() },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-white/40 text-xs uppercase tracking-widest">{r.label}</span>
                  <span className={`font-semibold ${r.label === 'Membership ID' ? `font-mono ${accentT}` : 'text-white'}`}>{r.value}</span>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/member/dashboard')}
              className={`w-full py-3 ${accent} text-white font-bold text-sm uppercase tracking-widest rounded transition-all hover:opacity-90 mb-3`}>
              Go to My Dashboard
            </button>
            <button onClick={() => navigate('/')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded transition-all">
              Back to Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
