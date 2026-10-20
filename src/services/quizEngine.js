import { KNOWLEDGE_QUEST_ARTICLES } from '../data/knowledgeQuestData';

const isValidQuizPost = (p) => {
  if (!p || !p.title || typeof p.title !== 'string') return false;

  const cleanTitle = p.title.trim();
  // Require titles to be substantial (at least 12 characters)
  if (cleanTitle.length < 12) return false;

  // Reject titles with repetitive pattern (e.g., "AAAAA...", "SDSDSDSD...")
  const cleanNoSpaces = cleanTitle.replace(/[\s\-_]+/g, '').toLowerCase();
  if (/^(.)\1+$/i.test(cleanNoSpaces)) return false;

  // Reject obvious junk or placeholder titles
  const junkPatterns = [
    /^(diy|test|okok|sdsd|asdf|qwerty|abc|idk|new|demo|temp|sample|foo|bar)+$/i,
    /no\s*context/i,
    /try\s*now/i,
    /new\s*test/i,
    /hello\s*world/i,
    /test\s*post/i
  ];
  if (junkPatterns.some(pat => pat.test(cleanTitle) || pat.test(cleanNoSpaces))) {
    return false;
  }

  // Must contain substantial educational content: either structured takeaways, a detailed summary, or long body content
  const hasTakeaways = Array.isArray(p.keyTakeaways) && p.keyTakeaways.some(t => t && typeof t === 'string' && t.trim().length >= 15);
  const hasGoodSummary = p.summary && typeof p.summary === 'string' && p.summary.trim().length >= 30;
  const hasGoodContent = p.content && typeof p.content === 'string' && p.content.trim().length >= 60;

  return hasTakeaways || hasGoodSummary || hasGoodContent;
};

// Unbiased Fisher–Yates shuffle (Array.sort with a random comparator is biased)
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const norm = (t) => String(t || '').trim().toLowerCase();

/**
 * Build a 4-option question: correct answer + 3 distractors drawn from a pool of
 * real, same-domain answers (other articles / other posts), then shuffled so the
 * correct answer can land in any position.
 */
const buildOptions = (correct, candidatePools) => {
  const seen = new Set([norm(correct)]);
  const distractors = [];
  for (const pool of candidatePools) {
    for (const cand of shuffle(pool || [])) {
      if (distractors.length >= 3) break;
      const key = norm(cand);
      if (!cand || seen.has(key) || key.length < 8) continue;
      seen.add(key);
      distractors.push(cand.trim());
    }
    if (distractors.length >= 3) break;
  }
  if (distractors.length < 3) return null; // not enough material for a fair question
  const options = shuffle([correct.trim(), ...distractors]);
  return { options, correctIndex: options.indexOf(correct.trim()) };
};

const summaryOf = (article) => (typeof article?.summary === 'object' ? article.summary : {});

export const generateWeeklyQuiz = (posts = [], count = 5) => {
  const articles = (KNOWLEDGE_QUEST_ARTICLES || []).filter((a) => a && a.title && typeof a.summary === 'object');

  // 1. News questions — several question styles so options don't feel repetitive
  const newsQuestions = articles.map((article) => {
    const sum = summaryOf(article);
    const sameCategory = articles.filter((a) => a.id !== article.id && a.category === article.category);
    const otherCategory = articles.filter((a) => a.id !== article.id && a.category !== article.category);

    const styles = shuffle(['why', 'headline', 'metric']);
    for (const style of styles) {
      let question;
      let correct;
      let pools;
      if (style === 'why' && sum.whyItMatters) {
        question = `"${article.title}" — why does this development matter?`;
        correct = sum.whyItMatters;
        pools = [sameCategory.map((a) => summaryOf(a).whyItMatters), otherCategory.map((a) => summaryOf(a).whyItMatters)];
      } else if (style === 'headline' && sum.whatHappened) {
        question = `Which headline matches this news summary?\n"${sum.whatHappened}"`;
        correct = article.title;
        pools = [sameCategory.map((a) => a.title), otherCategory.map((a) => a.title)];
      } else if (style === 'metric' && sum.keyMetric) {
        question = `Which key figure was reported in "${article.title}"?`;
        correct = sum.keyMetric;
        pools = [sameCategory.map((a) => summaryOf(a).keyMetric), otherCategory.map((a) => summaryOf(a).keyMetric)];
      } else {
        continue;
      }
      const built = buildOptions(correct, pools);
      if (!built) continue;
      return {
        isNews: true,
        newsId: article.id,
        postTitle: article.title,
        toiUrl: article.toiUrl || 'https://timesofindia.indiatimes.com/business',
        category: article.categoryLabel || 'Times of India Business',
        question,
        options: built.options,
        correctIndex: built.correctIndex,
        correctAnswerText: correct,
        explanation: `${sum.whatHappened || article.title}\nWhy It Matters: ${sum.whyItMatters || ''}`,
        sourceSnippet: `${sum.whatHappened || article.title}${sum.keyMetric ? ` (${sum.keyMetric})` : ''}`
      };
    }
    return null;
  }).filter(Boolean);

  // 2. Static high-quality peer seed question pool (options are shuffled below)
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

  const peerSeedQuestions = questionPool.map((q) => {
    const correct = q.options[q.correctIndex];
    const options = shuffle(q.options);
    return { ...q, options, correctIndex: options.indexOf(correct), correctAnswerText: correct };
  });

  // 3. Custom peer post questions — distractors come from OTHER real posts
  const validCustomPosts = (posts || []).filter((p) => isValidQuizPost(p) && !questionPool.some((q) => q.postId === p.id));
  const takeawayOf = (p) =>
    (Array.isArray(p.keyTakeaways) && p.keyTakeaways.find((t) => t && t.trim().length >= 15 && norm(t) !== norm(p.title))) ||
    (p.summary && p.summary.trim().length >= 30 && norm(p.summary) !== norm(p.title) ? p.summary.trim() : null) ||
    (p.content && p.content.trim().length >= 60 ? p.content.trim().split(/(?<=[.!?])\s+/)[0].slice(0, 180) : null);

  const peerAnswerPool = [
    ...validCustomPosts.map(takeawayOf),
    ...questionPool.map((q) => q.options[q.correctIndex])
  ].filter(Boolean);

  const customPostQuestions = validCustomPosts.map((p) => {
    const takeaway = takeawayOf(p);
    if (!takeaway) return null;
    const sameCategoryAnswers = validCustomPosts
      .filter((o) => o.id !== p.id && o.category === p.category)
      .map(takeawayOf);
    const built = buildOptions(takeaway, [sameCategoryAnswers, peerAnswerPool]);
    if (!built) return null;
    return {
      postId: p.id,
      postTitle: p.title,
      category: p.category || 'General',
      question: `In the peer post "${p.title}", which statement is the key takeaway?`,
      options: built.options,
      correctIndex: built.correctIndex,
      correctAnswerText: takeaway,
      explanation: `In "${p.title}", the key takeaway is: ${takeaway}`,
      sourceSnippet: p.summary || takeaway
    };
  }).filter(Boolean);

  // 4. Balanced mix: roughly half news, half peer learning
  const peerAll = shuffle([...customPostQuestions, ...peerSeedQuestions]);
  const newsAll = shuffle(newsQuestions);
  const newsTarget = Math.min(newsAll.length, Math.ceil(count / 2));
  const picked = [...newsAll.slice(0, newsTarget), ...peerAll.slice(0, count - newsTarget)];
  // Top up from whichever source still has questions
  const leftovers = shuffle([...newsAll.slice(newsTarget), ...peerAll.slice(count - newsTarget)]);
  while (picked.length < count && leftovers.length) picked.push(leftovers.shift());

  return shuffle(picked);
};
