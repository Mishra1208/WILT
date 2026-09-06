import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { getStoredUser, saveStoredUser, updateLeaderboardUser, getOrCreateGuestUser } from '../services/storage';
import { saveUserProfileToSupabase } from '../services/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser() || getOrCreateGuestUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Real Clerk User & Hooks
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut, openSignIn } = useClerk();

  // Synchronize Clerk user state when signed in
  useEffect(() => {
    if (isClerkLoaded) {
      if (isSignedIn && clerkUser) {
        const guestIdentity = getOrCreateGuestUser();
        const email = clerkUser.primaryEmailAddress?.emailAddress || '';
        const phone = clerkUser.primaryPhoneNumber?.phoneNumber || '';
        const cleanUsername = guestIdentity.username;

        const authenticatedUser = {
          id: clerkUser.id,
          name: `@${cleanUsername}`,
          username: cleanUsername,
          avatar: guestIdentity.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
          email: email,
          phone: phone,
          university: clerkUser.publicMetadata?.university || "University Scholar",
          major: clerkUser.publicMetadata?.major || "Finance & Tech",
          rank: 3,
          tier: "Curious Scholar",
          tierColor: "from-indigo-400 to-indigo-600",
          xp: 150,
          weeklyScore: 50,
          accuracy: 92,
          postsShared: 0,
          quizzesCompleted: 0,
          streakDays: 1,
          savedPosts: [],
          likedPosts: []
        };

        setUser(authenticatedUser);
        saveStoredUser(authenticatedUser);
        updateLeaderboardUser(authenticatedUser);
        saveUserProfileToSupabase(authenticatedUser);
        setIsAuthModalOpen(false);
      } else {
        const guest = getOrCreateGuestUser();
        setUser(guest);
      }
    }
  }, [isClerkLoaded, isSignedIn, clerkUser]);

  const openAuth = () => {
    try {
      if (openSignIn) {
        openSignIn();
        return;
      }
    } catch (e) {}
    setIsAuthModalOpen(true);
  };

  const login = ({ university, major, avatar, email, phone }) => {
    const guestIdentity = getOrCreateGuestUser();
    const cleanUsername = guestIdentity.username;

    const newUser = {
      id: `user-${Date.now()}`,
      name: `@${cleanUsername}`,
      username: cleanUsername,
      avatar: avatar || guestIdentity.avatar,
      university: university || "University Student",
      major: major || "Finance & Tech",
      email: email || '',
      phone: phone || '',
      rank: 12,
      tier: "Curious Scholar",
      tierColor: "from-indigo-400 to-indigo-600",
      xp: 150,
      weeklyScore: 50,
      accuracy: 90,
      postsShared: 0,
      quizzesCompleted: 0,
      streakDays: 1,
      savedPosts: [],
      likedPosts: []
    };
    setUser(newUser);
    saveStoredUser(newUser);
    updateLeaderboardUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      if (clerkSignOut) {
        await clerkSignOut();
      }
    } catch (e) {}
    const guest = getOrCreateGuestUser();
    setUser(guest);
    saveStoredUser(guest);
  };

  const addXP = (amount, isQuizPassed = false) => {
    const currentUser = user || getOrCreateGuestUser();
    const newXP = (currentUser.xp || 0) + amount;
    const newWeekly = (currentUser.weeklyScore || 0) + amount;
    const newQuizzes = (currentUser.quizzesCompleted || 0) + (isQuizPassed ? 1 : 0);
    
    // Recalculate tier based on XP
    let tier = currentUser.tier || "Novice";
    let tierColor = currentUser.tierColor || "from-slate-400 to-slate-600";
    if (newXP >= 2500) {
      tier = "Mastermind";
      tierColor = "from-amber-400 to-yellow-600";
    } else if (newXP >= 1800) {
      tier = "Grand Scholar";
      tierColor = "from-slate-300 to-slate-500";
    } else if (newXP >= 1200) {
      tier = "Fellow Analyst";
      tierColor = "from-amber-600 to-orange-700";
    } else if (newXP >= 600) {
      tier = "Curious Scholar";
      tierColor = "from-indigo-400 to-indigo-600";
    }

    const updatedUser = {
      ...currentUser,
      xp: newXP,
      weeklyScore: newWeekly,
      quizzesCompleted: newQuizzes,
      tier,
      tierColor
    };

    const updatedLeaderboard = updateLeaderboardUser(updatedUser);
    
    // Update user rank from sorted leaderboard
    const userInList = updatedLeaderboard.find(u => u.id === updatedUser.id || u.username === updatedUser.username);
    if (userInList) {
      updatedUser.rank = userInList.rank;
    }

    setUser(updatedUser);
    saveStoredUser(updatedUser);
    saveUserProfileToSupabase(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        addXP,
        openAuth,
        isAuthModalOpen,
        setIsAuthModalOpen: openAuth,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
