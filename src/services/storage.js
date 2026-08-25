import { INITIAL_POSTS, INITIAL_CONCEPTS, INITIAL_LEADERBOARD_USERS, CURRENT_DEMO_USER } from '../data/seedData';

const STORAGE_KEYS = {
  POSTS: 'wilt_posts_v3',
  CONCEPTS: 'wilt_concepts_v3',
  LEADERBOARD: 'wilt_leaderboard_v3',
  USER: 'wilt_current_user_v3',
  THEME: 'wilt_theme_v3',
  SAVED_POSTS: 'wilt_saved_posts_v3',
  QUIZ_HISTORY: 'wilt_quiz_history_v3',
};

// Initialize Storage with clean real user data
export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONCEPTS)) {
    localStorage.setItem(STORAGE_KEYS.CONCEPTS, JSON.stringify(INITIAL_CONCEPTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD)) {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(INITIAL_LEADERBOARD_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(CURRENT_DEMO_USER));
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
  const newPosts = [post, ...posts];
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts));
  return newPosts;
};

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
    return raw ? JSON.parse(raw) : CURRENT_DEMO_USER;
  } catch (e) {
    return CURRENT_DEMO_USER;
  }
};

export const saveStoredUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
};

export const saveUser = saveStoredUser;
