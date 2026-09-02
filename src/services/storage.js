import { INITIAL_POSTS, INITIAL_CONCEPTS, INITIAL_LEADERBOARD_USERS } from '../data/seedData';

const STORAGE_KEYS = {
  POSTS: 'wilt_posts_v4',
  CONCEPTS: 'wilt_concepts_v4',
  LEADERBOARD: 'wilt_leaderboard_v4',
  USER: 'wilt_current_user_v5', // upgraded to v5 for clean logged-out state
  SAVED_POSTS: 'wilt_saved_posts_v4',
  QUIZ_HISTORY: 'wilt_quiz_history_v4',
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
  // User starts as null (Logged Out) so they can sign in with Clerk
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
