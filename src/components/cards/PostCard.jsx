import React from 'react';
import { Heart, Bookmark, Clock, ShieldCheck, Link as LinkIcon, MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const PostCard = ({ post }) => {
  const { openPostDetail, toggleLike, isPostSaved, toggleSavePost } = useApp();
  const { user, setUser } = useAuth();

  const isLiked = user?.likedPosts?.includes(post.id);
  const isSaved = isPostSaved(post.id) || (user?.savedPosts && user.savedPosts.includes(post.id));

  const handleLike = (e) => {
    e.stopPropagation();
    if (!user) return;
    toggleLike(post.id, user);
    const updatedLiked = isLiked
      ? user.likedPosts.filter((id) => id !== post.id)
      : [...(user.likedPosts || []), post.id];
    setUser({ ...user, likedPosts: updatedLiked });
  };

  const handleSave = (e) => {
    e.stopPropagation();
    toggleSavePost(post.id);
    if (user) {
      const updatedSaved = isSaved
        ? (user.savedPosts || []).filter((id) => id !== post.id)
        : [...(user.savedPosts || []), post.id];
      setUser({ ...user, savedPosts: updatedSaved });
    }
  };

  // Clean trust source text
  const linkAtt = post.attachments?.find((a) => a.type === 'link');
  const effectiveUrl = post.sourceUrl || linkAtt?.url || linkAtt?.name;
  const trustDomain = effectiveUrl 
    ? effectiveUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]
    : null;

  return (
    <div
      onClick={() => openPostDetail(post)}
      className="group p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-primary-400/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-4px_rgba(79,70,229,0.08)] transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-3.5">
        {/* Author Header & Topic Pill */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={post.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
              alt={post.author?.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div className="leading-tight">
              <div className="text-xs font-extrabold text-slate-900 font-mono group-hover:text-primary-700 transition-colors">
                @{post.author?.username || 'learner'}
              </div>
            </div>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors">
            {post.category}
          </span>
        </div>

        {/* Post Title */}
        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors leading-snug">
          {post.title}
        </h3>

        {/* Summary / Teaser */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
          {post.summary}
        </p>

        {/* Attached Image Thumbnail Preview */}
        {post.attachments && post.attachments.some(a => a.type === 'image' || a.url?.startsWith('blob:') || a.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) && (
          <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50">
            <img
              src={post.attachments.find(a => a.type === 'image' || a.url?.startsWith('blob:') || a.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i))?.url}
              alt="Attached photo"
              className="w-full h-36 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Minimalist Core Takeaway (Clean hairline accent) */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <div className="py-1 px-3 rounded-xl bg-slate-50/80 border-l-2 border-primary-500 text-xs text-slate-700">
            <span className="font-semibold line-clamp-1">
              💡 {post.keyTakeaways[0]}
            </span>
          </div>
        )}

        {/* Source of Trust (Clean verified tag) */}
        {(post.sourceUrl || post.sourceContext) && (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50/60 px-2.5 py-1 rounded-xl border border-emerald-100/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate font-medium">
              {trustDomain ? (
                <span className="underline">{trustDomain}</span>
              ) : (
                post.sourceContext
              )}
            </span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-slate-100 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${
              isLiked ? 'text-rose-500 font-bold' : 'hover:text-slate-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
            <span className="text-xs font-semibold">{post.likes}</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 transition-colors ${
              isSaved ? 'text-primary-600 font-bold' : 'hover:text-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-primary-600' : ''}`} />
            <span className="text-xs font-semibold">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5" />
          {post.readTime}
        </span>
      </div>
    </div>
  );
};
