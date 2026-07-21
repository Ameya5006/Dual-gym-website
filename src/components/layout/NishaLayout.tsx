// src/components/layout/NishaLayout.tsx
// Dark pink theme — consistent visibility across all pages

import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { SHARED_CONTACT } from '../../constants/plans';

const NAV_LINKS = [
  { to: '/nisha',           label: 'Home',      end: true },
  { to: '/nisha/about',     label: 'About' },
  { to: '/nisha/equipment', label: 'Facilities' },
  { to: '/nisha/plans',     label: 'Plans' },
  { to: '/nisha/gallery',   label: 'Gallery' },
  { to: '/nisha/contact',   label: 'Contact' },
];

export default function NishaLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-nisha-dark text-white font-body">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-nisha-dark/95 backdrop-blur-sm border-b border-nisha-rose/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/nisha" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-nisha-rose flex items-center justify-center font-nisha text-white text-lg font-semibold italic">
              N
            </div>
            <div className="hidden sm:block">
              <p className="font-nisha font-semibold text-white text-base leading-none">Nisha Fitness</p>
              <p className="text-nisha-rose text-xs tracking-[0.2em] uppercase font-body">Women Only</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <NavLink key={link.to} to={link.to} end={link.end}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-widest font-semibold transition-colors ${
                    isActive ? 'text-nisha-rose' : 'text-white/50 hover:text-white'
                  }`
                }>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-2">
            <Link to="/"
              className="hidden sm:flex text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/30 px-3 py-1.5 rounded transition-all">
              ⇄ Boxing Club
            </Link>
            <Link to="/pay?gym=nisha"
              className="hidden sm:flex text-xs text-green-400 border border-green-600/40 hover:bg-green-600/20 px-3 py-1.5 rounded transition-all font-semibold">
              💳 Pay
            </Link>
            <button
              onClick={() => navigate('/member/login')}
              className="hidden sm:flex text-xs text-white/60 border border-white/20 hover:border-nisha-rose hover:text-nisha-rose px-3 py-1.5 rounded transition-all font-semibold">
              Login
            </button>
            <button
              onClick={() => navigate('/register', { state: { gym: 'nisha' } })}
              className="bg-nisha-rose text-white text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-sm hover:bg-rose-700 transition-all active:scale-95">
              Join Now
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white/60 p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-nisha-dark border-t border-nisha-rose/10 px-6 py-4 flex flex-col gap-3">
            {NAV_LINKS.map(link => (
              <NavLink key={link.to} to={link.to} end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-widest font-semibold py-2 border-b border-white/5 ${
                    isActive ? 'text-nisha-rose' : 'text-white/50'
                  }`
                }>
                {link.label}
              </NavLink>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => { navigate('/member/login'); setMenuOpen(false); }}
                className="flex-1 py-2 text-xs font-semibold uppercase tracking-widest border border-white/20 text-white/60 rounded">
                Login
              </button>
              <button onClick={() => { navigate('/register', { state: { gym: 'nisha' } }); setMenuOpen(false); }}
                className="flex-1 py-2 text-xs font-semibold uppercase tracking-widest bg-nisha-rose text-white rounded">
                Join Now
              </button>
            </div>
            <Link to="/" className="text-xs text-white/30 text-center pt-1">⇄ Switch to Boxing Club</Link>
          </div>
        )}
      </nav>

      {/* Page content */}
      <div className="pt-[73px]">
        <Outlet />
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-black/40 border-t border-nisha-rose/10 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-nisha text-nisha-rose text-xl italic mb-2">Nisha Fitness</p>
            <p className="text-white/40 text-xs leading-relaxed">
              A premium women-only gym in Roorkee. AC, music, modern machines.
              Your transformation starts here.
            </p>
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">Quick Links</p>
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to}
                className="block text-white/40 hover:text-nisha-rose text-sm py-0.5 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">Get in Touch</p>
            <p className="text-white/40 text-sm leading-relaxed">
              {SHARED_CONTACT.address}<br />
              {SHARED_CONTACT.phone}
            </p>
            <div className="flex gap-3 mt-3">
              <a href={SHARED_CONTACT.instagram} target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-nisha-rose text-xs transition-colors">Instagram</a>
              <a href={SHARED_CONTACT.facebook} target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-nisha-rose text-xs transition-colors">Facebook</a>
            </div>
            <p className="text-white/20 text-xs mt-4">© {new Date().getFullYear()} Nisha Fitness</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
