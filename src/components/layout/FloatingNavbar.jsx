import React from 'react';
import { useApp } from '../../context/AppContext';

export const FloatingNavbar = () => {
  const { currentView, setCurrentView } = useApp();

  return (
    <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 sm:px-12 py-4 flex items-center justify-between z-40 select-none">
      {/* Original WILT Brand Logo: Purple/Indigo "W" Badge + WILT */}
      <div 
        onClick={() => setCurrentView('notepad')}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white font-extrabold text-base flex items-center justify-center shadow-btn group-hover:scale-105 transition-transform">
          W
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
            WILT
          </span>
          <span className="text-[9px] font-bold text-primary-600 uppercase tracking-widest leading-tight">
            What I Learned Today
          </span>
        </div>
      </div>

      {/* Navigation Links in Original WILT Colors */}
      <nav className="flex items-center gap-6 sm:gap-10 text-xs font-bold tracking-[0.12em] text-slate-700 uppercase">
        <button
          onClick={() => setCurrentView('dictionary')}
          className={`hover:text-primary-600 transition-colors ${
            currentView === 'dictionary' ? 'text-primary-600 font-extrabold' : ''
          }`}
        >
          PEER DICTIONARY
        </button>

        <button
          onClick={() => setCurrentView('discover')}
          className={`hover:text-primary-600 transition-colors ${
            currentView === 'discover' ? 'text-primary-600 font-extrabold' : ''
          }`}
        >
          LEARNING HUB
        </button>

        <button
          onClick={() => setCurrentView('quiz')}
          className={`hover:text-primary-600 transition-colors hidden sm:block ${
            currentView === 'quiz' ? 'text-primary-600 font-extrabold' : ''
          }`}
        >
          YOUR STATUS
        </button>

        <button
          onClick={() => setCurrentView('about')}
          className={`hover:text-primary-600 transition-colors ${
            currentView === 'about' ? 'text-primary-600 font-extrabold' : ''
          }`}
        >
          ABOUT US
        </button>
      </nav>
    </header>
  );
};

export default FloatingNavbar;
