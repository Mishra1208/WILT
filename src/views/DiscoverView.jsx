import React from 'react';
import { Sparkles, FileText, Compass, Filter, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/cards/PostCard';
import { PageHero, HeroStat, HeroChip, TabRow } from '../components/widgets/PageHero';
import { ConceptCard } from '../components/cards/ConceptCard';

export const DiscoverView = () => {
  const {
    posts,
    concepts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setIsNewPostModalOpen,
    isPostsLoading
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
    <div className="px-5 sm:px-8 py-8 sm:py-10 max-w-7xl mx-auto space-y-8">
      <PageHero
        icon={Compass}
        title="Discover"
        description="Short, sourced lessons your classmates wrote: formulas, concepts and mental models you can learn in under a minute."
        aside={
          <div className="flex">
            <HeroStat value={filteredPosts.length} label={filteredPosts.length === 1 ? 'insight' : 'insights'} />
            <HeroStat value={allCategories.length - 1} label="topics" />
          </div>
        }
      >
        <TabRow>
          {allCategories.map((cat) => (
            <HeroChip key={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(cat)}>
              {cat}
            </HeroChip>
          ))}
        </TabRow>
        {searchQuery && (
          <div className="mt-3 text-sm text-muted">
            Showing results for <span className="font-semibold text-ink">"{searchQuery}"</span>
          </div>
        )}
      </PageHero>

      {/* All Posts Feed Section */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : isPostsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true" aria-label="Loading posts">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-56 rounded-xl bg-white border border-line animate-pulse" />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-12 my-2 rounded-xl bg-white border border-dashed border-line text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-3">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-ink">Nothing here yet</h3>
            <p className="font-serif text-lg text-muted mt-1 max-w-sm">
              No one has posted in this topic. Share what you learned today and it'll show up here.
            </p>
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="btn-iris mt-5 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
            >
              Write a post
            </button>
          </div>
        )}
      </div>

      {/* Concepts Section */}
      {filteredConcepts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">
                From the glossary
              </h2>
              <p className="font-serif text-lg text-muted">
                Finance and tech terms your classmates defined
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
