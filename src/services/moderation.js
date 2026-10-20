/**
 * Content Moderation & Abuse Detection Service
 *
 * Client-side first line of defence for posts, comments and dictionary entries.
 * Catches common evasion tricks that the previous word-list check missed:
 *   - leetspeak / symbols      (sh1t, @ss, f*ck, $hit)
 *   - stretched letters         (fuuuuck, shiiit)
 *   - spaced / dotted letters   (f u c k, f.u.c.k)
 *   - words glued together      (fuckoff, bullshitting, motherfuckers)
 *   - common Hinglish abuse     (frequent on Indian campuses)
 *
 * NOTE: anything that runs in the browser can be bypassed by a determined user.
 * For full protection, the same check should also run server-side
 * (e.g. a Supabase database trigger or Edge Function) before a row is stored.
 */

// Roots that are abusive even inside a longer word ("fuckoff", "bullshitting").
// Chosen so they don't appear inside ordinary English words.
const STRONG_ROOTS = [
  'fuck', 'fck', 'phuck', 'motherf', 'nigger', 'nigga', 'faggot',
  'bitch', 'biatch', 'asshole', 'arsehole', 'bullshit', 'dipshit', 'shithead', 'dumbass',
  'jackass', 'whore', 'slut', 'wanker', 'douchebag', 'scumbag',
  // Hinglish
  'madarchod', 'maderchod', 'behenchod', 'bhenchod', 'benchod', 'chutiya', 'chutiye', 'chootiya',
  'bhosdi', 'bhosad', 'gandu', 'lavda', 'bsdk', 'harami', 'kamina'
];

// Words that are only abusive as a whole word (to avoid false positives like
// "Dickens", "peacock", "assess", "Scunthorpe", "brandish", "laudable", "fire retardant").
const WHOLE_WORDS = [
  'shit', 'shitty', 'shits', 'dick', 'dicks', 'pussy', 'cock', 'cocks', 'ass', 'asses', 'arse', 'piss', 'pissed',
  'bastard', 'bastards', 'idiot', 'idiots', 'moron', 'morons', 'crap', 'douche', 'fag', 'fags', 'fuk', 'fuking',
  'cunt', 'cunts', 'twat', 'retard', 'retards', 'retarded', 'stfu', 'kys', 'gtfo', 'wtf',
  'lund', 'lauda', 'loda', 'randi', 'kutta', 'kutti', 'kutte', 'saala', 'saali', 'tatti'
];

// Abusive or threatening phrases (checked on the normalized, space-separated text)
const PHRASES = [
  'kill yourself', 'kill urself', 'go die', 'hope you die', 'i will kill you', 'ill kill you',
  'hate you', 'shut up bitch', 'son of a bitch', 'piece of shit', 'go to hell', 'teri maa', 'teri ma ki'
];

const LEET_MAP = { '0': 'o', '1': 'i', '!': 'i', '|': 'i', '3': 'e', '4': 'a', '@': 'a', '5': 's', '$': 's', '7': 't', '+': 't', '8': 'b', '9': 'g' };

const deLeet = (s) => s.replace(/[0134578@$!|+9]/g, (c) => LEET_MAP[c] || c);
// Collapse every repeated letter: used only for long "strong" roots (fuuck -> fuck, asssshole -> ashole)
const squeeze = (s) => s.replace(/(.)\1+/g, '$1');
// Variants of a token with stretched letters (3+ repeats) shortened: fuuuuck -> fuck / fuuck, asss -> as / ass
const stretchVariants = (t) => [t, t.replace(/(.)\1{2,}/g, '$1'), t.replace(/(.)\1{2,}/g, '$1$1')];

const WHOLE_SET = new Set(WHOLE_WORDS);
const STRONG_SQUEEZED = STRONG_ROOTS.map(squeeze);

// Masked spellings like f*ck, sh*t, f**k, b!tch
const MASK_PATTERNS = [
  /\bf[\W_]*[u*@#][\W_]*c[\W_]*k/i,
  /\bf[*#@]{1,3}k/i,
  /\bsh[*#@!1]t\b/i,
  /\bb[*#@!1]tch/i,
  /\bc[*#@]nt\b/i
];

const findIn = (raw) => {
  const lower = String(raw || '').toLowerCase();
  if (!lower.trim()) return null;

  for (const re of MASK_PATTERNS) {
    const m = lower.match(re);
    if (m) return m[0];
  }

  const leet = deLeet(lower);
  const tokens = leet.split(/[^a-z]+/).filter(Boolean);
  const spaced = ` ${tokens.join(' ')} `;

  // Phrases
  for (const phrase of PHRASES) {
    if (spaced.includes(` ${phrase} `)) return phrase;
  }

  // Whole words (raw and with stretched letters squeezed)
  for (const t of tokens) {
    if (stretchVariants(t).some((v) => WHOLE_SET.has(v))) return t;
  }

  // Strong roots anywhere inside a word
  for (const t of tokens) {
    const sq = squeeze(t);
    for (let i = 0; i < STRONG_ROOTS.length; i++) {
      if (t.includes(STRONG_ROOTS[i]) || sq.includes(STRONG_SQUEEZED[i])) return t;
    }
  }

  // Spaced-out / dotted letters: "f u c k", "f.u.c.k", "s-h-i-t"
  const singleLetterRuns = leet.match(/\b(?:[a-z][\s.\-_*]+){2,}[a-z]\b/g) || [];
  for (const run of singleLetterRuns) {
    const joined = run.replace(/[^a-z]/g, '');
    if (WHOLE_SET.has(joined) || STRONG_ROOTS.some((r) => joined.includes(r))) return run.trim();
  }

  return null;
};

/**
 * Checks whether any provided text contains abusive or inappropriate language.
 * @param {...string} textFields - Any number of text strings to validate
 * @returns {{ isClean: boolean, abusiveWord: string | null, isAbusive: boolean, reason: string | null }}
 */
export function validateContent(...textFields) {
  for (const field of textFields.flat()) {
    const hit = findIn(field);
    if (hit) {
      return {
        isClean: false,
        isAbusive: true,
        abusiveWord: hit,
        reason: `Inappropriate or abusive language detected ("${hit}"). WILT is an academic community — please revise your text before posting.`
      };
    }
  }
  return { isClean: true, isAbusive: false, abusiveWord: null, reason: null };
}
