export const KNOWLEDGE_QUEST_CATEGORIES = [
  { id: 'all', label: 'All News', icon: '🔥' },
  { id: 'international', label: '🌐 International Business', icon: '🌐' },
  { id: 'india_business', label: '🇮🇳 India Business', icon: '🇮🇳' },
  { id: 'markets', label: '📈 Markets & Economy', icon: '📈' },
  { id: 'mutual_funds', label: '💰 Mutual Funds & Finance', icon: '💰' },
  { id: 'banking', label: '🏦 Banking & Policy', icon: '🏦' }
];

export const KNOWLEDGE_QUEST_ARTICLES = [
  {
    id: 'quest-1',
    title: 'US Fed Signals Rate Cut Decision: Impact on Global Capital & Tech Valuations',
    category: 'international',
    categoryLabel: '🌐 International Business',
    date: 'Sep 02, 2026',
    readTime: '2 min read',
    source: 'Times of India Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/international-business/us-fed-rate-cut-impact-on-global-capital/articleshow/10892011.cms',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    summary: {
      whatHappened: 'The Federal Reserve signaled a potential interest rate reduction following stabilizing US inflation metrics and shifting labor market indicators.',
      whyItMatters: 'Lower US interest rates generally drive global capital into emerging markets like India, easing borrowing costs for tech firms and boosting global stock liquidity.',
      keyMetric: 'Fed Funds Rate Target: 5.25% - 5.50% ➔ Expected Cut of 25 bps'
    },
    interviewTalkingPoint: 'If asked in an interview about global capital flows: "A US Fed rate cut reduces dollar yields, encouraging institutional foreign investors (FIIs) to reallocate capital into high-growth emerging economies like India, boosting startup funding and IT stock valuations."',
    keyTerms: ['Fed Rate Cut', 'FII Inflows', 'Dollar Index (DXY)', 'Cost of Capital']
  },
  {
    id: 'quest-2',
    title: 'India Manufacturing PMI Surges to Multi-Year High on Export Surge & Domestic Demand',
    category: 'india_business',
    categoryLabel: '🇮🇳 India Business',
    date: 'Sep 02, 2026',
    readTime: '2 min read',
    source: 'Times of India Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business/manufacturing-pmi-surges-on-export-surge/articleshow/10892012.cms',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    summary: {
      whatHappened: 'India’s Purchasing Managers’ Index (PMI) for manufacturing accelerated sharply, reflecting strong factory orders and expanding export shipments.',
      whyItMatters: 'Strong manufacturing signals robust corporate capex, job growth, and sustained GDP expansion, strengthening India’s positioning in global supply chain diversification.',
      keyMetric: 'Manufacturing PMI: 58.5 (Above 50 threshold indicates strong expansion)'
    },
    interviewTalkingPoint: 'If asked about India’s economic growth drivers: "India’s high PMI score above 58 demonstrates real physical economy expansion driven by government infrastructure spending and the Production Linked Incentive (PLI) scheme."',
    keyTerms: ['PMI Index', 'Capex Expansion', 'PLI Scheme', 'Industrial Production']
  },
  {
    id: 'quest-3',
    title: 'Sensex & Nifty Hit Record Highs as Foreign Institutional Investors (FIIs) Turn Net Buyers',
    category: 'markets',
    categoryLabel: '📈 Markets & Economy',
    date: 'Sep 01, 2026',
    readTime: '2 min read',
    source: 'Times of India Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/markets/sensex-nifty-hit-record-highs-fii-inflows/articleshow/10892013.cms',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    summary: {
      whatHappened: 'Indian benchmark indices Sensex and Nifty rallied to fresh all-time highs led by heavy buying in banking, IT, and auto heavyweights.',
      whyItMatters: 'Combined domestic retail SIP inflows and returning foreign capital provide strong structural support to Indian market valuations despite global geopolitical headwinds.',
      keyMetric: 'Net FII Purchase: ₹3,400 Crore in a Single Session'
    },
    interviewTalkingPoint: 'If asked about Indian market resilience: "The Indian stock market exhibits dual strength: strong domestic retail liquidity via monthly SIPs (₹20,000+ Cr) balancing volatile foreign institutional flows (FIIs)."',
    keyTerms: ['Sensex / Nifty', 'Domestic Institutional Investors (DII)', 'P/E Multiple', 'Market Capitalization']
  },
  {
    id: 'quest-4',
    title: 'Retail Mutual Fund Inflows Cross ₹20,000 Crore Milestone via Monthly SIPs',
    category: 'mutual_funds',
    categoryLabel: '💰 Mutual Funds & Finance',
    date: 'Sep 01, 2026',
    readTime: '2 min read',
    source: 'Times of India Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/mutual-funds/retail-mf-inflows-cross-milestone/articleshow/10892014.cms',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    summary: {
      whatHappened: 'Systematic Investment Plan (SIP) contributions hit a record high, reflecting widespread retail investor participation in equity mutual funds.',
      whyItMatters: 'Retail financialization lowers India’s dependence on speculative foreign capital and provides predictable long-term capital for Indian infrastructure and corporates.',
      keyMetric: 'Monthly SIP Contributions: ₹21,250 Crore (+24% YoY growth)'
    },
    interviewTalkingPoint: 'If asked about wealth management trends: "The surge in monthly SIP contributions proves a fundamental shift from traditional physical assets (gold, real estate) into financialized equity assets among young professionals."',
    keyTerms: ['Systematic Investment Plan (SIP)', 'AUM (Assets Under Management)', 'Compounding', 'Financialization']
  },
  {
    id: 'quest-5',
    title: 'Reserve Bank of India (RBI) Maintains Repo Rate at 6.5%: Focus on Inflation & Liquidity',
    category: 'banking',
    categoryLabel: '🏦 Banking & Policy',
    date: 'Aug 31, 2026',
    readTime: '2 min read',
    source: 'Times of India Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business/rbi-monetary-policy-repo-rate-unchanged/articleshow/10892015.cms',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
    summary: {
      whatHappened: 'The RBI Monetary Policy Committee (MPC) voted to keep the policy Repo Rate unchanged at 6.50%, emphasizing withdrawal of accommodation to keep CPI inflation anchored at 4%.',
      whyItMatters: 'Stable interest rates maintain bank Net Interest Margins (NIM) while ensuring commercial lending rates remain predictable for housing, automotive, and corporate loans.',
      keyMetric: 'RBI Policy Repo Rate: 6.50% · Inflation Target: 4.0%'
    },
    interviewTalkingPoint: 'If asked about banking and monetary policy: "The RBI’s stance balances growth imperatives with inflation control. Keeping rates steady supports commercial credit growth while protecting bank asset quality."',
    keyTerms: ['Repo Rate', 'Monetary Policy Committee (MPC)', 'Net Interest Margin (NIM)', 'CPI Inflation']
  },
  {
    id: 'quest-6',
    title: 'Global Tech Giants Expand Semiconductor & AI Infrastructure Investments in India',
    category: 'international',
    categoryLabel: '🌐 International Business',
    date: 'Aug 30, 2026',
    readTime: '2 min read',
    source: 'Times of India Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/international-business/tech-giants-semiconductor-ai-investments-india/articleshow/10892016.cms',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    summary: {
      whatHappened: 'Major international technology conglomerates announced multi-billion-dollar commitments to set up advanced chip packaging units and AI data centers in Gujarat and Tamil Nadu.',
      whyItMatters: 'Positions India as a major global hub in semiconductor hardware, creating thousands of high-tech engineering jobs and lowering reliance on foreign chip imports.',
      keyMetric: 'Semiconductor Mission Outlay: $10 Billion Government Incentive Package'
    },
    interviewTalkingPoint: 'If asked about technology strategy in placement interviews: "India’s push into semiconductor fabrication and AI infrastructure transforms the nation from a pure software services provider into a deep-tech hardware powerhouse."',
    keyTerms: ['Semiconductor Fab', 'AI Data Centers', 'Global Capability Centers (GCC)', 'Deep Tech']
  }
];

export const KNOWLEDGE_QUEST_QUIZ = [
  {
    id: 'q1',
    question: 'What is the primary effect of a US Fed interest rate cut on emerging markets like India?',
    options: [
      'It stops all foreign investments into India',
      'It lowers US dollar yields, encouraging foreign capital (FIIs) to flow into high-growth markets like India',
      'It increases borrowing interest rates for Indian IT companies',
      'It forces the RBI to double interest rates immediately'
    ],
    correctAnswer: 1,
    explanation: 'A US Fed rate cut reduces fixed-income yields in the US, prompting global investors to seek higher returns in emerging markets like India.'
  },
  {
    id: 'q2',
    question: 'A Purchasing Managers’ Index (PMI) reading above 50 signifies:',
    options: [
      'Economic contraction',
      'Economic expansion and growth in factory production',
      'High inflation and market decline',
      'Zero change in manufacturing output'
    ],
    correctAnswer: 1,
    explanation: 'A PMI index score above 50 represents expansion in manufacturing or services compared to the previous month.'
  },
  {
    id: 'q3',
    question: 'Why are monthly Systematic Investment Plan (SIP) inflows critical for Indian stock markets?',
    options: [
      'They provide predictable domestic retail capital that balances foreign capital volatility',
      'They guarantee 100% returns for all investors',
      'They increase bank tax rates',
      'They replace government tax revenues'
    ],
    correctAnswer: 0,
    explanation: 'Steady monthly SIP inflows from domestic retail investors provide a strong structural cushion against volatile foreign institutional investor (FII) capital movements.'
  }
];
