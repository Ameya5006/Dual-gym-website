// src/pages/boxing/BoxingHome.tsx
// Hero section, stats bar, social proof, and calls to action

import { useNavigate } from 'react-router-dom';

// TODO: Replace with real photos — put them in /public/images/
const HERO_BG = '/images/boxing/hero.jpeg';
const COACH_PHOTO = '/images/boxing/coach-photo.jpeg';

// TODO: Replace with real numbers
const STATS = [
  { value: '11+', label: 'Years Training' },
  { value: '100+', label: 'Members Trained' },
  { value: '20+', label: 'State Champions' },
  { value: 'Army', label: 'Veteran Coach' },
];

export default function BoxingHome() {
  const navigate = useNavigate();

  return (
    <div className="bg-boxing-dark">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-boxing-dark via-transparent to-transparent" />

        {/* Decorative red vertical strip */}
        <div className="absolute left-8 top-1/4 bottom-1/4 w-0.5 bg-boxing-red opacity-60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Text content */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 border border-boxing-red/50 px-3 py-1 mb-6">
              <span className="w-2 h-2 bg-boxing-red rounded-full animate-pulse" />
              <span className="text-boxing-red text-xs uppercase tracking-[0.3em] font-boxing font-semibold">
                Retired Indian Army Officer
              </span>
            </div>

            <h1
              className="font-boxing font-black uppercase text-white leading-none text-shadow mb-4"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.02em' }}
            >
              Train Like
              <br />
              <span className="text-boxing-red">A Soldier</span>
            </h1>

            <p className="text-white/60 text-lg mb-8 max-w-lg leading-relaxed">
              No air conditioning. No gimmicks. Just authentic boxing and fitness training the way champions are made — through discipline, sweat, and real work.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/register', { state: { gym: 'boxing' } })}
                className="bg-boxing-red text-white font-boxing font-bold uppercase tracking-widest px-8 py-4 text-sm hover:bg-red-700 active:scale-95 transition-all"
                style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
              >
                Join The Club
              </button>
              <button
                onClick={() => navigate('/boxing/plans')}
                className="border border-white/30 text-white font-boxing font-bold uppercase tracking-widest px-8 py-4 text-sm hover:border-white/60 hover:bg-white/5 active:scale-95 transition-all"
              >
                View Plans
              </button>
            </div>
          </div>

          {/* Decorative stats panel - desktop only */}
          <div className="hidden lg:block w-72 bg-black/60 border border-white/10 backdrop-blur-sm p-6">
            <p className="text-boxing-red text-xs uppercase tracking-widest font-boxing font-semibold mb-4">By the numbers</p>
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                <span className="text-white/50 text-sm">{s.label}</span>
                <span className="font-boxing font-black text-white text-2xl">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
          <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ===== STATS BAR (mobile + desktop) ===== */}
      <div className="bg-boxing-red py-4">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-boxing font-black text-white text-3xl">{s.value}</p>
              <p className="text-white/70 text-xs uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== COACH SECTION ===== */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Photo */}
        <div className="relative">
          <div className="absolute -inset-3 border border-boxing-red/20" />
          <img
            src={COACH_PHOTO}
            alt="Coach"
            className="w-full max-w-sm mx-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>

        {/* Text */}
        <div>
          <p className="text-boxing-red text-xs uppercase tracking-[0.3em] font-boxing font-semibold mb-3">
            Meet Your Coach
          </p>
          <h2 className="font-boxing font-black uppercase text-white text-4xl md:text-5xl leading-none mb-4">
            The Man Behind the Gym {/* TODO: Add coach name */}
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            {/* TODO: Replace with actual coach bio */}
            A decorated veteran of the Indian Army, our head coach brings military discipline and professional boxing expertise to every training session. With over 15 years of experience training fighters at all levels, from beginners to state champions, his approach is direct, effective, and built on real results.
          </p>
          <p className="text-white/40 text-sm leading-relaxed mb-6">
            He doesn't just teach boxing — he teaches you how to carry yourself, how to push beyond what you think is possible, and how to earn every victory.
          </p>
          <button
            onClick={() => navigate('/boxing/about')}
            className="text-boxing-red border border-boxing-red/50 font-boxing font-bold uppercase tracking-widest px-6 py-3 text-sm hover:bg-boxing-red hover:text-white transition-all"
          >
            Full Story →
          </button>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="bg-boxing-gray/40 py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-6">Follow the journey</p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { platform: 'YouTube', count: '100K+', color: 'text-red-500', icon: '▶' },
              { platform: 'Facebook', count: '100K+', color: 'text-blue-400', icon: 'f' },
              { platform: 'Instagram', count: '~100K', color: 'text-pink-400', icon: '◉' },
            ].map((s) => (
              <div key={s.platform} className="text-center">
                <span className={`text-3xl font-boxing font-black ${s.color}`}>{s.count}</span>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
                  {s.icon} {s.platform} Followers
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-boxing font-black uppercase text-4xl text-white mb-4 leading-none">
            Ready to Begin?
          </h2>
          <p className="text-white/50 mb-8">
            Walk in any morning. No fancy gear required — just willingness to work hard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/register', { state: { gym: 'boxing' } })}
              className="bg-boxing-red text-white font-boxing font-bold uppercase tracking-widest px-10 py-4 text-sm hover:bg-red-700 active:scale-95 transition-all"
              style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
            >
              Join Now — View Plans
            </button>
            <a
              href={`https://wa.me/${import.meta.env.VITE_ADMIN_WHATSAPP_NUMBER}?text=Hi, I'd like to know more about Fitness First Boxing Club`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-green-600 text-green-400 font-bold uppercase tracking-widest px-8 py-4 text-sm hover:bg-green-600 hover:text-white transition-all"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
