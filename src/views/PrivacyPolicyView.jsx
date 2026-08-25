import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Eye, Database, CheckCircle2, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivacyPolicyView = () => {
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Student Privacy First</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Last Updated: August 25, 2026 • Effective for all WILT scholars
        </p>
      </div>

      {/* Policy Content */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-600" />
            <span>1. Our Commitment to Student Privacy</span>
          </h2>
          <p>
            WILT (What I Learned Today), conceived and maintained by <strong>Narendra Mishra</strong>, <strong>Avinendra Pratap Singh</strong> & <strong>Kumar</strong>, is dedicated to providing an academic peer-learning ecosystem where students can share insights freely without worrying about intrusive data harvesting.
          </p>
          <p>
            We <strong>never sell, monetize, or broker student information</strong> to advertisers or third-party marketing firms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-600" />
            <span>2. Information We Collect</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Profile & Account Details:</strong> Your student display name, chosen username, academic major, and university cohort.
            </li>
            <li>
              <strong>Learning Posts & Glossary Terms:</strong> 30-second insights, formulas, takeaway bullets, and verified citation sources you contribute.
            </li>
            <li>
              <strong>Quiz & Gamification Progress:</strong> XP score, campus leaderboard rank, accuracy statistics, and spaced recall history.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary-600" />
            <span>3. How We Use Your Information</span>
          </h2>
          <p>
            Collected data is strictly utilized to:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Spaced Recall Quizzes
              </span>
              <p className="text-xs text-slate-500">Auto-generating high-yield weekly MCQs from published takeaways.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Campus Leaderboard
              </span>
              <p className="text-xs text-slate-500">Displaying student XP tiers, Gold/Silver podiums, and accuracy badges.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Local Storage & Security</h2>
          <p>
            WILT uses browser LocalStorage and secure cloud databases to preserve your study notes and bookmarks across sessions. All transmission occurs over encrypted HTTPS/TLS channels.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Contact & Privacy Inquiries</h2>
          <p>
            If you have questions regarding data handling or wish to request data deletion, contact the project team at <span className="font-mono text-primary-600 font-bold">privacy@wilt-learning.edu</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
