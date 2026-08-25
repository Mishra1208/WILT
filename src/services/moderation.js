/**
 * Content Moderation & Abuse Detection Service
 * Checks text against abusive words, profanities, slurs, and inappropriate language.
 */

// Common profanities, slurs, and abusive terms in lowercase
const ABUSIVE_WORDS = [
  'fuck', 'fucking', 'fucker', 'fucked', 'shit', 'shitty', 'bitch', 'bitches',
  'asshole', 'bastard', 'cunt', 'dick', 'pussy', 'cock', 'slut', 'whore',
  'nigger', 'nigga', 'faggot', 'retard', 'retarded', 'idiot', 'moron',
  'dumbass', 'kill yourself', 'kys', 'stfu', 'bullshit', 'motherfucker',
  'crap', 'piss', 'douche', 'dipshit', 'jackass', 'scumbag', 'hate you'
];

/**
 * Checks whether any provided text contains abusive or inappropriate language.
 * @param {...string} textFields - Any number of text strings to validate
 * @returns {{ isClean: boolean, abusiveWord: string | null }}
 */
export function validateContent(...textFields) {
  const combinedText = textFields
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' '); // remove punctuation

  const words = combinedText.split(/\s+/);

  for (const word of words) {
    if (ABUSIVE_WORDS.includes(word)) {
      return {
        isClean: false,
        abusiveWord: word
      };
    }
  }

  // Also check multi-word abusive phrases
  for (const phrase of ['kill yourself', 'mother fucker', 'stfu']) {
    if (combinedText.includes(phrase)) {
      return {
        isClean: false,
        abusiveWord: phrase
      };
    }
  }

  return {
    isClean: true,
    abusiveWord: null
  };
}
