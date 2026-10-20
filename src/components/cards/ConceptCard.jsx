import React from 'react';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { topicColor } from '../../lib/topicColor';

export const ConceptCard = ({ concept }) => {
  const { setCurrentView, setSearchQuery } = useApp();

  const handleConceptClick = () => {
    setSearchQuery(concept.term);
    setCurrentView('dictionary');
  };

  const tone = topicColor(concept.category || '');

  return (
    <button
      onClick={handleConceptClick}
      className="group card-lift w-full text-left flex items-center justify-between gap-3 p-4 rounded-xl bg-white border border-line cursor-pointer min-w-0"
    >
      <div className="min-w-0">
        <div className={`text-[13px] font-semibold ${tone.text}`}>{concept.category}</div>
        <h4 className="mt-0.5 text-[17px] font-semibold text-ink leading-snug truncate">{concept.term}</h4>
      </div>
      <ArrowUpRight className="w-4 h-4 shrink-0 text-muted group-hover:text-ink transition-colors" />
    </button>
  );
};
