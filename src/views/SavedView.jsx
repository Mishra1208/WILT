import React, { useState } from 'react';
import { 
  Bookmark, 
  FileText, 
  Globe2, 
  ExternalLink, 
  Trash2, 
  MessageSquareQuote, 
  Zap, 
  Compass,
  PenTool,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/cards/PostCard';
import { cn } from '../lib/utils';

export const SavedView = () => {
  const { 
    posts, 
    savedPostIds, 
    savedNewsArticles, 
    toggleSavePost, 
    toggleSaveNews, 
    setCurrentView 
  } = useApp();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'news'
  const [copiedId, setCopiedId] = useState(null);

  const savedPosts = posts.filter((p) => savedPostIds.includes(p.id));

  const handleCopyTalkingPoint = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-16 px-4 sm:px-6 py-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
            <span>Saved Knowledge Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Your Bookmarks & Exam Prep
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            All your saved community learning notes and recruiter-ready business news items in one organized vault.
          </p>
        </div>

        {/* Header Section Tabs Switcher */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            onClick={() => setActiveTab('posts')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeTab === 'posts'
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <PenTool className="w-3.5 h-3.5 text-primary-600" />
            <span>Learning Posts</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black">
              {savedPosts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeTab === 'news'
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Business News</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black">
              {savedNewsArticles.length}
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 1: SAVED COMMUNITY LEARNING POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-600" />
              <span>Saved Community Posts ({savedPosts.length})</span>
            </h2>
          </div>

          {savedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200/80 shadow-xs">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No saved community posts yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Bookmark interesting student concepts, code snippets, and exam notes from the feed to review them anytime.
              </p>
              <button
                onClick={() => setCurrentView('notepad')}
                className="mt-5 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Browse Notepad Slate</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: SAVED BUSINESS NEWS & QUESTS */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-indigo-600" />
              <span>Saved Business News & Quests ({savedNewsArticles.length})</span>
            </h2>
          </div>

          {savedNewsArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedNewsArticles.map((article) => {
                const isCopied = copiedId === article.id;
                const whatHappened = typeof article.summary === 'object' ? (article.summary?.whatHappened || article.title) : (article.summary || article.title);
                const whyItMatters = typeof article.summary === 'object' ? (article.summary?.whyItMatters || 'Key business development.') : 'Key business development.';
                const keyMetric = typeof article.summary === 'object' ? (article.summary?.keyMetric || `Source: ${article.source || 'News'}`) : `Source: ${article.source || 'News'}`;

                return (
                  <div
                    key={article.id}
                    className="rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden"
                  >
                    <div className="space-y-4">
                      
                      {/* Image Header */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider shadow-xs">
                            {article.categoryLabel || 'Business News'}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[10px] font-bold text-slate-300 block mb-0.5">
                            {article.source} · {article.date}
                          </span>
                          <h3 className="text-xs sm:text-sm font-extrabold leading-snug line-clamp-2">
                            {article.title}
                          </h3>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        
                        {/* Executive Summary */}
                        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>Executive Summary</span>
                          </div>
                          <p className="text-slate-700 font-medium leading-relaxed">
                            <strong className="text-slate-900 font-bold">What Happened:</strong> {whatHappened}
                          </p>
                          <p className="text-slate-700 font-medium leading-relaxed">
                            <strong className="text-slate-900 font-bold">Why It Matters:</strong> {whyItMatters}
                          </p>
                        </div>

                        {/* Interview Talking Point */}
                        {article.interviewTalkingPoint && (
                          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 space-y-2 relative">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-950 uppercase tracking-wider">
                                <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Placement Interview Answer</span>
                              </div>
                              <button
                                onClick={() => handleCopyTalkingPoint(article.interviewTalkingPoint, article.id)}
                                className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2 py-0.5 rounded-md border border-indigo-200 flex items-center gap-1 cursor-pointer"
                              >
                                {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <span>Copy</span>}
                              </button>
                            </div>
                            <p className="text-xs text-indigo-900 font-medium italic">
                              "{article.interviewTalkingPoint}"
                            </p>
                          </div>
                        )}

                      </div>

                    </div>

                    {/* Action Bar */}
                    <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 mt-2">
                      <button
                        onClick={() => toggleSaveNews(article)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Remove Bookmark</span>
                      </button>

                      {article.toiUrl && (
                        <a
                          href={article.toiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                        >
                          <span>Full Article</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200/80 shadow-xs">
              <Globe2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No saved business news items</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Save business news and placement interview talking points from Knowledge Quest to quickly review them before campus recruitment interviews.
              </p>
              <button
                onClick={() => setCurrentView('knowledge-quest')}
                className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Go to Knowledge Quest</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SavedView;
