import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="w-full bg-white text-slate-600 text-xs py-4 px-6 sm:px-12 select-none border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        
        {/* Left Social Links */}
        <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary-600 transition-colors"
          >
            Facebook
          </a>
          <span className="text-slate-300">·</span>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary-600 transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-slate-300">·</span>
          <a 
            href="https://x.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary-600 transition-colors"
          >
            X
          </a>
        </div>

        {/* Center Support Email */}
        <div className="text-[11px] text-slate-600 font-mono">
          <a href="mailto:info.wilt@gmail.com" className="hover:text-primary-600 transition-colors">
            info.wilt@gmail.com
          </a>
        </div>

        {/* Right Copyright & Narendra Mishra Attribution */}
        <div className="text-[11px] text-slate-600 font-medium">
          © {new Date().getFullYear()} WILT. Built by{' '}
          <strong className="text-slate-900 font-bold">Narendra Mishra</strong>.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
