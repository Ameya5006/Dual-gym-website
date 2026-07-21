// src/pages/nisha/NishaHome.tsx

import { useNavigate } from 'react-router-dom';
import { SHARED_CONTACT } from '../../constants/plans';

const HERO_BG = '/images/Nisha/hero.jpeg';
// TODO: replace with actual hero photo once available

const STATS = [
  { value: '2026', label: 'Established' },
  { value: 'AC',   label: 'Air Conditioned' },
  { value: '10+',  label: 'Machines' },
  { value: '100%', label: 'Women Only' },
];

export default function NishaHome() {
  const navigate = useNavigate();

  return (
    <div className="bg-nisha-dark min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          onError={(e) => {
            (e.target as HTMLDivElement).style.background = 'linear-gradient(135deg, #1A0010 0%, #3D0020 100%)';
          }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-nisha-dark/95 via-nisha-dark/70 to-nisha-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-nisha-dark via-transparent to-transparent" />

        {/* Decorative rose vertical strip */}
        <div className="absolute left-8 top-1/4 bottom-1/4 w-0.5 bg-nisha-rose opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-nisha-rose/40 px-3 py-1 mb-6">
              <span className="w-2 h-2 bg-nisha-rose rounded-full animate-pulse" />
              <span className="text-nisha-rose text-xs uppercase tracking-[0.3em] font-semibold">
                Women Only · Roorkee
              </span>
            </div>

            <h1
              className="font-nisha font-semibold text-white leading-none text-shadow mb-2"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}
            >
              Nisha
            </h1>
            <h2
              className="font-nisha italic text-nisha-rose leading-none text-shadow mb-6"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 3.5rem)' }}
            >
              Fitness & Wellness
            </h2>

            <p className="text-white/60 text-lg mb-8 max-w-lg leading-relaxed font-body">
              A premium, air-conditioned gym designed exclusively for women.
              Modern equipment, music, and a safe space to transform yourself.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/register', { state: { gym: 'nisha' } })}
                className="bg-nisha-rose text-white font-body font-semibold uppercase tracking-widest px-8 py-4 text-sm hover:bg-rose-700 active:scale-95 transition-all rounded-sm"
              >
                Join Now
              </button>
              <button
                onClick={() => navigate('/member/login')}
                className="border border-white/30 text-white font-body font-semibold uppercase tracking-widest px-8 py-4 text-sm hover:border-nisha-rose hover:text-nisha-rose active:scale-95 transition-all rounded-sm"
              >
                Member Login
              </button>
              <button
                onClick={() => navigate('/nisha/plans')}
                className="border border-nisha-rose/40 text-nisha-rose font-body font-semibold uppercase tracking-widest px-8 py-4 text-sm hover:bg-nisha-rose hover:text-white active:scale-95 transition-all rounded-sm"
              >
                See Plans
              </button>
            </div>
          </div>

          {/* Stats panel */}
          <div className="hidden lg:block w-64 bg-black/40 border border-nisha-rose/20 backdrop-blur-sm p-6 rounded">
            <p className="text-nisha-rose text-xs uppercase tracking-widest font-semibold mb-4">Highlights</p>
            {STATS.map(s => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                <span className="text-white/50 text-sm font-body">{s.label}</span>
                <span className="font-nisha text-white text-2xl font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/30 text-xs uppercase tracking-widest font-body">Scroll</span>
          <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="bg-nisha-rose py-4">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="font-nisha font-semibold text-white text-3xl">{s.value}</p>
              <p className="text-white/70 text-xs uppercase tracking-widest font-body">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT SECTION ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-nisha-rose text-xs uppercase tracking-[0.3em] font-semibold mb-3 font-body">
              About Nisha Fitness
            </p>
            <h2 className="font-nisha text-4xl md:text-5xl text-white leading-tight mb-4">
              Your Space.<br />
              <span className="text-nisha-rose italic">Your Strength.</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-4 font-body">
              Nisha Fitness is a women-only gym established in 2026 in Roorkee.
              Fully air-conditioned with a music system, modern equipment, and a welcoming
              environment for women of all fitness levels.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-6 font-body">
              Whether you're just starting out or maintaining your fitness, this is your space —
              comfortable, private, and designed for you.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {['Women Only', 'Air Conditioned', 'Music System', 'Modern Equipment', 'All Levels Welcome'].map(tag => (
                <span key={tag} className="px-3 py-1 border border-nisha-rose/30 text-nisha-rose text-xs font-semibold uppercase tracking-widest rounded-full font-body">
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => navigate('/nisha/plans')}
              className="border border-nisha-rose text-nisha-rose font-body font-semibold uppercase tracking-widest px-6 py-3 text-sm hover:bg-nisha-rose hover:text-white transition-all rounded-sm"
            >
              View Membership Plans →
            </button>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '❄️', title: 'Air Conditioned', desc: 'Comfortable temperature all year round' },
              { icon: '🎵', title: 'Music System', desc: 'Energising music to keep you motivated' },
              { icon: '🏋️', title: 'Quality Machines', desc: '10+ modern strength and cardio machines' },
              { icon: '🔒', title: 'Women Only', desc: 'A safe, private space exclusively for women' },
            ].map(f => (
              <div key={f.title} className="bg-white/5 border border-nisha-rose/15 rounded p-4 hover:border-nisha-rose/30 transition-all">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="font-body font-semibold text-white text-sm mb-1">{f.title}</p>
                <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-nisha text-4xl text-white mb-4">Ready to Begin?</h2>
          <p className="text-white/50 mb-8 font-body">
            Join hundreds of women who have made Nisha Fitness their home for health and strength.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/register', { state: { gym: 'nisha' } })}
              className="bg-nisha-rose text-white font-body font-semibold uppercase tracking-widest px-10 py-4 text-sm hover:bg-rose-700 active:scale-95 transition-all rounded-sm"
            >
              Join Now
            </button>
            <a
              href={`https://wa.me/${SHARED_CONTACT.whatsappNumber}?text=Hi, I'd like to know more about Nisha Fitness`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-green-600 text-green-400 font-body font-semibold uppercase tracking-widest px-8 py-4 text-sm hover:bg-green-600 hover:text-white transition-all rounded-sm"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
