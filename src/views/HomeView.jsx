import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Brain,
  Zap,
  TrendingUp,
  PlusCircle,
  Trophy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/cards/PostCard';

export const HomeView = () => {
  const { posts, setCurrentView, setIsNewPostModalOpen } = useApp();
  const { user } = useAuth();

  const featuredPosts = posts.slice(0, 3);

  return (
    <div className="p-8 sm:p-12 max-w-6xl mx-auto space-y-16 animate-fadeIn">
      {/* Centered Hero Section (Nextplate Style) */}
      <div className="text-center max-w-3xl mx-auto pt-6 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          <span>Active Recall Peer Platform for Students</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Learn something once. <br />
          <span className="text-primary-600">Solidify it forever.</span>
        </h1>

        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Share bite-sized finance and tech insights in under 30 seconds. Put your memory to the test with weekly spaced-recall quizzes and climb the campus rank hierarchy.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setCurrentView('quiz')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Weekly Quiz 🚀</span>
          </button>

          <button
            onClick={() => setCurrentView('discover')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-soft transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Knowledge Feed</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 3 Clean Feature Pillars (Nextplate Card Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setIsNewPostModalOpen(true)}
          className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-hover hover:border-primary-200 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1.5">
            30-Second Micro-Insights
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Post formulas, analogies, and quick mental models you learned today to teach and help fellow students.
          </p>
        </div>

        <div
          onClick={() => setCurrentView('quiz')}
          className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-hover hover:border-primary-200 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1.5">
            Active Recall Quizzes
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Automatic weekly MCQs from peer cards. If you forget, jump right into the source text with one click.
          </p>
        </div>

        <div
          onClick={() => setCurrentView('dictionary')}
          className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-hover hover:border-primary-200 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1.5">
            Peer Community Glossary
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Search any finance or tech concept and get simple, plain-English definitions written by peers.
          </p>
        </div>
      </div>

      {/* Featured Insights Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Featured Insights
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hand-picked bite-sized lessons shared by college peers
            </p>
          </div>

          <button
            onClick={() => setCurrentView('discover')}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>View all posts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};
