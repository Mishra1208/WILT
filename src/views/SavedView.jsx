import React from 'react';
import { Bookmark, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/cards/PostCard';

export const SavedView = () => {
  const { posts, setCurrentView } = useApp();
  const { user } = useAuth();

  const savedPosts = posts.filter((p) => user?.savedPosts?.includes(p.id));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Saved Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your personal library of bookmarked formulas, shortcuts, and study notes.
        </p>
      </div>

      {savedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 shadow-soft">
          <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-900">No saved posts yet</h4>
          <p className="text-xs text-slate-500 mt-1">
            Click the bookmark icon on any post card to save it for exam revision.
          </p>
          <button
            onClick={() => setCurrentView('discover')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-btn transition-all"
          >
            Explore Insights
          </button>
        </div>
      )}
    </div>
  );
};
