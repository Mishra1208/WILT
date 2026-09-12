import React from 'react';
import { 
  Lock, 
  Sparkles, 
  X, 
  PenTool, 
  HelpCircle, 
  MessageSquareQuote, 
  Trophy, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, triggerClerkSignIn } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-7 relative border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Top Decorative Gradient Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-primary-600 via-indigo-600 to-amber-500 absolute top-0 left-0 right-0" />

        {/* Close Modal X Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Icon & Badge */}
        <div className="flex flex-col items-center text-center pt-2 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 relative group">
            <Lock className="w-7 h-7" />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-xs">
              <Sparkles className="w-3 h-3 fill-slate-950 text-slate-950" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Official Student Login</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
            Login Required to Continue
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-sm">
            Please log in order to post, share notes, read what others posted, attempt interview retention quizzes, and track your rank!
          </p>
        </div>

        {/* Access Features List */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs text-slate-700 font-semibold">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 font-bold">
              <PenTool className="w-3.5 h-3.5" />
            </div>
            <span><strong className="text-slate-900">Post & Share Notes:</strong> Publish daily insights with peers</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span><strong className="text-slate-900">Attempt Quizzes:</strong> Test 60-second interview recall</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold">
              <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <span><strong className="text-slate-900">Read Community Posts:</strong> Explore talking points & answers</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span><strong className="text-slate-900">Track XP & Leaderboard:</strong> Compete on student rankings</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={triggerClerkSignIn}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Sign In / Create Account with Clerk</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
          >
            Continue Browsing as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
