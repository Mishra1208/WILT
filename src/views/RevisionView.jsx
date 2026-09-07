import React from 'react';
import { Sparkles, Clock } from 'lucide-react';

export const RevisionView = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Glowing Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200/80 text-primary-700 text-xs font-extrabold tracking-wider uppercase shadow-2xs">
          <Sparkles className="w-4 h-4 text-primary-600 animate-pulse" />
          <span>Active Recall Engine</span>
        </div>

        {/* Big Stylish Headline */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 leading-none">
            COMING SOON<span className="text-primary-600">.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            We are crafting WILT's next-generation spaced repetition & flashcard revision experience.
          </p>
        </div>

        {/* Minimal Timeline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 text-slate-600 text-xs font-mono font-bold">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Expected Release: 2026 Edition</span>
        </div>

      </div>
    </div>
  );
};

export default RevisionView;
