export const CATEGORIES = [
  "All",
  "Accounting",
  "Banking",
  "Business",
  "Corporate Finance",
  "Current Affairs",
  "Economics",
  "ESG",
  "Finance",
  "FinTech",
  "General Knowledge",
  "Investment",
  "Markets",
  "Risk Management",
  "Technology",
  "Other"
];

// Clean initial posts - empty for real user data
export const INITIAL_POSTS = [];

// Initial concepts and jargon dictionary bank
export const INITIAL_CONCEPTS = [
  {
    id: "concept-1",
    term: "EBITDA",
    category: "Corporate Finance",
    definition: "Earnings Before Interest, Taxes, Depreciation, and Amortization. A key measure of core operating profitability.",
    plainExplanation: "The cash profitability of a company's main business operations before accounting for tax, debt interest, or equipment replacement costs.",
    formula: "EBITDA = Operating Income + Depreciation + Amortization",
    contributor: "avinendra_singh"
  },
  {
    id: "concept-2",
    term: "Repo Rate",
    category: "Banking",
    definition: "The interest rate at which commercial banks borrow money from the Central Bank by pledging government securities.",
    plainExplanation: "The Central Bank's interest rate. When Repo Rate rises, loan interest rates rise across all banks, cooling inflation.",
    formula: "High Repo Rate -> Expensive Bank Borrowing -> Tight Liquidity",
    contributor: "narendramishra"
  },
  {
    id: "concept-3",
    term: "BFS (Breadth-First Search)",
    category: "Technology",
    definition: "A tree and graph traversal algorithm that explores all neighbor nodes at the present depth level before moving to nodes at the next depth level.",
    plainExplanation: "Explores nodes level-by-level (like water ripples) using a Queue. Always finds the shortest path in unweighted graphs.",
    formula: "Queue (FIFO) -> Level-by-Level Exploration",
    contributor: "kumar_lead"
  },
  {
    id: "concept-4",
    term: "CapEx (Capital Expenditures)",
    category: "Accounting",
    definition: "Funds used by a company to acquire, upgrade, and maintain physical assets such as property, plants, buildings, or technology.",
    plainExplanation: "Money spent on long-term assets that will generate value for years, recorded on the Balance Sheet rather than as an immediate expense.",
    formula: "CapEx = Net Increase in Property, Plant & Equipment + Current Depreciation",
    contributor: "avinendra_singh"
  },
  {
    id: "concept-5",
    term: "Cash Reserve Ratio (CRR)",
    category: "Banking",
    definition: "The minimum percentage of total customer deposits commercial banks must reserve in pure cash with the Central Bank.",
    plainExplanation: "Emergency safety cash banks must deposit at the RBI/Central Bank with 0% interest to keep the financial system stable.",
    formula: "CRR Cash = Total Deposits (NDTL) × CRR %",
    contributor: "narendramishra"
  },
  {
    id: "concept-6",
    term: "Net Interest Margin (NIM)",
    category: "Banking",
    definition: "A profitability metric measuring the difference between interest income earned by a bank on loans and interest paid out to depositors.",
    plainExplanation: "The bank's profit margin on lending. High NIM means the bank earns significantly more interest on loans than it pays on savings accounts.",
    formula: "NIM % = (Interest Earned - Interest Expensed) / Average Earning Assets",
    contributor: "avinendra_singh"
  },
  {
    id: "concept-7",
    term: "P/E Ratio (Price-to-Earnings)",
    category: "Investment",
    definition: "A valuation ratio comparing a company's current stock market share price to its per-share earnings (EPS).",
    plainExplanation: "How many dollars investors are willing to pay for every $1 of annual profit the company generates.",
    formula: "P/E Ratio = Market Share Price / Earnings Per Share (EPS)",
    contributor: "kumar_lead"
  }
];

// Initial Leaderboard
export const INITIAL_LEADERBOARD_USERS = [
  {
    id: "user-1",
    name: "Narendra Mishra",
    username: "narendramishra",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    university: "University Student",
    major: "Software Engineering & Cloud Architecture",
    rank: 1,
    tier: "Master Fellow",
    tierColor: "from-amber-400 to-amber-600",
    xp: 2980,
    weeklyScore: 580,
    accuracy: 98,
    postsShared: 0,
    quizzesCompleted: 0,
    streakDays: 1,
    trophy: "🥇 Gold Podium",
    badges: ["👑 Co-Founder", "⚡ System Architect"]
  },
  {
    id: "user-2",
    name: "Avinendra Pratap Singh",
    username: "avinendra_singh",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    university: "University Student",
    major: "Finance & Accounting",
    rank: 2,
    tier: "Grandmaster",
    tierColor: "from-slate-400 to-slate-600",
    xp: 2840,
    weeklyScore: 540,
    accuracy: 96,
    postsShared: 0,
    quizzesCompleted: 0,
    streakDays: 1,
    trophy: "🥈 Silver Podium",
    badges: ["👑 Co-Founder", "📊 Model Architect"]
  },
  {
    id: "user-3",
    name: "Kumar",
    username: "kumar_lead",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    university: "University Student",
    major: "Computer Science & FinTech",
    rank: 3,
    tier: "Grandmaster",
    tierColor: "from-amber-600 to-amber-800",
    xp: 2490,
    weeklyScore: 480,
    accuracy: 94,
    postsShared: 0,
    quizzesCompleted: 0,
    streakDays: 1,
    trophy: "🥉 Bronze Podium",
    badges: ["⚡ Co-Founder", "🧠 Recall Engineer"]
  }
];
