import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  HelpCircle, 
  MessageSquareQuote, 
  Globe2, 
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Zap,
  Check,
  X,
  Calendar,
  Clock,
  Lock,
  Newspaper
} from 'lucide-react';
import { KNOWLEDGE_QUEST_CATEGORIES, KNOWLEDGE_QUEST_ARTICLES, KNOWLEDGE_QUEST_QUIZ, SECONDARY_FALLBACK_IMAGES } from '../data/knowledgeQuestData';
import { fetchLiveBusinessNews, getNewsFallbackSvg } from '../services/newsService';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { PageHero, HeroChip, HeroAction, TabRow } from '../components/widgets/PageHero';

export const KnowledgeQuestView = () => {
  const { toggleSaveNews, isNewsSaved } = useApp();
  const { requireAuth, isLoggedIn } = useAuth();
  const [articles, setArticles] = useState(KNOWLEDGE_QUEST_ARTICLES);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [copiedId, setCopiedId] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchLiveBusinessNews().then((liveNews) => {
      if (liveNews && liveNews.length > 0) {
        setArticles(liveNews);
      }
    });
  }, []);

  // Reset pagination when category or search query changes
  useEffect(() => {
    setVisibleCount(10);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quiz Modal State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Filter Articles
  const filteredArticles = (articles || []).filter((article) => {
    if (!article) return false;
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const q = (searchQuery || '').toLowerCase();
    
    const whatHappened = typeof article.summary === 'object' ? (article.summary?.whatHappened || '') : (article.summary || '');
    const whyItMatters = typeof article.summary === 'object' ? (article.summary?.whyItMatters || '') : '';
    
    const matchesSearch = 
      (article.title || '').toLowerCase().includes(q) ||
      whatHappened.toLowerCase().includes(q) ||
      whyItMatters.toLowerCase().includes(q) ||
      (article.keyTerms && article.keyTerms.some(term => (term || '').toLowerCase().includes(q)));
    
    return matchesCategory && matchesSearch;
  });

  const displayedArticles = filteredArticles.slice(0, visibleCount);

  const getCategoryCount = (catId) => {
    if (catId === 'all') return articles.length;
    return articles.filter((a) => a.category === catId).length;
  };

  const handleCopyTalkingPoint = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSelectQuizOption = (optIdx) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    if (optIdx === KNOWLEDGE_QUEST_QUIZ[quizIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < KNOWLEDGE_QUEST_QUIZ.length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizSubmitted(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizSubmitted(false);
    setIsQuizModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 px-5 sm:px-8 pt-8 sm:pt-10">
      
      <PageHero
        icon={Newspaper}
        title="Knowledge Quest"
        description="Business news, cut down to what you'd need in a placement interview: what happened, why it matters, and how to talk about it."
        aside={
          <HeroAction onClick={() => requireAuth(() => setIsQuizModalOpen(true))} icon={HelpCircle}>Test yourself on the news</HeroAction>
        }
      >
        <div className="flex flex-col-reverse md:flex-row md:items-end gap-4">
          <TabRow className="flex-1">
            {KNOWLEDGE_QUEST_CATEGORIES.map((cat) => (
              <HeroChip key={cat.id} active={activeCategory === cat.id} onClick={() => setActiveCategory(cat.id)}>
                {cat.label.replace(/^[^A-Za-z]+/, '')}
                <span className="ml-1.5 text-muted tabular-nums">{getCategoryCount(cat.id)}</span>
              </HeroChip>
            ))}
          </TabRow>
          <div className="relative w-full md:w-64 shrink-0 md:mb-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the news"
              className="w-full pl-9 pr-3 py-2 text-[15px] rounded-md bg-white border border-line text-ink placeholder-muted focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-ink/30"
            />
          </div>
        </div>
      </PageHero>


      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedArticles.map((article) => {
          const isSaved = isNewsSaved(article.id);
          const isCopied = copiedId === article.id;

          return (
            <div
              key={article.id}
              className="card-lift rounded-xl bg-white border border-line flex flex-col justify-between overflow-hidden group relative"
            >
              <div className="space-y-4">
                
                {/* Article Header Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img loading="lazy" decoding="async"
                    src={article.imageUrl}
                    alt={article.title}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.retried) {
                        e.currentTarget.dataset.retried = "true";
                        e.currentTarget.src = SECONDARY_FALLBACK_IMAGES[article.category] || SECONDARY_FALLBACK_IMAGES.india_business;
                      } else {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getNewsFallbackSvg(article.categoryLabel || article.category);
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-white/95 text-ink font-semibold text-xs shadow-sm">
                      {article.categoryLabel}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white font-extrabold text-[11px] tracking-wide flex items-center gap-1.5 shadow-md border border-white/20">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{article.isLive ? article.date : 'Curated brief'}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-2 mb-1 text-[11px] font-bold text-slate-200">
                      <span>{article.isLive ? article.source : 'WILT curated brief · evergreen explainer'}</span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug tracking-[-0.01em] line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </div>

                {/* Content Body Container (Blurred if unauthenticated) */}
                <div className="relative flex-1 flex flex-col justify-between min-h-[300px]">
                  <div className={cn("p-5 sm:p-6 space-y-4 transition-all duration-300", !isLoggedIn && "filter blur-md select-none pointer-events-none opacity-40")}>
                    
                    {article.isLive ? (
                      <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-ink">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>Live from Times of India</span>
                        </div>
                        {article.summary?.whatHappened ? (
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">
                            <strong className="text-slate-900 font-bold">TOI summary:</strong> {article.summary.whatHappened}
                          </p>
                        ) : null}
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          This is breaking news straight from the TOI feed, so there's no WILT analysis or interview talking point for it yet. Read the full article for the details.
                        </p>
                      </div>
                    ) : (
                    <>
                    {/* Executive Summary Block */}
                    <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-ink">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>The 30-second version</span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-700 font-medium leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="font-extrabold text-primary-600 shrink-0">·</span>
                          <span><strong className="text-slate-900 font-bold">What Happened:</strong> {typeof article.summary === 'object' ? (article.summary?.whatHappened || article.title) : (article.summary || article.title)}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-extrabold text-primary-600 shrink-0">·</span>
                          <span><strong className="text-slate-900 font-bold">Why It Matters:</strong> {typeof article.summary === 'object' ? (article.summary?.whyItMatters || 'Key market development.') : 'Key market development.'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-extrabold text-emerald-600 shrink-0">·</span>
                          <span><strong className="text-slate-900 font-bold">Key Metric:</strong> <code className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">{typeof article.summary === 'object' ? (article.summary?.keyMetric || `Source: ${article.source || 'News'}`) : `Source: ${article.source || 'News'}`}</code></span>
                        </li>
                      </ul>
                    </div>

                    {/* Placement Interview Talking Point Box */}
                    <div className="p-4 rounded-2xl bg-primary-50/70 border border-primary-100 space-y-2 relative">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-primary-950">
                          <MessageSquareQuote className="w-4 h-4 text-primary-600" />
                          <span>Say this in an interview</span>
                        </div>
                        <button
                          onClick={() => handleCopyTalkingPoint(article.interviewTalkingPoint, article.id)}
                          className="text-[11px] font-bold text-primary-700 hover:text-primary-900 bg-white px-2 py-1 rounded-lg border border-primary-200 flex items-center gap-1 transition-all cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-extrabold">Copied!</span>
                            </>
                          ) : (
                            <span>Copy Answer</span>
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-primary-900 font-medium leading-relaxed italic">
                        "{article.interviewTalkingPoint}"
                      </p>

                      {/* Key Terms Badges */}
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {(article.keyTerms || []).map((term, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-primary-100 text-primary-700 text-[11px] font-bold">
                            #{term}
                          </span>
                        ))}
                      </div>
                    </div>
                    </>
                    )}

                  </div>

                  {/* Card Footer Action Bar */}
                  <div className={cn("p-5 sm:p-6 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 mt-4", !isLoggedIn && "filter blur-md select-none pointer-events-none opacity-40")}>
                    <button
                      onClick={() => requireAuth(() => toggleSaveNews(article))}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border",
                        isSaved
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                      )}
                    >
                      <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-amber-500 text-amber-500")} />
                      <span>{isSaved ? 'Saved to Notes' : 'Save Prep'}</span>
                    </button>

                    <a
                      href={article.toiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-iris px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Read on Times of India</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Lock Overlay for Unauthenticated Users */}
                  {!isLoggedIn && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-white/70 text-center rounded-b-3xl">
                      <div className="p-3 rounded-full bg-white text-primary-600 shadow-xl mb-3 border border-slate-100 ring-4 ring-primary-500/10">
                        <Lock className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 mb-1 font-display">
                        30-Sec Executive Summary Locked
                      </h4>
                      <p className="text-xs text-slate-700 font-semibold max-w-xs mb-4 leading-relaxed">
                        Sign in to unlock recruiter-ready summaries, placement interview talking points, and full article links.
                      </p>
                      <button
                        onClick={() => requireAuth()}
                        className="px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center gap-2 transform active:scale-95 group"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Read Full Summary</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Load More News Button */}
      {filteredArticles.length > visibleCount && (
        <div className="flex justify-center pt-6 pb-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="px-8 py-3.5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 font-extrabold text-xs shadow-md hover:shadow-xl hover:border-primary-300 hover:text-primary-600 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <span>Load More Business News ({filteredArticles.length - visibleCount} remaining)</span>
            <ArrowDown className="w-4 h-4 text-primary-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Placement Interview Retention Quiz Modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 space-y-6 relative">
            
            <button
              onClick={resetQuiz}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!quizSubmitted ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-black text-slate-900 font-display">
                      Placement Prep Retention Test
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    Question {quizIndex + 1} of {KNOWLEDGE_QUEST_QUIZ.length}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-800 leading-snug">
                  {KNOWLEDGE_QUEST_QUIZ[quizIndex].question}
                </h4>

                <div className="space-y-2.5">
                  {KNOWLEDGE_QUEST_QUIZ[quizIndex].options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === KNOWLEDGE_QUEST_QUIZ[quizIndex].correctAnswer;
                    
                    let style = "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200";
                    if (selectedOption !== null) {
                      if (isCorrect) style = "bg-emerald-50 text-emerald-900 border-emerald-300 font-bold";
                      else if (isSelected) style = "bg-rose-50 text-rose-900 border-rose-300 font-bold";
                      else style = "bg-slate-50 text-slate-500 border-slate-100 opacity-60";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectQuizOption(idx)}
                        disabled={selectedOption !== null}
                        className={cn(
                          "w-full p-3.5 rounded-2xl text-xs font-semibold border text-left transition-all flex items-center justify-between gap-3 cursor-pointer",
                          style
                        )}
                      >
                        <span>{option}</span>
                        {selectedOption !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="p-3.5 rounded-2xl bg-primary-50 border border-primary-100 space-y-1 animate-fadeIn">
                    <span className="text-[11px] font-extrabold uppercase text-primary-900 block">Explanation</span>
                    <p className="text-xs text-primary-800 font-medium">
                      {KNOWLEDGE_QUEST_QUIZ[quizIndex].explanation}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end pt-2">
                  <button
                    onClick={handleNextQuizQuestion}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{quizIndex < KNOWLEDGE_QUEST_QUIZ.length - 1 ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                  🏆
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 font-display">
                    Retention Test Complete!
                  </h3>
                  <p className="text-sm font-semibold text-slate-600">
                    You scored <strong className="text-primary-600">{quizScore} out of {KNOWLEDGE_QUEST_QUIZ.length}</strong> on today's TOI Business & Global News quiz.
                  </p>
                </div>
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  Back to Knowledge Quest
                </button>
              </div>
            )}

          </div>
        </div>
      )}
      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-white/20 cursor-pointer animate-fadeIn"
          aria-label="Back to top"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

    </div>
  );
};

export default KnowledgeQuestView;
