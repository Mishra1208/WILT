import React from 'react';
import { Search, Bell, PanelLeftOpen } from 'lucide-react';
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { searchQuery, setSearchQuery, setCurrentView, isSidebarOpen, toggleSidebar } = useApp();
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white/95 backdrop-blur border-b border-line px-3.5 sm:px-8 flex items-center justify-between gap-3 sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-lg">
        <button
          onClick={toggleSidebar}
          title="Toggle Navigation Menu"
          aria-label="Open menu"
          className={`p-2 rounded-full border border-line text-ink hover:bg-paper transition-colors flex-shrink-0 cursor-pointer ${
            isSidebarOpen ? 'md:hidden' : 'flex'
          }`}
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search posts and terms"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 sm:pr-12 py-2.5 rounded-full bg-paper border border-transparent text-[15px] text-ink placeholder-muted focus:outline-none focus:bg-white focus:border-line focus:ring-4 focus:ring-primary-500/10 transition-colors"
          />
          <kbd className="hidden sm:block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[11px] font-medium text-muted bg-white border border-line rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => setCurrentView('quiz')}
          className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-ink hover:bg-haze transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-marker-orange" />
          Weekly quiz
        </button>

        <button
          onClick={() => setCurrentView('notifications')}
          aria-label="Notifications"
          className="p-2 rounded-md text-muted hover:text-ink hover:bg-haze transition-colors relative"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#8F3333] absolute top-2 right-2" />
        </button>

        <SignedIn>
          <button
            onClick={() => setCurrentView('leaderboard')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-semibold text-ink hover:bg-haze transition-colors cursor-pointer"
          >
            <span className="tabular-nums">{user?.xp || 0}</span>
            <span className="text-muted font-medium">XP</span>
          </button>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn-iris px-5 py-2.5 text-sm font-semibold cursor-pointer">
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
};
