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
  TrendingUp, 
  Globe2, 
  Building2, 
  Coins, 
  Landmark, 
  ArrowRight,
  Zap,
  Check,
  X
} from 'lucide-react';
import { KNOWLEDGE_QUEST_CATEGORIES, KNOWLEDGE_QUEST_ARTICLES, KNOWLEDGE_QUEST_QUIZ } from '../data/knowledgeQuestData';
import { fetchLiveBusinessNews } from '../services/newsService';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const KnowledgeQuestView = () => {
  const [articles, setArticles] = useState(KNOWLEDGE_QUEST_ARTICLES);
  const [isLoading, setIsLoading] = useState(true);
  const [savedArticleIds, setSavedArticleIds] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchLiveBusinessNews().then((liveNews) => {
      if (liveNews && liveNews.length > 0) {
        setArticles([...liveNews, ...KNOWLEDGE_QUEST_ARTICLES]);
      }
      setIsLoading(false);
    });
  }, []);

  const toggleSaveArticle = (id) => {
    setSavedArticleIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-16 px-4 sm:px-6">
      
      {/* Hero Header Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/20 border border-primary-400/30 text-primary-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-primary-400 animate-spin-slow" />
            <span>Times of India Business & Global Digest</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-display">
            Knowledge <span className="bg-gradient-to-r from-primary-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Quest</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            Master current business affairs for campus placements. Condensed top headlines from Times of India with 30-second executive summaries and ready-to-use placement interview talking points.
          </p>

          {/* Stats Bar & Quick Quiz Button */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recruiter-Ready Insights</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span>International & India News</span>
            </div>
            <button
              onClick={() => setIsQuizModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-primary-500/25 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Test Interview Retention</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Search Filter */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Sub-Hub Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {KNOWLEDGE_QUEST_CATEGORIES.map((cat) => {
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border",
                    activeCategory === cat.id
                      ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/20 scale-102"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  )}
                >
                  <span>{cat.label}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-black",
                    activeCategory === cat.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search business news..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => {
          const isSaved = savedArticleIds.includes(article.id);
          const isCopied = copiedId === article.id;

          return (
            <div
              key={article.id}
              className="rounded-3xl bg-white border border-slate-200/80 hover:border-primary-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div className="space-y-4">
                
                {/* Article Header Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 font-black text-[10px] uppercase tracking-wider shadow-sm">
                      {article.categoryLabel}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold text-slate-300 block mb-0.5">
                      {article.source} · {article.date}
                    </span>
                    <h3 className="text-sm font-extrabold leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  
                  {/* Executive Summary Block */}
                  <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>30-Second Executive Summary</span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 font-medium leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="font-extrabold text-primary-600 shrink-0">·</span>
                        <span><strong className="text-slate-900 font-bold">What Happened:</strong> {typeof article.summary === 'object' ? (article.summary?.whatHappened || article.title) : (article.summary || article.title)}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-extrabold text-indigo-600 shrink-0">·</span>
                        <span><strong className="text-slate-900 font-bold">Why It Matters:</strong> {typeof article.summary === 'object' ? (article.summary?.whyItMatters || 'Key market development.') : 'Key market development.'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-extrabold text-emerald-600 shrink-0">·</span>
                        <span><strong className="text-slate-900 font-bold">Key Metric:</strong> <code className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">{typeof article.summary === 'object' ? (article.summary?.keyMetric || `Source: ${article.source || 'News'}`) : `Source: ${article.source || 'News'}`}</code></span>
                      </li>
                    </ul>
                  </div>

                  {/* Placement Interview Talking Point Box */}
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2 relative">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-indigo-950 uppercase tracking-wider">
                        <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
                        <span>Placement Interview Talking Point</span>
                      </div>
                      <button
                        onClick={() => handleCopyTalkingPoint(article.interviewTalkingPoint, article.id)}
                        className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2 py-1 rounded-lg border border-indigo-200 flex items-center gap-1 transition-all cursor-pointer"
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

                    <p className="text-xs text-indigo-900 font-medium leading-relaxed italic">
                      "{article.interviewTalkingPoint}"
                    </p>

                    {/* Key Terms Badges */}
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {article.keyTerms.map((term, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-indigo-100 text-indigo-700 text-[10px] font-bold">
                          #{term}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Card Footer Action Bar */}
              <div className="p-5 sm:p-6 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 mt-4">
                <button
                  onClick={() => toggleSaveArticle(article.id)}
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>Read Full Article on Times of India</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

      {/* Placement Interview Retention Quiz Modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 space-y-6 relative">
            
            <button
              onClick={resetQuiz}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
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
                      else style = "bg-slate-50 text-slate-400 border-slate-100 opacity-60";
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
                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1 animate-fadeIn">
                    <span className="text-[10px] font-extrabold uppercase text-indigo-900 block">Explanation</span>
                    <p className="text-xs text-indigo-800 font-medium">
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

    </div>
  );
};

export default KnowledgeQuestView;
