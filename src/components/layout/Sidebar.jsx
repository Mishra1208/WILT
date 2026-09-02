import React from 'react';
import {
  Compass,
  BookOpen,
  HelpCircle,
  Brain,
  Bookmark,
  Bell,
  Settings,
  PlusCircle,
  Trophy,
  PenTool,
  Info,
  PanelLeftClose
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { currentView, setCurrentView, setIsNewPostModalOpen, isSidebarOpen, toggleSidebar } = useApp();
  const { user, isLoggedIn, setIsAuthModalOpen } = useAuth();

  const mainNav = [
    { id: 'notepad', label: 'Notepad Slate', icon: PenTool, badge: 'Landing' },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'dictionary', label: 'Dictionary', icon: BookOpen },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, badge: 'Weekly' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'revision', label: 'Revision', icon: Brain },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  const accountNav = [
    { id: 'about', label: 'About WILT', icon: Info },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isSidebarOpen) {
    return null;
  }

  const handleNavClick = (id) => {
    setCurrentView(id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Dark Mobile Backdrop (Only rendered on mobile screens < md) */}
      <div
        onClick={toggleSidebar}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 md:hidden animate-fadeIn"
      />

      <aside className="fixed inset-y-0 left-0 md:sticky md:top-0 w-72 md:w-64 h-screen max-h-screen flex-shrink-0 flex flex-col justify-between border-r border-slate-200/80 bg-white select-none transition-all duration-300 animate-fadeIn z-50 md:z-30 overflow-hidden shadow-2xl md:shadow-none">
        <div className="p-5 flex-1 flex flex-col gap-5 overflow-y-auto min-h-0">
        {/* Brand Header with Close Button */}
        <div className="flex items-center justify-between px-1 pt-1">
          <button
            onClick={() => setCurrentView('notepad')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-primary-600 text-white font-extrabold text-base flex items-center justify-center shadow-btn group-hover:scale-105 transition-transform">
              W
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-tight">
                WILT
              </span>
              <span className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider block">
                What I Learned Today
              </span>
            </div>
          </button>

          {/* Close Sidebar Button */}
          <button
            onClick={toggleSidebar}
            title="Close sidebar (⌘B)"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Main Navigation List */}
        <nav className="flex flex-col gap-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-primary-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-coral-50 text-coral-600 border border-coral-100">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>



        {/* ACCOUNT Section */}
        <div className="flex flex-col gap-1 pt-2 border-t border-slate-100/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
            Account
          </div>
          {accountNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-primary-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Footer Card */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        {isLoggedIn ? (
          <div
            onClick={() => handleNavClick('settings')}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2.5 truncate">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user.name}
                </div>
                <div className="text-[11px] text-primary-600 font-mono">
                  {user.xp} XP • {user.tier}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsAuthModalOpen(true);
              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                toggleSidebar();
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-btn"
          >
            Student Sign In
          </button>
        )}
      </div>
    </aside>
    </>
  );
};
