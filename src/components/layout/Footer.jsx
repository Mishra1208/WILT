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

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    await subscribeNewsletterToSupabase(email, 'wilt_footer_digest');
    setLoading(false);
    setSubscribed(true);

    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3500);
  };

  return (
    <footer className="w-full bg-white text-slate-600 text-xs pt-16 pb-10 px-6 sm:px-12 select-none border-t border-slate-200/80 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-primary-500/5 via-purple-500/5 to-pink-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-100">
          
          {/* Brand Info & Mission (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                W
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-slate-900 leading-none font-display">
                  WILT
                </span>
                <span className="text-[9px] font-bold tracking-[0.18em] text-primary-600 uppercase">
                  What I Learned Today
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-medium">
              The premier campus micro-learning network. Transforming daily student insights into a structured, verified open source of trust.
            </p>

            {/* Live Network Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Campus Network Operational · 2026 Edition</span>
            </div>
          </div>

          {/* Platform Navigation (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <button 
                  onClick={() => setCurrentView('discover')} 
                  className="hover:text-primary-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Learning Hub</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('notepad')} 
                  className="hover:text-primary-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Post Daily Insight</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('dictionary')} 
                  className="hover:text-primary-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Dictionary</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('leaderboard')} 
                  className="hover:text-primary-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Top Scholars</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Legal Policies (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
              <span>Trust & Governance</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <button 
                  onClick={() => setCurrentView('about')} 
                  className="hover:text-primary-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>About WILT</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('privacy')} 
                  className="hover:text-primary-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('terms')} 
                  className="hover:text-primary-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-slate-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={openReportBugModal} 
                  className="hover:text-amber-600 font-bold transition-colors flex items-center gap-1.5 cursor-pointer text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Report a Bug</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('standards')} 
                  className="hover:text-primary-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Community Standards</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Daily Digest Newsletter (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              <span>Knowledge Digest</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Top verified insights & weekly recaps delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="relative mt-2">
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter campus email..."
                  className="w-full pl-10 pr-24 py-2.5 text-xs rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Joined!</span>
                    </>
                  ) : (
                    <>
                      <span>Digest</span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Social, Legal Links & Attribution Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left pt-2">
          
          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              title="LinkedIn"
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-500 hover:text-primary-600 border border-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer"
              title="X / Twitter"
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-500 hover:text-primary-600 border border-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="https://github.com/Mishra1208/WILT" 
              target="_blank" 
              rel="noopener noreferrer"
              title="GitHub Repository"
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-500 hover:text-primary-600 border border-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="mailto:info.wilt@gmail.com" 
              title="Email Support"
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-500 hover:text-primary-600 border border-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Legal Horizontal Links */}
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 flex-wrap justify-center">
            <button onClick={() => setCurrentView('privacy')} className="hover:text-primary-600 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span className="text-slate-300">·</span>
            <button onClick={() => setCurrentView('terms')} className="hover:text-primary-600 transition-colors cursor-pointer">
              Terms of Service
            </button>
            <span className="text-slate-300">·</span>
            <button onClick={() => setCurrentView('standards')} className="hover:text-primary-600 transition-colors cursor-pointer">
              Community Standards
            </button>
            <span className="text-slate-300">·</span>
            <button onClick={() => setCurrentView('about')} className="hover:text-primary-600 transition-colors cursor-pointer">
              About Us
            </button>
            <span className="text-slate-300">·</span>
            <button onClick={openReportBugModal} className="hover:text-amber-600 font-bold transition-colors cursor-pointer text-amber-700">
              Report a Bug
            </button>
          </div>

          {/* Developer Attribution */}
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <span>© {new Date().getFullYear()} WILT. Built by</span>
            <strong className="text-slate-900 font-extrabold hover:text-primary-600 transition-colors">
              Narendra Mishra
            </strong>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
