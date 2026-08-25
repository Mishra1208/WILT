import React, { useState } from 'react';
import { RotateCw, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RevisionView = () => {
  const { concepts, openPostDetail, posts } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  if (!concepts || concepts.length === 0) return null;

  const currentConcept = concepts[currentIdx % concepts.length];

  const handleNext = (mastered) => {
    if (mastered) {
      setMasteredCount((p) => p + 1);
    } else {
      setReviewCount((p) => p + 1);
    }
    setIsFlipped(false);
    setCurrentIdx((p) => (p + 1) % concepts.length);
  };

  const handleOpenSource = () => {
    if (currentConcept.relatedPostId) {
      const post = posts.find((p) => p.id === currentConcept.relatedPostId);
      if (post) openPostDetail(post);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Flashcard Recall
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Active recall session for exam prep and formula memory.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            ✓ {masteredCount} Mastered
          </span>
          <span className="px-3 py-1 rounded-full bg-coral-50 text-coral-600 border border-coral-100">
            ↻ {reviewCount} Review
          </span>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 font-mono font-semibold">
        Card {(currentIdx % concepts.length) + 1} of {concepts.length}
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
                {currentConcept.category}
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
    </div>
  );
};
