/**
 * News Service — Fetches REAL-TIME TODAY'S live business & international news
 * via live RSS-to-JSON endpoints and formats them into 60-second Recruiter-Ready digests.
 */

const RSS_BUSINESS = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fheadlines%2Fsection%2Ftopic%2FBUSINESS%3Fhl%3Den-IN%26gl%3DIN%26ceid%3DIN%3Aen';
const RSS_WORLD = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fheadlines%2Fsection%2Ftopic%2FWORLD%3Fhl%3Den-IN%26gl%3DIN%26ceid%3DIN%3Aen';
const RSS_TECH = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fheadlines%2Fsection%2Ftopic%2FTECHNOLOGY%3Fhl%3Den-IN%26gl%3DIN%26ceid%3DIN%3Aen';

// High-resolution reliable Unsplash CDN images categorized for ultra-fast loading worldwide & in India
const CATEGORY_IMAGES = {
  international: [
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
  ],
  markets: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80'
  ],
  banking: [
    'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'
  ],
  mutual_funds: [
    'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=800&auto=format&fit=crop&q=80'
  ],
  india_business: [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80'
  ]
};

const getReliableImage = (catId, idx) => {
  const list = CATEGORY_IMAGES[catId] || CATEGORY_IMAGES.india_business;
  return list[idx % list.length];
};

// Helper to generate dynamic placement interview talking point based on title and content
const generateInterviewTalkingPoint = (title, source) => {
  const lower = title.toLowerCase();
  
  if (lower.includes('fed') || lower.includes('rate') || lower.includes('rbi') || lower.includes('inflation') || lower.includes('gdp')) {
    return `If asked about economic indicators: "Macroeconomic metrics like GDP trends and central bank interest rates dictate corporate borrowing costs and equity valuations across key sectors."`;
  }
  if (lower.includes('ipo') || lower.includes('share') || lower.includes('market') || lower.includes('nifty') || lower.includes('sensex') || lower.includes('sebi')) {
    return `If asked about capital markets: "Strong institutional capital and regulatory clearance like SEBI IPO approvals reflect robust retail investor participation and domestic equity market depth."`;
  }
  if (lower.includes('apple') || lower.includes('ai') || lower.includes('tech') || lower.includes('google') || lower.includes('chip') || lower.includes('nvidia')) {
    return `If asked about technology & innovation: "Product innovation cycles and AI infrastructure spending create sustainable competitive advantages and long-term enterprise value."`;
  }
  if (lower.includes('auto') || lower.includes('car') || lower.includes('maruti') || lower.includes('mahindra') || lower.includes('ev')) {
    return `If asked about manufacturing & automotive: "Consumer demand shifts toward modern automotive features and EV technology are driving capex growth and supply chain modernization in India."`;
  }

  return `If asked about this sector in an interview: "Staying current with recent ${source || 'industry'} developments demonstrates strong commercial awareness and strategic thinking in candidate interviews."`;
};

// Helper to extract key terms
const extractKeyTerms = (title) => {
  const text = title.toUpperCase();
  const terms = [];
  
  if (text.includes('IPO')) terms.push('IPO');
  if (text.includes('SEBI') || text.includes('RBI') || text.includes('FED')) terms.push('Regulatory Policy');
  if (text.includes('NIFTY') || text.includes('SENSEX') || text.includes('STOCK')) terms.push('Equity Markets');
  if (text.includes('GDP') || text.includes('INFLATION')) terms.push('Macroeconomics');
  if (text.includes('AI') || text.includes('TECH') || text.includes('APPLE')) terms.push('Technology');
  if (text.includes('AUTO') || text.includes('EV') || text.includes('CAR')) terms.push('Automotive');

  if (terms.length === 0) terms.push('Corporate Strategy', 'Industry Trends');
  return terms;
};

// Helper to map article to sub-hub category
const categorizeArticle = (title, sourceName) => {
  const text = (title + ' ' + (sourceName || '')).toLowerCase();
  
  if (text.includes('us') || text.includes('world') || text.includes('iran') || text.includes('global') || text.includes('trump') || text.includes('apple') || text.includes('china')) {
    return { id: 'international', label: '🌐 International Business' };
  }
  if (text.includes('market') || text.includes('sensex') || text.includes('nifty') || text.includes('stock') || text.includes('gdp') || text.includes('gift')) {
    return { id: 'markets', label: '📈 Markets & Economy' };
  }
  if (text.includes('rbi') || text.includes('sebi') || text.includes('cbi') || text.includes('lic') || text.includes('bank') || text.includes('fed')) {
    return { id: 'banking', label: '🏦 Banking & Policy' };
  }
  if (text.includes('fund') || text.includes('invest') || text.includes('sip') || text.includes('ipo') || text.includes('profit')) {
    return { id: 'mutual_funds', label: '💰 Mutual Funds & Finance' };
  }
  
  return { id: 'india_business', label: '🇮🇳 India Business' };
};

export const fetchLiveBusinessNews = async () => {
  try {
    const [bizRes, worldRes, techRes] = await Promise.all([
      fetch(RSS_BUSINESS).then(r => r.json()).catch(() => null),
      fetch(RSS_WORLD).then(r => r.json()).catch(() => null),
      fetch(RSS_TECH).then(r => r.json()).catch(() => null)
    ]);

    const rawItems = [
      ...(bizRes?.items || []),
      ...(worldRes?.items || []),
      ...(techRes?.items || [])
    ];

    if (!rawItems || rawItems.length === 0) {
      return null;
    }

    // Filter valid items
    const valid = rawItems.filter(item => item && item.title && item.title.length > 8);

    return valid.map((item, idx) => {
      // Split Title and Source
      const parts = item.title.split(' - ');
      const cleanSource = parts.length > 1 ? parts.pop() : 'Business News';
      const cleanTitle = parts.join(' - ');

      const catObj = categorizeArticle(cleanTitle, cleanSource);
      const terms = extractKeyTerms(cleanTitle);
      const talkingPoint = generateInterviewTalkingPoint(cleanTitle, cleanSource);

      // Format date to Today / Yesterday / Recent date
      let formattedDate = 'Today';
      if (item.pubDate) {
        const pub = new Date(item.pubDate);
        const now = new Date();
        const diffHours = Math.floor((now - pub) / (1000 * 60 * 60));
        if (diffHours < 24) {
          formattedDate = diffHours <= 1 ? 'Just now' : `${diffHours} hours ago`;
        } else {
          formattedDate = pub.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      }

      // Clean snippet summary
      const cleanDescription = item.description 
        ? item.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim()
        : cleanTitle;

      // Assign high-resolution reliable CDN image
      const categoryImg = getReliableImage(catObj.id, idx);

      return {
        id: `live-rss-${idx}-${Date.now()}`,
        title: cleanTitle,
        category: catObj.id,
        categoryLabel: catObj.label,
        date: formattedDate,
        readTime: '60 sec read',
        source: cleanSource,
        toiUrl: item.link || 'https://news.google.com',
        imageUrl: categoryImg,
        summary: {
          whatHappened: cleanDescription.length > 15 ? cleanDescription : cleanTitle,
          whyItMatters: `Key recent development reported by ${cleanSource} impacting sector valuations and business outlook.`,
          keyMetric: `Published: ${formattedDate}`
        },
        interviewTalkingPoint: talkingPoint,
        keyTerms: terms
      };
    });
  } catch (e) {
    console.warn('Failed to fetch real-time live news, falling back:', e);
    return null;
  }
};
