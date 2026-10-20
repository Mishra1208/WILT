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
  Globe,
  AlertTriangle,
  PanelLeftClose
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getTierProgress } from '../widgets/XpRing';

export const Sidebar = () => {
  const { currentView, setCurrentView, setIsNewPostModalOpen, isSidebarOpen, toggleSidebar, openReportBugModal, leaderboard } = useApp();
  const { user, isLoggedIn, setIsAuthModalOpen, requireAuth, openAuth } = useAuth();

  const learningNav = [
    { id: 'knowledge-quest', label: 'Knowledge Quest', icon: Globe },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'dictionary', label: 'Dictionary', icon: BookOpen },
  ];

  const recallNav = [
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'revision', label: 'Revision', icon: Brain },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  const accountNav = [
    { id: 'about', label: 'About WILT', icon: Info },
    { id: 'report-bug', label: 'Report a Bug', icon: AlertTriangle, action: openReportBugModal },
    { id: 'notifications', label: 'Notifications', icon: Bell },
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

  const myRank = isLoggedIn
    ? (leaderboard || []).find((u) => u.id === user?.id || u.username === user?.username)?.rank
    : null;
  const { next, toNext } = getTierProgress(user?.xp || 0);

  const { progress } = getTierProgress(user?.xp || 0);

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return (
      <button
        onClick={() => (item.action ? item.action() : handleNavClick(item.id))}
        aria-current={isActive ? 'page' : undefined}
        className={`relative flex items-center gap-3 px-3 py-2 rounded-md text-[15px] transition-colors cursor-pointer ${
          isActive ? 'bg-white/[0.09] text-white font-semibold' : 'text-white/65 hover:text-white hover:bg-white/[0.05] font-medium'
        }`}
      >
        {isActive && <span className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r bg-highlight" />}
        <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-highlight' : ''}`} />
        <span>{item.label}</span>
      </button>
    );
  };

  const NavGroup = ({ label, items }) => (
    <div className="flex flex-col gap-0.5">
      <div className="text-[13px] font-medium text-white/40 px-3 pb-1.5">{label}</div>
      {items.map((item) => (
        <NavItem key={item.id} item={item} />
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      <div onClick={toggleSidebar} className="fixed inset-0 bg-night-deep/60 z-40 md:hidden" />

      <aside className="fixed inset-y-0 left-0 md:sticky md:top-0 w-[min(17rem,85vw)] md:w-60 h-screen-safe max-h-screen-safe flex-shrink-0 flex flex-col justify-between bg-night select-none z-50 md:z-30 overflow-hidden shadow-2xl md:shadow-none">
        <div className="px-3 py-4 flex-1 flex flex-col gap-6 overflow-y-auto min-h-0">
          {/* Wordmark + close */}
          <div className="flex items-center justify-between pl-3">
            <button onClick={() => handleNavClick('notepad')} className="text-left cursor-pointer">
              <span className="block text-[22px] font-extrabold tracking-[-0.04em] text-white leading-none">
                wilt<span className="text-highlight">.</span>
              </span>
              <span className="block text-[12px] text-white/50 mt-1">What I Learned Today</span>
            </button>
            <button
              onClick={toggleSidebar}
              title="Close sidebar (⌘B)"
              aria-label="Close sidebar"
              className="p-2 rounded-md text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleNavClick('notepad')}
            className="mx-0.5 flex items-center justify-center gap-2 py-2.5 rounded-md bg-highlight text-night text-[15px] font-semibold hover:bg-[#FFEA8F] transition-colors cursor-pointer"
          >
            <PenTool className="w-4 h-4" />
            Write today's note
          </button>

          <NavGroup label="Learn" items={learningNav} />
          <NavGroup label="Practice" items={recallNav} />
          <NavGroup label="More" items={accountNav} />
        </div>

        {/* Progress */}
        <div className="p-3 border-t border-white/10">
          {isLoggedIn ? (
            <button
              onClick={() => handleNavClick('leaderboard')}
              className="w-full rounded-md p-2.5 text-left hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full bg-white/10" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-white truncate">@{user?.username}</div>
                  <div className="text-[13px] text-white/55">
                    {user?.tier || 'Novice'}{myRank ? ` · #${myRank}` : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-highlight tabular-nums">{user?.xp || 0}</div>
                  <div className="text-[11px] text-white/45">XP</div>
                </div>
              </div>
              <div className="mt-2.5 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-highlight rounded-full transition-[width] duration-700" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
              <div className="mt-1.5 text-[12px] text-white/45">
                {next ? `${toNext} XP to ${next.name}` : 'Top tier reached'}
              </div>
            </button>
          ) : (
            <div className="p-2.5">
              <div className="text-sm font-semibold text-white">Earn XP for what you learn</div>
              <p className="text-[13px] text-white/55 mt-1 leading-snug">Sign in to take quizzes and climb the leaderboard.</p>
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  if (typeof window !== 'undefined' && window.innerWidth < 768) toggleSidebar();
                }}
                className="mt-3 w-full py-2 rounded-md text-sm font-semibold bg-white text-night hover:bg-white/90 transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
