import React, { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useApp } from './context/AppContext';
import { FloatingNavbar } from './components/layout/FloatingNavbar';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Views
import { NotepadLandingView } from './views/NotepadLandingView';
import { AboutView } from './views/AboutView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { TermsView } from './views/TermsView';
import { CommunityStandardsView } from './views/CommunityStandardsView';
import { HomeView } from './views/HomeView';
import { DiscoverView } from './views/DiscoverView';
import { DictionaryView } from './views/DictionaryView';
import { QuizView } from './views/QuizView';
import { LeaderboardView } from './views/LeaderboardView';
import { RevisionView } from './views/RevisionView';
import { SavedView } from './views/SavedView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';

// Modals
import { NewPostModal } from './components/modals/NewPostModal';
import { PostDetailModal } from './components/modals/PostDetailModal';
import { NewConceptModal } from './components/modals/NewConceptModal';
import { AuthModal } from './components/modals/AuthModal';

export function App() {
  const { currentView, toggleSidebar } = useApp();

  // Keyboard shortcut listener for Cmd+K (search) and Cmd+B (sidebar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('header input');
        if (searchInput) searchInput.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const isLandingMode = currentView === 'notepad';

  const renderLandingView = () => {
    switch (currentView) {
      case 'about':
        return <AboutView />;
      case 'privacy':
        return <PrivacyPolicyView />;
      case 'terms':
        return <TermsView />;
      case 'standards':
        return <CommunityStandardsView />;
      case 'notepad':
      default:
        return <NotepadLandingView />;
    }
  };

  const renderDashboardView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'discover':
        return <DiscoverView />;
      case 'dictionary':
        return <DictionaryView />;
      case 'quiz':
        return <QuizView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'revision':
        return <RevisionView />;
      case 'saved':
        return <SavedView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      case 'about':
        return <AboutView />;
      case 'privacy':
        return <PrivacyPolicyView />;
      case 'terms':
        return <TermsView />;
      case 'standards':
        return <CommunityStandardsView />;
      default:
        return <DiscoverView />;
    }
  };

  return (
    <>
      {isLandingMode ? (
        /* LANDING EXPERIENCE: Floating Navbar + Centered View + Footer */
        <div className="min-h-screen bg-[#FAFAFB] text-slate-900 font-sans flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
          <FloatingNavbar />
          <main className="flex-1">
            {renderLandingView()}
          </main>
          <Footer />
        </div>
      ) : (
        /* FULL DASHBOARD EXPERIENCE: Sticky Sidebar + Sticky Header + Full Page Scrolling + Footer */
        <div className="min-h-screen bg-[#FAFAFB] text-slate-900 font-sans flex selection:bg-indigo-100 selection:text-indigo-900">
          {/* Sticky Sidebar */}
          <div className="sticky top-0 h-screen flex-shrink-0 z-30">
            <Sidebar />
          </div>

          {/* Main Content & Natural Window Flow */}
          <div className="flex-1 min-w-0 flex flex-col justify-between min-h-screen">
            <div>
              <Header />
              <main className="flex-1">
                {renderDashboardView()}
              </main>
            </div>
            <Footer />
          </div>
        </div>
      )}

      {/* Global Modals */}
      <NewPostModal />
      <PostDetailModal />
      <NewConceptModal />
      <AuthModal />

      {/* Vercel Web Traffic Analytics */}
      <Analytics />
    </>
  );
}

export default App;
