/**
 * News Service — Times of India (TOI) Business & Global News Engine
 * Provides instant, 100% reliable, recruiter-ready 60-second digests
 * categorized into International Business, India Business, Markets & Economy,
 * Mutual Funds & Finance, and Banking & Policy.
 */

import { KNOWLEDGE_QUEST_ARTICLES, SECONDARY_FALLBACK_IMAGES } from '../data/knowledgeQuestData';

// 100% Fail-Safe Inline SVG Data URL Generator when external CDN is unreachable
export const getNewsFallbackSvg = (categoryLabel = 'BUSINESS NEWS') => {
  const cleanLabel = (categoryLabel || 'BUSINESS NEWS').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  const encoded = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#312E81"/>
          <stop offset="50%" stop-color="#4F46E5"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#g)"/>
      <circle cx="700" cy="80" r="150" fill="white" opacity="0.06"/>
      <circle cx="100" cy="320" r="180" fill="white" opacity="0.06"/>
      <text x="50%" y="42%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="28" font-weight="900" letter-spacing="2">TIMES OF INDIA BUSINESS</text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="#A5B4FC" font-family="sans-serif" font-size="18" font-weight="700">${cleanLabel.toUpperCase()}</text>
    </svg>
  `);
  return `data:image/svg+xml;utf8,${encoded}`;
};

// Decode the handful of HTML entities RSS descriptions commonly contain
const decodeEntities = (str = '') =>
  str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

const cleanText = (html = '') => decodeEntities(String(html).replace(/<[^>]*>?/gm, ' ')).replace(/\s+/g, ' ').trim();

// Trim to whole sentences instead of cutting mid-word
const toSentences = (text, max = 320) => {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  return lastStop > 80 ? cut.slice(0, lastStop + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};

// Classify a live headline using ITS OWN words (never borrowed from another story)
const CATEGORY_RULES = [
  { id: 'markets', label: '📈 Markets & Economy', words: /\b(sensex|nifty|stock|stocks|shares|market|markets|ipo|sebi|gdp|inflation|cpi|rupee|gold|silver|bond|bonds|earnings)\b/i },
  { id: 'banking', label: '🏦 Banking & Policy', words: /\b(rbi|bank|banks|banking|repo|npa|loan|loans|credit|upi|npci|deposit|lender|nbfc|cbdc|monetary policy)\b/i },
  { id: 'mutual_funds', label: '💰 MF & Finance', words: /\b(mutual fund|mutual funds|sip|sips|amc|amfi|nav|elss|aum|insurance|pension|epfo|tax|itr|gst)\b/i },
  { id: 'international', label: '🌐 International Business', words: /\b(u\.s\.|fed|america|china|europe|ecb|global|world|trump|tariff|tariffs|opec|crude|dollar|imf|uk|japan)\b/i }
];
const classifyHeadline = (text) => {
  const rule = CATEGORY_RULES.find((r) => r.words.test(text)) || (/\bUS\b/.test(text) ? CATEGORY_RULES.find((r) => r.id === 'international') : null);
  return rule ? { category: rule.id, categoryLabel: rule.label } : { category: 'india_business', categoryLabel: '🇮🇳 India Business' };
};

/**
 * Live headlines come straight from the TOI Business RSS feed.
 * Each live card shows ONLY what the feed says about that story (headline + TOI's own
 * description). We never attach a curated "Why it matters" / talking point written for a
 * different story — that mismatch was reported in pilot testing.
 */
export const fetchLiveBusinessNews = async () => {
  try {
    const rssUrl = encodeURIComponent('https://timesofindia.indiatimes.com/rssfeeds/1898055.cms');
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();

    if (data && Array.isArray(data.items) && data.items.length > 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const liveItems = data.items
        .slice(0, 15)
        .filter((item) => item && item.title && item.link)
        .map((item, idx) => {
          const title = cleanText(item.title);
          const description = toSentences(cleanText(item.description || item.content || ''));
          const pubDateObj = item.pubDate ? new Date(item.pubDate.replace(' ', 'T')) : null;
          const dateFormatted = pubDateObj && !isNaN(pubDateObj)
            ? `${months[pubDateObj.getMonth()]} ${String(pubDateObj.getDate()).padStart(2, '0')}, ${pubDateObj.getFullYear()}`
            : 'Today';
          const { category, categoryLabel } = classifyHeadline(`${title} ${description}`);

          return {
            id: `live-toi-${idx}-${encodeURIComponent(item.guid || item.link).slice(-24)}`,
            isLive: true,
            title,
            category,
            categoryLabel,
            date: dateFormatted,
            readTime: 'Live headline',
            source: 'Times of India Business (Live)',
            toiUrl: item.link,
            imageUrl: item.thumbnail || item.enclosure?.link || SECONDARY_FALLBACK_IMAGES[category],
            summary: {
              whatHappened: description && description.toLowerCase() !== title.toLowerCase() ? description : ''
            },
            interviewTalkingPoint: null,
            keyTerms: []
          };
        });

      return [...liveItems, ...KNOWLEDGE_QUEST_ARTICLES];
    }
  } catch (err) {
    console.warn('Live RSS feed fetch notice (showing curated briefs only):', err);
  }

  return KNOWLEDGE_QUEST_ARTICLES;
};
