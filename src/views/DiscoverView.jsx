import React from 'react';
import { Sparkles, FileText, Compass, Filter } from 'lucide-react';
import { CATEGORIES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/cards/PostCard';
import { ConceptCard } from '../components/cards/ConceptCard';

export const DiscoverView = () => {
  const {
    posts,
    concepts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setIsNewPostModalOpen
  } = useApp();

  const query = searchQuery.toLowerCase().trim();

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      post.category === selectedCategory ||
      post.tags?.includes(selectedCategory);

    const matchesSearch =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query) ||
      post.author?.name.toLowerCase().includes(query) ||
      post.author?.username.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Filter concepts for the bottom section
  const filteredConcepts = concepts.filter((c) => {
    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      !query ||
      c.term.toLowerCase().includes(query) ||
      c.definition.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const allCategories = Array.from(
    new Set([
      ...CATEGORIES.filter((c) => c !== 'Other'),
      ...posts.map((p) => p.category).filter(Boolean),
      ...concepts.map((c) => c.category).filter(Boolean)
    ])
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Discover
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700">
              {filteredPosts.length} insights
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore verified 30-second peer lessons, formulas, and mental models.
          </p>
        </div>

        {searchQuery && (
          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 self-start sm:self-auto">
            Filtered by: "{searchQuery}"
          </div>
        )}
      </div>

      {/* Category Pills Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {allCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm scale-105'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* All Posts Feed Section */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-12 my-6 rounded-3xl bg-white border border-dashed border-slate-200 text-center shadow-soft">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No posts found in this category
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Be the first to share an insight for this topic.
            </p>
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="mt-4 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold shadow-btn hover:bg-primary-700 transition-all"
            >
              Share Something
            </button>
          </div>
        )}
      </div>

      {/* Concepts Section */}
      {filteredConcepts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Glossary Concepts
              </h2>
              <p className="text-xs text-slate-500">
                Peer-curated finance & tech definitions for quick reference
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConcepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
