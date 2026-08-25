import React from 'react';
import {
  Compass,
  BookOpen,
  Info,
  Sparkles,
  ArrowRight,
  PenTool,
  GraduationCap
} from 'lucide-react';
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const FloatingNavbar = () => {
  const { currentView, setCurrentView } = useApp();
  const { user } = useAuth();

  return (
    <header className="sticky top-5 z-40 px-4 max-w-5xl mx-auto w-full">
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

        {/* Right CTA Button using Official Clerk Modal & UserButton */}
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
  );
};
