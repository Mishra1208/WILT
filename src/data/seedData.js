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
    contributor: "quantum_scholar_8912"
  },
  {
    id: "concept-2",
    term: "Repo Rate",
    category: "Banking",
    definition: "The interest rate at which commercial banks borrow money from the Central Bank by pledging government securities.",
    plainExplanation: "The Central Bank's interest rate. When Repo Rate rises, loan interest rates rise across all banks, cooling inflation.",
    formula: "High Repo Rate -> Expensive Bank Borrowing -> Tight Liquidity",
    contributor: "apex_builder_1623"
  },
  {
    id: "concept-3",
    term: "BFS (Breadth-First Search)",
    category: "Technology",
    definition: "A tree and graph traversal algorithm that explores all neighbor nodes at the present depth level before moving to nodes at the next depth level.",
    plainExplanation: "Explores nodes level-by-level (like water ripples) using a Queue. Always finds the shortest path in unweighted graphs.",
    formula: "Queue (FIFO) -> Level-by-Level Exploration",
    contributor: "cipher_mind_3051"
  },
  {
    id: "concept-4",
    term: "CapEx (Capital Expenditures)",
    category: "Accounting",
    definition: "Funds used by a company to acquire, upgrade, and maintain physical assets such as property, plants, buildings, or technology.",
    plainExplanation: "Money spent on long-term assets that will generate value for years, recorded on the Balance Sheet rather than as an immediate expense.",
    formula: "CapEx = Net Increase in Property, Plant & Equipment + Current Depreciation",
    contributor: "nexus_thinker_9410"
  },
  {
    id: "concept-5",
    term: "Cash Reserve Ratio (CRR)",
    category: "Banking",
    definition: "The minimum percentage of total customer deposits commercial banks must reserve in pure cash with the Central Bank.",
    plainExplanation: "Emergency safety cash banks must deposit at the RBI/Central Bank with 0% interest to keep the financial system stable.",
    formula: "CRR Cash = Total Deposits (NDTL) × CRR %",
    contributor: "cosmic_fellow_7431"
  },
  {
    id: "concept-6",
    term: "Net Interest Margin (NIM)",
    category: "Banking",
    definition: "A profitability metric measuring the difference between interest income earned by a bank on loans and interest paid out to depositors.",
    plainExplanation: "The bank's profit margin on lending. High NIM means the bank earns significantly more interest on loans than it pays on savings accounts.",
    formula: "NIM % = (Interest Earned - Interest Expensed) / Average Earning Assets",
    contributor: "quantum_scholar_8912"
  },
  {
    id: "concept-7",
    term: "P/E Ratio (Price-to-Earnings)",
    category: "Investment",
    definition: "A valuation ratio comparing a company's current stock market share price to its per-share earnings (EPS).",
    plainExplanation: "How many dollars investors are willing to pay for every $1 of annual profit the company generates.",
    formula: "P/E Ratio = Market Share Price / Earnings Per Share (EPS)",
    contributor: "cipher_mind_3051"
  }
];

// Completely Live Real Audience Leaderboard (0 mock/hardcoded entries)
export const INITIAL_LEADERBOARD_USERS = [];
