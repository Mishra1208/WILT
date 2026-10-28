/**
 * Mint news collector.
 *
 * Pulls every official Mint (livemint.com) section RSS feed, removes
 * duplicates, sorts each story into a WILT category and keeps the last
 * 7 days. Runs on the server (Vercel function in production, Vite middleware
 * in development) so there are no CORS problems and students' browsers make
 * one small request instead of sixteen.
 *
 * We only use what Mint itself publishes in its feeds: headline, Mint's own
 * one-paragraph summary, image and link. "Read full story" always sends the
 * reader to livemint.com.
 */

// Mint's business sections. General sections (news, politics) are read too,
// but only their business and finance stories are kept.
const BUSINESS_FEEDS = ['markets', 'money', 'companies', 'industry', 'economy', 'insurance', 'budget'];
const MIXED_FEEDS = ['latest-news', 'news', 'politics', 'technology', 'opinion'];
const FEEDS = [...BUSINESS_FEEDS, ...MIXED_FEEDS];

const MAX_AGE_DAYS = 7;
const FEED_TIMEOUT_MS = 8000;

/**
 * WILT is for MBA students preparing for placements, so every story here is
 * business or finance. Each story has a topic (markets, companies…) and a
 * region (India or international); the India / International tabs filter by
 * region, the others by topic.
 */
export const CATEGORIES = [
  { id: 'india', label: 'India business' },
  { id: 'international', label: 'International business' },
  { id: 'markets', label: 'Markets' },
  { id: 'finance', label: 'Banking & finance' },
  { id: 'companies', label: 'Companies & deals' },
  { id: 'economy', label: 'Economy & policy' },
  { id: 'tech', label: 'Tech & startups' },
  { id: 'opinion', label: 'Opinion' }
];
const LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

// ---------- tiny RSS parser (Mint's feeds are simple and consistent) ----------

const decode = (s = '') =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&') // Mint double-encodes some entities (&amp;nbsp;)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]) : '';
};

const toIso = (s) => {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const parseFeed = (xml, feed) => {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml))) {
    const block = m[1];
    const link = tag(block, 'link');
    const title = tag(block, 'title');
    if (!link || !title || !link.includes('livemint.com')) continue;
    const img = block.match(/<media:content[^>]*url="([^"]+)"/i);
    items.push({
      title,
      link,
      summary: tag(block, 'description'),
      publishedAt: toIso(tag(block, 'pubDate')),
      imageUrl: img ? img[1] : null,
      feed
    });
  }
  return items;
};

// ---------- business filter, topic and region ----------

// A story from a general section is kept only if it is clearly about business,
// money or the economy.
const BUSINESS = /\b(business|businesses|economy|economic|economist|gdp|inflation|deflation|recession|growth rate|fiscal|budget|tax|taxes|taxpayers?|gst|tds|itr|tariffs?|trade|exports?|imports?|rupee|dollar|currency|forex|crude|oil prices?|brent|opec|gold|silver|commodit(y|ies)|markets?|stocks?|shares?|equity|equities|sensex|nifty|ipo|listing|investors?|investment|invest|funds?|funding|mutual funds?|sip|bonds?|yields?|interest rates?|rate (cut|hike)|repo|rbi|sebi|fed|federal reserve|ecb|central bank|banks?|banking|bankers?|loans?|lenders?|credit|nbfc|fintech|upi|payments?|insurance|insurers?|pension|epfo|companies|company|firms?|corporate|startups?|unicorn|valuation|acquisitions?|acquire[sd]?|mergers?|deal|deals|stake|ceo|cfo|chairman|founders?|revenue|profits?|earnings|results|quarter|q[1-4]|margins?|sales|layoffs?|hiring|jobs|employment|wages|salar(y|ies)|industry|industrial|manufacturing|factory|capex|infrastructure|real estate|housing prices|retail|consumers?|demand|supply chain|exports|fdi|fii|fpi|billion|crore|lakh crore|\$\d|₹)\b/i;

// Political, security and general stories that happen to mention money
const NOT_BUSINESS = /\b(election|elections|poll results|exit polls?|mlc|mla|candidates?|campaign|mayoral|cyclone|landfall|weather|imd|cricket|football|nba|ipl|wpl|match|bollywood|film|movie|actor|actress|murder|arrest|police|court hearing|defen[cs]e|military|army|missile|war|terror|protest|festival|horoscope|recipe|price drops?|exchange offers?|bank offers?|cafe|chai|wafers?|liquor|actor|singer|tourists?|visitors|walkway)\b/i;

const isBusiness = (item, section) => {
  if (BUSINESS_FEEDS.includes(item.feed) || ['market', 'money', 'companies', 'industry', 'economy', 'insurance', 'budget'].includes(section)) {
    return true;
  }
  const text = `${item.title} ${item.summary}`;
  // The headline decides: a headline about an election is out even if the summary mentions money
  if (NOT_BUSINESS.test(item.title)) return false;
  if (BUSINESS.test(item.title)) return true;
  // Headline isn't obviously business: keep only if the summary is clearly about it
  if (NOT_BUSINESS.test(text)) return false;
  return businessTermCount(item.summary) >= 3;
};

const businessTermCount = (text = '') => {
  const found = new Set();
  const re = new RegExp(BUSINESS.source, 'gi');
  let m;
  while ((m = re.exec(text))) found.add(m[0].toLowerCase());
  return found.size;
};

const MARKETS = /\b(ipo|sensex|nifty|stock market|stocks?|shares|listing|gmp|sebi|investors?|bonds?|yields?|f&o|smallcap|midcap|wall street|nasdaq|dow)\b/i;
const FINANCE = /\b(rbi|bank|banks|banking|loan|loans|lender|credit card|nbfc|upi|insurance|mutual fund|sip|pension|epfo|tax|taxpayers?|itr|tds|gold price|fixed deposit|fd rates?|personal finance)\b/i;
const ECONOMY = /\b(sanctions|regulations?|rules|sovereign wealth fund|economy|economic|gdp|inflation|fiscal|budget|tariffs?|trade deal|trade war|exports?|imports?|rupee|forex|fed|federal reserve|central bank|interest rates?|rate (cut|hike)|policy|imf|world bank|crude|oil prices?|opec)\b/i;
const TECH = /\b(ai|artificial intelligence|tech|technology|startups?|unicorn|chips?|semiconductor|software|saas|it services|digital|openai|nvidia|google|microsoft|apple|meta|amazon)\b/i;

const topicOf = (item, section, sub) => {
  switch (section) {
    case 'market': return 'markets';
    case 'money':
    case 'insurance': return 'finance';
    case 'companies': return sub === 'start-ups' ? 'tech' : 'companies';
    case 'industry': return sub === 'banking' ? 'finance' : 'companies';
    case 'economy':
    case 'budget': return 'economy';
    case 'technology':
    case 'ai': return 'tech';
    case 'opinion': return 'opinion';
    default: break;
  }
  const t = item.title;
  if (MARKETS.test(t)) return 'markets';
  if (FINANCE.test(t)) return 'finance';
  if (ECONOMY.test(t)) return 'economy';
  if (TECH.test(t)) return 'tech';
  return 'companies';
};

const WORLD = /\b(us|u\.s\.|usa|america|american|trump|fed|federal reserve|wall street|nasdaq|dow|china|chinese|beijing|europe|european|eu|ecb|uk|britain|british|japan|japanese|russia|russian|ukraine|israel|iran|gulf|opec|imf|world bank|global|globally|worldwide|g7|g20|canada|australia|germany|german|france|french|saudi|dubai|uae|singapore|korea|taiwan|brazil|mexico|africa|openai|nvidia|tesla|apple|microsoft|amazon|meta|alphabet|anthropic|elon musk|brent)\b/i;
const INDIA = /\b(india|indian|indians|modi|delhi|mumbai|bengaluru|bangalore|chennai|hyderabad|pune|kolkata|gujarat|maharashtra|rbi|sebi|nse|bse|sensex|nifty|rupee|₹|crore|lakh|gst|epfo|upi|tata|reliance|jio|adani|infosys|wipro|hdfc|icici|sbi|lic|airtel|mahindra|bajaj|itc|hul|ola|zomato|swiggy|paytm|flipkart|nykaa|centre|union budget|niti aayog|l&t|larsen|tcs|hcl|tech mahindra|maruti|ongc|ntpc|coal india|vedanta|axis bank|kotak|bharti|godrej|hero motocorp|eicher|ultratech|asian paints|titan|dmart|irctc|zepto|meesho|ather|hindustan unilever|psu|pli|d-street|dalal street)\b/i;

const regionOf = (item, section, sub) => {
  if (sub === 'world' || sub === 'us-news') return 'international';
  const text = `${item.title} ${item.summary}`;
  const india = INDIA.test(text);
  const world = WORLD.test(text);
  if (world && !india) return 'international';
  // Mint is an Indian paper: stories default to India unless clearly global
  if (world && india && WORLD.test(item.title) && !INDIA.test(item.title)) return 'international';
  return 'india';
};

const classify = (item) => {
  const path = item.link.replace(/^https?:\/\/[^/]+\//, '');
  const [section = '', sub = ''] = path.split('/');
  if (SKIP_SECTIONS.has(section)) return null;
  if (!isBusiness(item, section)) return null;
  return { topic: topicOf(item, section, sub), region: regionOf(item, section, sub) };
};

// Not news stories (videos, galleries, sponsored posts) or not business
const SKIP_SECTIONS = new Set(['videos', 'photos', 'brand-post', 'brand-stories', 'podcast', 'sports', 'elections', 'education', 'science', 'lounge', 'mint-lounge', 'focus', 'astrology', 'web-stories']);

// ---------- fetch everything ----------

const fetchFeed = async (feed) => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FEED_TIMEOUT_MS);
  try {
    const res = await fetch(`https://www.livemint.com/rss/${feed}`, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'WILT-news-reader/1.0 (+https://wilt-three.vercel.app)', Accept: 'application/rss+xml, application/xml' }
    });
    if (!res.ok) return [];
    return parseFeed(await res.text(), feed);
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
};

const storyId = (link) => {
  const num = link.match(/-(\d{8,})\.html/);
  return num ? `mint-${num[1]}` : `mint-${link.replace(/[^a-z0-9]/gi, '').slice(-32)}`;
};

export const collectMintNews = async () => {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const seen = new Map();

  for (const item of results.flat()) {
    const id = storyId(item.link);
    if (seen.has(id)) continue;
    const time = item.publishedAt ? Date.parse(item.publishedAt) : NaN;
    if (!Number.isFinite(time) || time < cutoff) continue;
    const cls = classify(item);
    if (!cls) continue;
    seen.set(id, {
      id,
      title: item.title,
      summary: item.summary && item.summary.toLowerCase() !== item.title.toLowerCase() ? item.summary : '',
      url: item.link,
      imageUrl: item.imageUrl,
      publishedAt: item.publishedAt,
      category: cls.topic,
      categoryLabel: LABELS[cls.topic],
      region: cls.region,
      regionLabel: cls.region === 'india' ? 'India' : 'International'
    });
  }

  const stories = [...seen.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return {
    source: 'Mint (livemint.com)',
    fetchedAt: new Date().toISOString(),
    feedsOk: results.filter((r) => r.length > 0).length,
    feedsTotal: FEEDS.length,
    categories: CATEGORIES,
    stories
  };
};

// Small in-memory cache so a warm server doesn't refetch on every request
let cache = { at: 0, data: null };
const CACHE_MS = 10 * 60 * 1000;

export const getMintNews = async () => {
  if (cache.data && Date.now() - cache.at < CACHE_MS) return cache.data;
  const data = await collectMintNews();
  if (data.stories.length > 0) cache = { at: Date.now(), data };
  return data;
};
