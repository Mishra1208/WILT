import React from 'react';
import { 
  Users, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  Link as LinkIcon, 
  HeartHandshake, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommunityStandardsView = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-10 animate-fadeIn select-none text-slate-800">
      {/* Back Navigation */}
      <button
        onClick={() => setCurrentView('notepad')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors p-2 rounded-xl hover:bg-slate-100"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Notepad Studio</span>
      </button>

      {/* Header */}
      <div className="space-y-3 border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
          <Users className="w-3.5 h-3.5" />
          <span>Collegiate Code of Conduct</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Community Standards
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Guidelines instituted by Avinendra Pratap Singh & Kumar to maintain high academic trust
        </p>
      </div>

      {/* Standards Sections */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        {/* Standard 1: Zero-Tolerance Abusive Language */}
        <section className="space-y-3 p-5 sm:p-6 rounded-3xl bg-rose-50/60 border border-rose-200/80 text-rose-950">
          <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-rose-900">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>1. Zero Tolerance for Abusive & Inappropriate Language</span>
          </h2>
          <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed font-medium">
            WILT enforces an <strong>automated algorithmic content moderation filter</strong>. Any learning post, comment, or definition containing profanity, hate speech, abusive terms, personal harassment, or derogatory language is <strong>immediately blocked from submission</strong>.
          </p>
        </section>

        {/* Standard 2: Mandatory Source of Trust */}
        <section className="space-y-3 p-5 sm:p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-950">
          <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-emerald-900">
            <LinkIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>2. Mandatory Source of Trust Requirement</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed font-medium">
            To ensure peer accuracy and prevent the spread of misinformation in finance and technology, every student <strong>must provide at least one verification source</strong> before publishing:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-900">
              🔗 <strong>Option 1: Reference URL / Link</strong> (e.g. Investopedia, academic journals, official documentation).
            </div>
            <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-900">
              📍 <strong>Option 2: Learning Location / Context</strong> (e.g. "Prof. Miller's Lecture Hall B", "Finance Notice Board").
            </div>
          </div>
        </section>

        {/* Standard 3: Constructive Peer Explanations */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span>3. High-Yield, 30-Second Explanations</span>
          </h2>
          <p>
            The spirit of WILT is simplicity. Aim to write explanations that make complex financial and technical concepts click instantly. Use plain analogies, clear bullet points, and clean formulas.
          </p>
        </section>

        {/* Standard 4: Fair Play & Leaderboard Integrity */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-primary-600" />
            <span>4. Fair Play on the Campus Leaderboard</span>
          </h2>
          <p>
            Campus rankings (🥇 Gold, 🥈 Silver, 🥉 Bronze) celebrate authentic learning consistency. Attempting to exploit automated quiz generation or spam fake cards will result in XP penalties and account resets.
          </p>
        </section>
      </div>
    </div>
  );
};
