import React from 'react';
import { FileText, ArrowLeft, BookOpen, Scale, Award, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TermsView = () => {
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold">
          <FileText className="w-3.5 h-3.5" />
          <span>Academic Terms & Guidelines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Terms of Use
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Last Updated: August 25, 2026 • Governing the WILT Platform
        </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary-600" />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By accessing or contributing to WILT (What I Learned Today), created by <strong>Narendra Mishra</strong>, <strong>Avinendra Pratap Singh</strong>, and <strong>Kumar</strong>, you agree to comply with these terms, our Community Standards, and all applicable university honor codes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <span>2. Educational Peer-Learning License</span>
          </h2>
          <p>
            Content shared on WILT is intended exclusively for non-commercial educational study, peer micro-tutoring, and spaced repetition. You grant WILT a non-exclusive license to index your published insights into the campus feed, peer glossary, and auto-generated weekly active recall quizzes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-600" />
            <span>3. Academic Integrity & Citation Standards</span>
          </h2>
          <p>
            Students must never post live exam question leaks, proprietary test materials, or copyrighted answer keys. WILT encourages original explanatory notes, conceptual analogies, and verified mathematical/financial formulas with proper Source of Trust citations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-coral-600" />
            <span>4. Intellectual Property Attribution</span>
          </h2>
          <p>
            WILT's interface, proprietary active recall quiz engine, gamification hierarchy, and math symbol ribbon are intellectual creations of <strong>Narendra Mishra</strong>, <strong>Avinendra Pratap Singh</strong>, and <strong>Kumar</strong>. Unauthorized commercial replication or scraping is prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
          <p>
            While we strive for 100% conceptual accuracy through peer verification and moderation, WILT is a student study aid and does not replace official university coursework or certified professional advice.
          </p>
        </section>
      </div>
    </div>
  );
};
