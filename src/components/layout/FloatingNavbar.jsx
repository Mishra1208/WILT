import React, { useState } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { id: 'knowledge-quest', label: 'Knowledge Quest' },
  { id: 'discover', label: 'Learning hub' },
  { id: 'quiz', label: 'Weekly quiz' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'about', label: 'About' }
];

/**
 * Top bar for the landing page. It sits on the deep-indigo hero, so it's dark
 * and translucent rather than white.
 */
export const FloatingNavbar = () => {
  const { currentView, setCurrentView } = useApp();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur border-b border-line px-4 sm:px-8 h-16 flex items-center justify-between z-40 select-none">
      <button onClick={() => handleNavClick('notepad')} className="text-left cursor-pointer">
        <span className="block text-[22px] font-extrabold tracking-[-0.04em] text-ink leading-none">
          wilt<span className="text-[#E0B400]">.</span>
        </span>
      </button>

      <nav className="hidden md:flex items-center gap-1 text-[15px] font-medium" aria-label="Main">
        {LINKS.map((l) => (
          <button
            key={l.id}
            onClick={() => handleNavClick(l.id)}
            className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
              currentView === l.id ? 'text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {l.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="hidden sm:inline-flex px-4 py-2 rounded-md text-sm font-semibold bg-ink text-white hover:bg-ink/90 transition-colors cursor-pointer">
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <button
            onClick={() => handleNavClick('leaderboard')}
            className="hidden sm:inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-md border border-line text-sm font-semibold text-ink hover:bg-haze transition-colors cursor-pointer"
          >
            <img src={user?.avatar} alt="" className="w-6 h-6 rounded-full bg-haze" />
            <span>
              {user?.xp || 0} <span className="text-muted font-medium">XP</span>
            </span>
          </button>
        </SignedIn>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-ink hover:bg-haze rounded-md transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-line shadow-lift py-3 px-4 flex flex-col md:hidden z-50">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => handleNavClick(l.id)}
              className={`text-left text-base font-medium px-3 py-3 rounded-md transition-colors ${
                currentView === l.id ? 'bg-haze text-ink' : 'text-ink/80 hover:bg-haze'
              }`}
            >
              {l.label}
            </button>
          ))}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="mt-2 w-full py-3 rounded-md text-sm font-semibold bg-ink text-white">Sign in</button>
            </SignInButton>
          </SignedOut>
        </div>
      )}
    </header>
  );
};

export default FloatingNavbar;
