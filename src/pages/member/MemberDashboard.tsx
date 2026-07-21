// src/pages/member/MemberDashboard.tsx
// Existing member portal — view membership, renew plan, payment history

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { getMember, submitRenewalRequest, daysUntilExpiry } from '../../firebase/db';
import { BOXING_PLANS, NISHA_PLANS, GYM_UPI } from '../../constants/plans';
import { buildUpiLink } from '../../utils/upiLink';
import type { Member, MembershipPlan } from '../../types';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [member,      setMember]      = useState<Member | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState<'overview' | 'renew' | 'history'>('overview');
  const [renewPlan,   setRenewPlan]   = useState<MembershipPlan | null>(null);
  const [renewStep,   setRenewStep]   = useState<'select' | 'payment' | 'submitted'>('select');
  const [submitting,  setSubmitting]  = useState(false);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // Give Firebase time to restore session before redirecting
      setTimeout(() => {
        if (!auth.currentUser) {
          navigate('/member/login', { replace: true });
        }
      }, 1000);
      return;
    }
    const m = await getMember(user.uid);
    if (!m) { navigate('/member/login', { replace: true }); return; }
    setMember(m);
    setLoading(false);
  });
  return unsub;
}, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-boxing-dark flex items-center justify-center font-body">
        <p className="text-white/40">Loading your dashboard...</p>
      </div>
    );
  }

  if (!member) return null;

  const isBoxing = member.gym === 'boxing';
  const accent   = isBoxing ? 'bg-boxing-red'    : 'bg-nisha-rose';
  const accentT  = isBoxing ? 'text-boxing-red'  : 'text-nisha-rose';
  const accentB  = isBoxing ? 'border-boxing-red': 'border-nisha-rose';
  const bg       = isBoxing ? 'bg-boxing-dark'   : 'bg-nisha-dark';
  const gymName  = isBoxing ? 'Fitness First Boxing Club' : 'Nisha Fitness';

  const days       = daysUntilExpiry(member);
  const isExpired  = days < 0;
  const isExpiring = !isExpired && days <= 7;
  const isPaid     = member.paymentStatus === 'paid';

  const plans = (isBoxing ? BOXING_PLANS : NISHA_PLANS).filter(p => !p.isPersonalTraining);

  async function handleSubmitRenewal() {
    if (!renewPlan || !member) return;
    setSubmitting(true);
    try {
      await submitRenewalRequest(member.uid, renewPlan.id, renewPlan.name, renewPlan.price);
      setRenewStep('submitted');
    } catch { /* non-blocking */ }
    finally { setSubmitting(false); }
  }

  return (
    <div className={`min-h-screen ${bg} text-white font-body`}>
      {/* Top bar */}
<div className={`${accent} px-4 py-0 flex items-center justify-between`} style={{ minHeight: '60px' }}>
  <div className="flex items-center gap-3">
    <div>
      <p className="text-white/60 text-xs uppercase tracking-widest leading-none mb-0.5">{gymName}</p>
      <p className="font-boxing font-bold uppercase text-base leading-none">{member.name}</p>
    </div>
  </div>

  <div className="flex items-center gap-2">
    {/* Membership ID pill */}
    <div className="hidden sm:flex items-center gap-1.5 bg-black/30 border border-white/20 rounded-full px-3 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      <span className="text-white/70 text-xs font-mono tracking-wider">{member.membershipId}</span>
    </div>

    {/* Gym Home button */}
    <button
      onClick={() => navigate(isBoxing ? '/boxing' : '/nisha')}
      className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/20 hover:border-white/40 transition-all backdrop-blur-sm"
    >
      <span>🏠</span>
      <span className="hidden sm:inline">Gym Home</span>
    </button>

    {/* Logout button */}
    <button
      onClick={() => { signOut(auth); navigate('/'); }}
      className="flex items-center gap-1.5 bg-black/20 hover:bg-black/40 text-white/70 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/10 hover:border-white/30 transition-all"
    >
      <span>↩</span>
      <span className="hidden sm:inline">Logout</span>
    </button>
  </div>
</div>
      
      

      {/* Status banner */}
      {!isPaid && (
        <div className="bg-orange-900/60 border-b border-orange-700 px-6 py-2 text-center">
          <p className="text-orange-300 text-sm font-semibold">⏳ Payment pending — show receipt to gym staff to activate</p>
        </div>
      )}
      {isExpired && isPaid && (
        <div className="bg-red-900/60 border-b border-red-700 px-6 py-2 text-center">
          <p className="text-red-300 text-sm font-semibold">❌ Membership expired — renew now to continue training</p>
        </div>
      )}
      {isExpiring && isPaid && (
        <div className="bg-amber-900/50 border-b border-amber-700 px-6 py-2 text-center">
          <p className="text-amber-300 text-sm font-semibold">⚠️ Membership expires in {days} day{days !== 1 ? 's' : ''} — renew soon</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-white/10 px-6 flex gap-0">
        {(['overview', 'renew', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all ${
              activeTab === tab
                ? `${isBoxing ? 'border-boxing-red text-white' : 'border-nisha-rose text-white'}`
                : 'border-transparent text-white/40 hover:text-white/60'
            }`}>
            {tab === 'overview' ? 'My Membership' : tab === 'renew' ? '🔄 Renew' : 'Payment History'}
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Membership card */}
            <div className={`relative border ${accentB} rounded overflow-hidden`}>
              <div className={`${accent} px-5 py-3 flex justify-between items-center`}>
                <span className="font-boxing font-bold uppercase text-sm">{gymName}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                  isExpired ? 'bg-red-900 text-red-200' :
                  !isPaid ? 'bg-orange-900 text-orange-200' :
                  isExpiring ? 'bg-amber-900 text-amber-200' :
                  'bg-green-900 text-green-200'
                }`}>
                  {isExpired ? 'Expired' : !isPaid ? 'Pending' : isExpiring ? 'Expiring Soon' : '✓ Active'}
                </span>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: 'Member Name',    value: member.name },
                  { label: 'Membership ID',  value: member.membershipId },
                  { label: 'Plan',           value: member.planName },
                  { label: 'Join Date',      value: new Date(member.joinDate).toLocaleDateString('en-IN') },
                  { label: 'Valid Until',    value: new Date(member.expiryDate).toLocaleDateString('en-IN') },
                  { label: 'Days Remaining', value: isExpired ? `Expired ${Math.abs(days)} days ago` : `${days} days left` },
                  { label: 'Payment',        value: member.paymentStatus.toUpperCase() },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-white/40 text-xs uppercase tracking-widest">{row.label}</span>
                    <span className={`text-sm font-semibold ${
                      row.label === 'Membership ID' ? `font-mono ${accentT}` :
                      row.label === 'Days Remaining' && isExpired ? 'text-red-400' :
                      row.label === 'Days Remaining' && isExpiring ? 'text-amber-400' :
                      row.label === 'Days Remaining' ? 'text-green-400' :
                      row.label === 'Payment' && !isPaid ? 'text-orange-400' : 'text-white'
                    }`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveTab('renew')}
                className={`py-3 ${accent} text-white font-bold text-xs uppercase tracking-widest rounded transition-all hover:opacity-90`}>
                🔄 Renew Membership
              </button>
              <a href={isBoxing ? import.meta.env.VITE_BOXING_WHATSAPP_GROUP : import.meta.env.VITE_NISHA_WHATSAPP_GROUP}
                target="_blank" rel="noopener noreferrer"
                className="py-3 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest rounded transition-all text-center">
                WhatsApp Group
              </a>
            </div>
          </div>
        )}

        {/* ── RENEW TAB ── */}
        {activeTab === 'renew' && (
          <div>
            {renewStep === 'submitted' ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">📨</div>
                <h3 className="font-boxing font-bold uppercase text-2xl mb-2">Renewal Request Sent!</h3>
                <p className="text-white/50 mb-4">
                  Your renewal request has been sent to the gym.<br />
                  Show payment screenshot to staff. They will activate your extended membership.
                </p>
                <button onClick={() => { setRenewStep('select'); setRenewPlan(null); setActiveTab('overview'); }}
                  className="text-white/40 text-sm hover:text-white/60 underline">
                  Back to dashboard
                </button>
              </div>
            ) : renewStep === 'payment' && renewPlan ? (
              <div>
                <button onClick={() => setRenewStep('select')} className="text-white/40 text-sm hover:text-white/60 mb-4">← Back</button>
                <h3 className="font-boxing font-bold uppercase text-2xl mb-5">Pay to Renew</h3>

                <div className="border border-white/10 rounded p-4 mb-4 bg-white/5 space-y-2">
                  {[
                    { label: 'Membership ID', value: member.membershipId },
                    { label: 'Plan',          value: renewPlan.name },
                    { label: 'Duration',      value: `${renewPlan.durationDays} days` },
                    { label: 'Amount',        value: `₹${renewPlan.price.toLocaleString('en-IN')}` },
                    { label: 'New Expiry',    value: (() => {
                        const base = new Date(member.expiryDate) > new Date() ? new Date(member.expiryDate) : new Date();
                        base.setDate(base.getDate() + renewPlan.durationDays);
                        return base.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                      })()
                    },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center text-sm">
                      <span className="text-white/40 text-xs uppercase tracking-widest">{r.label}</span>
                      <span className={`font-semibold ${r.label === 'Amount' ? `${accentT} text-lg font-boxing font-black` : 'text-white'}`}>{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* UPI QR */}
                <div className="text-center mb-5">
                  <div className="inline-block border-4 border-white p-2 bg-white rounded">
                    <img src="https://placehold.co/160x160/FFFFFF/000000?text=UPI+QR" alt="UPI QR" className="w-40 h-40" />
                  </div>
                  <p className="text-white/40 text-xs mt-2">Scan with GPay, PhonePe, Paytm</p>
                  <p className="text-white/60 text-sm mt-1 font-semibold">UPI ID: TODO@bank</p>
                </div>
                {!GYM_UPI[member.gym].upiId.startsWith('TODO') && (
  <a href={buildUpiLink({
    upiId:     GYM_UPI[member.gym].upiId,
    payeeName: isBoxing ? 'Fitness First Boxing Club' : 'Nisha Fitness',
    amount:    renewPlan.price,
    note:      `${member.membershipId} - ${renewPlan.name}`,
  })}
    className="flex items-center justify-center gap-2 w-full py-3 mb-5 border border-white/20 hover:border-white/40 text-white text-sm font-semibold rounded transition-all">
    📱 Pay via UPI App
  </a>
)}

                <button onClick={handleSubmitRenewal} disabled={submitting}
                  className={`w-full py-4 ${accent} font-boxing font-bold uppercase tracking-widest text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50`}>
                  {submitting ? 'Submitting...' : 'I\'ve Paid — Submit for Verification →'}
                </button>
                <p className="text-white/20 text-xs text-center mt-2">
                  Gym staff will verify and activate your renewal within same day.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-boxing font-bold uppercase text-2xl mb-2">Renew Membership</h3>
                <p className="text-white/40 text-sm mb-5">Choose a plan to continue your training</p>

                {(isExpired || isExpiring) && (
                  <div className={`mb-4 px-4 py-2 rounded text-sm font-semibold ${isExpired ? 'bg-red-950/60 text-red-300' : 'bg-amber-950/60 text-amber-300'}`}>
                    {isExpired ? '❌ Your membership has expired. Renew to regain access.' : `⚠️ Expiring in ${days} day${days !== 1 ? 's' : ''}. Renew now to avoid a break.`}
                  </div>
                )}

                <div className="space-y-3">
                  {plans.map(plan => (
                    <div key={plan.id}
                      onClick={() => setRenewPlan(plan)}
                      className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${
                        renewPlan?.id === plan.id
                          ? `${accentB} bg-white/10 scale-[1.01]`
                          : 'border-white/10 hover:border-white/30 bg-white/5'
                      }`}>
                      <div>
                        <p className={`text-xs uppercase tracking-widest mb-1 ${accentT}`}>
                          {plan.duration === 'monthly' ? '1 Month' : plan.duration === '3month' ? '3 Months' : plan.duration === '6month' ? '6 Months' : '1 Year'}
                        </p>
                        <p className="font-boxing font-bold text-lg uppercase">{plan.name}</p>
                        {plan.highlight && <p className={`text-xs ${accentT} font-semibold`}>★ Most Popular</p>}
                      </div>
                      <p className="font-boxing font-black text-3xl">₹{plan.price.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { if (renewPlan) setRenewStep('payment'); }}
                  disabled={!renewPlan}
                  className={`w-full mt-5 py-4 ${accent} font-boxing font-bold uppercase tracking-widest text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40`}>
                  Continue with {renewPlan ? renewPlan.name : 'selected plan'} →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── PAYMENT HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div>
            <h3 className="font-boxing font-bold uppercase text-xl mb-5">Payment History</h3>
            {member.paymentHistory.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-white/30">No confirmed payments yet.</p>
                <p className="text-white/20 text-sm mt-1">Your first payment will appear here after admin verification.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...member.paymentHistory].reverse().map(record => (
                  <div key={record.id} className="border border-white/10 rounded p-4 bg-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">{record.planName}</span>
                      <span className={`font-boxing font-black text-xl ${accentT}`}>₹{record.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Paid: {new Date(record.paidAt).toLocaleDateString('en-IN')}</span>
                      <span>Valid until: {new Date(record.newExpiryDate).toLocaleDateString('en-IN')}</span>
                    </div>
                    {record.note && <p className="text-white/30 text-xs">{record.note}</p>}
                    <div className="text-xs">
                      <span className="bg-green-900/60 text-green-300 px-2 py-0.5 rounded">✓ Verified by gym</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
