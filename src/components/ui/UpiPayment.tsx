// src/components/ui/UpiPayment.tsx
// SRP: Handles UPI payment flow
// Opens UPI app with pre-filled amount, captures transaction ID
// Member enters UTR/transaction ID as proof — stored in Firestore
// Admin verifies and approves

import { useState } from 'react';
import { SHARED_CONTACT } from '../../constants/plans';

interface UpiPaymentProps {
  amount: number;
  membershipId: string;
  memberName: string;
  gym: 'boxing' | 'nisha';
  onPaymentSubmitted: (transactionId: string) => void;
  accentClass: string;
}

export default function UpiPayment({
  amount, membershipId, memberName, gym, onPaymentSubmitted, accentClass
}: UpiPaymentProps) {
  const [txnId,    setTxnId]    = useState('');
  const [step,     setStep]     = useState<'scan' | 'confirm'>('scan');
  const [error,    setError]    = useState('');

  const gymName  = gym === 'boxing' ? 'FitnessFirstBoxing' : 'NishaFitness';
  const note     = encodeURIComponent(`${gymName}-${membershipId}`);
  const upiId    = SHARED_CONTACT.upiId.startsWith('TODO') ? 'yourupi@bank' : SHARED_CONTACT.upiId;

  // UPI deep link — opens GPay/PhonePe/Paytm with amount pre-filled
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent('Fitness First Gym')}&am=${amount}&cu=INR&tn=${note}`;

  // Individual app deep links
  const gpayLink   = `gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent('Fitness First Gym')}&am=${amount}&cu=INR&tn=${note}`;
  const phonepeLink= `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent('Fitness First Gym')}&am=${amount}&cu=INR&tn=${note}`;

  function handleSubmit() {
    setError('');
    const clean = txnId.trim().toUpperCase();
    if (clean.length < 6) return setError('Please enter a valid transaction ID (minimum 6 characters)');
    onPaymentSubmitted(clean);
  }

  return (
    <div className="space-y-4">
      {step === 'scan' && (
        <>
          {/* QR Code */}
          <div className="text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Scan QR Code</p>
            <div className="inline-block border-4 border-white p-2 bg-white rounded">
              <img
                src="/images/upi-qr.png"
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/180x180/FFFFFF/000000?text=UPI+QR+CODE'; }}
                alt="UPI QR Code"
                className="w-44 h-44 object-contain"
              />
            </div>
            <p className="text-white/50 text-xs mt-2">GPay · PhonePe · Paytm · Any UPI app</p>
            <p className="text-white font-semibold text-sm mt-1">{upiId}</p>
          </div>

          {/* Amount */}
          <div className="text-center border border-white/10 rounded p-4 bg-white/5">
            <p className="text-white/40 text-xs mb-1">Amount</p>
            <p className="font-boxing font-black text-4xl text-white">₹{amount.toLocaleString('en-IN')}</p>
          </div>

          {/* Quick pay buttons */}
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2 text-center">Or pay directly</p>
            <div className="grid grid-cols-3 gap-2">
              <a href={upiLink}
                className="py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded text-center transition-all">
                📱 UPI
              </a>
              <a href={gpayLink}
                className="py-2.5 bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 text-xs font-semibold rounded text-center transition-all">
                GPay
              </a>
              <a href={phonepeLink}
                className="py-2.5 bg-purple-900/40 hover:bg-purple-900/60 text-purple-300 text-xs font-semibold rounded text-center transition-all">
                PhonePe
              </a>
            </div>
          </div>

          <button onClick={() => setStep('confirm')}
            className={`w-full py-3 ${accentClass} text-white font-boxing font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-all`}>
            I've Paid — Enter Transaction ID →
          </button>
        </>
      )}

      {step === 'confirm' && (
        <>
          <div>
            <p className="text-white/70 text-sm mb-4">
              Enter the <span className="text-white font-semibold">UTR / Transaction ID</span> from your payment app. This is shown in the payment success screen of GPay, PhonePe, or Paytm.
            </p>

            <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">
              Transaction ID / UTR Number *
            </label>
            <input
              type="text"
              value={txnId}
              onChange={e => setTxnId(e.target.value)}
              placeholder="e.g. 123456789012 or T2506101234"
              className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 font-mono tracking-wider uppercase"
            />
            <p className="text-white/30 text-xs mt-1">
              Find this in your UPI app → Payment History → this transaction
            </p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button onClick={handleSubmit}
            className={`w-full py-4 ${accentClass} font-boxing font-bold uppercase tracking-widest text-sm hover:opacity-90 active:scale-95 transition-all`}>
            Submit Payment Proof →
          </button>

          <button onClick={() => setStep('scan')}
            className="w-full text-white/30 text-sm hover:text-white/50">
            ← Back to QR
          </button>
        </>
      )}
    </div>
  );
}
