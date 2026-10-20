import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import {
  getStoredUser,
  saveStoredUser,
  updateLeaderboardUser,
  getOrCreateGuestUser,
  getUsernameForAccount,
  getCachedAccountProfile,
  cacheAccountProfile,
  getTierForXP
} from '../services/storage';
import {
  saveUserProfileToSupabase,
  fetchUserProfileFromSupabase,
  fetchQuizStatsFromSupabase,
  isUsernameTakenInSupabase
} from '../services/supabase';

const AuthContext = createContext();

/**
 * Build the in-app user object for a signed-in Clerk account.
 * Identity (username, avatar) is derived from the Clerk account ID — never from the
 * device — so the same email shows the same username on every device, and different
 * emails on the same device get different usernames.
 */
const buildAccountUser = (clerkUser, saved) => {
  const accountId = clerkUser.id;
  const username = (saved?.username || getUsernameForAccount(accountId)).replace(/^@/, '').toLowerCase();
  const xp = Number(saved?.xp) || 0;
  const { tier, tierColor } = getTierForXP(xp);

  return {
    id: accountId,
    name: `@${username}`,
    username,
    avatar: saved?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    university: saved?.university || clerkUser.publicMetadata?.university || 'University Scholar',
    major: saved?.major || clerkUser.publicMetadata?.major || 'Finance & Tech',
    rank: Number(saved?.rank) || 1,
    tier,
    tierColor,
    xp,
    weeklyScore: Number(saved?.weeklyScore) || 0,
    accuracy: Number(saved?.accuracy) || 0,
    totalCorrect: Number(saved?.totalCorrect) || 0,
    totalAnswered: Number(saved?.totalAnswered) || 0,
    postsShared: Number(saved?.postsShared) || 0,
    quizzesCompleted: Number(saved?.quizzesCompleted ?? saved?.quizzes_completed) || 0,
    streakDays: Number(saved?.streakDays) || 1,
    savedPosts: saved?.savedPosts || [],
    likedPosts: saved?.likedPosts || [],
    isGuest: false
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = getStoredUser();
    // Only trust a stored signed-in user until Clerk confirms the session below
    return stored && !stored.isGuest ? stored : { ...getOrCreateGuestUser(), isGuest: true };
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const userRef = useRef(user);
  userRef.current = user;

  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut, openSignIn } = useClerk();

  const isRealLoggedIn = Boolean(isClerkLoaded && isSignedIn && clerkUser);
  const clerkUserId = clerkUser?.id;

  const commitUser = (next) => {
    setUser(next);
    saveStoredUser(next);
    if (!next.isGuest) cacheAccountProfile(next);
  };

  // Synchronize the signed-in account. Runs once per account (keyed on the Clerk ID),
  // not on every Clerk object refresh, so progress is never reset mid-session.
  useEffect(() => {
    if (!isClerkLoaded) return;

    if (!isSignedIn || !clerkUser) {
      const guest = { ...getOrCreateGuestUser(), isGuest: true };
      setUser(guest);
      saveStoredUser(guest);
      return;
    }

    let cancelled = false;
    const accountId = clerkUser.id;

    // 1. Show cached progress for THIS account immediately (works offline)
    const cached = getCachedAccountProfile(accountId);
    const initial = buildAccountUser(clerkUser, cached);
    commitUser(initial);
    setIsAuthModalOpen(false);

    // 2. Reconcile with the account's cloud profile
    (async () => {
      const { profile, error } = await fetchUserProfileFromSupabase(accountId);
      if (cancelled) return;

      let merged = initial;
      if (!profile && !error && !cached?.username) {
        // Brand-new account: make sure its pseudonym isn't already used by someone else
        for (let attempt = 0; attempt < 5; attempt++) {
          const candidate = getUsernameForAccount(accountId, attempt);
          // eslint-disable-next-line no-await-in-loop
          if (!(await isUsernameTakenInSupabase(candidate, accountId))) {
            merged = buildAccountUser(clerkUser, { username: candidate });
            break;
          }
        }
        if (cancelled) return;
      }
      if (profile) {
        // Cloud is the source of truth for identity; keep the higher XP in case
        // a quiz finished offline before the cloud save landed.
        merged = buildAccountUser(clerkUser, {
          ...cached,
          ...profile,
          xp: Math.max(Number(profile.xp) || 0, Number(cached?.xp) || 0)
        });
      }

      const stats = await fetchQuizStatsFromSupabase(merged.username);
      if (cancelled) return;
      if (stats && stats.totalAnswered > 0) {
        merged = {
          ...merged,
          totalCorrect: stats.totalCorrect,
          totalAnswered: stats.totalAnswered,
          accuracy: Math.round((stats.totalCorrect / stats.totalAnswered) * 100),
          quizzesCompleted: Math.max(merged.quizzesCompleted, stats.attempts)
        };
      }

      // Don't overwrite progress earned while this sync was in flight
      const live = userRef.current;
      if (live && live.id === accountId && (live.xp || 0) > merged.xp) {
        merged = { ...merged, xp: live.xp, ...getTierForXP(live.xp), totalCorrect: live.totalCorrect, totalAnswered: live.totalAnswered, accuracy: live.accuracy, quizzesCompleted: live.quizzesCompleted };
      }

      commitUser(merged);
      if (merged.xp > 0) updateLeaderboardUser(merged);

      // First sign-in for this account (or profile changed): persist it
      if (!error) saveUserProfileToSupabase(merged);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClerkLoaded, isSignedIn, clerkUserId]);

  const openAuth = () => {
    setIsAuthModalOpen(true);
  };

  const triggerClerkSignIn = () => {
    try {
      if (openSignIn) {
        openSignIn();
      }
    } catch (e) {}
    setIsAuthModalOpen(false);
  };

  const requireAuth = (onSuccess) => {
    if (isRealLoggedIn) {
      if (onSuccess) onSuccess();
      return true;
    }
    setIsAuthModalOpen(true);
    return false;
  };

  const logout = async () => {
    try {
      if (clerkSignOut) {
        await clerkSignOut();
      }
    } catch (e) {}
    const guest = { ...getOrCreateGuestUser(), isGuest: true };
    setUser(guest);
    saveStoredUser(guest);
  };

  /**
   * Award XP. For quizzes pass { correct, total } so lifetime accuracy is
   * updated from real answers (correct / answered), not a fixed number.
   */
  const addXP = (amount, quizResult = null) => {
    const currentUser = userRef.current || getOrCreateGuestUser();
    const safeAmount = Math.max(0, Number(amount) || 0);
    const newXP = (currentUser.xp || 0) + safeAmount;

    let { totalCorrect = 0, totalAnswered = 0, accuracy = 0, quizzesCompleted = 0 } = currentUser;
    if (quizResult && quizResult.total > 0) {
      totalCorrect = (Number(totalCorrect) || 0) + quizResult.correct;
      totalAnswered = (Number(totalAnswered) || 0) + quizResult.total;
      accuracy = Math.round((totalCorrect / totalAnswered) * 100);
      quizzesCompleted = (Number(quizzesCompleted) || 0) + 1;
    }

    const updatedUser = {
      ...currentUser,
      xp: newXP,
      weeklyScore: (currentUser.weeklyScore || 0) + safeAmount,
      totalCorrect,
      totalAnswered,
      accuracy,
      quizzesCompleted,
      ...getTierForXP(newXP)
    };

    const updatedLeaderboard = updateLeaderboardUser(updatedUser);
    const userInList = updatedLeaderboard.find((u) => u.id === updatedUser.id || u.username === updatedUser.username);
    if (userInList) {
      updatedUser.rank = userInList.rank;
    }

    commitUser(updatedUser);
    saveUserProfileToSupabase(updatedUser);
    return updatedUser;
  };

  const toggleUserLikePost = (postId) => {
    if (!user || !postId) return;
    const isLiked = (user.likedPosts || []).includes(postId);
    const updatedLiked = isLiked
      ? (user.likedPosts || []).filter((id) => id !== postId)
      : [...(user.likedPosts || []), postId];

    const updatedUser = { ...user, likedPosts: updatedLiked };
    commitUser(updatedUser);
    if (updatedUser.isGuest) {
      try {
        localStorage.setItem('wilt_guest_identity_v16', JSON.stringify(updatedUser));
      } catch (e) {}
    }
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: isRealLoggedIn,
        logout,
        addXP,
        toggleUserLikePost,
        openAuth,
        triggerClerkSignIn,
        requireAuth,
        isAuthModalOpen,
        setIsAuthModalOpen,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
