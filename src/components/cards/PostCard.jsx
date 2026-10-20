import React from 'react';
import { Heart, Bookmark, Clock, ShieldCheck, Link as LinkIcon, MapPin, Sparkles, Lightbulb } from 'lucide-react';
import { topicColor } from '../../lib/topicColor';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const PostCard = ({ post }) => {
  const { openPostDetail, toggleLike, isPostSaved, toggleSavePost } = useApp();
  const { user, setUser, toggleUserLikePost, requireAuth } = useAuth();

  const isLiked = user?.likedPosts?.includes(post.id);
  const isSaved = isPostSaved(post.id) || (user?.savedPosts && user.savedPosts.includes(post.id));

  const handleLike = (e) => {
    e.stopPropagation();
    requireAuth(() => {
      if (user) {
        toggleLike(post.id, user);
        toggleUserLikePost(post.id);
      }
    });
  };

  const handleSave = (e) => {
    e.stopPropagation();
    requireAuth(() => {
      toggleSavePost(post.id);
      if (user) {
        const updatedSaved = isSaved
          ? (user.savedPosts || []).filter((id) => id !== post.id)
          : [...(user.savedPosts || []), post.id];
        setUser({ ...user, savedPosts: updatedSaved });
      }
    });
  };

  // Clean trust source & reference badges
  const linkAtt = post.attachments?.find((a) => a.type === 'link');
  const refSourceAtt = post.attachments?.find((a) => a.type === 'reference_source');
  
  const rawUrl = linkAtt?.url || (post.sourceUrl && /^(https?:\/\/|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i.test(post.sourceUrl) ? post.sourceUrl : null);
  const trustDomain = rawUrl ? rawUrl.replace(/^https?:\/\/(www\.)?/i, '').split('/')[0] : null;

  const locationText = refSourceAtt?.name || (post.sourceContext && post.sourceContext !== 'Verified Learner Post' ? post.sourceContext : (post.sourceUrl && !rawUrl ? post.sourceUrl : null));

  const tone = topicColor(post.category || '');

  const hasImage = post.attachments && post.attachments.some((a) => a.type === 'image' || a.url?.startsWith('blob:') || a.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i));
  const imageUrl = hasImage
    ? post.attachments.find((a) => a.type === 'image' || a.url?.startsWith('blob:') || a.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i))?.url
    : null;
  const takeaway = post.keyTakeaways && post.keyTakeaways[0] && post.keyTakeaways[0].trim() !== (post.title || '').trim() && post.keyTakeaways[0].trim() !== (post.summary || '').trim()
    ? post.keyTakeaways[0]
    : null;
  const summary = post.summary && post.summary.trim() !== (post.title || '').trim() ? post.summary : null;

  return (
    <article
      onClick={() => requireAuth(() => openPostDetail(post))}
      className="group card-lift p-5 sm:p-6 rounded-xl bg-white border border-line cursor-pointer flex flex-col min-w-0"
    >
      {/* Topic + read time */}
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className={`inline-flex items-center gap-1.5 font-semibold truncate ${tone.text}`}>
          <span className={`w-2 h-2 rounded-[2px] shrink-0 ${tone.dot}`} />
          {post.category}
        </span>
        <span className="text-muted shrink-0">{post.readTime}</span>
      </div>

      <h3 className="mt-3 text-[19px] font-semibold text-ink leading-snug tracking-[-0.01em] group-hover:underline decoration-line underline-offset-4">
        {post.title}
      </h3>

      {summary && (
        <p className="mt-2 font-serif text-[17px] text-muted line-clamp-3 leading-snug">{summary}</p>
      )}

      {imageUrl && (
        <div className="mt-4 rounded-lg overflow-hidden border border-line bg-haze">
          <img loading="lazy" decoding="async" src={imageUrl} alt="" className="w-full h-36 object-cover" />
        </div>
      )}

      {takeaway && (
        <p className="mt-4 pl-3 border-l-2 border-highlight font-serif italic text-[16px] text-ink/85 line-clamp-2 leading-snug">
          {takeaway}
        </p>
      )}

      <div className="flex-1" />

      {(trustDomain || locationText) && (
        <div className="mt-4 flex items-center gap-x-3 gap-y-1 flex-wrap text-[13px] text-muted min-w-0">
          {trustDomain && (
            <span className="inline-flex items-center gap-1 min-w-0">
              <ShieldCheck className="w-3.5 h-3.5 text-mint-600 shrink-0" />
              <span className="truncate">{trustDomain}</span>
            </span>
          )}
          {locationText && (
            <span className="inline-flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{locationText}</span>
            </span>
          )}
        </div>
      )}

      {/* Author + actions */}
      <div className="mt-4 pt-4 border-t border-line flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <img
            loading="lazy"
            decoding="async"
            src={post.author?.avatar || ''}
            alt=""
            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
            className="w-6 h-6 rounded-full bg-haze shrink-0"
          />
          <span className="text-[13px] font-medium text-ink truncate">@{post.author?.username || 'learner'}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleLike}
            aria-label={isLiked ? 'Unlike' : 'Like'}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[13px] font-medium transition-colors ${
              isLiked ? 'text-rose-600' : 'text-muted hover:text-ink hover:bg-haze'
            }`}
          >
            <Heart key={isLiked ? 'on' : 'off'} className={`w-4 h-4 ${isLiked ? 'fill-rose-500 animate-pop' : ''}`} />
            {post.likes}
          </button>
          <button
            onClick={handleSave}
            aria-label={isSaved ? 'Remove from saved' : 'Save'}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[13px] font-medium transition-colors ${
              isSaved ? 'text-primary-700' : 'text-muted hover:text-ink hover:bg-haze'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </article>
  );
};
