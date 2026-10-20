import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  Mail, 
  Linkedin, 
  Twitter, 
  Github, 
  Globe, 
  ShieldCheck, 
  Check, 
  Send,
  FileText,
  Lock,
  Scale,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { subscribeNewsletterToSupabase } from '../../services/supabase';

export const Footer = () => {
  const { setCurrentView, openReportBugModal } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = (e) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText('wilt.support@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2500);
  };

  const [subscribeError, setSubscribeError] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setSubscribeError(null);
    const result = await subscribeNewsletterToSupabase(email, 'wilt_footer_digest');
    setLoading(false);

    if (!result?.success) {
      setSubscribeError(result?.message || "Couldn't subscribe right now. Please try again.");
      return;
    }

    setSubscribed(result.status === 'already_exists' ? 'exists' : 'new');
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3500);
  };

  const linkCls = 'text-[15px] text-muted hover:text-ink transition-colors cursor-pointer text-left';

  return (
    <footer className="w-full bg-white border-t border-line pt-12 pb-8 select-none">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
          <div className="col-span-2 md:col-span-4">
            <span className="block text-[22px] font-extrabold tracking-[-0.04em] text-ink leading-none">
              wilt<span className="text-[#E0B400]">.</span>
            </span>
            <p className="mt-3 font-serif text-[17px] text-muted leading-snug max-w-xs">
              One thing you learned today, with a source, remembered through a weekly quiz.
            </p>
          </div>

          <nav className="md:col-span-2 flex flex-col gap-2.5" aria-label="Product">
            <span className="text-sm font-semibold text-ink mb-1">Product</span>
            <button onClick={() => setCurrentView('notepad')} className={linkCls}>Write a note</button>
            <button onClick={() => setCurrentView('discover')} className={linkCls}>Discover</button>
            <button onClick={() => setCurrentView('knowledge-quest')} className={linkCls}>Knowledge Quest</button>
            <button onClick={() => setCurrentView('quiz')} className={linkCls}>Weekly quiz</button>
          </nav>

          <nav className="md:col-span-2 flex flex-col gap-2.5" aria-label="Company">
            <span className="text-sm font-semibold text-ink mb-1">WILT</span>
            <button onClick={() => setCurrentView('about')} className={linkCls}>About</button>
            <button onClick={() => setCurrentView('standards')} className={linkCls}>Community standards</button>
            <button onClick={() => setCurrentView('privacy')} className={linkCls}>Privacy</button>
            <button onClick={() => setCurrentView('terms')} className={linkCls}>Terms</button>
          </nav>

          <div className="col-span-2 md:col-span-4">
            <span className="text-sm font-semibold text-ink">Weekly digest</span>
            <p className="mt-1.5 text-[15px] text-muted">The best notes of the week, by email.</p>
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
              <label htmlFor="digest-email" className="sr-only">Email address</label>
              <input
                id="digest-email"
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (subscribeError) setSubscribeError(null); }}
                placeholder="you@university.edu"
                className="flex-1 min-w-0 px-3 py-2.5 text-[15px] rounded-md bg-haze border border-transparent text-ink placeholder-muted focus:outline-none focus:bg-white focus:border-line focus:ring-4 focus:ring-primary-500/10"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 rounded-md bg-ink text-white text-[15px] font-semibold hover:bg-ink/90 disabled:opacity-60 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {loading ? 'Saving…' : subscribed ? (<><Check className="w-4 h-4" />{subscribed === 'exists' ? 'Already in' : 'Subscribed'}</>) : 'Subscribe'}
              </button>
            </form>
            {subscribeError && (
              <p role="alert" className="mt-2 text-sm font-medium text-[#B4233C]">{subscribeError}</p>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted">
          <span>© {new Date().getFullYear()} WILT · Built by Narendra Mishra</span>
          <div className="flex items-center gap-4">
            <button onClick={handleCopyEmail} className="hover:text-ink transition-colors cursor-pointer flex items-center gap-1.5">
              {emailCopied ? <Check className="w-4 h-4 text-mint-600" /> : <Mail className="w-4 h-4" />}
              {emailCopied ? 'Email copied' : 'wilt.support@gmail.com'}
            </button>
            <button onClick={openReportBugModal} className="hover:text-ink transition-colors cursor-pointer">Report a bug</button>
            <a href="https://github.com/Mishra1208/WILT" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-ink transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
