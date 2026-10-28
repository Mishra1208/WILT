/**
 * News service: Mint (livemint.com).
 *
 * Knowledge Quest reads /api/mint-news, our own endpoint that gathers every
 * official Mint section feed on the server and caches it for 15 minutes.
 * Each story carries only what Mint publishes: headline, Mint's own summary,
 * image and a link to the full story on livemint.com.
 */

import { SECONDARY_FALLBACK_IMAGES } from '../data/knowledgeQuestData';

export const MINT_EPAPER_URL = 'https://epaper.livemint.com/';

// "India business" / "International business" filter by region; the rest by topic
export const MINT_CATEGORIES = [
  { id: 'all', label: 'All business news' },
  { id: 'india', label: 'India business', by: 'region' },
  { id: 'international', label: 'International business', by: 'region' },
  { id: 'markets', label: 'Markets' },
  { id: 'finance', label: 'Banking & finance' },
  { id: 'companies', label: 'Companies & deals' },
  { id: 'economy', label: 'Economy & policy' },
  { id: 'tech', label: 'Tech & startups' },
  { id: 'opinion', label: 'Opinion' }
];

export const matchesMintCategory = (article, catId) => {
  if (catId === 'all') return true;
  if (catId === 'india' || catId === 'international') return article.region === catId;
  return article.category === catId;
};

// Local images used when Mint's image fails to load
const FALLBACK_BY_CATEGORY = {
  india: SECONDARY_FALLBACK_IMAGES.india_business,
  international: SECONDARY_FALLBACK_IMAGES.international,
  markets: SECONDARY_FALLBACK_IMAGES.markets,
  finance: SECONDARY_FALLBACK_IMAGES.mutual_funds,
  economy: SECONDARY_FALLBACK_IMAGES.banking,
  companies: SECONDARY_FALLBACK_IMAGES.india_business,
  tech: SECONDARY_FALLBACK_IMAGES.international,
  opinion: SECONDARY_FALLBACK_IMAGES.india_business,
  others: SECONDARY_FALLBACK_IMAGES.india_business
};
export const fallbackImageFor = (category) =>
  FALLBACK_BY_CATEGORY[category] || SECONDARY_FALLBACK_IMAGES[category] || SECONDARY_FALLBACK_IMAGES.india_business;

// Last-resort inline image (no network needed)
export const getNewsFallbackSvg = (categoryLabel = 'Business news') => {
  const clean = String(categoryLabel || 'Business news')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/[<>&"]/g, '')
    .trim();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <rect width="800" height="450" fill="#F7F5F0"/>
    <rect x="40" y="40" width="720" height="370" rx="24" fill="#FFFFFF" stroke="#E9E5DC"/>
    <text x="400" y="210" text-anchor="middle" fill="#1E1E1E" font-family="sans-serif" font-size="44" font-weight="700">mint</text>
    <text x="400" y="260" text-anchor="middle" fill="#5C5A57" font-family="sans-serif" font-size="20">${clean}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
};

/** "12 min ago", "3 h ago", "Yesterday", "Oct 24" */
export const timeAgo = (iso) => {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return '';
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (mins < 60) return `${Math.max(1, mins)} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  if (hrs < 48) return 'Yesterday';
  const d = new Date(t);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

// Shape a Mint story so the rest of the app (Saved, quiz) can use it like
// any other news item.
const toArticle = (s) => ({
  id: s.id,
  isLive: true,
  isMint: true,
  title: s.title,
  category: s.category,
  categoryLabel: s.categoryLabel,
  region: s.region || 'india',
  regionLabel: s.regionLabel || 'India',
  publishedAt: s.publishedAt,
  date: formatDate(s.publishedAt),
  source: 'Mint',
  url: s.url,
  toiUrl: s.url, // older screens read this field for the "read full story" link
  imageUrl: s.imageUrl || fallbackImageFor(s.category),
  summary: { whatHappened: s.summary || '' },
  interviewTalkingPoint: null,
  keyTerms: []
});

const CACHE_KEY = 'wilt:mint-news:v2';
const CACHE_MS = 10 * 60 * 1000;

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Date.now() - parsed.at < CACHE_MS ? parsed.data : null;
  } catch {
    return null;
  }
};
const writeCache = (data) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage full or blocked: fine, we just refetch next time */
  }
};

/**
 * Returns { articles, fetchedAt, error }. Never throws.
 */
export const fetchMintNews = async () => {
  const cached = readCache();
  if (cached) return cached;
  try {
    const res = await fetch('/api/mint-news');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const articles = (data.stories || []).filter((s) => s && s.title && s.url).map(toArticle);
    if (articles.length === 0) throw new Error('No stories');
    const result = { articles, fetchedAt: data.fetchedAt, error: null };
    writeCache(result);
    return result;
  } catch (err) {
    console.warn('Mint news could not be loaded:', err);
    return { articles: [], fetchedAt: null, error: 'Mint news could not be loaded right now.' };
  }
};

/**
 * A quick "match the headline" quiz from real Mint stories: we show Mint's
 * summary and the student picks the right headline. Wrong options come from
 * other stories in the same section so they're plausible.
 */
export const buildMintQuiz = (articles = [], count = 5) => {
  const pool = articles.filter((a) => a.summary?.whatHappened && a.summary.whatHappened.length > 60);
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const picked = shuffle(pool).slice(0, count);

  return picked
    .map((a) => {
      const same = shuffle(pool.filter((b) => b.id !== a.id && b.category === a.category));
      const other = shuffle(pool.filter((b) => b.id !== a.id && b.category !== a.category));
      const wrong = [...same, ...other].slice(0, 3).map((b) => b.title);
      if (wrong.length < 3) return null;
      const options = shuffle([a.title, ...wrong]);
      return {
        id: a.id,
        question: a.summary.whatHappened,
        options,
        correctAnswer: options.indexOf(a.title),
        explanation: `This was Mint's story "${a.title}" (${a.categoryLabel}).`,
        url: a.url
      };
    })
    .filter(Boolean);
};
