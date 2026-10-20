import { INITIAL_POSTS, INITIAL_CONCEPTS, INITIAL_LEADERBOARD_USERS } from '../data/seedData';

const STORAGE_KEYS = {
  POSTS: 'wilt_posts_v16',
  CONCEPTS: 'wilt_concepts_v16',
  LEADERBOARD: 'wilt_leaderboard_v16',
  USER: 'wilt_current_user_v16',
  SAVED_POSTS: 'wilt_saved_posts_v16',
  QUIZ_HISTORY: 'wilt_quiz_history_v16',
};

// Initialize Storage with clean real user data
export const initStorage = () => {
  // Clear any old storage keys
  try {
    ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v11', 'v12', 'v13', 'v14', 'v15'].forEach(v => {
      localStorage.removeItem(`wilt_posts_${v}`);
      localStorage.removeItem(`wilt_saved_posts_${v}`);
      localStorage.removeItem(`wilt_concepts_${v}`);
      localStorage.removeItem(`wilt_leaderboard_${v}`);
      localStorage.removeItem(`wilt_current_user_${v}`);
      localStorage.removeItem(`wilt_guest_identity_${v}`);
    });
  } catch (e) {}

  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONCEPTS)) {
    localStorage.setItem(STORAGE_KEYS.CONCEPTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD)) {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(INITIAL_LEADERBOARD_USERS));
  }
};

export const getStoredPosts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    return raw ? JSON.parse(raw) : INITIAL_POSTS;
  } catch (e) {
    return INITIAL_POSTS;
  }
};

export const savePost = (post) => {
  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.id === post.id);
  let newPosts;
  if (index >= 0) {
    newPosts = [...posts];
    newPosts[index] = post;
  } else {
    newPosts = [post, ...posts];
  }
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts));
  return newPosts;
};

export const saveAllPostsToStorage = (postsList) => {
  try {
    if (postsList && Array.isArray(postsList)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(postsList));
    }
  } catch (e) {}
};

export const updatePostInStorage = savePost;

export const getStoredConcepts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONCEPTS);
    const parsed = raw ? JSON.parse(raw) : INITIAL_CONCEPTS;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_CONCEPTS;
  } catch (e) {
    return INITIAL_CONCEPTS;
  }
};

export const saveConcept = (concept) => {
  const concepts = getStoredConcepts();
  const newConcepts = [concept, ...concepts];
  localStorage.setItem(STORAGE_KEYS.CONCEPTS, JSON.stringify(newConcepts));
  return newConcepts;
};

export const getStoredLeaderboard = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    const parsed = raw ? JSON.parse(raw) : INITIAL_LEADERBOARD_USERS;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_LEADERBOARD_USERS;
  } catch (e) {
    return INITIAL_LEADERBOARD_USERS;
  }
};

export const saveLeaderboard = (leaderboard) => {
  localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
  return leaderboard;
};

export const updateLeaderboardUser = (updatedUser) => {
  if (!updatedUser) return getStoredLeaderboard();

  const list = getStoredLeaderboard();
  const cleanHandle = (updatedUser.username || updatedUser.name || 'anonymous').replace(/^@/, '').toLowerCase().trim();
  
  const index = list.findIndex((u) => u.id === updatedUser.id || (u.username && u.username.toLowerCase() === cleanHandle));

  const formattedUser = {
    id: updatedUser.id || `user-${Date.now()}`,
    name: `@${cleanHandle}`,
    username: cleanHandle,
    avatar: updatedUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanHandle}`,
    university: updatedUser.university || 'Anonymous Campus',
    major: updatedUser.major || 'Guest Scholar',
    xp: updatedUser.xp ?? 0,
    accuracy: updatedUser.accuracy ?? 0,
    tier: updatedUser.tier || 'Curious Scholar'
  };

  let updatedList;
  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = { ...updatedList[index], ...formattedUser };
  } else if ((formattedUser.xp || 0) > 0) {
    updatedList = [...list, formattedUser];
  } else {
    updatedList = [...list];
  }

  // Filter out any 0 XP entries so empty leaderboard stays 100% clean
  updatedList = updatedList.filter(u => (Number(u.xp) || 0) > 0);

  // Sort descending by XP
  updatedList.sort((a, b) => (b.xp || 0) - (a.xp || 0));

  // Reassign ranks and podiums
  updatedList = updatedList.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    trophy: idx === 0 ? "🥇 Gold Champion" : idx === 1 ? "🥈 Silver Rank" : idx === 2 ? "🥉 Bronze Rank" : null
  }));

  saveLeaderboard(updatedList);
  return updatedList;
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const saveStoredUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
  return user;
};

export const saveUser = saveStoredUser;

export const getOrCreateGuestUser = () => {
  try {
    const key = 'wilt_guest_identity_v16';
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.quizzesCompleted && (parsed.xp === 150 || !parsed.xp)) {
        parsed.xp = 0;
        parsed.accuracy = 0;
        localStorage.setItem(key, JSON.stringify(parsed));
      }
      return parsed;
    }

    const prefixes = ['quantum', 'stellar', 'curious', 'apex', 'matrix', 'cipher', 'nexus', 'orbit', 'vector', 'cosmic', 'zenith', 'hyper'];
    const roles = ['scholar', 'thinker', 'learner', 'mind', 'seeker', 'builder', 'fellow', 'explorer'];
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const username = `${prefix}_${role}_${randomNum}`;

    const guestUser = {
      id: `guest-${Date.now()}-${randomNum}`,
      name: `@${username}`,
      username: username,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      university: 'Anonymous Campus',
      major: 'Guest Scholar',
      rank: 1,
      tier: 'Curious Scholar',
      xp: 0,
      accuracy: 0,
      isGuest: true
    };

    localStorage.setItem(key, JSON.stringify(guestUser));
    return guestUser;
  } catch (e) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const fallbackGuest = {
      id: `guest-${Date.now()}`,
      name: `@scholar_${randomNum}`,
      username: `scholar_${randomNum}`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=scholar_${randomNum}`,
      university: 'Anonymous Campus',
      major: 'Guest Scholar',
      xp: 0,
      accuracy: 0,
      isGuest: true
    };
    return fallbackGuest;
  }
};

// ---------------------------------------------------------------------------
// Account identity helpers
// ---------------------------------------------------------------------------
const USERNAME_PREFIXES = ['quantum', 'stellar', 'curious', 'apex', 'matrix', 'cipher', 'nexus', 'orbit', 'vector', 'cosmic', 'zenith', 'hyper'];
const USERNAME_ROLES = ['scholar', 'thinker', 'learner', 'mind', 'seeker', 'builder', 'fellow', 'explorer'];

// FNV-1a 32-bit hash: small, fast, stable across browsers and devices.
const stableHash = (str) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
};

/**
 * Deterministic pseudonym for a signed-in account.
 * The same Clerk user ID always produces the same username on every device,
 * and two different accounts get two different usernames.
 */
export const getUsernameForAccount = (accountId, attempt = 0) => {
  const h = stableHash(`${accountId || 'anonymous'}${attempt ? `:${attempt}` : ''}`);
  const prefix = USERNAME_PREFIXES[h % USERNAME_PREFIXES.length];
  const role = USERNAME_ROLES[Math.floor(h / USERNAME_PREFIXES.length) % USERNAME_ROLES.length];
  const h2 = stableHash(`${h}:${accountId}`);
  const num = 10000 + (h2 % 90000);
  return `${prefix}_${role}_${num}`;
};

// Per-account profile cache (offline fallback), keyed by account ID so that
// switching accounts on one device never leaks one account's identity into another.
const accountCacheKey = (accountId) => `wilt_account_profile_v1_${accountId}`;

export const getCachedAccountProfile = (accountId) => {
  if (!accountId) return null;
  try {
    const raw = localStorage.getItem(accountCacheKey(accountId));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const cacheAccountProfile = (profile) => {
  if (!profile || !profile.id) return;
  try {
    // Never persist contact details in the shared profile cache
    const { email, phone, ...safe } = profile;
    localStorage.setItem(accountCacheKey(profile.id), JSON.stringify(safe));
  } catch (e) {}
};

export const getTierForXP = (xp = 0) => {
  if (xp >= 2500) return { tier: 'Mastermind', tierColor: 'from-amber-400 to-yellow-600' };
  if (xp >= 1800) return { tier: 'Grand Scholar', tierColor: 'from-slate-300 to-slate-500' };
  if (xp >= 1200) return { tier: 'Fellow Analyst', tierColor: 'from-amber-600 to-orange-700' };
  if (xp >= 600) return { tier: 'Curious Scholar', tierColor: 'from-primary-400 to-primary-600' };
  return { tier: 'Novice', tierColor: 'from-slate-400 to-slate-600' };
};
