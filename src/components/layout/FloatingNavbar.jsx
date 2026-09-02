import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X } from 'lucide-react';

export const FloatingNavbar = () => {
  const { currentView, setCurrentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between z-40 select-none relative">
      {/* Original WILT Brand Logo */}
      <div 
        onClick={() => handleNavClick('notepad')}
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

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-bold tracking-[0.12em] text-slate-700 uppercase">
        <button
          onClick={() => handleNavClick('knowledge-quest')}
          className={`hover:text-primary-600 transition-colors flex items-center gap-1.5 ${
            currentView === 'knowledge-quest' ? 'text-primary-600 font-extrabold' : ''
          }`}
        >
          <span>KNOWLEDGE QUEST</span>
          <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black tracking-normal">TOI</span>
        </button>

        <button
          onClick={() => handleNavClick('discover')}
          className={`hover:text-primary-600 transition-colors ${
            currentView === 'discover' ? 'text-primary-600 font-extrabold' : ''
          }`}
        >
          LEARNING HUB
        </button>

        <button
          onClick={() => handleNavClick('quiz')}
          className={`hover:text-primary-600 transition-colors ${
            currentView === 'quiz' ? 'text-primary-600 font-extrabold' : ''
          }`}
        >
          YOUR STATUS
        </button>

        <button
          onClick={() => handleNavClick('about')}
          className={`hover:text-primary-600 transition-colors ${
            currentView === 'about' ? 'text-primary-600 font-extrabold' : ''
          }`}
        >
          ABOUT US
        </button>
      </nav>

      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-slate-700 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
        aria-label="Toggle Navigation Menu"
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Navigation Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl py-4 px-6 flex flex-col gap-4 md:hidden z-50 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => handleNavClick('discover')}
            className={`text-left text-xs font-extrabold tracking-wider uppercase py-2 border-b border-slate-100 ${
              currentView === 'discover' ? 'text-primary-600' : 'text-slate-700'
            }`}
          >
            DISCOVER
          </button>

          <button
            onClick={() => handleNavClick('discover')}
            className={`text-left text-xs font-extrabold tracking-wider uppercase py-2 border-b border-slate-100 ${
              currentView === 'discover' ? 'text-primary-600' : 'text-slate-700'
            }`}
          >
            LEARNING HUB
          </button>

          <button
            onClick={() => handleNavClick('quiz')}
            className={`text-left text-xs font-extrabold tracking-wider uppercase py-2 border-b border-slate-100 ${
              currentView === 'quiz' ? 'text-primary-600' : 'text-slate-700'
            }`}
          >
            YOUR STATUS
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`text-left text-xs font-extrabold tracking-wider uppercase py-2 ${
              currentView === 'about' ? 'text-primary-600' : 'text-slate-700'
            }`}
          >
            ABOUT US
          </button>
        </div>
      )}
    </header>
  );
};

export default FloatingNavbar;
