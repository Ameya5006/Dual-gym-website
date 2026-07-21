// src/pages/Landing.tsx
// The immersive split-screen entry page
// LEFT: Fitness First Boxing Club (dark/red)
// RIGHT: Nisha Fitness (rose/pink)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO: Replace these with actual gym photos
// Put your photos in /public/images/ and update these paths
const BOXING_BG = '/images/boxing/ring3.jpeg';
const NISHA_BG = '/images/Nisha/landing.jpeg';


export default function Landing() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<'boxing' | 'nisha' | null>(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden font-body select-none">
      {/* ==================== LEFT: BOXING CLUB ==================== */}
      <div
        className="relative flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          width: hovered === 'boxing' ? '60%' : hovered === 'nisha' ? '40%' : '50%',
          minWidth: 0,
        }}
        onMouseEnter={() => setHovered('boxing')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => navigate('/boxing')}
      >
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{
            backgroundImage: `url(${BOXING_BG})`,
            transform: hovered === 'boxing' ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        {/* Dark overlay - heavier for boxing */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-black/90" />
        {/* Red accent strip on right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-boxing-red z-10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12">
          {/* Army badge */}
          <div className="mb-4 border border-boxing-red/60 px-4 py-1 text-boxing-red text-xs tracking-[0.3em] uppercase font-boxing font-semibold">
            Est. by Indian Army Veteran
          </div>

          {/* Gym name */}
          <h1
            className="font-boxing font-black uppercase text-white leading-none tracking-wide text-shadow"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
          >
            Fitness First
          </h1>
          <h2
            className="font-boxing font-semibold uppercase tracking-[0.25em] text-shadow"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.8rem)',
              color: '#C0392B',
            }}
          >
            Boxing Club & Gym
          </h2>

          {/* Tagline */}
          <p className="mt-4 text-white/70 text-sm md:text-base font-body max-w-xs leading-relaxed">
            No AC. No shortcuts. Pure discipline.
            <br />
            Train like a soldier. Fight like a champion.
          </p>

          {/* CTA Button */}
          <button
            className="mt-8 px-8 py-3 bg-boxing-red text-white font-boxing font-bold uppercase tracking-widest text-sm hover:bg-red-700 active:scale-95 transition-all"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            Enter →
          </button>

          {/* Arrow hint on mobile */}
          <div className="mt-6 text-white/40 text-xs tracking-widest hidden md:block">
            TAP TO ENTER
          </div>
        </div>
      </div>

      {/* ==================== RIGHT: NISHA FITNESS ==================== */}
      <div
        className="relative flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          width: hovered === 'nisha' ? '60%' : hovered === 'boxing' ? '40%' : '50%',
          minWidth: 0,
        }}
        onMouseEnter={() => setHovered('nisha')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => navigate('/nisha')}
      >
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{
            backgroundImage: `url(${NISHA_BG})`,
            transform: hovered === 'nisha' ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        {/* Lighter overlay for nisha - more welcoming */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/55 to-black/55" />
        {/* Pink accent strip on left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-nisha-rose z-10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12">
          {/* Women only badge */}
          <div className="mb-4 border border-nisha-rose/60 px-4 py-1 text-nisha-rose text-xs tracking-[0.3em] uppercase font-body font-semibold">
            Women Only • AC Gym
          </div>

          {/* Gym name */}
          <h1
            className="font-nisha font-semibold text-white leading-none tracking-wide text-shadow"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
          >
            Nisha
          </h1>
          <h2
            className="font-nisha italic text-shadow"
            style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 2.2rem)',
              color: '#FCB8D2',
            }}
          >
            Fitness & Wellness
          </h2>

          {/* Tagline */}
          <p className="mt-4 text-white/70 text-sm md:text-base font-body max-w-xs leading-relaxed">
            Your strength. Your space.
            <br />
            Premium equipment. AC. Music. You.
          </p>

          {/* CTA Button */}
          <button className="mt-8 px-8 py-3 border border-nisha-rose text-nisha-rose font-body font-medium tracking-widest text-sm hover:bg-nisha-rose hover:text-white active:scale-95 transition-all rounded-sm">
            Enter →
          </button>

          <div className="mt-6 text-white/40 text-xs tracking-widest hidden md:block">
            TAP TO ENTER
          </div>
        </div>
      </div>

      {/* ==================== MOBILE: STACKED LAYOUT ==================== */}
      {/* On small screens, flex-col stacks automatically via Tailwind. 
          The width transitions won't apply, but it still looks great. */}

      {/* Bottom watermark */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/20 text-xs tracking-widest z-30">
        Roorkee , Uttarakhand  {/* TODO: Replace with actual city if different */}
      </div>
    </div>
  );
}



