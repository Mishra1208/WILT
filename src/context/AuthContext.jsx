import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser, saveStoredUser, updateLeaderboardUser, getStoredLeaderboard } from '../services/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      saveStoredUser(user);
    }
  }, [user]);

  const login = ({ username, name, university, major, avatar }) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: name || "Student Scholar",
      username: username.replace(/^@/, '').toLowerCase().trim(),
      avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      university: university || "University Student",
      major: major || "Finance & Tech",
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
    updateLeaderboardUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wilt_current_user_v1');
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
    updateLeaderboardUser(updatedUser);
  };

  const switchAccount = (demoUser) => {
    setUser(demoUser);
    saveStoredUser(demoUser);
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        addXP,
        switchAccount,
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
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
