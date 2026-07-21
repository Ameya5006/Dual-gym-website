// src/pages/boxing/BoxingContact.tsx

import { useState } from 'react';
import { GYM_CONTACT } from '../../constants/plans';
import { saveTrialRequest } from '../../firebase/db';
import TimingsTable from '../../components/ui/TimingsTable';

export default function BoxingContact() {
  const contact = GYM_CONTACT.boxing;
  const [trialName,  setTrialName]  = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialTime,  setTrialTime]  = useState('');
  const [trialSent,  setTrialSent]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  async function handleTrialSubmit() {
    if (!trialName.trim())                   return setError('Please enter your name');
    if (!trialPhone.match(/^[0-9]{10}$/))    return setError('Enter a valid 10-digit number');
    if (!trialTime)                          return setError('Please select a preferred time');
    setLoading(true);
    setError('');
    try {
      await saveTrialRequest({
        gym: 'boxing',
        name: trialName.trim(),
        phone: '+91' + trialPhone,
        preferredTime: trialTime,
      });
      setTrialSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-boxing-dark min-h-screen text-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        <p className="text-boxing-red text-xs uppercase tracking-[0.3em] font-boxing font-semibold mb-3">
          Contact
        </p>
        <h1 className="font-boxing font-black uppercase text-5xl leading-none mb-12">
          Find Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── LEFT: Details + Timings ── */}
          <div className="space-y-8">

            {/* Basic info */}
            <div className="space-y-4">
              <div>
                <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Address</p>
                <p className="text-white/70">{contact.address}</p>
              </div>
              <div>
                <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Phone</p>
                <a href={`tel:${contact.phone}`} className="text-white/70 hover:text-white transition-colors">
                  {contact.phone}
                </a>
              </div>
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/${contact.whatsappNumber}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold rounded transition-all"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Timings table */}
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Opening Hours</p>
              <TimingsTable gym="boxing" />
            </div>

            {/* Map */}
            <div>
              <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Location</p>
              {contact.mapEmbedUrl.startsWith('TODO') ? (
                <div className="w-full h-48 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                  <span className="text-white/30 text-sm">TODO: Paste Google Maps embed URL in plans.ts</span>
                </div>
              ) : (
                <iframe
                  src={contact.mapEmbedUrl}
                  width="100%" height="200"
                  className="rounded border border-white/10"
                  loading="lazy"
                  allowFullScreen
                  title="Gym location"
                />
              )}
            </div>
          </div>

          {/* ── RIGHT: Free trial form ── */}
          <div className="border border-white/10 p-6 bg-white/5 h-fit">
            <h2 className="font-boxing font-bold uppercase text-xl mb-1">Book a Free Trial</h2>
            <p className="text-white/40 text-sm mb-6">
              Come see the gym for yourself. No commitment required.
            </p>

            {trialSent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-green-400 font-semibold mb-2">Request received!</p>
                <p className="text-white/50 text-sm">
                  We'll call you within 24 hours to confirm your free trial session.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text" value={trialName}
                  onChange={(e) => setTrialName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                />
                <div className="flex">
                  <span className="bg-white/10 border border-r-0 border-white/20 px-3 py-3 text-white/50 rounded-l text-sm">+91</span>
                  <input
                    type="tel" value={trialPhone}
                    onChange={(e) => setTrialPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit phone number"
                    className="flex-1 bg-white/5 border border-white/20 rounded-r px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                  />
                </div>
                <select
                  value={trialTime}
                  onChange={(e) => setTrialTime(e.target.value)}
                  className="w-full bg-boxing-dark border border-white/20 rounded px-4 py-3 text-white focus:outline-none"
                >
                  <option value="">Select preferred time</option>
                  <option>Morning batch (6:30 AM – 8:30 AM)</option>
                  <option>Evening batch (5 PM – 8 PM)</option>
                  <option>Saturday morning</option>
                </select>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  onClick={handleTrialSubmit}
                  disabled={loading}
                  className="w-full py-3 bg-boxing-red text-white font-boxing font-bold uppercase tracking-widest text-sm hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
                  style={{ clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
                >
                  {loading ? 'Submitting...' : 'Request Free Trial →'}
                </button>
                <p className="text-white/20 text-xs text-center">
                  Sunday is closed. Please select Mon–Sat timing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
