import React, { useEffect, useState } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { id: 'discover', label: 'Notes' },
  { id: 'knowledge-quest', label: 'Business news' },
  { id: 'quiz', label: 'Weekly quiz' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'about', label: 'About' }
];

/**
 * Landing-page top bar: wordmark on the left, a floating white pill of links in
 * the middle, and a black pill action on the right. Gains a soft paper
 * backdrop once the page scrolls.
 */
export const FloatingNavbar = () => {
  const { currentView, setCurrentView } = useApp();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const onScroll = () => setMoved(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 select-none transition-colors duration-300 ${
        moved || mobileMenuOpen ? 'bg-paper/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-4">
        <button onClick={() => go('notepad')} className="text-left cursor-pointer">
          <span className="text-[28px] font-bold tracking-[-0.06em] text-ink leading-none">
            wilt<span className="text-marker-orange">.</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1 rounded-full bg-white px-2 py-1.5 shadow-[0_8px_24px_-16px_rgba(30,30,30,0.35)]" aria-label="Main">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`px-4 py-2 rounded-full text-[15px] font-medium transition-colors cursor-pointer ${
                currentView === l.id ? 'bg-paper text-ink' : 'text-ink/75 hover:text-ink hover:bg-paper'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-iris hidden sm:inline-flex px-6 py-3 text-[15px] font-semibold cursor-pointer">Get started</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => go('leaderboard')}
              className="hidden sm:inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-white text-[15px] font-semibold text-ink shadow-[0_8px_24px_-16px_rgba(30,30,30,0.35)] cursor-pointer"
            >
              <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full bg-paper" />
              {user?.xp || 0} XP
            </button>
          </SignedIn>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 rounded-full bg-white flex items-center justify-center text-ink shadow-[0_8px_24px_-16px_rgba(30,30,30,0.35)]"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-5 pb-5">
          <div className="rounded-[24px] bg-white p-3 flex flex-col shadow-lift">
            {LINKS.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className="text-left text-[17px] font-medium px-4 py-3 rounded-full text-ink hover:bg-paper">
                {l.label}
              </button>
            ))}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-iris mt-2 w-full py-3.5 text-[16px] font-semibold">Get started</button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
};

export default FloatingNavbar;
