// src/components/layout/BoxingLayout.tsx
// Persistent navbar + footer wrapper for all boxing gym pages

import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';

// TODO: Replace with actual gym logo
const LOGO_TEXT = 'FFBC'; // Fitness First Boxing Club initials

const NAV_LINKS = [
  { to: '/boxing', label: 'Home', end: true },
  { to: '/boxing/about', label: 'Coach' },
  { to: '/boxing/equipment', label: 'The Gym' },
  { to: '/boxing/plans', label: 'Plans' },
  { to: '/boxing/gallery', label: 'Gallery' },
  { to: '/boxing/contact', label: 'Contact' },
];

export default function BoxingLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-boxing-dark text-white font-body">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-boxing-dark/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/boxing" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-boxing-red flex items-center justify-center font-boxing font-black text-white text-sm"
              style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}>
              {LOGO_TEXT}
            </div>
            <div className="hidden sm:block">
              <p className="font-boxing font-bold uppercase text-white text-sm leading-none tracking-wide">Fitness First</p>
              <p className="text-boxing-red text-xs uppercase tracking-[0.2em]">Boxing Club & Gym</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-widest font-semibold transition-colors ${
                    isActive ? 'text-boxing-red' : 'text-white/60 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* CTA + mobile menu */}
          <div className="flex items-center gap-3">
            {/* Switch gym button */}
            <Link to="/" className="hidden sm:flex text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/30 px-3 py-1.5 rounded transition-all">
              ⇄ Nisha Fitness
            </Link>
            {/* Join Now */}
            <button
              onClick={() => navigate('/register', { state: { gym: 'boxing' } })}
              className="bg-boxing-red text-white text-xs font-boxing font-bold uppercase tracking-widest px-4 py-2 hover:bg-red-700 transition-all active:scale-95"
              style={{ clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
            >
              Join Now
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white/60 hover:text-white p-1"
            >
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
          <div className="md:hidden bg-boxing-dark border-t border-white/10 px-6 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-widest font-semibold py-2 border-b border-white/5 ${
                    isActive ? 'text-boxing-red' : 'text-white/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/" className="text-sm text-white/30 pt-2">⇄ Switch to Nisha Fitness</Link>
          </div>
        )}
      </nav>

      {/* Page content (with top padding for fixed navbar) */}
      <div className="pt-[73px]">
        <Outlet />
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="bg-black/50 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-boxing font-bold uppercase text-boxing-red text-sm tracking-widest mb-2">Fitness First Boxing Club & Gym</p>
            <p className="text-white/40 text-xs leading-relaxed">
              Trained by a retired Indian Army officer. No AC, no shortcuts — just pure discipline and authentic boxing training.
            </p>
          </div>
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-3">Quick Links</p>
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="block text-white/40 hover:text-white text-sm py-0.5 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-3">Follow the Coach</p>
            {/* TODO: Replace # with actual social links */}
            <div className="flex gap-3">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-red-500 text-sm transition-colors">YouTube 100K+</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-blue-500 text-sm transition-colors">Facebook</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-pink-500 text-sm transition-colors">Instagram</a>
            </div>
            <p className="text-white/20 text-xs mt-4">© {new Date().getFullYear()} Fitness First Boxing Club</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
