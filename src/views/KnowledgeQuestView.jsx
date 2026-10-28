import React, { useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Search,
  HelpCircle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  X,
  Lock,
  Newspaper,
  RefreshCw
} from 'lucide-react';
import {
  fetchMintNews,
  buildMintQuiz,
  timeAgo,
  fallbackImageFor,
  getNewsFallbackSvg,
  MINT_CATEGORIES,
  MINT_EPAPER_URL,
  matchesMintCategory
} from '../services/newsService';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { PageHero, HeroChip, TabRow } from '../components/widgets/PageHero';

const PAGE_SIZE = 18;

const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_FILTERS = [
  { id: 'week', label: 'This week', test: () => true },
  { id: 'day', label: 'Last 24 hours', test: (t) => t >= Date.now() - DAY_MS }
];

// "Top of the news": the latest story from each of these, in order
const TOP_PICKS = ['economy', 'markets', 'companies', 'finance', 'international'];

const StoryImage = ({ article, className }) => (
  <img
    loading="lazy"
    decoding="async"
    src={article.imageUrl}
    alt=""
    onError={(e) => {
      const el = e.currentTarget;
      if (!el.dataset.retried) {
        el.dataset.retried = 'true';
        el.src = fallbackImageFor(article.category);
      } else {
        el.onerror = null;
        el.src = getNewsFallbackSvg(article.categoryLabel);
      }
    }}
    className={className}
  />
);

const Meta = ({ article }) => (
  <div className="flex items-center gap-2 text-[13px] text-muted">
    <span className="font-semibold text-ink">{article.categoryLabel}</span>
    <span aria-hidden="true">·</span>
    <span>{article.regionLabel}</span>
    <span aria-hidden="true">·</span>
    <span>{timeAgo(article.publishedAt)}</span>
  </div>
);

export const KnowledgeQuestView = () => {
  const { toggleSaveNews, isNewsSaved } = useApp();
  const { requireAuth, isLoggedIn } = useAuth();

  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [fetchedAt, setFetchedAt] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const load = () => {
    setStatus('loading');
    fetchMintNews().then(({ articles: list, fetchedAt: at, error }) => {
      setArticles(list);
      setFetchedAt(at);
      setStatus(error ? 'error' : 'ready');
    });
  };

  useEffect(load, []);
  useEffect(() => setVisibleCount(PAGE_SIZE), [activeCategory, searchQuery, dateFilter]);
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---- filtering ----
  const dateTest = DATE_FILTERS.find((d) => d.id === dateFilter)?.test || (() => true);
  const inDateRange = useMemo(
    () => articles.filter((a) => dateTest(Date.parse(a.publishedAt))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [articles, dateFilter]
  );

  const q = searchQuery.trim().toLowerCase();
  const filtered = inDateRange.filter((a) => {
    if (!matchesMintCategory(a, activeCategory)) return false;
    if (!q) return true;
    return a.title.toLowerCase().includes(q) || (a.summary?.whatHappened || '').toLowerCase().includes(q);
  });

  const showTop = activeCategory === 'all' && !q;
  const topStories = useMemo(() => {
    if (!showTop) return [];
    const used = new Set();
    return TOP_PICKS.map((cat) => {
      const pick = inDateRange.find((a) => !used.has(a.id) && a.summary?.whatHappened && matchesMintCategory(a, cat) && a.category !== 'opinion');
      if (pick) used.add(pick.id);
      return pick;
    }).filter(Boolean);
  }, [inDateRange, showTop]);
  const topIds = new Set(topStories.map((a) => a.id));
  const rest = filtered.filter((a) => !topIds.has(a.id));
  const displayed = rest.slice(0, visibleCount);

  const countFor = (catId) => inDateRange.filter((a) => matchesMintCategory(a, catId)).length;

  // ---- quiz from real Mint stories ----
  const [quiz, setQuiz] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const openQuiz = () => {
    const questions = buildMintQuiz(articles, 5);
    if (questions.length === 0) return;
    setQuiz(questions);
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizSubmitted(false);
  };
  const closeQuiz = () => setQuiz(null);
  const pickOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === quiz[quizIndex].correctAnswer) setQuizScore((s) => s + 1);
  };
  const nextQuestion = () => {
    if (quizIndex < quiz.length - 1) {
      setQuizIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      setQuizSubmitted(true);
    }
  };

  const ReadButton = ({ article, compact = false }) => (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'btn-iris rounded-full font-semibold inline-flex items-center gap-1.5 cursor-pointer',
        compact ? 'px-4 py-2 text-[13px]' : 'px-5 py-2.5 text-sm'
      )}
    >
      Read full story on Mint <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );

  const SaveButton = ({ article }) => {
    const saved = isNewsSaved(article.id);
    return (
      <button
        onClick={() => requireAuth(() => toggleSaveNews(article))}
        aria-label={saved ? 'Remove from saved' : 'Save for later'}
        title={saved ? 'Saved' : 'Save for later'}
        className={cn(
          'w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0',
          saved ? 'bg-highlight/40 border-highlight text-ink' : 'border-line text-muted hover:text-ink hover:bg-paper'
        )}
      >
        <Bookmark className={cn('w-4 h-4', saved && 'fill-ink')} />
      </button>
    );
  };

  // Summary text, or a sign-in prompt for guests
  const Summary = ({ article, lines = 'line-clamp-4' }) => {
    const text = article.summary?.whatHappened;
    if (!text) return null;
    if (isLoggedIn) return <p className={cn('text-[15px] leading-relaxed text-ink/80', lines)}>{text}</p>;
    return (
      <div className="relative">
        <p className={cn('text-[15px] leading-relaxed text-ink/80 blur-[5px] select-none', lines)} aria-hidden="true">{text}</p>
        <button
          onClick={() => requireAuth()}
          className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-semibold text-ink cursor-pointer"
        >
          <span className="inline-flex items-center gap-2 bg-white/90 border border-line rounded-full px-4 py-2 shadow-sm">
            <Lock className="w-3.5 h-3.5" /> Sign in to read the summary
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 px-5 sm:px-8 pt-8 sm:pt-10">
      <PageHero
        title="Knowledge Quest"
        description="This week's business and finance news from Mint, India and global, with Mint's own summary. What recruiters expect you to know."
        aside={
          <div className="flex flex-col sm:flex-row gap-2.5">
            <a
              href={MINT_EPAPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full border-2 border-ink text-ink text-[15px] font-semibold hover:bg-ink hover:text-white transition-colors inline-flex items-center justify-center gap-2"
            >
              <Newspaper className="w-4 h-4" /> Open today's e-paper
            </a>
            <button
              onClick={() => requireAuth(openQuiz)}
              disabled={status !== 'ready'}
              className="btn-iris px-5 py-3 rounded-full font-semibold text-[15px] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <HelpCircle className="w-4 h-4" /> Test yourself
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <TabRow>
            {MINT_CATEGORIES.map((cat) => (
              <HeroChip key={cat.id} active={activeCategory === cat.id} onClick={() => setActiveCategory(cat.id)}>
                {cat.label}
                {status === 'ready' && <span className="ml-1.5 text-muted tabular-nums">{countFor(cat.id)}</span>}
              </HeroChip>
            ))}
          </TabRow>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="inline-flex p-1 rounded-full bg-white border border-line self-start">
              {DATE_FILTERS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDateFilter(d.id)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer',
                    dateFilter === d.id ? 'bg-ink text-white' : 'text-muted hover:text-ink'
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Mint stories"
                className="w-full pl-10 pr-3 py-2.5 text-[15px] rounded-full bg-white border border-line text-ink placeholder-muted focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-ink/30"
              />
            </div>
          </div>
        </div>
      </PageHero>

      {/* Loading */}
      {status === 'loading' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-line overflow-hidden animate-pulse">
              <div className="h-44 bg-haze" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-24 bg-haze rounded" />
                <div className="h-5 w-full bg-haze rounded" />
                <div className="h-5 w-2/3 bg-haze rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Couldn't load */}
      {status === 'error' && (
        <div className="rounded-2xl bg-white border border-line p-8 sm:p-10 text-center max-w-xl mx-auto space-y-4">
          <Newspaper className="w-8 h-8 mx-auto text-muted" />
          <h2 className="text-xl font-bold text-ink">We couldn't reach Mint just now</h2>
          <p className="text-muted">Try again in a minute, or read today's paper directly.</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <button onClick={load} className="btn-iris px-5 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 cursor-pointer">
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
            <a href={MINT_EPAPER_URL} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full border border-line text-sm font-semibold text-ink hover:bg-paper">
              Open the e-paper
            </a>
          </div>
        </div>
      )}

      {status === 'ready' && (
        <>
          {/* Top of the news: one lead story per main section */}
          {topStories.length > 0 && (
            <section aria-labelledby="top-news" className="space-y-4">
              <h2 id="top-news" className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Top of the news</h2>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Lead */}
                <article className="lg:col-span-3 rounded-2xl bg-white border border-line overflow-hidden flex flex-col">
                  <div className="relative aspect-[2/1] bg-haze overflow-hidden">
                    <StoryImage article={topStories[0]} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col">
                    <Meta article={topStories[0]} />
                    <h3 className="text-2xl sm:text-[1.75rem] font-bold text-ink leading-tight tracking-[-0.02em]">{topStories[0].title}</h3>
                    <Summary article={topStories[0]} lines="line-clamp-5" />
                    <div className="mt-auto pt-3 flex items-center gap-2.5">
                      <ReadButton article={topStories[0]} />
                      <SaveButton article={topStories[0]} />
                    </div>
                  </div>
                </article>

                {/* The other sections */}
                <div className="lg:col-span-2 rounded-2xl bg-white border border-line divide-y divide-line">
                  {topStories.slice(1).map((a) => (
                    <article key={a.id} className="p-5 flex gap-4">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <Meta article={a} />
                        <a href={a.url} target="_blank" rel="noopener noreferrer" className="block text-[17px] font-semibold text-ink leading-snug hover:underline decoration-2 underline-offset-2">
                          {a.title}
                        </a>
                      </div>
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-haze shrink-0">
                        <StoryImage article={a} className="w-full h-full object-cover" />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All stories */}
          <section className="space-y-4">
            {showTop && rest.length > 0 && (
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">All stories</h2>
            )}

            {rest.length === 0 && topStories.length === 0 ? (
              <div className="rounded-2xl bg-white border border-line p-10 text-center text-muted">
                No Mint stories match{q ? ` "${searchQuery}"` : ''} here.{' '}
                {dateFilter !== 'week' && (
                  <button onClick={() => setDateFilter('week')} className="font-semibold text-ink underline underline-offset-2 cursor-pointer">
                    Show the whole week
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayed.map((a) => (
                  <article key={a.id} className="card-lift rounded-2xl bg-white border border-line overflow-hidden flex flex-col">
                    <div className="relative h-44 bg-haze overflow-hidden">
                      <StoryImage article={a} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-2.5 flex-1 flex flex-col">
                      <Meta article={a} />
                      <h3 className="text-[18px] font-semibold text-ink leading-snug tracking-[-0.01em]">{a.title}</h3>
                      <Summary article={a} />
                      <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                        <ReadButton article={a} compact />
                        <SaveButton article={a} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {rest.length > visibleCount && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  className="px-7 py-3 rounded-full bg-white border border-line text-ink font-semibold text-sm hover:bg-paper transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  Show more stories ({rest.length - visibleCount} left) <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>

          <p className="text-[13px] text-muted text-center pt-2">
            Headlines, summaries and images are from Mint (livemint.com) · full stories open on Mint
            {fetchedAt ? ` · updated ${timeAgo(fetchedAt)}` : ''}
          </p>
        </>
      )}

      {/* Quiz built from this week's Mint stories */}
      {quiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fadeIn" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button onClick={closeQuiz} aria-label="Close" className="absolute top-4 right-4 p-2 rounded-full hover:bg-paper text-muted hover:text-ink">
              <X className="w-5 h-5" />
            </button>

            {!quizSubmitted ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2 pr-10">
                  <h3 className="text-lg font-bold text-ink">Match the headline</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-paper text-muted">
                    {quizIndex + 1} of {quiz.length}
                  </span>
                </div>
                <div className="rounded-2xl bg-paper p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">Mint's summary</span>
                  <p className="mt-1.5 text-[15px] text-ink leading-relaxed">{quiz[quizIndex].question}</p>
                </div>
                <p className="text-sm font-semibold text-ink">Which story is this?</p>
                <div className="space-y-2.5">
                  {quiz[quizIndex].options.map((option, idx) => {
                    const isCorrect = idx === quiz[quizIndex].correctAnswer;
                    let style = 'bg-white hover:bg-paper text-ink border-line';
                    if (selectedOption !== null) {
                      if (isCorrect) style = 'bg-marker-green/10 text-ink border-marker-green font-semibold';
                      else if (idx === selectedOption) style = 'bg-[#8F3333]/10 text-ink border-[#8F3333]';
                      else style = 'bg-white text-muted border-line opacity-60';
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => pickOption(idx)}
                        disabled={selectedOption !== null}
                        className={cn('w-full p-3.5 rounded-2xl text-sm border text-left transition-colors flex items-center justify-between gap-3 cursor-pointer', style)}
                      >
                        <span>{option}</span>
                        {selectedOption !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-marker-green shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {selectedOption !== null && (
                  <div className="text-sm text-muted">
                    {quiz[quizIndex].explanation}{' '}
                    <a href={quiz[quizIndex].url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline underline-offset-2">
                      Read it
                    </a>
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={nextQuestion}
                    disabled={selectedOption === null}
                    className="btn-iris px-5 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {quizIndex < quiz.length - 1 ? 'Next' : 'See score'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-5 py-4">
                <div className="text-5xl font-bold text-ink tabular-nums">
                  {quizScore}/{quiz.length}
                </div>
                <p className="text-muted">
                  {quizScore === quiz.length ? 'Perfect. You really read the news this week.' : 'Read a few more stories and try again — the questions change every time.'}
                </p>
                <div className="flex justify-center gap-2.5">
                  <button onClick={openQuiz} className="btn-iris px-5 py-2.5 rounded-full font-semibold text-sm cursor-pointer">New questions</button>
                  <button onClick={closeQuiz} className="px-5 py-2.5 rounded-full border border-line font-semibold text-sm text-ink hover:bg-paper cursor-pointer">Back to the news</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-ink text-white shadow-xl flex items-center justify-center cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default KnowledgeQuestView;
