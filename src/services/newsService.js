/**
 * News Service — Fetches 60+ live business news articles and formats them into
 * 60-second Recruiter-Ready Inshorts-style digests with interview talking points.
 */

const NEWS_API_BUSINESS = 'https://saurav.tech/NewsAPI/top-headlines/category/business/in.json';
const NEWS_API_TECH = 'https://saurav.tech/NewsAPI/top-headlines/category/technology/in.json';

// Helper to generate dynamic placement interview talking point based on title and content
const generateInterviewTalkingPoint = (title, content, source) => {
  const lower = (title + ' ' + (content || '')).toLowerCase();
  
  if (lower.includes('fed') || lower.includes('rate') || lower.includes('rbi') || lower.includes('inflation')) {
    return `If asked about monetary policy: "Central bank interest rate decisions directly dictate the cost of corporate borrowing and liquidity. Sustained rate stability helps stabilize inflation while sustaining corporate earnings growth."`;
  }
  if (lower.includes('ipo') || lower.includes('share') || lower.includes('market') || lower.includes('nifty') || lower.includes('sensex')) {
    return `If asked about stock market trends: "Equity market valuations reflect investor confidence in economic growth, corporate margins, and steady domestic institutional liquidity balancing foreign capital movements."`;
  }
  if (lower.includes('tech') || lower.includes('startup') || lower.includes('ai') || lower.includes('zepto') || lower.includes('funding')) {
    return `If asked about startup valuation & technology: "High-growth tech companies focus on unit economics and sustainable cash flow over burn rate. Rapid scaling combined with operational efficiency creates long-term enterprise value."`;
  }
  if (lower.includes('tata') || lower.includes('car') || lower.includes('auto') || lower.includes('ev') || lower.includes('power')) {
    return `If asked about industrial & manufacturing growth: "India’s manufacturing resurgence is driven by heavy capex investments, rising domestic consumption, and green transition initiatives like EV adoption."`;
  }

  return `If asked about this sector in an interview: "Understanding ${source || 'industry'} dynamics demonstrates strong commercial awareness. Key trends indicate shifting consumer demand and strategic corporate re-positioning."`;
};

// Helper to extract key terms
const extractKeyTerms = (title, description) => {
  const text = (title + ' ' + (description || '')).toUpperCase();
  const terms = [];
  
  if (text.includes('IPO')) terms.push('IPO');
  if (text.includes('RBI') || text.includes('FED')) terms.push('Monetary Policy');
  if (text.includes('NIFTY') || text.includes('SENSEX') || text.includes('STOCKS')) terms.push('Stock Market');
  if (text.includes('VALUATION') || text.includes('FUNDING')) terms.push('Venture Capital');
  if (text.includes('EV') || text.includes('AUTO') || text.includes('CAR')) terms.push('Automotive');
  if (text.includes('INFLATION')) terms.push('Macroeconomics');

  if (terms.length === 0) terms.push('Corporate Strategy', 'Industry Insights');
  return terms;
};

// Helper to map article to sub-hub category
const categorizeArticle = (title, description, sourceName) => {
  const text = (title + ' ' + (description || '') + ' ' + (sourceName || '')).toLowerCase();
  
  if (text.includes('us') || text.includes('global') || text.includes('tesla') || text.includes('amazon') || text.includes('fed') || text.includes('world')) {
    return { id: 'international', label: '🌐 International Business' };
  }
  if (text.includes('market') || text.includes('sensex') || text.includes('nifty') || text.includes('stock') || text.includes('shares') || text.includes('bse')) {
    return { id: 'markets', label: '📈 Markets & Economy' };
  }
  if (text.includes('rbi') || text.includes('bank') || text.includes('icici') || text.includes('lending') || text.includes('rate')) {
    return { id: 'banking', label: '🏦 Banking & Policy' };
  }
  if (text.includes('fund') || text.includes('invest') || text.includes('sip') || text.includes('lic') || text.includes('ipo')) {
    return { id: 'mutual_funds', label: '💰 Mutual Funds & Finance' };
  }
  
  return { id: 'india_business', label: '🇮🇳 India Business' };
};

export const fetchLiveBusinessNews = async () => {
  try {
    const [bizRes, techRes] = await Promise.all([
      fetch(NEWS_API_BUSINESS).then(r => r.json()).catch(() => null),
      fetch(NEWS_API_TECH).then(r => r.json()).catch(() => null)
    ]);

    const rawArticles = [
      ...(bizRes?.articles || []),
      ...(techRes?.articles || [])
    ];

    if (!rawArticles || rawArticles.length === 0) {
      return null;
    }

    // Filter out articles missing title or description
    const valid = rawArticles.filter(a => a && a.title && a.title.length > 10 && a.url);

    return valid.map((art, idx) => {
      const cleanTitle = art.title.replace(/ - [^-]+$/, '');
      const sourceName = art.source?.name || 'Inshorts News';
      const catObj = categorizeArticle(art.title, art.description, sourceName);
      const terms = extractKeyTerms(art.title, art.description);
      const talkingPoint = generateInterviewTalkingPoint(art.title, art.description, sourceName);

      const pubDate = art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : 'Recently';

      return {
        id: `live-news-${idx}-${Date.now()}`,
        title: cleanTitle,
        category: catObj.id,
        categoryLabel: catObj.label,
        date: pubDate,
        readTime: '60 sec read',
        source: sourceName,
        toiUrl: art.url,
        imageUrl: art.urlToImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
        summary: {
          whatHappened: art.description || art.title,
          whyItMatters: art.content ? art.content.replace(/\[\+\d+ chars\]/, '') : 'Key corporate development impacting industry valuations and commercial growth.',
          keyMetric: `Source: ${sourceName}`
        },
        interviewTalkingPoint: talkingPoint,
        keyTerms: terms
      };
    });
  } catch (e) {
    console.warn('Failed to fetch live news, falling back:', e);
    return null;
  }
};
