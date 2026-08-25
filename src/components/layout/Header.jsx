import React from 'react';
import { Search, Bell, Sparkles, PanelLeftOpen, PanelLeftClose, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { searchQuery, setSearchQuery, setCurrentView, isSidebarOpen, toggleSidebar } = useApp();
  const { user, isLoggedIn, setIsAuthModalOpen } = useAuth();

  return (
    <header className="h-16 px-6 sm:px-8 border-b border-slate-200/80 bg-white sticky top-0 z-20 flex items-center justify-between gap-4 sm:gap-6">
      {/* Left Area: Smart Hamburger / Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          title={isSidebarOpen ? "Collapse sidebar (⌘B)" : "Expand sidebar (⌘B)"}
          className="p-2 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-700 border border-slate-200/80 transition-all flex items-center gap-2 group shadow-2xs"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 text-slate-500 group-hover:text-primary-600 transition-colors" />
          ) : (
            <>
              <PanelLeftOpen className="w-4 h-4 text-primary-600 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-1.5 pr-1">
                <div className="w-5 h-5 rounded-md bg-primary-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                  W
                </div>
                <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                  Menu
                </span>
              </div>
            </>
          )}
        </button>

        {/* Top Search Input */}
        <div className="w-64 sm:w-80 md:w-96 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, posts, topics..."
              className="w-full pl-10 pr-10 py-2 text-xs rounded-xl bg-slate-100/70 border border-transparent focus:border-primary-500 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
            />
            <kbd className="hidden sm:inline-flex items-center absolute right-3 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white rounded border border-slate-200">
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

        {/* Profile / Sign In */}
        {isLoggedIn ? (
          <div
            onClick={() => setCurrentView('settings')}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
              {user.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-btn transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
