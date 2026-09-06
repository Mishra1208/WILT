export const KNOWLEDGE_QUEST_CATEGORIES = [
  { id: 'all', label: 'All News', icon: '🔥' },
  { id: 'international', label: '🌐 International Business', icon: '🌐' },
  { id: 'india_business', label: '🇮🇳 India Business', icon: '🇮🇳' },
  { id: 'markets', label: '📈 Markets & Economy', icon: '📈' },
  { id: 'mutual_funds', label: '💰 MF & Finance', icon: '💰' },
  { id: 'banking', label: '🏦 Banking & Policy', icon: '🏦' }
];

// Local high-reliability image fallbacks served directly from Vercel domain
export const SECONDARY_FALLBACK_IMAGES = {
  international: '/news/toi-int-1.jpg',
  india_business: '/news/toi-ind-1.jpg',
  markets: '/news/toi-mkt-1.jpg',
  mutual_funds: '/news/toi-mf-1.jpg',
  banking: '/news/toi-bnk-1.jpg'
};

export const KNOWLEDGE_QUEST_ARTICLES = [
  // --- 🌐 INTERNATIONAL BUSINESS ---
  {
    id: 'toi-int-1',
    title: 'US Fed Signals Rate Cut Decision: Impact on Global Capital & Tech Valuations',
    category: 'international',
    categoryLabel: '🌐 International Business',
    date: 'Sep 06, 2026',
    readTime: '60 sec read',
    source: 'Times of India Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/international-business',
    imageUrl: '/news/toi-int-1.jpg',
    summary: {
      whatHappened: 'The Federal Reserve signaled a potential interest rate reduction following stabilizing US inflation metrics and shifting labor market indicators.',
      whyItMatters: 'Lower US interest rates generally drive global capital into emerging markets like India, easing borrowing costs for tech firms and boosting global stock liquidity.',
      keyMetric: 'Fed Target Rate: 5.25% - 5.50% ➔ Expected 25 bps Cut'
    },
    interviewTalkingPoint: 'If asked in an interview about global capital flows: "A US Fed rate cut reduces dollar yields, encouraging institutional foreign investors (FIIs) to reallocate capital into high-growth emerging economies like India, boosting startup funding and IT stock valuations."',
    keyTerms: ['Fed Rate Cut', 'FII Inflows', 'Dollar Index (DXY)', 'Cost of Capital']
  },
  {
    id: 'toi-int-2',
    title: 'Global Tech Conglomerates Expand AI Data Centers & Semiconductor Supply Chains in India',
    category: 'international',
    categoryLabel: '🌐 International Business',
    date: 'Sep 05, 2026',
    readTime: '60 sec read',
    source: 'Times of India Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/international-business',
    imageUrl: '/news/toi-int-2.jpg',
    summary: {
      whatHappened: 'Major international technology conglomerates announced multi-billion-dollar commitments to set up advanced chip packaging units and AI data centers in Gujarat and Tamil Nadu.',
      whyItMatters: 'Positions India as a major global hub in semiconductor hardware, creating thousands of high-tech engineering jobs and lowering reliance on foreign chip imports.',
      keyMetric: '$10 Billion Government Incentive Package & Global Co-Investments'
    },
    interviewTalkingPoint: 'If asked about technology strategy in placement interviews: "India’s push into semiconductor fabrication and AI infrastructure transforms the nation from a pure software services provider into a deep-tech hardware powerhouse."',
    keyTerms: ['Semiconductor Fab', 'AI Data Centers', 'Global Capability Centers (GCC)', 'Deep Tech']
  },
  {
    id: 'toi-int-3',
    title: 'Brent Crude Oil Stabilizes Near $78/Barrel Amid OPEC+ Supply Strategy Shift',
    category: 'international',
    categoryLabel: '🌐 International Business',
    date: 'Sep 05, 2026',
    readTime: '60 sec read',
    source: 'Times of India International',
    toiUrl: 'https://timesofindia.indiatimes.com/business/international-business',
    imageUrl: '/news/toi-int-3.jpg',
    summary: {
      whatHappened: 'Global crude benchmarks settled near $78 per barrel as OPEC+ producers balanced production quotas against non-OPEC output increases.',
      whyItMatters: 'As a major crude importer, moderate oil prices directly reduce India’s Current Account Deficit (CAD) and mitigate domestic inflationary pressure.',
      keyMetric: 'Brent Crude: $78.40/barrel · India CAD Impact: -15 bps per $10 drop'
    },
    interviewTalkingPoint: 'If asked about macro commodity impacts: "Stable oil prices under $80 protect India’s current account deficit and fiscal math, allowing the central bank to maintain monetary stability while lowering transport input costs for manufacturing."',
    keyTerms: ['Current Account Deficit', 'OPEC+ Quotas', 'Import Inflation', 'Macro Stability']
  },
  {
    id: 'toi-int-4',
    title: 'Nvidia & Enterprise Tech Leaders Report Surge in Generative AI Capex',
    category: 'international',
    categoryLabel: '🌐 International Business',
    date: 'Sep 04, 2026',
    readTime: '60 sec read',
    source: 'Times of India Tech & World',
    toiUrl: 'https://timesofindia.indiatimes.com/business/international-business',
    imageUrl: '/news/toi-int-4.jpg',
    summary: {
      whatHappened: 'Enterprise technology giants reported quarterly revenue beats driven by hyperscaler AI chip demand and enterprise cloud infrastructure deployment.',
      whyItMatters: 'Accelerating AI capex signals sustained long-term digital transformation spending, driving Indian IT service providers into AI implementation contracts.',
      keyMetric: 'Global AI Capex: $200B+ Projected for 2026'
    },
    interviewTalkingPoint: 'If asked about IT sector trends: "Enterprise spending is shifting rapidly from legacy IT infrastructure maintenance toward Generative AI implementation and cloud modernization, creating high-margin advisory opportunities for Indian IT leaders."',
    keyTerms: ['Generative AI', 'Hyperscaler Capex', 'Enterprise SaaS', 'IT Modernization']
  },
  {
    id: 'toi-int-5',
    title: 'US Dollar Index (DXY) Eases to 102 as Global Trade Settlement Shifts to Bilateral Currencies',
    category: 'international',
    categoryLabel: '🌐 International Business',
    date: 'Sep 03, 2026',
    readTime: '60 sec read',
    source: 'Times of India Global Economy',
    toiUrl: 'https://timesofindia.indiatimes.com/business/international-business',
    imageUrl: '/news/toi-int-5.jpg',
    summary: {
      whatHappened: 'The US Dollar Index weakened slightly as international trade partners expanded local currency trade settlements in Asia and Europe.',
      whyItMatters: 'A softer US dollar strengthens emerging market currencies like the Indian Rupee (INR) and reduces external debt servicing costs for domestic corporates.',
      keyMetric: 'Dollar Index (DXY): 102.15 (-0.4% MoM decline)'
    },
    interviewTalkingPoint: 'If asked about foreign exchange dynamics: "A softening dollar index relieves pressure on INR exchange rates, stabilizing imported inflation and allowing emerging markets greater monetary policy autonomy."',
    keyTerms: ['Dollar Index', 'Currency Depreciation', 'Trade Settlement', 'Forex Reserves']
  },
  {
    id: 'toi-int-6',
    title: 'European Central Bank (ECB) Cuts Benchmark Rates to Stimulate Eurozone Manufacturing',
    category: 'international',
    categoryLabel: '🌐 International Business',
    date: 'Sep 02, 2026',
    readTime: '60 sec read',
    source: 'Times of India International',
    toiUrl: 'https://timesofindia.indiatimes.com/business/international-business',
    imageUrl: '/news/toi-int-6.jpg',
    summary: {
      whatHappened: 'The ECB reduced key deposit facility rates by 25 basis points to support industrial production across Germany, France, and northern Europe.',
      whyItMatters: 'Lower European interest rates stimulate consumer demand in the EU, benefiting Indian textile, auto component, and IT service exporters.',
      keyMetric: 'ECB Deposit Rate: 3.25% (25 bps Cut)'
    },
    interviewTalkingPoint: 'If asked about European trade linkages: "Eurozone monetary easing revives industrial demand across major European economies, supporting order books for Indian engineering and IT export sectors."',
    keyTerms: ['ECB Monetary Policy', 'Export Demand', 'Eurozone Economy', 'Interest Rate Cycles']
  },

  // --- 🇮🇳 INDIA BUSINESS ---
  {
    id: 'toi-ind-1',
    title: 'India Manufacturing PMI Surges to 58.5 on Strong Export Orders & Factory Output',
    category: 'india_business',
    categoryLabel: '🇮🇳 India Business',
    date: 'Sep 06, 2026',
    readTime: '60 sec read',
    source: 'Times of India Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-ind-1.jpg',
    summary: {
      whatHappened: 'India’s Purchasing Managers’ Index (PMI) for manufacturing accelerated sharply, reflecting strong factory orders and expanding export shipments.',
      whyItMatters: 'Strong manufacturing signals robust corporate capex, job growth, and sustained GDP expansion, strengthening India’s positioning in global supply chain diversification.',
      keyMetric: 'Manufacturing PMI: 58.5 (Above 50 threshold indicates strong expansion)'
    },
    interviewTalkingPoint: 'If asked about India’s economic growth drivers: "India’s high PMI score above 58 demonstrates real physical economy expansion driven by government infrastructure spending and the Production Linked Incentive (PLI) scheme."',
    keyTerms: ['PMI Index', 'Capex Expansion', 'PLI Scheme', 'Industrial Production']
  },
  {
    id: 'toi-ind-2',
    title: 'PLI Scheme Impact: India Electronics Exports Cross $30 Billion Landmark',
    category: 'india_business',
    categoryLabel: '🇮🇳 India Business',
    date: 'Sep 05, 2026',
    readTime: '60 sec read',
    source: 'Times of India Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-ind-2.jpg',
    summary: {
      whatHappened: 'Electronics manufacturing under the Production Linked Incentive (PLI) program propelled total mobile and hardware exports past $30 billion.',
      whyItMatters: 'Reduces trade deficit, boosts domestic component ecosystem, and attracts global contract manufacturers like Foxconn and Pegatron to expand Indian plants.',
      keyMetric: 'Electronics Exports: $30.5 Billion (+38% YoY Growth)'
    },
    interviewTalkingPoint: 'If asked about manufacturing policy: "The PLI scheme has successfully transformed India into a global smartphone manufacturing hub, demonstrating how targeted supply-side incentives can scale export-oriented industrial capacity."',
    keyTerms: ['PLI Scheme', 'Electronics Exports', 'Supply Chain Diversification', 'Manufacturing Hub']
  },
  {
    id: 'toi-ind-3',
    title: 'India EV Sales Hit Record High Driven by Commercial Fleet & 2W Adoption',
    category: 'india_business',
    categoryLabel: '🇮🇳 India Business',
    date: 'Sep 04, 2026',
    readTime: '60 sec read',
    source: 'Times of India Auto & Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-ind-3.jpg',
    summary: {
      whatHappened: 'Electric vehicle registrations across two-wheelers, three-wheelers, and commercial delivery fleets reached record monthly totals across tier-1 and tier-2 cities.',
      whyItMatters: 'Accelerates clean mobility transition, reduces fossil fuel import bills, and creates high growth in battery manufacturing and charging infrastructure startups.',
      keyMetric: 'EV Penetration: 7.8% of Total Auto Sales in Major Urban Markets'
    },
    interviewTalkingPoint: 'If asked about green mobility: "Rapid EV fleet adoption in commercial logistics and two-wheelers is lowering total cost of ownership (TCO) for businesses while driving private investment in charging grids and localized battery chemistry."',
    keyTerms: ['EV Transition', 'Total Cost of Ownership', 'Charging Infrastructure', 'Clean Energy']
  },
  {
    id: 'toi-ind-4',
    title: 'Reliance & Tata Group Commit ₹1.5 Lakh Crore Capex for Green Hydrogen & Solar Fabs',
    category: 'india_business',
    categoryLabel: '🇮🇳 India Business',
    date: 'Sep 03, 2026',
    readTime: '60 sec read',
    source: 'Times of India Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-ind-4.jpg',
    summary: {
      whatHappened: 'India’s premier industrial conglomerates announced multi-phase capital expenditure plans for gigafactories producing green hydrogen electrolyzers and solar PV modules.',
      whyItMatters: 'Supports India’s net-zero carbon goals by 2070 while positioning domestic industry to export clean energy equipment to Europe and Asia.',
      keyMetric: 'Green Energy Outlay: ₹1.5 Lakh Crore ($18 Billion)'
    },
    interviewTalkingPoint: 'If asked about energy transition: "Large-scale private capex in green hydrogen and solar gigafactories ensures long-term energy security for India while building competitive advantage in exportable clean-tech hardware."',
    keyTerms: ['Green Hydrogen', 'Corporate Capex', 'Gigafactories', 'Energy Transition']
  },
  {
    id: 'toi-ind-5',
    title: 'India Startup Ecosystem Sees $8 Billion Funding Rebound in SaaS & Fintech',
    category: 'india_business',
    categoryLabel: '🇮🇳 India Business',
    date: 'Sep 02, 2026',
    readTime: '60 sec read',
    source: 'Times of India Tech & Business',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-ind-5.jpg',
    summary: {
      whatHappened: 'Venture capital and private equity funding into Indian startups rebounded sharply, focused on sustainable unit economics in B2B SaaS, fintech, and deeptech.',
      whyItMatters: 'Marks a transition from cash-burn customer acquisition models toward disciplined, profitable enterprise tech solutions with global recurring revenue.',
      keyMetric: 'H1 Funding Rebound: $8.2 Billion Across 450+ Deals'
    },
    interviewTalkingPoint: 'If asked about startup valuation dynamics: "The current venture capital landscape prioritizes path-to-profitability, positive EBITDA, and defensible IP over top-line GMV growth, creating healthier tech enterprise fundamentals."',
    keyTerms: ['Venture Capital', 'Unit Economics', 'Path to Profitability', 'B2B SaaS']
  },
  {
    id: 'toi-ind-6',
    title: 'National Highways Infrastructure Capex Drives Cement & Heavy Equipment Demand',
    category: 'india_business',
    categoryLabel: '🇮🇳 India Business',
    date: 'Sep 01, 2026',
    readTime: '60 sec read',
    source: 'Times of India Infrastructure',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-ind-6.jpg',
    summary: {
      whatHappened: 'Accelerated highway construction and expressways expansion pushed domestic cement consumption and commercial vehicle sales to fresh multi-year highs.',
      whyItMatters: 'Public capital expenditure creates a multiplier effect across core steel, cement, logistics, and rural employment sectors.',
      keyMetric: 'Highway Construction Target: 32 km/day Average Speed'
    },
    interviewTalkingPoint: 'If asked about infrastructure multiplier effect: "Government-led capital expenditure in logistics corridors lowers national freight logistics costs from 14% to under 9% of GDP, boosting export competitiveness."',
    keyTerms: ['Public Capex', 'Logistics Multiplier', 'Infrastructure Spending', 'Core Sectors']
  },

  // --- 📈 MARKETS & ECONOMY ---
  {
    id: 'toi-mkt-1',
    title: 'Sensex & Nifty Hit All-Time Highs as Foreign Institutional Investors (FIIs) Turn Net Buyers',
    category: 'markets',
    categoryLabel: '📈 Markets & Economy',
    date: 'Sep 06, 2026',
    readTime: '60 sec read',
    source: 'Times of India Markets',
    toiUrl: 'https://timesofindia.indiatimes.com/business/markets',
    imageUrl: '/news/toi-mkt-1.jpg',
    summary: {
      whatHappened: 'Indian benchmark indices Sensex and Nifty rallied to fresh all-time highs led by heavy buying in banking, IT, and auto heavyweights.',
      whyItMatters: 'Combined domestic retail SIP inflows and returning foreign capital provide strong structural support to Indian market valuations despite global geopolitical headwinds.',
      keyMetric: 'Net FII Purchase: ₹3,400 Crore in a Single Trading Session'
    },
    interviewTalkingPoint: 'If asked about Indian market resilience: "The Indian stock market exhibits dual strength: strong domestic retail liquidity via monthly SIPs (₹20,000+ Cr) balancing volatile foreign institutional flows (FIIs)."',
    keyTerms: ['Sensex / Nifty', 'FII Inflows', 'DII Liquidity', 'Market Cap']
  },
  {
    id: 'toi-mkt-2',
    title: 'SEBI Simplifies IPO Listing Timeline to T+3 Days to Boost Capital Market Efficiency',
    category: 'markets',
    categoryLabel: '📈 Markets & Economy',
    date: 'Sep 05, 2026',
    readTime: '60 sec read',
    source: 'Times of India Markets',
    toiUrl: 'https://timesofindia.indiatimes.com/business/markets',
    imageUrl: '/news/toi-mkt-2.jpg',
    summary: {
      whatHappened: 'The Securities and Exchange Board of India (SEBI) reduced the post-issue IPO listing timeline from 6 days (T+6) to 3 days (T+3) across mainboard exchanges.',
      whyItMatters: 'Unlocks capital faster for issuers, reduces opportunity costs for retail applicants, and enhances secondary market liquidity for new listings.',
      keyMetric: 'IPO Listing Settlement: T+3 Days Mandatory Enforcement'
    },
    interviewTalkingPoint: 'If asked about capital market regulation: "SEBI’s reduction of the IPO listing cycle to T+3 highlights India’s world-class financial market infrastructure, reducing liquidity lockup for investors."',
    keyTerms: ['SEBI Regulation', 'T+3 Settlement', 'Primary Market IPO', 'Capital Efficiency']
  },
  {
    id: 'toi-mkt-3',
    title: 'India GDP Expands at 7.2% in FY26 Led by Strong Private Consumption & Capex',
    category: 'markets',
    categoryLabel: '📈 Markets & Economy',
    date: 'Sep 04, 2026',
    readTime: '60 sec read',
    source: 'Times of India Economy',
    toiUrl: 'https://timesofindia.indiatimes.com/business/markets',
    imageUrl: '/news/toi-mkt-3.jpg',
    summary: {
      whatHappened: 'National Statistical Office (NSO) data confirmed India’s real GDP growth rate at 7.2% for the fiscal year, retaining its position as the world’s fastest-growing major economy.',
      whyItMatters: 'Robust economic growth provides corporate earnings visibility, supporting elevated equity valuations and attracting foreign direct investment (FDI).',
      keyMetric: 'Real GDP Growth Rate: 7.2% YoY · Nominal GDP: ₹320 Lakh Crore'
    },
    interviewTalkingPoint: 'If asked about macro growth prospects: "India’s 7%+ GDP growth trajectory is sustained by strong domestic consumption, high government capital outlay, and expanding service sector exports."',
    keyTerms: ['GDP Growth', 'Macroeconomics', 'Private Consumption', 'FDI Inflows']
  },
  {
    id: 'toi-mkt-4',
    title: 'J.P. Morgan Emerging Market Bond Index Inclusion Triggers $25B Debt Inflows to India',
    category: 'markets',
    categoryLabel: '📈 Markets & Economy',
    date: 'Sep 03, 2026',
    readTime: '60 sec read',
    source: 'Times of India Markets',
    toiUrl: 'https://timesofindia.indiatimes.com/business/markets',
    imageUrl: '/news/toi-mkt-4.jpg',
    summary: {
      whatHappened: 'The phased weightage increase of Indian Fully Accessible Route (FAR) sovereign bonds in global debt indices drove billions in passive bond fund inflows.',
      whyItMatters: 'Lowers government borrowing yields, stabilizes foreign currency reserves, and deepens sovereign debt market liquidity without triggering domestic inflation.',
      keyMetric: 'Projected Passive Debt Inflows: $25 Billion Total'
    },
    interviewTalkingPoint: 'If asked about bond market global integration: "Inclusion of Indian government bonds in global indices lowers government borrowing costs and broadens the investor base beyond domestic commercial banks."',
    keyTerms: ['Bond Index Inclusion', 'Sovereign Debt', 'Yield Curve', 'Passive Inflows']
  },
  {
    id: 'toi-mkt-5',
    title: 'India Corporate Earnings Growth Rebounds to 18% YoY Led by Banking & Capital Goods',
    category: 'markets',
    categoryLabel: '📈 Markets & Economy',
    date: 'Sep 02, 2026',
    readTime: '60 sec read',
    source: 'Times of India Markets',
    toiUrl: 'https://timesofindia.indiatimes.com/business/markets',
    imageUrl: '/news/toi-mkt-5.jpg',
    summary: {
      whatHappened: 'Quarterly Nifty 50 earnings summaries exceeded consensus forecasts, driven by strong Net Interest Margins (NIM) in banking and order execution in capital goods.',
      whyItMatters: 'Earnings growth justifies current P/E multiples, giving equity investors confidence to remain invested across large-cap and mid-cap categories.',
      keyMetric: 'Nifty EPS Growth: +18.4% YoY Average Across Constituents'
    },
    interviewTalkingPoint: 'If asked about market valuations: "Current stock market levels are backed by real double-digit corporate earnings growth (EPS expansion), protecting against valuation bubble risks."',
    keyTerms: ['Earnings Per Share (EPS)', 'P/E Multiple', 'Nifty 50 Earnings', 'Capital Goods']
  },
  {
    id: 'toi-mkt-6',
    title: 'Gold & Silver Prices Rally Amid Global Central Bank Asset Diversification',
    category: 'markets',
    categoryLabel: '📈 Markets & Economy',
    date: 'Sep 01, 2026',
    readTime: '60 sec read',
    source: 'Times of India Markets',
    toiUrl: 'https://timesofindia.indiatimes.com/business/markets',
    imageUrl: '/news/toi-mkt-6.jpg',
    summary: {
      whatHappened: 'Precious metals touched multi-month highs as global central banks increased gold allocations to hedge against currency fluctuations and geopolitical risks.',
      whyItMatters: 'Demonstrates a macro flight to safe-haven assets while benefiting domestic bullion demand and gold loan NBFC loan-to-value (LTV) ratios.',
      keyMetric: 'Gold Futures: ₹74,500/10g · RBI Gold Reserve Allocation: +12%'
    },
    interviewTalkingPoint: 'If asked about safe-haven assets: "Central bank gold purchases highlight global reserve diversification strategies, protecting sovereign balance sheets against FX volatility."',
    keyTerms: ['Gold Reserves', 'Safe-Haven Assets', 'Hedging Strategy', 'Macro Bullion']
  },

  // --- 💰 MUTUAL FUNDS & FINANCE ---
  {
    id: 'toi-mf-1',
    title: 'Retail Mutual Fund Inflows Cross ₹22,000 Crore Milestone via Monthly SIPs',
    category: 'mutual_funds',
    categoryLabel: '💰 MF & Finance',
    date: 'Sep 06, 2026',
    readTime: '60 sec read',
    source: 'Times of India Mutual Funds',
    toiUrl: 'https://timesofindia.indiatimes.com/business/mutual-funds',
    imageUrl: '/news/toi-mf-1.jpg',
    summary: {
      whatHappened: 'Systematic Investment Plan (SIP) contributions hit an all-time record, reflecting widespread retail investor participation in equity mutual funds.',
      whyItMatters: 'Retail financialization lowers India’s dependence on speculative foreign capital and provides predictable long-term capital for Indian infrastructure and corporates.',
      keyMetric: 'Monthly SIP Inflows: ₹22,150 Crore (+24% YoY Growth)'
    },
    interviewTalkingPoint: 'If asked about wealth management trends: "The surge in monthly SIP contributions proves a fundamental shift from traditional physical assets (gold, real estate) into financialized equity assets among young professionals."',
    keyTerms: ['Systematic Investment Plan (SIP)', 'AUM Growth', 'Financialization', 'Retail Liquidity']
  },
  {
    id: 'toi-mf-2',
    title: 'SEBI Introduces New Asset Class Category Between Mutual Funds & PMS for Retail Wealth',
    category: 'mutual_funds',
    categoryLabel: '💰 MF & Finance',
    date: 'Sep 05, 2026',
    readTime: '60 sec read',
    source: 'Times of India Mutual Funds',
    toiUrl: 'https://timesofindia.indiatimes.com/business/mutual-funds',
    imageUrl: '/news/toi-mf-2.jpg',
    summary: {
      whatHappened: 'SEBI approved a new investment vehicle with a minimum ticket size of ₹10 lakh, bridging the gap between retail Mutual Funds and Portfolio Management Services (PMS).',
      whyItMatters: 'Allows affluent investors access to long-short strategies and derivative hedging with regulated safeguards and lower entry barriers than traditional PMS (₹50 lakh).',
      keyMetric: 'Minimum Ticket Size: ₹10 Lakh · Higher Risk-Adjusted Flexibility'
    },
    interviewTalkingPoint: 'If asked about financial product innovation: "SEBI’s new asset class fills an important gap for high-net-worth investors seeking sophisticated derivative strategies without the high entry threshold of PMS."',
    keyTerms: ['New Asset Class', 'PMS vs Mutual Fund', 'SEBI Framework', 'HNW Investing']
  },
  {
    id: 'toi-mf-3',
    title: 'Flexi Cap & Large Cap Funds Lead Inflows as Investors Rebalance Portfolios',
    category: 'mutual_funds',
    categoryLabel: '💰 MF & Finance',
    date: 'Sep 04, 2026',
    readTime: '60 sec read',
    source: 'Times of India Personal Finance',
    toiUrl: 'https://timesofindia.indiatimes.com/business/mutual-funds',
    imageUrl: '/news/toi-mf-3.jpg',
    summary: {
      whatHappened: 'AMFI monthly data revealed strong net inflows into Flexi Cap, Large Cap, and Multi-Asset Allocation funds following small-cap valuation consolidation.',
      whyItMatters: 'Reflects growing investor maturity and prudent asset allocation toward steady, lower-volatility large-cap blue-chip equities.',
      keyMetric: 'Flexi Cap Category Inflows: ₹4,200 Crore in Single Month'
    },
    interviewTalkingPoint: 'If asked about portfolio risk management: "Investors shifting toward Flexi Cap and Large Cap funds highlights prudent risk management, securing gains after extended mid/small-cap rallies."',
    keyTerms: ['Flexi Cap Funds', 'AMFI Data', 'Asset Allocation', 'Large Cap Bluechips']
  },
  {
    id: 'toi-mf-4',
    title: 'Mutual Fund Industry AUM Crosses ₹65 Lakh Crore Milestone in Historic Rally',
    category: 'mutual_funds',
    categoryLabel: '💰 MF & Finance',
    date: 'Sep 03, 2026',
    readTime: '60 sec read',
    source: 'Times of India Mutual Funds',
    toiUrl: 'https://timesofindia.indiatimes.com/business/mutual-funds',
    imageUrl: '/news/toi-mf-4.jpg',
    summary: {
      whatHappened: 'Total Assets Under Management (AUM) across Indian Asset Management Companies (AMCs) surpassed ₹65 lakh crore for the first time in history.',
      whyItMatters: 'Demonstrates deep structural expansion of India’s capital markets, driving fee income for asset managers and generating employment in wealth tech.',
      keyMetric: 'Industry Total AUM: ₹65.8 Lakh Crore ($790 Billion)'
    },
    interviewTalkingPoint: 'If asked about financial sector growth: "Crossing ₹65 lakh crore in AUM illustrates how digital onboarding and compounding returns are rapidly expanding India’s domestic asset management ecosystem."',
    keyTerms: ['Total AUM', 'AMFI Industry Benchmark', 'Wealth Tech', 'AMC Earnings']
  },
  {
    id: 'toi-mf-5',
    title: 'Direct Mutual Fund Growth Outpaces Regular Plans as Digital Fintech Apps Expand',
    category: 'mutual_funds',
    categoryLabel: '💰 MF & Finance',
    date: 'Sep 02, 2026',
    readTime: '60 sec read',
    source: 'Times of India Personal Finance',
    toiUrl: 'https://timesofindia.indiatimes.com/business/mutual-funds',
    imageUrl: '/news/toi-mf-5.jpg',
    summary: {
      whatHappened: 'Direct mutual fund plans registered higher net unit creation compared to regular plans, driven by tech-savvy retail investors using zero-commission platforms.',
      whyItMatters: 'Lower Total Expense Ratios (TER) in direct plans save investors 0.5%–1.5% annually, compounding significantly higher wealth over 15-20 year investment horizons.',
      keyMetric: 'Direct Plan TER Savings: 0.75% Average Annual Yield Boost'
    },
    interviewTalkingPoint: 'If asked about fintech disruption in wealth management: "The growth of zero-commission direct plans democratizes investing by lowering expense ratios, allowing retail investors to retain maximum compounding returns."',
    keyTerms: ['Direct vs Regular Plans', 'Expense Ratio (TER)', 'Fintech Disruption', 'Wealth Democratization']
  },
  {
    id: 'toi-mf-6',
    title: 'Tax-Saving ELSS Schemes See Surge in Year-End Financial Allocations',
    category: 'mutual_funds',
    categoryLabel: '💰 MF & Finance',
    date: 'Sep 01, 2026',
    readTime: '60 sec read',
    source: 'Times of India Wealth',
    toiUrl: 'https://timesofindia.indiatimes.com/business/mutual-funds',
    imageUrl: '/news/toi-mf-6.jpg',
    summary: {
      whatHappened: 'Equity Linked Savings Schemes (ELSS) recorded heavy inflows as salaried professionals capitalized on Section 80C tax deductions combined with 3-year equity lock-ins.',
      whyItMatters: 'ELSS lock-ins prevent emotional panic selling during market downturns, delivering superior long-term compounded CAGR compared to traditional PPF or tax FDs.',
      keyMetric: 'ELSS Lock-In: 3 Years (Shortest among all tax-saving instruments)'
    },
    interviewTalkingPoint: 'If asked about tax-efficient investing: "ELSS combines dual benefits: immediate tax deductions under Section 80C and wealth creation through equities, with the 3-year lock-in instilling disciplined long-term investing behavior."',
    keyTerms: ['ELSS Tax Funds', 'Section 80C', 'Lock-in Period', 'Wealth Compounding']
  },

  // --- 🏦 BANKING & POLICY ---
  {
    id: 'toi-bnk-1',
    title: 'Reserve Bank of India (RBI) Maintains Repo Rate at 6.50%: Focus on Inflation Control',
    category: 'banking',
    categoryLabel: '🏦 Banking & Policy',
    date: 'Sep 06, 2026',
    readTime: '60 sec read',
    source: 'Times of India Banking',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-bnk-1.jpg',
    summary: {
      whatHappened: 'The RBI Monetary Policy Committee (MPC) voted to keep the policy Repo Rate unchanged at 6.50%, emphasizing withdrawal of accommodation to keep CPI inflation anchored at 4%.',
      whyItMatters: 'Stable interest rates maintain bank Net Interest Margins (NIM) while ensuring commercial lending rates remain predictable for housing, automotive, and corporate loans.',
      keyMetric: 'RBI Policy Repo Rate: 6.50% · Inflation Target: 4.0%'
    },
    interviewTalkingPoint: 'If asked about banking and monetary policy: "The RBI’s stance balances growth imperatives with inflation control. Keeping rates steady supports commercial credit growth while protecting bank asset quality."',
    keyTerms: ['Repo Rate', 'Monetary Policy Committee (MPC)', 'Net Interest Margin (NIM)', 'CPI Inflation']
  },
  {
    id: 'toi-bnk-2',
    title: 'Indian Public Sector Banks Record Lowest Gross NPA in 12 Years at 2.4%',
    category: 'banking',
    categoryLabel: '🏦 Banking & Policy',
    date: 'Sep 05, 2026',
    readTime: '60 sec read',
    source: 'Times of India Banking',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-bnk-2.jpg',
    summary: {
      whatHappened: 'Public Sector Banks (PSBs) reported a historic reduction in Gross Non-Performing Assets (NPAs), supported by robust resolution under the Insolvency and Bankruptcy Code (IBC).',
      whyItMatters: 'Clean commercial bank balance sheets allow lenders to aggressively extend credit to corporate expansion and retail housing without systemic default risks.',
      keyMetric: 'Gross NPA Ratio: 2.4% (Down from 11.2% in FY18)'
    },
    interviewTalkingPoint: 'If asked about banking sector health: "The dramatic cleanup of Indian bank balance sheets via the IBC framework and prudent provisioning has turned PSBs from loss-making institutions into highly profitable credit engines."',
    keyTerms: ['Gross NPA', 'Insolvency & Bankruptcy Code (IBC)', 'Provision Coverage Ratio', 'PSB Turnaround']
  },
  {
    id: 'toi-bnk-3',
    title: 'UPI Payment Volumes Hit 15 Billion Transactions Monthly, Expanding Globally',
    category: 'banking',
    categoryLabel: '🏦 Banking & Policy',
    date: 'Sep 04, 2026',
    readTime: '60 sec read',
    source: 'Times of India Banking & Policy',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-bnk-3.jpg',
    summary: {
      whatHappened: 'NPCI confirmed Unified Payments Interface (UPI) processed over 15 billion monthly digital transactions, with cross-border linkages active in Singapore, UAE, and Europe.',
      whyItMatters: 'Solidifies India’s position as a global leader in real-time digital payments architecture, lowering cash handling costs for merchants and boosting tax compliance.',
      keyMetric: 'Monthly Transaction Volume: 15.2 Billion · Monthly Value: ₹20.6 Lakh Crore'
    },
    interviewTalkingPoint: 'If asked about fintech infrastructure: "UPI’s open-loop interoperable design has revolutionized retail commerce in India, serving as a global blueprint for sovereign digital public infrastructure (DPI)."',
    keyTerms: ['Unified Payments Interface (UPI)', 'Digital Public Infrastructure', 'NPCI', 'Real-Time Payments']
  },
  {
    id: 'toi-bnk-4',
    title: 'RBI Digital Rupee (e₹) Pilot Expands to Interbank Money Markets & Remittances',
    category: 'banking',
    categoryLabel: '🏦 Banking & Policy',
    date: 'Sep 03, 2026',
    readTime: '60 sec read',
    source: 'Times of India Policy',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-bnk-4.jpg',
    summary: {
      whatHappened: 'The Reserve Bank of India expanded wholesale and retail Central Bank Digital Currency (CBDC) trials to settle government bond trades and international remittances.',
      whyItMatters: 'Reduces interbank settlement latency, eliminates counterparty clearing risks, and provides a programmable digital alternative to physical currency notes.',
      keyMetric: 'CBDC Pilot Scale: 5 Million Active Retail Users & 15 Participating Banks'
    },
    interviewTalkingPoint: 'If asked about Central Bank Digital Currency: "The RBI’s e₹ CBDC pilot modernizes wholesale interbank settlement by enabling instantaneous sovereign token settlement without correspondent bank fees."',
    keyTerms: ['CBDC Digital Rupee', 'Wholesale Settlement', 'Central Bank Policy', 'Remittance Latency']
  },
  {
    id: 'toi-bnk-5',
    title: 'Commercial Bank Credit Growth Touches 15.2% YoY Driven by Housing & Retail Loans',
    category: 'banking',
    categoryLabel: '🏦 Banking & Policy',
    date: 'Sep 02, 2026',
    readTime: '60 sec read',
    source: 'Times of India Banking',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-bnk-5.jpg',
    summary: {
      whatHappened: 'Bi-weekly RBI lending data showed bank credit off-take expanding across retail mortgages, vehicle loans, and working capital lines for MSMEs.',
      whyItMatters: 'Sustained double-digit credit expansion indicates healthy borrowing demand across businesses and households, supporting bank net interest income.',
      keyMetric: 'Bank Credit Off-Take Growth: 15.2% YoY'
    },
    interviewTalkingPoint: 'If asked about credit expansion: "Double-digit bank credit growth reflects consumer confidence in long-term income stability and expanding capital demand from medium and small enterprises."',
    keyTerms: ['Credit Off-Take', 'Retail Lending', 'MSME Financing', 'Net Interest Income']
  },
  {
    id: 'toi-bnk-6',
    title: 'SEBI & RBI Mandate Enhanced Cybersecurity Standards for Scheduled Banks',
    category: 'banking',
    categoryLabel: '🏦 Banking & Policy',
    date: 'Sep 01, 2026',
    readTime: '60 sec read',
    source: 'Times of India Banking Policy',
    toiUrl: 'https://timesofindia.indiatimes.com/business/india-business',
    imageUrl: '/news/toi-bnk-6.jpg',
    summary: {
      whatHappened: 'Regulators released joint guidelines requiring 24/7 Security Operations Centers (SOC) and zero-trust cloud architecture across all scheduled commercial banks.',
      whyItMatters: 'Protects core banking solutions (CBS) against cyber threats, ransomware, and unauthorized transactional access as digital banking volume surges.',
      keyMetric: 'Compliance Mandate: 100% Mandatory SOC Audit by Year End'
    },
    interviewTalkingPoint: 'If asked about banking technology regulation: "Proactive cybersecurity mandates by RBI and SEBI preserve consumer trust in digital banking infrastructure as digital transaction volume scales exponentially."',
    keyTerms: ['Cybersecurity Guidelines', 'Zero-Trust Architecture', 'Core Banking Solution', 'RegTech']
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
