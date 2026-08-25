import React from 'react';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConceptCard = ({ concept }) => {
  const { setCurrentView, setSearchQuery } = useApp();

  const handleConceptClick = () => {
    setSearchQuery(concept.term);
    setCurrentView('dictionary');
  };

  return (
    <div
      onClick={handleConceptClick}
      className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-primary-300 hover:shadow-soft transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-primary-600 transition-colors">
            {concept.term}
          </h4>
          <span className="inline-block mt-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            {concept.category}
          </span>
        </div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </div>
  );
};
