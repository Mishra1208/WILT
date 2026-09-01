import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  Heart, 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Sparkles, 
  Lock, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  User,
  ExternalLink,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const PostDetailModal = () => {
  const { selectedPost, closePostDetail, highlightSnippet, toggleLike, setCurrentView, setSearchQuery, addCommentToPost } = useApp();
  const { user, setUser } = useAuth();
  const [commentInput, setCommentInput] = useState('');
  const [commentError, setCommentError] = useState(null);

  if (!selectedPost) return null;

  const isLiked = user?.likedPosts?.includes(selectedPost.id);
  const isSaved = user?.savedPosts?.includes(selectedPost.id);

  const comments = selectedPost.comments || [];
  const isDiscussionClosed = comments.length >= 6;

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

  const handleAddComment = (e) => {
    e.preventDefault();
    setCommentError(null);

    if (isDiscussionClosed) {
      setCommentError('Discussion capacity reached (6/6 students max).');
      return;
    }

    if (!commentInput.trim()) return;

    const added = addCommentToPost(selectedPost.id, commentInput, user);
    if (added) {
      setCommentInput('');
    } else {
      setCommentError('Discussion is locked as 6 students have already commented.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto animate-fadeIn flex flex-col min-h-screen select-none">
      
      {/* FULL PAGE TOP STICKY HEADER */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={closePostDetail}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Back to Discover</span>
          </button>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline truncate max-w-xs">
            {selectedPost.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLiked
                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{selectedPost.likes}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleSave}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSaved
                ? 'bg-primary-50 border-primary-200 text-primary-700 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-primary-600' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Close X Button */}
          <button
            onClick={closePostDetail}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* FULL PAGE MAIN CONTENT CANVAS */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Active Recall Reference Banner */}
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

        {/* MAIN ARTICLE CARD CONTAINER */}
        <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* Category & Read Time Pills */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
              {selectedPost.category}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{selectedPost.readTime}</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              • {selectedPost.createdAt || 'Recent'}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            {selectedPost.title}
          </h1>

          {/* Author Meta Bar */}
          <div className="flex items-center justify-between py-4 border-y border-slate-100 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedPost.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                alt={selectedPost.author?.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
              />
              <div>
                <div className="text-sm font-extrabold text-slate-900 font-mono">
                  @{selectedPost.author?.username || 'learner'}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {selectedPost.author?.role || 'Student Scholar'}
                </div>
              </div>
            </div>

            {selectedPost.author?.badge && (
              <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                {selectedPost.author.badge}
              </span>
            )}
          </div>

          {/* Article Body Content */}
          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line font-sans">
            {selectedPost.content}
          </div>

          {/* Attached Media / Photos / Files Gallery */}
          {selectedPost.attachments && selectedPost.attachments.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-primary-600" />
                <span>Attached Photos & Files ({selectedPost.attachments.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedPost.attachments.map((att, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2.5">
                    {att.type === 'image' || att.url?.startsWith('blob:') || att.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <div className="space-y-2">
                        <img
                          src={att.url}
                          alt={att.name || 'Uploaded photo'}
                          className="w-full max-h-96 object-contain rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                        />
                        <span className="text-[11px] font-bold text-slate-700 block px-1 truncate">
                          📷 {att.name || 'Photo Attachment'}
                        </span>
                      </div>
                    ) : (
                      <div className="p-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          {att.type === 'file' ? <FileText className="w-4 h-4 text-primary-600 shrink-0" /> : <LinkIcon className="w-4 h-4 text-primary-600 shrink-0" />}
                          <span className="text-xs font-bold text-slate-800 truncate">{att.name}</span>
                        </div>
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-primary-600 text-white font-bold text-xs hover:bg-primary-700 transition-colors"
                        >
                          View
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source of Trust & Verification Block */}
          {(selectedPost.sourceUrl || selectedPost.sourceContext) && (
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Source of Trust & Verification</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {selectedPost.sourceUrl && (
                  <div className="p-3 rounded-xl bg-white border border-emerald-100 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Reference Source</span>
                      <span className="font-mono text-emerald-700 truncate block text-xs">
                        {selectedPost.sourceUrl}
                      </span>
                    </div>
                    <a
                      href={selectedPost.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 whitespace-nowrap cursor-pointer"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {selectedPost.sourceContext && (
                  <div className="p-3 rounded-xl bg-white border border-emerald-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Learning Location / Context</span>
                    <span className="font-semibold text-slate-800 text-xs">
                      📍 {selectedPost.sourceContext}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          {selectedPost.keyTakeaways && selectedPost.keyTakeaways.length > 0 && (
            <div className="p-6 rounded-2xl bg-primary-50/70 border border-primary-100 space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-primary-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span>Key Study Takeaways</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {selectedPost.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
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
              <span className="text-xs font-extrabold text-slate-700 block mb-2">
                Dictionary concepts mentioned in this post:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedPost.terms.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTermClick(term)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-primary-600" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* 6-STUDENT CAPPED DISCUSSION FORUM SECTION */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Discussion Header & Capacity Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary-100/70 text-primary-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  Peer Discussion Forum
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  Capped at maximum 6 student contributors per post
                </p>
              </div>
            </div>

            {/* Status Capacity Badge */}
            {isDiscussionClosed ? (
              <span className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-extrabold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>Discussion Closed (6/6 Capacity Reached)</span>
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>{comments.length}/6 Student Slots Used ({6 - comments.length} remaining)</span>
              </span>
            )}
          </div>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No peer comments yet</p>
                <p className="text-[11px] text-slate-400">Be one of the 6 students to start the discussion for this insight!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={comment.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                        alt={comment.author?.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900 font-mono">@{comment.author?.username || 'learner'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{comment.createdAt || 'Just now'}</span>
                  </div>
                  <p className="text-xs text-slate-700 pl-9 font-medium leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Comment Input or Closed Banner */}
          {isDiscussionClosed ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>🔒 This peer discussion has reached its max capacity of 6 student contributors and is now closed.</span>
            </div>
          ) : (
            <form onSubmit={handleAddComment} className="space-y-3 pt-2 border-t border-slate-100">
              {commentError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{commentError}</span>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={`Join the discussion (Slot ${comments.length + 1} of 6)...`}
                  className="flex-1 px-4 py-2.5 text-xs rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Comment</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

        </section>

      </main>
    </div>
  );
};

export default PostDetailModal;
