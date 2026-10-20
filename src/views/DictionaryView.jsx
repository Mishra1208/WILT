import React, { useState } from 'react';
import { BookOpen, Search, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHero, HeroAction } from '../components/widgets/PageHero';
import { topicColor } from '../lib/topicColor';
import { useAuth } from '../context/AuthContext';

export const DictionaryView = () => {
  const { concepts, posts, openPostDetail, setIsNewConceptModalOpen } = useApp();
  const { requireAuth } = useAuth();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLetter, setActiveLetter] = useState('All');

  const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  // Extract jargon terms from community posts dynamically
  const postExtractedConcepts = (posts || []).flatMap((p) => {
    if (!p.terms || p.terms.length === 0) return [];
    return p.terms.map((term, idx) => ({
      id: `post-term-${p.id}-${idx}`,
      term: term,
      category: p.category || 'General',
      definition: p.summary || p.title,
      plainExplanation: p.keyTakeaways?.[0] || `Community concept from post "${p.title}"`,
      contributor: p.author?.username || 'peer',
      relatedPostId: p.id
    }));
  });

  // Combine concepts and post terms, deduplicating by term
  const allConcepts = [...(concepts || []), ...postExtractedConcepts];
  const uniqueConcepts = Array.from(
    new Map(allConcepts.map((c) => [c.term.trim().toLowerCase(), c])).values()
  );

  const filteredConcepts = uniqueConcepts.filter((c) => {
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
      requireAuth(() => openPostDetail(post));
    }
  };

  return (
    <div className="px-5 sm:px-8 py-8 sm:py-10 max-w-7xl mx-auto space-y-8">
      <PageHero
        icon={BookOpen}
        title="Dictionary"
        description="Finance and tech terms explained in plain English by your classmates, with formulas where they help."
        aside={
          <HeroAction onClick={() => requireAuth(() => setIsNewConceptModalOpen(true))} icon={Plus}>Add a term</HeroAction>
        }
      >
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a term, e.g. Repo Rate, EBITDA, BFS"
            className="w-full pl-10 pr-4 py-3 text-[16px] rounded-md bg-white border border-line text-ink placeholder-muted focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-ink/30"
          />
        </div>
        <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar py-1 mt-3">
          {alphabet.map((letter) => {
            const isSelected = activeLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => setActiveLetter(letter)}
                className={`min-w-[2rem] h-8 px-2 flex-shrink-0 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isSelected ? 'bg-ink text-white' : 'text-muted hover:text-ink hover:bg-white'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </PageHero>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredConcepts.map((concept) => (
          <div
            key={concept.id}
            className="card-lift p-5 sm:p-6 rounded-xl bg-white border border-line flex flex-col justify-between min-w-0"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3 min-w-0">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-ink break-words tracking-[-0.02em]">
                    {concept.term}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Added by @{concept.contributor || 'peer'}
                  </span>
                </div>

                <span className={`shrink-0 whitespace-nowrap text-[13px] font-semibold ${topicColor(concept.category || '').text}`}>
                  {concept.category}
                </span>
              </div>

              {concept.plainExplanation && (
                <div className="pl-3 border-l-2 border-highlight mb-3.5">
                  <div className="text-[13px] font-semibold text-ink flex items-center gap-1 mb-1">
                                        <span>In plain English</span>
                  </div>
                  <p className="font-serif text-[17px] text-ink/85 leading-snug">
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
