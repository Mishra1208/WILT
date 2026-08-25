import React from 'react';
import { Search, Bell, Sparkles, User, PanelLeftOpen } from 'lucide-react';
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { searchQuery, setSearchQuery, setCurrentView, isSidebarOpen, toggleSidebar } = useApp();
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input & Hamburger Toggle */}
      <div className="flex items-center gap-3 w-full max-w-md">
        {/* Smart Hamburger Toggle when Sidebar is Collapsed */}
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            title="Expand Sidebar (⌘B / Ctrl+B)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-primary-50 text-slate-700 hover:text-primary-700 border border-slate-200 hover:border-primary-200 transition-all text-xs font-bold shadow-2xs group flex-shrink-0 animate-fadeIn"
          >
            <PanelLeftOpen className="w-4 h-4 text-slate-500 group-hover:text-primary-600 transition-colors" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        )}

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search concepts, posts, topics... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all shadow-2xs"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Weekly Quiz CTA */}
        <button
          onClick={() => setCurrentView('quiz')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          <span>Weekly Quiz (+150 XP)</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setCurrentView('notifications')}
          aria-label="Notifications"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-coral-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        {/* Profile / Official Clerk Sign In */}
        <SignedIn>
          <div className="flex items-center gap-2">
            <div
              onClick={() => setCurrentView('settings')}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                alt={user?.name || "Scholar"}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                {user?.name ? user.name.split(' ')[0] : 'Scholar'}
              </span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-btn transition-all cursor-pointer">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
};
