import React, { useState } from 'react';
import { RotateCw, CheckCircle2, ArrowRight, Sparkles, Rocket, Brain, Zap, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RevisionView = () => {
  const { concepts, openPostDetail, posts } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const activeConcepts = concepts && concepts.length > 0 ? concepts : [];

  const handleNext = (mastered) => {
    if (activeConcepts.length === 0) return;
    if (mastered) {
      setMasteredCount((p) => p + 1);
    } else {
      setReviewCount((p) => p + 1);
    }
    setIsFlipped(false);
    setCurrentIdx((p) => (p + 1) % activeConcepts.length);
  };

  const currentConcept = activeConcepts.length > 0 ? activeConcepts[currentIdx % activeConcepts.length] : null;

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* BEAUTIFUL "COMING SOON" HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-primary-900 to-slate-950 p-6 sm:p-10 text-white shadow-2xl border border-indigo-700/50">
        {/* Decorative background ambient glow circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 border border-white/15 text-xs font-black tracking-wide uppercase">
              <Rocket className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Coming Soon in 2026 Edition</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/30 text-primary-200 border border-primary-400/30 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-primary-300" />
              <span>AI Spaced Repetition Engine</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Smart Spaced Repetition & Exam Flashcards
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl font-normal leading-relaxed">
              We are building WILT's next-generation SuperMemo AI active recall engine. Automatically convert community posts, formulas, and financial jargon into memory-boosting daily flashcard decks!
            </p>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs">
                <Brain className="w-4 h-4 text-amber-400" />
                <span>Active Recall AI</span>
              </div>
              <p className="text-[11px] text-indigo-200/80">Adaptive decay curves based on how fast you recall definitions.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
              <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>1-Click Deck Builder</span>
              </div>
              <p className="text-[11px] text-indigo-200/80">Turn saved posts directly into revision flashcards with 1 click.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
              <div className="flex items-center gap-2 text-sky-300 font-extrabold text-xs">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Formula Mastery</span>
              </div>
              <p className="text-[11px] text-indigo-200/80">Interactive KaTeX math equations for Accounting & Corporate Finance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE RECALL PREVIEW SESSION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Interactive Flashcard Preview
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Try out the current active recall concept deck below
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold self-start sm:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ {masteredCount} Mastered
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              ↻ {reviewCount} Review
            </span>
          </div>
        </div>

        {currentConcept ? (
          <>
            <div className="text-center text-xs text-slate-400 font-mono font-semibold">
              Card {(currentIdx % activeConcepts.length) + 1} of {activeConcepts.length}
            </div>

            {/* Flashcard Box */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[280px] p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-hover hover:border-primary-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              {!isFlipped ? (
                <div className="flex flex-col justify-between h-full space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-primary-50 text-primary-700">
                      {currentConcept.category || 'General'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                      <RotateCw className="w-3.5 h-3.5" /> Tap card to reveal
                    </span>
                  </div>

                  <div className="text-center py-6">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Concept</span>
                    <h2 className="text-3xl font-extrabold text-slate-900 mt-1.5">
                      {currentConcept.term}
                    </h2>
                  </div>

                  <div className="text-center text-xs text-primary-600 font-bold">
                    Try to recall the definition & formula before flipping!
                  </div>
                </div>
              ) : (
          <div className="flex flex-col justify-between h-full space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary-700">
                {currentConcept.term}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                <RotateCw className="w-3.5 h-3.5" /> Tap to flip back
              </span>
            </div>

            <div className="space-y-3">
              {currentConcept.plainExplanation && (
                <div className="p-3 rounded-2xl bg-primary-50/70 border border-primary-100">
                  <div className="text-[10px] font-bold text-primary-700 uppercase">Plain English</div>
                  <p className="text-xs text-primary-950 font-medium mt-0.5">{currentConcept.plainExplanation}</p>
                </div>
              )}

              <p className="text-xs text-slate-600 leading-relaxed">
                {currentConcept.definition}
              </p>

              {currentConcept.formula && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <code className="text-xs font-mono font-bold text-slate-800">{currentConcept.formula}</code>
                </div>
              )}
            </div>

            {currentConcept.relatedPostId && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenSource();
                }}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 self-start"
              >
                <span>Read related post</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handleNext(false)}
          className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          <span>Review Again</span>
        </button>

        <button
          onClick={() => handleNext(true)}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-btn flex items-center gap-2 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Mastered It!</span>
        </button>
      </div>
    </>
  ) : (
    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
      <p className="text-xs font-bold text-slate-700">No active recall flashcards available</p>
      <p className="text-[11px] text-slate-400">Post a new study insight or add terms in the Dictionary to populate cards!</p>
    </div>
  )}
      </div>
    </div>
  );
};
