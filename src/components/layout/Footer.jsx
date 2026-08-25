import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  GraduationCap, 
  Heart,
  Github,
  Twitter,
  Linkedin,
  BookOpen,
  Trophy,
  PenTool,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { subscribeToNewsletter } from '../../services/supabase';

export const Footer = () => {
  const { setCurrentView } = useApp();
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'already_exists' | 'error'

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    
    setSubStatus('loading');
    const result = await subscribeToNewsletter(email.trim());

    if (result.status === 'subscribed') {
      setSubStatus('success');
      try {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.85 }
        });
      } catch (err) {}
      setTimeout(() => {
        setEmail('');
        setSubStatus('idle');
      }, 3500);
    } else if (result.status === 'already_exists') {
      setSubStatus('already_exists');
      setTimeout(() => {
        setSubStatus('idle');
      }, 3500);
    } else {
      setSubStatus('error');
      setTimeout(() => {
        setSubStatus('idle');
      }, 3500);
    }
  };

  return (
    <footer className="relative bg-white border-t border-slate-200/90 mt-20 select-none overflow-hidden font-sans">
      {/* Top subtle gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

      <div className="px-6 py-14 sm:py-16 mx-auto max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-y-12 gap-x-8 lg:gap-x-12">
          
          {/* Brand Info & Mission (2 cols) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-4">
            <button
              onClick={() => setCurrentView('notepad')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white font-black text-lg flex items-center justify-center shadow-btn group-hover:scale-105 transition-transform">
                W
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-slate-900 block leading-tight">
                  WILT
                </span>
                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest block">
                  What I Learned Today
                </span>
              </div>
            </button>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm font-medium">
              The high-retention micro-learning platform for university students. Master complex formulas, models, and concepts in 30-second peer insights with spaced recall.
            </p>

            {/* Creators Attribution Pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
              <span className="text-slate-500">Built by</span>
              <span className="text-slate-900 font-extrabold">Avinendra Pratap Singh</span>
              <span className="text-slate-400">&</span>
              <span className="text-slate-900 font-extrabold">Kumar</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-500 hover:text-primary-600 border border-slate-200/90 hover:border-primary-300 flex items-center justify-center transition-all shadow-2xs hover:-translate-y-0.5"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-900 text-slate-500 hover:text-white border border-slate-200/90 hover:border-slate-900 flex items-center justify-center transition-all shadow-2xs hover:-translate-y-0.5"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-500 hover:text-primary-600 border border-slate-200/90 hover:border-primary-300 flex items-center justify-center transition-all shadow-2xs hover:-translate-y-0.5"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Platform Navigation */}
          <div className="space-y-4">
            <p className="text-[11px] font-black tracking-widest text-slate-900 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-600 inline-block" />
              <span>Platform</span>
            </p>
            <ul className="space-y-3 text-xs font-semibold text-slate-600">
              <li>
                <button
                  onClick={() => setCurrentView('notepad')}
                  className="hover:text-primary-600 transition-all flex items-center gap-2 hover:translate-x-1"
                >
                  <PenTool className="w-3.5 h-3.5 text-slate-400" />
                  <span>Notepad Studio</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('discover')}
                  className="hover:text-primary-600 transition-all flex items-center gap-2 hover:translate-x-1"
                >
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  <span>Discover Feed</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('dictionary')}
                  className="hover:text-primary-600 transition-all flex items-center gap-2 hover:translate-x-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Peer Glossary</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('quiz')}
                  className="hover:text-primary-600 transition-all flex items-center gap-2 hover:translate-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Weekly Quiz (+150 XP)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('leaderboard')}
                  className="hover:text-primary-600 transition-all flex items-center gap-2 hover:translate-x-1"
                >
                  <Trophy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Campus Leaderboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Story & Pillars */}
          <div className="space-y-4">
            <p className="text-[11px] font-black tracking-widest text-slate-900 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-coral-500 inline-block" />
              <span>About & Story</span>
            </p>
            <ul className="space-y-3 text-xs font-semibold text-slate-600">
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-primary-600 transition-all hover:translate-x-1 flex items-center gap-1.5"
                >
                  <span>The WILT Story</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-primary-600 transition-all hover:translate-x-1 flex items-center gap-1.5"
                >
                  <span>Avinendra Pratap Singh</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-primary-600 transition-all hover:translate-x-1 flex items-center gap-1.5"
                >
                  <span>Kumar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-primary-600 transition-all hover:translate-x-1 flex items-center gap-1.5"
                >
                  <span>The 4 Core Pillars</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-primary-600 transition-all hover:translate-x-1 flex items-center gap-1.5"
                >
                  <span>Active Recall Engine</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter (2 cols) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-4">
            <div className="space-y-1.5">
              <p className="text-[11px] font-black tracking-widest text-slate-900 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Weekly Knowledge Digest</span>
              </p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Get the top 5 high-yield peer formulas, mental models, and finance shortcuts sent to your college inbox every Sunday.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-1">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your student email..."
                  className="w-full px-4 py-3 text-xs rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100/60 shadow-2xs transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={subStatus === 'loading'}
                className={`w-full py-3 px-5 rounded-2xl text-white font-extrabold text-xs shadow-btn hover:shadow-hover transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer ${
                  subStatus === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : subStatus === 'already_exists'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700'
                }`}
              >
                {subStatus === 'loading' ? (
                  <span>Joining Weekly Digest...</span>
                ) : subStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Subscribed Successfully! 🎉</span>
                  </>
                ) : subStatus === 'already_exists' ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-white" />
                    <span>Email Already Subscribed! 📬</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Join Weekly Digest</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} WILT. Designed for university scholars by{' '}
            <strong className="text-slate-800 font-bold">Avinendra Pratap Singh</strong> &{' '}
            <strong className="text-slate-800 font-bold">Kumar</strong>.
          </p>

          {/* New Tab Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <a
              href="?page=privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-primary-600 font-semibold transition-all"
            >
              Privacy Policy
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="?page=terms"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-primary-600 font-semibold transition-all"
            >
              Terms of Use
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="?page=standards"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-primary-600 font-semibold transition-all"
            >
              Community Standards
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
