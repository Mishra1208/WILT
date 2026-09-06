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

export const fetchLiveBusinessNews = async () => {
  // Return the curated Times of India business articles stream
  return KNOWLEDGE_QUEST_ARTICLES;
};
