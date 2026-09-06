import { INITIAL_POSTS, INITIAL_CONCEPTS, INITIAL_LEADERBOARD_USERS } from '../data/seedData';

const STORAGE_KEYS = {
  POSTS: 'wilt_posts_v8',
  CONCEPTS: 'wilt_concepts_v8',
  LEADERBOARD: 'wilt_leaderboard_v8',
  USER: 'wilt_current_user_v8',
  SAVED_POSTS: 'wilt_saved_posts_v8',
  QUIZ_HISTORY: 'wilt_quiz_history_v8',
};

// Initialize Storage with clean real user data
export const initStorage = () => {
  // Clear any old post storage keys (v1 through v7)
  try {
    ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7'].forEach(v => {
      localStorage.removeItem(`wilt_posts_${v}`);
      localStorage.removeItem(`wilt_saved_posts_${v}`);
      localStorage.removeItem(`wilt_concepts_${v}`);
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

export const updatePostInStorage = savePost;

export const getStoredConcepts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONCEPTS);
    return raw ? JSON.parse(raw) : INITIAL_CONCEPTS;
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
    return raw ? JSON.parse(raw) : INITIAL_LEADERBOARD_USERS;
  } catch (e) {
    return INITIAL_LEADERBOARD_USERS;
  }
};

export const saveLeaderboard = (leaderboard) => {
  localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
  return leaderboard;
};

export const updateLeaderboardUser = (updatedUser) => {
  const list = getStoredLeaderboard();
  const index = list.findIndex((u) => u.id === updatedUser.id || u.username === updatedUser.username);
  let updatedList;
  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = { ...updatedList[index], ...updatedUser };
  } else {
    updatedList = [...list, updatedUser];
  }
  // Sort descending by XP
  updatedList.sort((a, b) => (b.xp || 0) - (a.xp || 0));
  // Reassign ranks and podiums
  updatedList = updatedList.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    trophy: idx === 0 ? "🥇 Gold Podium" : idx === 1 ? "🥈 Silver Podium" : idx === 2 ? "🥉 Bronze Podium" : null
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
    const key = 'wilt_guest_identity_v3';
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);

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
      rank: 25,
      tier: 'Curious Scholar',
      xp: 100,
      isGuest: true
    };

    localStorage.setItem(key, JSON.stringify(guestUser));
    return guestUser;
  } catch (e) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return {
      id: `guest-${Date.now()}`,
      name: `@scholar_${randomNum}`,
      username: `scholar_${randomNum}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      university: 'Anonymous Campus',
      major: 'Guest Scholar',
      xp: 100,
      isGuest: true
    };
  }
};
