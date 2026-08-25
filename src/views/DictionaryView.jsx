import React, { useState } from 'react';
import { BookOpen, Search, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const DictionaryView = () => {
  const { concepts, posts, openPostDetail, setIsNewConceptModalOpen } = useApp();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLetter, setActiveLetter] = useState('All');

  const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const filteredConcepts = concepts.filter((c) => {
    const matchesSearch =
      !search ||
      c.term.toLowerCase().includes(search.toLowerCase()) ||
      c.definition.toLowerCase().includes(search.toLowerCase()) ||
      c.plainExplanation?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === 'All' || c.category === activeCategory;

    const matchesLetter =
      activeLetter === 'All' ||
      c.term.toUpperCase().startsWith(activeLetter);

    return matchesSearch && matchesCategory && matchesLetter;
  });

  const handleOpenRelatedPost = (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      openPostDetail(post);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Community Glossary
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search any finance or tech concept and get simple, peer-written explanations.
          </p>
        </div>

        <button
          onClick={() => setIsNewConceptModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-btn transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Term</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search any concept (e.g. Repo Rate, EBITDA, BFS, Fixed Assets)..."
          className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 shadow-soft transition-all"
        />
      </div>

      {/* A-Z Alphabet Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {alphabet.map((letter) => {
          const isSelected = activeLetter === letter;
          return (
            <button
              key={letter}
              onClick={() => setActiveLetter(letter)}
              className={`w-7 h-7 flex-shrink-0 rounded-lg text-xs font-mono font-bold transition-all ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-btn scale-105'
                  : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredConcepts.map((concept) => (
          <div
            key={concept.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-hover hover:border-primary-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {concept.term}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Contributed by @{concept.contributor || 'peer'}
                  </span>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  {concept.category}
                </span>
              </div>

              {concept.plainExplanation && (
                <div className="p-3.5 rounded-2xl bg-primary-50/70 border border-primary-100 mb-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary-700 flex items-center gap-1 mb-0.5">
                    <Sparkles className="w-3 h-3 text-primary-600" />
                    <span>In Plain English</span>
                  </div>
                  <p className="text-xs text-primary-950 leading-relaxed font-medium">
                    {concept.plainExplanation}
                  </p>
                </div>
              )}

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {concept.definition}
              </p>

              {concept.formula && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3">
                  <code className="text-xs font-mono font-bold text-slate-800">
                    {concept.formula}
                  </code>
                </div>
              )}
            </div>

            {concept.relatedPostId && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => handleOpenRelatedPost(concept.relatedPostId)}
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                >
                  <span>Read related post</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
