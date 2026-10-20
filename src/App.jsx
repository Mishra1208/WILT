import React, { useEffect, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useApp } from './context/AppContext';
import { FloatingNavbar } from './components/layout/FloatingNavbar';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Views — the landing page loads immediately; every other page is split into its
// own chunk so phones download far less JavaScript up front.
import { NotepadLandingView } from './views/NotepadLandingView';

const viewLoaders = {
  about: () => import('./views/AboutView').then((m) => ({ default: m.AboutView })),
  privacy: () => import('./views/PrivacyPolicyView').then((m) => ({ default: m.PrivacyPolicyView })),
  terms: () => import('./views/TermsView').then((m) => ({ default: m.TermsView })),
  standards: () => import('./views/CommunityStandardsView').then((m) => ({ default: m.CommunityStandardsView })),
  home: () => import('./views/HomeView').then((m) => ({ default: m.HomeView })),
  discover: () => import('./views/DiscoverView').then((m) => ({ default: m.DiscoverView })),
  dictionary: () => import('./views/DictionaryView').then((m) => ({ default: m.DictionaryView })),
  quiz: () => import('./views/QuizView').then((m) => ({ default: m.QuizView })),
  leaderboard: () => import('./views/LeaderboardView').then((m) => ({ default: m.LeaderboardView })),
  revision: () => import('./views/RevisionView').then((m) => ({ default: m.RevisionView })),
  saved: () => import('./views/SavedView').then((m) => ({ default: m.SavedView })),
  notifications: () => import('./views/NotificationsView').then((m) => ({ default: m.NotificationsView })),
  knowledgeQuest: () => import('./views/KnowledgeQuestView').then((m) => ({ default: m.KnowledgeQuestView }))
};

const AboutView = lazy(viewLoaders.about);
const PrivacyPolicyView = lazy(viewLoaders.privacy);
const TermsView = lazy(viewLoaders.terms);
const CommunityStandardsView = lazy(viewLoaders.standards);
const HomeView = lazy(viewLoaders.home);
const DiscoverView = lazy(viewLoaders.discover);
const DictionaryView = lazy(viewLoaders.dictionary);
const QuizView = lazy(viewLoaders.quiz);
const LeaderboardView = lazy(viewLoaders.leaderboard);
const RevisionView = lazy(viewLoaders.revision);
const SavedView = lazy(viewLoaders.saved);
const NotificationsView = lazy(viewLoaders.notifications);
const KnowledgeQuestView = lazy(viewLoaders.knowledgeQuest);

const ViewFallback = () => (
  <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-4" aria-busy="true" aria-label="Loading page">
    <div className="h-7 w-48 rounded-lg bg-slate-200/70 animate-pulse" />
    <div className="h-4 w-72 max-w-full rounded bg-slate-200/60 animate-pulse" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
      <div className="h-40 rounded-2xl bg-slate-200/50 animate-pulse" />
      <div className="h-40 rounded-2xl bg-slate-200/50 animate-pulse" />
    </div>
  </div>
);

// Modals
import { NewPostModal } from './components/modals/NewPostModal';
import { PostDetailModal } from './components/modals/PostDetailModal';
import { NewConceptModal } from './components/modals/NewConceptModal';
import { AuthModal } from './components/modals/AuthModal';
import { ReportBugModal } from './components/modals/ReportBugModal';

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

  // Warm up the other pages in the background once the first screen is ready,
  // so switching sections later doesn't wait on the network.
  useEffect(() => {
    const prefetch = () => Object.values(viewLoaders).forEach((load) => load().catch(() => {}));
    const conn = typeof navigator !== 'undefined' ? navigator.connection : null;
    if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    }
    const t = setTimeout(prefetch, 2500);
    return () => clearTimeout(t);
  }, []);

  // Start each page at the top when switching sections
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
  }, [currentView]);

  const isLandingMode = currentView === 'notepad';
  // Each area gets its own palette (see src/index.css): practice = teal, news = crimson
  const sectionTheme =
    currentView === 'quiz' || currentView === 'leaderboard'
      ? 'library'
      : currentView === 'knowledge-quest' || currentView === 'quest'
        ? 'crest'
        : undefined;

  const renderLandingView = () => {
    switch (currentView) {
      case 'knowledge-quest':
      case 'quest':
        return <KnowledgeQuestView />;
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
      case 'knowledge-quest':
      case 'quest':
        return <KnowledgeQuestView />;
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
        <div className="min-h-screen text-ink font-sans flex flex-col justify-between selection:bg-primary-100 selection:text-primary-900">
          <FloatingNavbar />
          <main className="flex-1 min-w-0">
            <Suspense fallback={<ViewFallback />}>{renderLandingView()}</Suspense>
          </main>
          <Footer />
        </div>
      ) : (
        /* FULL DASHBOARD EXPERIENCE: Sticky Sidebar + Sticky Header + Full Page Scrolling + Footer */
        <div className="min-h-screen text-ink font-sans flex selection:bg-primary-100 selection:text-primary-900">
          {/* Sticky Sidebar */}
          <div className="sticky top-0 h-screen-safe flex-shrink-0 z-50 md:z-30">
            <Sidebar />
          </div>

          {/* Main Content & Natural Window Flow */}
          <div className="flex-1 min-w-0 flex flex-col justify-between min-h-screen">
            <div>
              <Header />
              <main className="flex-1 min-w-0" data-theme={sectionTheme}>
                <Suspense fallback={<ViewFallback />}>{renderDashboardView()}</Suspense>
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
      <ReportBugModal />

      {/* Vercel Web Traffic Analytics */}
      <Analytics />
    </>
  );
}

export default App;
