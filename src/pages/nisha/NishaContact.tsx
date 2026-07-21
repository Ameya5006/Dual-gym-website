// src/pages/nisha/NishaContact.tsx

import { useState } from 'react';
import { GYM_CONTACT } from '../../constants/plans';
import { saveTrialRequest } from '../../firebase/db';
import TimingsTable from '../../components/ui/TimingsTable';

export default function NishaContact() {
  const contact = GYM_CONTACT.nisha;
  const [trialName,  setTrialName]  = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialTime,  setTrialTime]  = useState('');
  const [trialSent,  setTrialSent]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  async function handleTrialSubmit() {
    if (!trialName.trim())                return setError('Please enter your name');
    if (!trialPhone.match(/^[0-9]{10}$/)) return setError('Enter a valid 10-digit number');
    if (!trialTime)                       return setError('Please select a preferred time');
    setLoading(true); setError('');
    try {
      await saveTrialRequest({ gym: 'nisha', name: trialName.trim(), phone: '+91' + trialPhone, preferredTime: trialTime });
      setTrialSent(true);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }

  const inputCls = 'w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-nisha-rose';

  return (
    <div className="bg-nisha-dark min-h-screen text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-nisha-rose text-xs uppercase tracking-[0.3em] font-semibold mb-3 font-body">Contact</p>
        <h1 className="font-nisha text-5xl text-white mb-12">Find Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1 font-body">Address</p>
                <p className="text-white/70 font-body">{contact.address}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1 font-body">Phone</p>
                <a href={`tel:${contact.phone}`} className="text-white/70 hover:text-nisha-rose transition-colors font-body">{contact.phone}</a>
              </div>
              <a href={`https://wa.me/${contact.whatsappNumber}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold rounded transition-all">
                WhatsApp Us
              </a>
            </div>

            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-body">Opening Hours</p>
              <TimingsTable gym="nisha" />
            </div>

            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-body">Location</p>
              {!contact.mapEmbedUrl || contact.mapEmbedUrl.startsWith('TODO') ? (
                <div className="w-full h-48 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                  <span className="text-white/30 text-sm font-body">Location map coming soon</span>
                </div>
              ) : (
                <iframe src={contact.mapEmbedUrl} width="100%" height="200"
                  className="rounded border border-white/10" loading="lazy" allowFullScreen title="Gym location" />
              )}
            </div>
          </div>

          {/* Right — trial form */}
          <div className="border border-nisha-rose/20 p-6 bg-white/5 rounded h-fit">
            <h2 className="font-nisha text-2xl text-white mb-1">Book a Visit</h2>
            <p className="text-white/40 text-sm mb-6 font-body">Come see Nisha Fitness for yourself. No commitment required.</p>

            {trialSent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-green-400 font-semibold mb-2">Request received!</p>
                <p className="text-white/50 text-sm font-body">We'll call you within 24 hours to confirm.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <input type="text" value={trialName} onChange={e => setTrialName(e.target.value)}
                  placeholder="Your full name" className={inputCls} />
                <div className="flex">
                  <span className="bg-white/10 border border-r-0 border-white/20 px-3 py-3 text-white/50 rounded-l text-sm">+91</span>
                  <input type="tel" value={trialPhone}
                    onChange={e => setTrialPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit number"
                    className="flex-1 bg-white/5 border border-white/20 rounded-r px-4 py-3 text-white placeholder-white/30 focus:outline-none" />
                </div>

                {/* Time selection — buttons, not dropdown */}
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-body">Preferred Time</p>
                  <div className="grid grid-cols-1 gap-2">
                    {['Morning (6 AM – 10 AM)', 'Afternoon (10 AM – 4 PM)', 'Evening (4 PM – 10 PM)'].map(t => (
                      <button key={t} type="button" onClick={() => setTrialTime(t)}
                        className={`py-2.5 px-4 rounded border text-sm font-semibold transition-all text-left ${
                          trialTime === t
                            ? 'bg-nisha-rose border-nisha-rose text-white'
                            : 'bg-white/5 border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button onClick={handleTrialSubmit} disabled={loading}
                  className="w-full py-3 bg-nisha-rose text-white font-semibold uppercase tracking-widest text-sm hover:bg-rose-700 active:scale-95 transition-all rounded disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Request a Visit →'}
                </button>
                <p className="text-white/20 text-xs text-center font-body">Sunday is closed. Please select Mon–Sat timing.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
