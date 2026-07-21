// src/pages/auth/Register.tsx
// Registration — Membership ID + phone login, no OTP

import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { createMember } from '../../firebase/db';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { BOXING_PLANS, NISHA_PLANS, GYM_UPI } from '../../constants/plans';
import { buildUpiLink } from '../../utils/upiLink';
import type { MembershipPlan, GymType, Gender } from '../../types';
import NoDiscountBanner from '../../components/ui/NoDiscountBanner';
import { getMemberByPhone } from '../../firebase/db';
function isSunday(): boolean { return new Date().getDay() === 0; }

const GOVT_ID_TYPES = ['Aadhaar Card', 'Voter ID', 'Passport', 'Driving Licence', 'PAN Card'];
type Step = 'select-plan' | 'personal-details' | 'payment' | 'id-confirmation' | 'success';
export default function Register() {
  const location       = useLocation();
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  const gymFromState = (location.state as { gym?: GymType })?.gym;
  const gymFromParam = searchParams.get('gym') as GymType | null;
  const gym: GymType = gymFromState || gymFromParam || 'boxing';
  const plans        = gym === 'boxing' ? BOXING_PLANS : NISHA_PLANS;
  const isBoxing     = gym === 'boxing';
  const accent       = isBoxing ? 'bg-boxing-red'   : 'bg-nisha-rose';
  const accentText   = isBoxing ? 'text-boxing-red' : 'text-nisha-rose';
  const bg           = isBoxing ? 'bg-boxing-dark'  : 'bg-nisha-dark';

  if (isSunday()) {
    return (
      <div className={`min-h-screen ${bg} text-white flex items-center justify-center font-body`}>
        <div className="text-center px-6 max-w-sm">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="font-boxing font-black uppercase text-3xl mb-3">Closed Today</h2>
          <p className="text-white/60 mb-6">We are closed every Sunday. Come back Monday!</p>
          <button onClick={() => navigate(isBoxing ? '/boxing' : '/nisha')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold uppercase tracking-widest rounded transition-all">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const preselectedPlan = (location.state as { plan?: MembershipPlan })?.plan ?? null;
  return <RegistrationFlow
    gym={gym} plans={plans} isBoxing={isBoxing}
    accent={accent} accentText={accentText} bg={bg}
    navigate={navigate} preselectedPlan={preselectedPlan}
  />;
}

function RegistrationFlow({ gym, plans, isBoxing, accent, accentText, bg, navigate, preselectedPlan }: {
  gym: GymType; plans: MembershipPlan[]; isBoxing: boolean;
  accent: string; accentText: string; bg: string;
  navigate: ReturnType<typeof useNavigate>;
  preselectedPlan: MembershipPlan | null;
}) {
  const [step,          setStep]          = useState<Step>(preselectedPlan ? 'personal-details' : 'select-plan');
  const [selectedPlan,  setSelectedPlan]  = useState<MembershipPlan | null>(preselectedPlan);
  const [name,          setName]          = useState('');
  const [age,           setAge]           = useState('');
  const [gender,        setGender]        = useState<Gender | ''>('');
  const [phone,         setPhone]         = useState('');
  const [govtIdType,    setGovtIdType]    = useState('');
  const [govtIdNumber,  setGovtIdNumber]  = useState('');
  const [medicalCert,   setMedicalCert]   = useState(false);
  const [photoConsent,  setPhotoConsent]  = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');
  const [createdMember, setCreatedMember] = useState<{ membershipId: string; name: string; expiryDate: string; phone: string } | null>(null);

  const progressMap: Record<Step, number> = {
'select-plan': 25, 'personal-details': 50, 'payment': 75, 'id-confirmation': 90, 'success': 100,  };

  // Gender options — Nisha is female only
  const genderOptions = gym === 'nisha'
    ? [{ value: 'female', label: 'Female' }, { value: 'prefer-not-to-say', label: 'Prefer not to say' }]
    : [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }, { value: 'prefer-not-to-say', label: 'Prefer not to say' }];

  function maskId(id: string): string {
    if (id.length <= 4) return id;
    return '*'.repeat(id.length - 4) + id.slice(-4);
  }

  async function handleSubmitDetails() {
    setError('');
    if (!name.trim())                      return setError('Please enter your full name');
    if (!age || parseInt(age) < 7)         return setError('Minimum age is 7 years');
    if (parseInt(age) > 80)                return setError('Please enter a valid age');
    if (!gender)                           return setError('Please select your gender');
    if (!phone.match(/^[0-9]{10}$/))       return setError('Enter a valid 10-digit phone number');
    if (!govtIdType)                       return setError('Please select a government ID type');
    if (!govtIdNumber.trim())              return setError('Please enter your government ID number');
    if (!medicalCert)                      return setError('Medical fitness certificate confirmation is required');
    if (!photoConsent)                     return setError('Please accept the photo consent to continue');

    setLoading(true);
    try {
      // Sign out any existing session so new registration works cleanly
      try { await signOut(auth); } catch {}

      // ── Duplicate check — phone already registered? ──────────
      const existingMember = await getMemberByPhone('+91' + phone);
      if (existingMember) {
        setError(
          `This phone number is already registered as member ${existingMember.membershipId} at ${
            existingMember.gym === 'boxing' ? 'Fitness First Boxing Club' : 'Nisha Fitness'
          }. Please login instead.`
        );
        setLoading(false);
        return;
      }
      const joinDate   = new Date();
      const expiryDate = new Date(joinDate);
      expiryDate.setDate(expiryDate.getDate() + (selectedPlan?.durationDays || 30));

      const member = await createMember({
        gym,
        name:               name.trim(),
        emergencyContact: '',
        age:                parseInt(age),
        gender:             gender as Gender,
        phone:              '+91' + phone,
        govtIdType,
        govtIdNumber:       maskId(govtIdNumber),
        medicalCertificate: medicalCert,
        photoConsent,
        planId:             selectedPlan!.id,
        planName:           selectedPlan!.name,
        joinDate:           joinDate.toISOString(),
        expiryDate:         expiryDate.toISOString(),
        paymentStatus:      'pending',
        paymentAmount:      selectedPlan!.price,
        whatsappJoined:     false,
      });


      setCreatedMember({ membershipId: member.membershipId, name: member.name, expiryDate: member.expiryDate, phone });
      setStep('payment');
    } catch (err: unknown) {
  console.error('REGISTRATION ERROR:', err);
  const msg = err instanceof Error ? err.message : '';
      if (msg.includes('email-already-in-use')) {
        setError('This phone number is already registered. Please login instead.');
} else if (msg.includes('phone-already-in-use')) {
  setError('This phone number is already registered. Please go to the login page and login with your Membership ID and phone number.');
} else {
  setError('Registration failed. Please try again. If the problem persists, contact the gym.');
}
    } finally { setLoading(false); }
  }

  const inputCls  = `w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40`;
  const labelCls  = `text-xs text-white/40 uppercase tracking-widest block mb-1`;
  const btnActive = `${accent} text-white`;
  const btnInactive = `bg-white/5 border border-white/20 text-white/60 hover:border-white/40 hover:text-white`;

  return (
    <div className={`min-h-screen ${bg} text-white font-body`}>
      {/* Header */}
      <div className={`${accent} py-4 px-6 flex items-center gap-4`}>
        <button onClick={() => navigate(isBoxing ? '/boxing' : '/nisha')}
          className="text-white/70 hover:text-white text-sm">← Back</button>
        <h1 className="font-boxing font-bold uppercase tracking-wider text-lg">
          {isBoxing ? 'Fitness First Boxing Club' : 'Nisha Fitness'} — Register
        </h1>
      </div>

      {/* Progress */}
      <div className="w-full bg-white/10 h-1">
        <div className={`h-1 ${accent} transition-all duration-500`} style={{ width: `${progressMap[step]}%` }} />
      </div>

      {step === 'select-plan' && (
        <div className="text-center py-3 bg-white/5 border-b border-white/10">
          <span className="text-white/40 text-sm">Already a member? </span>
          <button onClick={() => navigate('/member/login')}
            className={`text-sm font-semibold ${accentText} hover:underline`}>
            Login here →
          </button>
        </div>
      )}

      <div className="max-w-xl mx-auto px-6 py-10">

        {/* ── STEP 1: SELECT PLAN ── */}
        {step === 'select-plan' && (
          <div>
            <h2 className="font-boxing font-bold uppercase text-3xl mb-2">Choose Your Plan</h2>
            <NoDiscountBanner gym={gym} compact />
            <div className="mt-6 flex flex-col gap-3">
              {plans.map(plan => (
                <div key={plan.id}
                  onClick={() => { setSelectedPlan(plan); setStep('personal-details'); }}
                  className="flex items-center justify-between p-4 border border-white/10 hover:border-white/30 bg-white/5 rounded cursor-pointer transition-all hover:scale-[1.01]">
                  <div>
                    <p className={`text-xs uppercase tracking-widest mb-1 ${plan.isPersonalTraining ? 'text-yellow-500' : accentText}`}>
                      {plan.isPersonalTraining ? '⭐ Personal Training' :
                        plan.duration === 'monthly' ? '1 Month' :
                        plan.duration === '3month'  ? '3 Months' :
                        plan.duration === '6month'  ? '6 Months' : '1 Year'}
                    </p>
                    <p className="font-boxing font-bold text-xl uppercase text-white">{plan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-boxing font-black text-3xl text-white">₹{plan.price.toLocaleString('en-IN')}</p>
                    {plan.highlight && <span className={`text-xs px-2 py-0.5 ${accent} font-bold uppercase`}>Popular</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: PERSONAL DETAILS ── */}
        {step === 'personal-details' && (
          <div>
            <p className={`text-xs uppercase tracking-widest mb-1 ${accentText}`}>
              Plan: {selectedPlan?.name} — ₹{selectedPlan?.price.toLocaleString('en-IN')}
            </p>
            <h2 className="font-boxing font-bold uppercase text-3xl mb-5">Your Details</h2>
            <NoDiscountBanner gym={gym} compact />

            <div className="mt-6 flex flex-col gap-4">

              {/* Name */}
              <div>
                <label className={labelCls}>Full Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name" className={inputCls} />
              </div>

              {/* Age */}
              <div>
                <label className={labelCls}>Age * (minimum 7 years)</label>
                <input type="number" value={age} min={7} max={80}
                  onChange={e => setAge(e.target.value)} placeholder="Your age" className={inputCls} />
              </div>

              {/* Gender — button style, no native dropdown */}
              <div>
                <label className={labelCls}>Gender *</label>
                <div className={`grid gap-2 ${genderOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                  {genderOptions.map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setGender(opt.value as Gender)}
                      className={`py-3 px-4 rounded border text-sm font-semibold transition-all ${
                        gender === opt.value ? btnActive : btnInactive
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={labelCls}>Phone Number * (parent's or your own)</label>
                <div className="flex">
                  <span className="bg-white/10 border border-r-0 border-white/20 px-3 py-3 text-white/50 rounded-l text-sm">+91</span>
                  <input type="tel" value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit number"
                    className="flex-1 bg-white/5 border border-white/20 rounded-r px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40" />
                </div>
                <p className="text-white/30 text-xs mt-1">This will be your login password — remember it</p>
              </div>

              {/* Govt ID type — button style, no native dropdown */}
              <div>
                <label className={labelCls}>Government ID Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  {GOVT_ID_TYPES.map(type => (
                    <button key={type} type="button"
                      onClick={() => setGovtIdType(type)}
                      className={`py-2.5 px-3 rounded border text-xs font-semibold transition-all text-left ${
                        govtIdType === type ? btnActive : btnInactive
                      }`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Govt ID number */}
              <div>
                <label className={labelCls}>Government ID Number *</label>
                <input type="text" value={govtIdNumber}
                  onChange={e => setGovtIdNumber(e.target.value.toUpperCase())}
                  placeholder="Enter ID number" className={inputCls} />
                <p className="text-white/30 text-xs mt-1">Only last 4 digits stored for privacy</p>
              </div>

              {/* Medical cert */}
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-white/10 rounded bg-white/5">
                <input type="checkbox" checked={medicalCert} onChange={e => setMedicalCert(e.target.checked)} className="mt-0.5" />
                <span className="text-xs text-white/60 leading-relaxed">
                  <span className="text-white font-semibold">Medical Fitness Certificate *</span><br />
                  I confirm I have a medical fitness certificate and am fit to train. I will submit it on my first visit.
                </span>
              </label>

              {/* Photo consent */}
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-white/10 rounded bg-white/5">
                <input type="checkbox" checked={photoConsent} onChange={e => setPhotoConsent(e.target.checked)} className="mt-0.5" />
                <span className="text-xs text-white/60 leading-relaxed">
                  I agree that photos and videos taken at the gym may be used on social media and promotional material.
                </span>
              </label>

              {error && <p className="text-red-400 text-sm bg-red-950/40 px-3 py-2 rounded">{error}</p>}

              <button onClick={handleSubmitDetails} disabled={loading}
                className={`w-full py-4 ${accent} font-boxing font-bold uppercase tracking-widest text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50`}>
                {loading ? 'Saving...' : 'Continue to Payment →'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: PAYMENT ── */}
        {step === 'payment' && selectedPlan && createdMember && (
          <div>
            <h2 className="font-boxing font-bold uppercase text-3xl mb-2">Complete Payment</h2>

            {/* Credentials */}
            <div className="border border-green-500/30 rounded p-4 mb-4 bg-green-950/20">
              <p className="text-green-400 text-xs uppercase tracking-widest font-bold mb-2">🔑 Your Login Details — Save Now</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Membership ID</span>
                  <span className={`font-mono font-bold ${accentText}`}>{createdMember.membershipId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Password</span>
                  <span className="text-white font-mono">+91{createdMember.phone}</span>
                </div>
              </div>
              <p className="text-yellow-400 text-xs mt-2 font-bold">
                ⚠️ Screenshot this screen. You cannot login without your Membership ID.
              </p>
            </div>

            <NoDiscountBanner gym={gym} compact />

            {/* Amount */}
            <div className="my-5 text-center border border-white/10 rounded p-5 bg-white/5">
              <p className="text-white/40 text-sm mb-1">Amount to Pay</p>
              <p className="font-boxing font-black text-5xl text-white">₹{selectedPlan.price.toLocaleString('en-IN')}</p>
              <p className="text-white/30 text-xs mt-1">{selectedPlan.name} — {selectedPlan.durationDays} days</p>
            </div>

            {/* UPI QR */}
            <div className="text-center mb-5">
              <div className="inline-block border-4 border-white p-2 bg-white rounded">
                <img src={GYM_UPI[gym].qrPath}
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/180x180/FFFFFF/000000?text=UPI+QR+CODE'; }}
                  alt="UPI QR Code" className="w-44 h-44 object-contain" />
              </div>
              <p className="text-white/50 text-xs mt-2">Scan with GPay · PhonePe · Paytm · Any UPI</p>
              {!GYM_UPI[gym].upiId.startsWith('TODO') && (
                <p className="text-white font-semibold mt-1 text-sm">{GYM_UPI[gym].upiId}</p>
              )}
            </div>
            {!GYM_UPI[gym].upiId.startsWith('TODO') && (
  <a href={buildUpiLink({
    upiId:     GYM_UPI[gym].upiId,
    payeeName: isBoxing ? 'Fitness First Boxing Club' : 'Nisha Fitness',
    amount:    selectedPlan.price,
    note:      `${createdMember.membershipId} - ${selectedPlan.name}`,
  })}
    className="flex items-center justify-center gap-2 w-full py-3 mb-5 border border-white/20 hover:border-white/40 text-white text-sm font-semibold rounded transition-all">
    📱 Pay via UPI App
  </a>
)}

            <p className="text-white/30 text-xs text-center mb-5">
              After paying, show the payment screenshot to gym staff. They will activate your membership.
            </p>

<button onClick={() => setStep('id-confirmation')}
  className={`w-full py-4 ${accent} font-boxing font-bold uppercase tracking-widest text-sm hover:opacity-90 active:scale-95 transition-all`}>
  I've Completed Payment →
</button>
          </div>
        )}

        {/* ── STEP 3.5: MEMBERSHIP ID CONFIRMATION ── */}
        {step === 'id-confirmation' && createdMember && (
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="font-boxing font-black uppercase text-3xl mb-3 text-yellow-400">
              Important — Read This
            </h2>
            <p className="text-white/60 mb-6 leading-relaxed">
              Your <span className="font-bold text-white">Membership ID</span> is the ONLY way to log in later.
              There is no OTP, no email recovery — if you lose this ID, you{' '}
              <span className="font-bold text-yellow-400">cannot access your account</span>.
            </p>

            <div className="border-2 border-yellow-400 rounded-lg p-6 mb-6 bg-yellow-950/30">
              <p className="text-yellow-400 text-xs uppercase tracking-widest font-bold mb-2">Your Membership ID</p>
              <p className={`font-boxing font-black text-4xl ${accentText} tracking-wider`}>{createdMember.membershipId}</p>
              <div className="mt-4 pt-4 border-t border-yellow-400/20 flex justify-between items-center">
                <span className="text-white/40 text-xs uppercase tracking-widest">Login Password</span>
                <span className="text-white font-mono font-semibold">+91{createdMember.phone}</span>
              </div>
            </div>

            <div className="text-left bg-white/5 border border-white/10 rounded p-4 mb-6 space-y-2">
              <p className="text-white/70 text-sm font-semibold">📸 Before continuing, make sure you:</p>
              <div className="flex items-start gap-2 text-white/50 text-sm">
                <span className="text-green-400 mt-0.5">✓</span>
                Take a screenshot of this screen
              </div>
              <div className="flex items-start gap-2 text-white/50 text-sm">
                <span className="text-green-400 mt-0.5">✓</span>
                Or write down your Membership ID somewhere safe
              </div>
              <div className="flex items-start gap-2 text-white/50 text-sm">
                <span className="text-green-400 mt-0.5">✓</span>
                Remember the phone number you registered with — it's your password
              </div>
            </div>

            <button onClick={() => setStep('success')}
              className={`w-full py-4 ${accent} font-boxing font-bold uppercase tracking-widest text-sm hover:opacity-90 active:scale-95 transition-all`}>
              I've Saved My Membership ID — Continue →
            </button>
          </div>
        )}

        {/* ── STEP 4: SUCCESS ── */}
        {step === 'success' && createdMember && (
          <div className="text-center">
            <div className="text-5xl mb-4">{isBoxing ? '🥊' : '💪'}</div>
            <h2 className="font-boxing font-bold uppercase text-3xl mb-2">Welcome!</h2>
            <p className="text-white/50 mb-6">
              {isBoxing ? 'Fitness First Boxing Club' : 'Nisha Fitness'} is excited to have you.
            </p>

            <div className="border border-green-500/40 rounded p-5 mb-5 bg-green-950/20 text-left">
              <p className="text-green-400 text-xs uppercase tracking-widest font-bold mb-3">🔑 Save Your Login Details</p>
              <div className="space-y-2">
                {[
                  { label: 'Membership ID',     value: createdMember.membershipId },
                  { label: 'Phone (password)',   value: `+91${createdMember.phone}` },
                  { label: 'Plan',               value: selectedPlan?.name ?? '' },
                  { label: 'Valid Until',         value: new Date(createdMember.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0">
                    <span className="text-white/40 text-xs uppercase tracking-widest">{r.label}</span>
                    <span className={`font-semibold text-sm ${r.label === 'Membership ID' ? `font-mono ${accentText}` : 'text-white'}`}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 border border-yellow-500/40 rounded p-2 bg-yellow-950/20">
                <p className="text-yellow-400 text-xs font-bold text-center">
                  ⚠️ SAVE YOUR ID: {createdMember.membershipId}
                </p>
              </div>
            </div>

            <a href={isBoxing ? import.meta.env.VITE_BOXING_WHATSAPP_GROUP : import.meta.env.VITE_NISHA_WHATSAPP_GROUP}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-sm uppercase tracking-widest rounded transition-all mb-3">
              Join WhatsApp Group
            </a>
            <button onClick={() => navigate('/member/dashboard')}
              className={`w-full py-3 border ${isBoxing ? 'border-boxing-red text-boxing-red hover:bg-boxing-red' : 'border-nisha-rose text-nisha-rose hover:bg-nisha-rose'} font-bold text-sm uppercase tracking-widest hover:text-white transition-all rounded mb-4`}>
              Go to My Dashboard →
            </button>
            <p className="text-white/20 text-xs">Show payment screenshot to gym staff to activate membership.</p>
          </div>
        )}

      </div>
    </div>
  );
}