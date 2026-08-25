// Automatic Quiz Generator & Question Bank Engine
// Generates contextual MCQs dynamically from weekly posts and community concepts.

export const generateWeeklyQuiz = (posts = [], count = 5) => {
  if (!posts || posts.length === 0) return [];

  // Question Templates and extracted generators
  const questionPool = [
    {
      postId: "post-1",
      postTitle: "How to calculate Fixed Assets in 10 seconds",
      category: "Accounting",
      question: "What is the correct formula to calculate Net Fixed Assets (PPE)?",
      options: [
        "Gross Fixed Assets - Accumulated Depreciation - Impairment",
        "Beginning PPE + Operating Expenses - Tax Deductions",
        "Total Assets - Current Liabilities + CapEx",
        "Gross Fixed Assets + Maintenance Expense - Salvage Value"
      ],
      correctIndex: 0,
      explanation: "Net Fixed Assets (PPE) equals Gross Historical PPE minus Accumulated Depreciation and any Impairment Losses. Operating expenses belong to the Income Statement.",
      sourceSnippet: "Net Fixed Assets = Gross Fixed Assets - Accumulated Depreciation - Impairment Losses"
    },
    {
      postId: "post-3",
      postTitle: "Repo Rate vs. Reverse Repo Rate: The Lemonade Stand Analogy",
      category: "Banking",
      question: "When the Central Bank raises the Repo Rate, what is the primary expected economic impact?",
      options: [
        "Commercial bank borrowing costs increase, credit tightens, and inflation cools down",
        "Commercial banks are paid higher interest for parking surplus cash",
        "Stock markets immediately experience unlimited liquidity injection",
        "Commercial banks are legally forced to hold zero cash reserves"
      ],
      correctIndex: 0,
      explanation: "Repo Rate is the interest rate charged when the Central Bank lends to commercial banks. Raising it makes loans costlier, cooling down excessive borrowing and inflation.",
      sourceSnippet: "Repo Rate: Central Bank lends to commercial banks at interest. High Repo Rate -> Loans get expensive -> Inflation cools down."
    },
    {
      postId: "post-2",
      postTitle: "Solving Tree & Graph Traversal (BFS vs DFS) without headaches",
      category: "Technology",
      question: "Which data structure and algorithm pattern is ideal for finding the shortest distance in an unweighted graph?",
      options: [
        "Breadth-First Search (BFS) using a Queue (FIFO)",
        "Depth-First Search (DFS) using a Stack (LIFO)",
        "Binary Search using a sorted Array",
        "Topological Sort using a Hash Map"
      ],
      correctIndex: 0,
      explanation: "BFS explores layer-by-layer (like ripples in water) using a FIFO Queue, ensuring you reach any node via the minimum number of steps.",
      sourceSnippet: "Rule of Gold: If the question asks for shortest distance or fewest steps, 95% of the time it is BFS using a Queue!"
    },
    {
      postId: "post-4",
      postTitle: "Cash Reserve Ratio (CRR) & SLR: The Bank's Emergency Cushion",
      category: "Banking",
      question: "What is a major difference between Cash Reserve Ratio (CRR) and Statutory Liquidity Ratio (SLR)?",
      options: [
        "CRR is held in pure cash at the Central Bank with 0% interest; SLR can be Gold/G-Secs held by the bank",
        "CRR earns high bond yields, while SLR is strictly kept in non-interest physical cash vaults",
        "CRR applies only to tech startups, while SLR applies to sovereign governments",
        "CRR must be 100% of all customer deposits at all times"
      ],
      correctIndex: 0,
      explanation: "CRR is maintained strictly with the Central Bank in pure cash and yields 0% interest. SLR is held by the bank itself in cash, gold, or approved government bonds and earns interest.",
      sourceSnippet: "CRR: Maintained with Central Bank in pure cash (0% interest). SLR: Maintained with bank itself in Gold & G-Secs (earns yield)."
    },
    {
      postId: "post-5",
      postTitle: "Why EBITDA is NOT Pure Cash Flow (and how to avoid the trap)",
      category: "Corporate Finance",
      question: "Why can a company have positive EBITDA while running out of actual cash?",
      options: [
        "EBITDA does not account for heavy CapEx, working capital tied up in receivables, or debt interest",
        "EBITDA excludes revenue generated from physical sales",
        "EBITDA only tracks tax refunds paid by the federal government",
        "EBITDA is calculated by subtracting cash flow from liabilities"
      ],
      correctIndex: 0,
      explanation: "EBITDA ignores essential cash outflows like capital expenditures (CapEx) to replace equipment, uncollected customer revenue (accounts receivable), and interest on debt.",
      sourceSnippet: "EBITDA leaves out Working Capital changes, CapEx maintenance, and real cash taxes/interest paid."
    },
    {
      postId: "post-6",
      postTitle: "How Beta (β) Measures Market Sensitivity in CAPM",
      category: "Investment",
      question: "If a tech stock has a Beta (β) of 1.5, what does this indicate when the benchmark index drops by 10%?",
      options: [
        "The stock is expected to drop by approximately 15% due to higher volatility",
        "The stock will automatically increase by 15% as a defensive hedge",
        "The stock's price is completely uncorrelated with market swings",
        "The risk-free rate will decline by 1.5 percentage points"
      ],
      correctIndex: 0,
      explanation: "Beta > 1 means higher systematic volatility than the market. A beta of 1.5 amplifies market movements in both directions (10% market drop * 1.5 = 15% stock drop).",
      sourceSnippet: "Beta > 1.0 (e.g. 1.5): If the market drops 10%, the stock drops 15%."
    }
  ];

  // If user has custom posts, dynamically generate extra questions
  const customPostQuestions = posts
    .filter(p => !questionPool.some(q => q.postId === p.id))
    .map(p => {
      const takeaway = p.keyTakeaways?.[0] || p.summary || p.title;
      return {
        postId: p.id,
        postTitle: p.title,
        category: p.category || "General",
        question: `According to @${p.author?.username || 'peer'}'s bite on "${p.title}", which of the following is a primary key takeaway?`,
        options: [
          takeaway,
          `Operating expenses should be capitalized into long-term intangibles`,
          `Central banks strictly ban liquidity ratios for educational institutions`,
          `This concept only applies when market variance drops below zero`
        ].sort(() => 0.5 - Math.random()),
        correctIndex: 0, // calculated dynamically below
        correctAnswerText: takeaway,
        explanation: `In the post "${p.title}", the author highlights: ${takeaway}`,
        sourceSnippet: p.summary || takeaway
      };
    });

  // Re-index correctIndex for shuffled custom options
  customPostQuestions.forEach(q => {
    if (q.correctAnswerText) {
      q.correctIndex = q.options.indexOf(q.correctAnswerText);
    }
  });

  const allQuestions = [...questionPool, ...customPostQuestions];

  // Shuffle and pick `count` questions
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
