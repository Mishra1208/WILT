import React from 'react';
import { X, Heart, Bookmark, Clock, CheckCircle2, AlertCircle, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const PostDetailModal = () => {
  const { selectedPost, closePostDetail, highlightSnippet, toggleLike, setCurrentView, setSearchQuery } = useApp();
  const { user, setUser } = useAuth();

  if (!selectedPost) return null;

  const isLiked = user?.likedPosts?.includes(selectedPost.id);
  const isSaved = user?.savedPosts?.includes(selectedPost.id);

  const handleLike = () => {
    if (!user) return;
    toggleLike(selectedPost.id, user);
    const updatedLiked = isLiked
      ? user.likedPosts.filter((id) => id !== selectedPost.id)
      : [...(user.likedPosts || []), selectedPost.id];
    setUser({ ...user, likedPosts: updatedLiked });
  };

  const handleSave = () => {
    if (!user) return;
    const updatedSaved = isSaved
      ? user.savedPosts.filter((id) => id !== selectedPost.id)
      : [...(user.savedPosts || []), selectedPost.id];
    setUser({ ...user, savedPosts: updatedSaved });
  };

  const handleTermClick = (term) => {
    closePostDetail();
    setSearchQuery(term);
    setCurrentView('dictionary');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
              {selectedPost.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">• {selectedPost.readTime}</span>
          </div>

          <button
            onClick={closePostDetail}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active recall context banner */}
        {highlightSnippet && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Active Recall Reference from Quiz</span>
            </div>
            <p className="text-xs text-amber-950 font-mono font-medium">
              "{highlightSnippet}"
            </p>
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          {selectedPost.title}
        </h1>

        {/* Author Header */}
        <div className="flex items-center justify-between py-3.5 border-y border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={selectedPost.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
              alt={selectedPost.author?.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>{selectedPost.author?.name}</span>
                <span className="text-[11px] text-slate-400 font-mono font-normal">
                  @{selectedPost.author?.username}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">{selectedPost.author?.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{selectedPost.likes}</span>
            </button>

            <button
              onClick={handleSave}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-primary-600' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans space-y-4">
          {selectedPost.content}
        </div>

        {/* Source of Trust Verification Block */}
        {(selectedPost.sourceUrl || selectedPost.sourceContext) && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-wider">
              <span className="text-sm">🛡️</span>
              <span>Source of Trust & Verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              {selectedPost.sourceUrl && (
                <div className="p-2.5 rounded-xl bg-white border border-emerald-100 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Reference Link</span>
                    <span className="font-mono text-emerald-700 truncate block text-[11px]">
                      {selectedPost.sourceUrl}
                    </span>
                  </div>
                  <a
                    href={selectedPost.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] whitespace-nowrap"
                  >
                    Open ↗
                  </a>
                </div>
              )}

              {selectedPost.sourceContext && (
                <div className="p-2.5 rounded-xl bg-white border border-emerald-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Learning Location / Context</span>
                  <span className="font-medium text-slate-800 text-[11px]">
                    📍 {selectedPost.sourceContext}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Key Takeaways */}
        {selectedPost.keyTakeaways && selectedPost.keyTakeaways.length > 0 && (
          <div className="p-5 rounded-2xl bg-primary-50/70 border border-primary-100 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-primary-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>Key Study Takeaways</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {selectedPost.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Associated Community Glossary Terms */}
        {selectedPost.terms && selectedPost.terms.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Dictionary concepts mentioned:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedPost.terms.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTermClick(term)}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
