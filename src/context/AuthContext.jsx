import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import confetti from 'canvas-confetti';
import { getStoredUser, saveStoredUser, updateLeaderboardUser } from '../services/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Real Clerk User & Hooks
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut, openSignIn } = useClerk();

  // Synchronize Clerk user state when signed in
  useEffect(() => {
    if (isClerkLoaded) {
      if (isSignedIn && clerkUser) {
        const email = clerkUser.primaryEmailAddress?.emailAddress || '';
        const phone = clerkUser.primaryPhoneNumber?.phoneNumber || '';
        const displayName = clerkUser.fullName || clerkUser.firstName || (email ? email.split('@')[0] : '') || phone || 'Student Scholar';
        const rawUsername = clerkUser.username || (email ? email.split('@')[0] : '') || `scholar_${clerkUser.id.slice(-4)}`;
        const cleanUsername = rawUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
        const avatar = clerkUser.imageUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;

        const authenticatedUser = {
          id: clerkUser.id,
          name: displayName,
          username: cleanUsername,
          avatar: avatar,
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
        setIsAuthModalOpen(false);

        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      } else {
        // When not signed in with Clerk, keep state clean
        setUser(null);
        saveStoredUser(null);
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

  const login = ({ username, name, university, major, avatar, email, phone }) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: name || "Student Scholar",
      username: username.replace(/^@/, '').toLowerCase().trim(),
      avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
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
    setUser(null);
    saveStoredUser(null);
  };

  const addXP = (amount, isQuizPassed = false) => {
    if (!user) return;
    const newXP = (user.xp || 0) + amount;
    const newWeekly = (user.weeklyScore || 0) + amount;
    const newQuizzes = (user.quizzesCompleted || 0) + (isQuizPassed ? 1 : 0);
    
    // Recalculate tier based on XP
    let tier = user.tier || "Novice";
    let tierColor = user.tierColor || "from-slate-400 to-slate-600";
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
      ...user,
      xp: newXP,
      weeklyScore: newWeekly,
      quizzesCompleted: newQuizzes,
      tier,
      tierColor
    };

    setUser(updatedUser);
    saveStoredUser(updatedUser);
    updateLeaderboardUser(updatedUser);
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
