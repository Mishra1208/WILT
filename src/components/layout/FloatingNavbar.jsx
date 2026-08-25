import React, { useState, useEffect } from 'react';
import {
  Compass,
  BookOpen,
  Info,
  Sparkles,
  ArrowRight,
  PenTool,
  GraduationCap,
  Menu,
  X,
  Trophy,
  ChevronRight,
  User,
  PanelLeft
} from 'lucide-react';
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const FloatingNavbar = () => {
  const { currentView, setCurrentView } = useApp();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 90) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsFlyoutOpen(false); // automatically retract drawer when at top
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. TOP HORIZONTAL FLOATING NAVBAR (Visible when scrollY <= 90px) */}
      <header
        className={`sticky top-5 z-40 px-4 max-w-5xl mx-auto w-full transition-all duration-500 ease-out transform ${
          isScrolled
            ? '-translate-y-16 opacity-0 pointer-events-none scale-95'
            : 'translate-y-0 opacity-100 scale-100'
        }`}
      >
        <nav className="rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentView('notepad')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white font-extrabold text-sm flex items-center justify-center shadow-btn group-hover:scale-105 transition-transform">
              W
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                WILT
              </span>
            </div>
          </div>

          {/* Center Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs font-bold">
            <button
              onClick={() => setCurrentView('notepad')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                currentView === 'notepad'
                  ? 'bg-primary-50 text-primary-700 font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Notepad</span>
            </button>

            <button
              onClick={() => setCurrentView('discover')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                currentView !== 'notepad' && currentView !== 'about'
                  ? 'bg-primary-50 text-primary-700 font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore All Features</span>
            </button>

            <button
              onClick={() => setCurrentView('about')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                currentView === 'about'
                  ? 'bg-primary-50 text-primary-700 font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About</span>
            </button>
          </div>

          {/* Right CTA Button */}
          <div className="flex items-center gap-2">
            <SignedIn>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('settings')}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt={user?.name || "Scholar"}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                    @{user?.username || 'scholar'}
                  </span>
                </button>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="px-4 py-2 rounded-full text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-btn transition-all flex items-center gap-1.5 transform active:scale-95 cursor-pointer"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </nav>
      </header>

      {/* 2. COOL ANIMATED LEFT-SIDE FLOATING TRIGGER BADGE (Visible when scrolled down) */}
      <div
        className={`fixed left-4 sm:left-6 top-24 z-50 transition-all duration-500 ease-out transform ${
          isScrolled && !isFlyoutOpen
            ? 'translate-x-0 opacity-100 scale-100'
            : '-translate-x-20 opacity-0 pointer-events-none scale-90'
        }`}
      >
        <button
          onClick={() => setIsFlyoutOpen(true)}
          title="Open Navigation Menu"
          className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white/95 hover:bg-white text-slate-900 border border-slate-200/90 shadow-[0_12px_35px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.22)] backdrop-blur-xl transition-all duration-300 transform active:scale-95 cursor-pointer hover:border-primary-400"
        >
          {/* Animated Pulsing Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 opacity-20 group-hover:opacity-40 blur-xs transition-opacity animate-pulse" />

          <div className="relative flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs group-hover:rotate-12 transition-transform">
              W
            </div>
            <div className="flex items-center gap-1 text-xs font-extrabold text-slate-800 pr-1">
              <Menu className="w-4 h-4 text-primary-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Menu</span>
            </div>
          </div>
        </button>
      </div>

      {/* 3. SLEEK SLIDING SIDE FLYOUT PANEL (Opened from Left Floating Trigger) */}
      {isFlyoutOpen && (
        <div className="fixed inset-0 z-50 flex select-none">
          {/* Dark Glass Backdrop */}
          <div
            onClick={() => setIsFlyoutOpen(false)}
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
          />

          {/* Flyout Navigation Drawer */}
          <div className="relative w-80 max-w-[85vw] h-fit max-h-[90vh] my-auto ml-4 sm:ml-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.18)] p-5 flex flex-col gap-4 animate-in slide-in-from-left duration-300 z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div
                onClick={() => {
                  setCurrentView('notepad');
                  setIsFlyoutOpen(false);
                }}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white font-extrabold text-sm flex items-center justify-center shadow-btn">
                  W
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                    WILT
                  </span>
                  <span className="text-[9px] font-bold text-primary-600 uppercase tracking-wider block">
                    Navigation Menu
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsFlyoutOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav Menu Options */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setCurrentView('notepad');
                  setIsFlyoutOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                  currentView === 'notepad'
                    ? 'bg-primary-50 text-primary-700 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-primary-100/70 text-primary-600">
                    <PenTool className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div>Notepad Slate</div>
                    <div className="text-[10px] font-normal text-slate-400">Write 30s micro-notes</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('discover');
                  setIsFlyoutOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                  currentView === 'discover'
                    ? 'bg-primary-50 text-primary-700 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-indigo-100/70 text-indigo-600">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div>Explore All Features</div>
                    <div className="text-[10px] font-normal text-slate-400">Campus feed & formulas</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('dictionary');
                  setIsFlyoutOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-emerald-100/70 text-emerald-600">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div>Peer Glossary</div>
                    <div className="text-[10px] font-normal text-slate-400">Plain-English definitions</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('quiz');
                  setIsFlyoutOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-amber-100/70 text-amber-600">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div>Weekly Quiz</div>
                    <div className="text-[10px] font-normal text-slate-400">+150 XP recall challenge</div>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  +150 XP
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('leaderboard');
                  setIsFlyoutOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-amber-100/70 text-amber-600">
                    <Trophy className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div>Campus Leaderboard</div>
                    <div className="text-[10px] font-normal text-slate-400">Podium & XP ranks</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('about');
                  setIsFlyoutOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                  currentView === 'about'
                    ? 'bg-primary-50 text-primary-700 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-slate-100 text-slate-600">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div>About WILT</div>
                    <div className="text-[10px] font-normal text-slate-400">Founders & Story</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Drawer User CTA / Profile */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <SignedIn>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                      alt={user?.name || "Scholar"}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="text-[11px] font-bold text-slate-800">
                      @{user?.username || 'scholar'}
                    </div>
                  </div>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-btn transition-all flex items-center justify-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>Student Sign In</span>
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingNavbar;
