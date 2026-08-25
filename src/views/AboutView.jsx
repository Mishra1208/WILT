import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Brain,
  Trophy,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Users,
  GraduationCap,
  HelpCircle,
  PenTool,
  Award,
  HeartHandshake,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DrawCircleHeading } from '../components/ui/DrawCircleHeading';

export const AboutView = () => {
  const { setCurrentView } = useApp();
  const [animateScribble, setAnimateScribble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateScribble(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const pillars = [
    {
      icon: Zap,
      iconColor: 'bg-primary-50 text-primary-600 border-primary-100',
      title: '1. Micro-Learning Bites',
      tag: '30s Retention',
      desc: 'Instead of passive 3-hour slides, learn and post 30-second insights, formulas, and shortcuts that immediately click in your head.'
    },
    {
      icon: Brain,
      iconColor: 'bg-coral-50 text-coral-600 border-coral-100',
      title: '2. Active Recall & Smart Review',
      tag: 'Spaced Memory',
      desc: 'Our weekly quiz tests you on random cards. If you get a question wrong, our recall engine says "Did you forget about it? Read it here" linking back to the exact source post.'
    },
    {
      icon: Trophy,
      iconColor: 'bg-amber-50 text-amber-600 border-amber-100',
      title: '3. Campus Rank Hierarchy',
      tag: 'Trophy Podiums',
      desc: 'Compete for the top 3 podium (🥇 Gold, 🥈 Silver, 🥉 Bronze) with unique handles, campus cohorts, accuracy stats, and XP progression.'
    },
    {
      icon: BookOpen,
      iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      title: '4. Crowdsourced Peer Glossary',
      tag: 'Plain English',
      desc: 'Search any finance, accounting, or tech concept and get simple, plain-English analogies written and curated by college peers.'
    }
  ];

  const creators = [
    {
      name: "Narendra Mishra",
      role: "Co-Creator & Lead Architect",
      badge: "⚡ Co-Founder",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80",
      quote: "Knowledge grows when shared. WILT makes continuous peer learning seamless, high-yield, and accessible to every student.",
      focus: "Full-Stack System Architecture & Cloud Infrastructure"
    },
    {
      name: "Avinendra Pratap Singh",
      role: "Co-Creator & Concept Architect",
      badge: "🎓 Co-Founder",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80",
      quote: "Students shouldn't have to reread 500-page textbooks for one formula. WILT is built so peers can teach each other in 30 seconds.",
      focus: "Micro-Learning Architecture & Product Vision"
    },
    {
      name: "Kumar",
      role: "Co-Creator & Platform Lead",
      badge: "🚀 Co-Founder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80",
      quote: "The secret to acing exams isn't memorization—it's active recall. We engineered WILT to turn revision into a fast, gamified habit.",
      focus: "Spaced Repetition Engine & Gamification"
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Jot down 30s Insight',
      desc: 'Type a formula, shortcut, or concept in the digital notepad studio.',
      icon: PenTool,
      color: 'text-primary-600 bg-primary-50'
    },
    {
      step: '02',
      title: 'Weekly Auto-Quiz',
      desc: 'Algorithmic MCQ generation tests peer knowledge without manual effort.',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      step: '03',
      title: 'Instant Recall Loop',
      desc: '"Did you forget about it? Read it here" opens exact source context.',
      icon: Brain,
      color: 'text-coral-600 bg-coral-50'
    },
    {
      step: '04',
      title: 'Campus Podium Standing',
      desc: 'Earn XP, climb your university roster, and unlock Gold trophies.',
      icon: Trophy,
      color: 'text-emerald-600 bg-emerald-50'
    }
  ];

  const faqs = [
    {
      q: 'Who is WILT built for?',
      a: 'WILT (What I Learned Today) is crafted specifically for university and college students studying Finance, Accounting, Economics, and Computer Science who want to learn faster through peer knowledge and active recall.'
    },
    {
      q: 'How does the "Did you forget about it? Read it here" feature work?',
      a: 'When you take the weekly active recall quiz, if you answer any question incorrectly, our smart review engine instantly pops up a notice with a direct 1-click link to the exact peer post and highlighted source context.'
    },
    {
      q: 'Who started the WILT project?',
      a: 'WILT was conceptualized and created by Narendra Mishra, Avinendra Pratap Singh, and Kumar as a modern peer-learning ecosystem combining micro-notes, spaced repetition, and university hierarchy leaderboards.'
    }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-16 animate-fadeIn select-none">
      {/* HERO SECTION WITH ANIMATED PEN & SCRIBBLE */}
      <div className="text-center max-w-3xl mx-auto space-y-5 pt-4">
        {/* Floating Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-sm hover:scale-105 transition-transform">
          <GraduationCap className="w-4 h-4 text-primary-400" />
          <span>The WILT Story & Vision</span>
        </div>

        {/* Animated Headline with Writing Pen and Hand-drawn underline */}
        <div className="relative inline-block px-4">
          {/* Animated Floating Fountain Pen Icon */}
          <div className="absolute -top-6 -left-3 sm:-left-6 text-primary-600 animate-bounce">
            <div className="p-2 rounded-2xl bg-primary-50 border border-primary-200 shadow-sm transform -rotate-12">
              <PenTool className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Built for students who want to{' '}
            <span className="relative inline-block">
              {/* Masked Gradient Text */}
              <span className="bg-gradient-to-r from-indigo-700 via-primary-600 to-coral-500 bg-clip-text text-transparent animate-gradient-x">
                learn in seconds
              </span>

              {/* Hand-Drawn SVG Scribble Underline Animation */}
              <svg
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-4 sm:h-5 text-coral-500 overflow-visible pointer-events-none"
                viewBox="0 0 260 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 5,14 Q 70,4 135,11 Q 195,17 255,8"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-all duration-1000 ease-out ${
                    animateScribble ? 'stroke-dashoffset-0 opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    strokeDasharray: 300,
                    strokeDashoffset: animateScribble ? 0 : 300,
                  }}
                />
                <path
                  d="M 15,18 Q 85,9 155,15 Q 215,7 245,13"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-all duration-1000 delay-300 ease-out ${
                    animateScribble ? 'stroke-dashoffset-0 opacity-90' : 'opacity-0'
                  }`}
                  style={{
                    strokeDasharray: 300,
                    strokeDashoffset: animateScribble ? 0 : 300,
                  }}
                />
              </svg>
            </span>
            , not hours.
          </h1>
        </div>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
          WILT turns fragmented notes and exhausting exam cramming into an engaging daily learning habit backed by spaced repetition, source verification, and peer collaboration.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => setCurrentView('notepad')}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-btn hover:shadow-hover transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Open Notepad Studio 📝</span>
          </button>
          <button
            onClick={() => setCurrentView('discover')}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-soft transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Full Platform</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* PROJECT CREATORS & FOUNDERS SPOTLIGHT */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Original Idea & Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Meet the Creators
          </h2>
          <p className="text-xs text-slate-500">
            WILT was envisioned and created by <strong>Narendra Mishra</strong>, <strong>Avinendra Pratap Singh</strong>, and <strong>Kumar</strong> to solve how college students retain complex knowledge.
          </p>
        </div>

        {/* 3 Founders Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {creators.map((creator, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-primary-300 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary-100 group-hover:ring-primary-400 transition-all shadow-xs flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-700 transition-colors truncate">
                        {creator.name}
                      </h3>
                      <p className="text-[11px] text-primary-600 font-semibold font-mono truncate">
                        {creator.role}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs whitespace-nowrap flex-shrink-0">
                    {creator.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-2xl border border-slate-100 font-serif">
                  "{creator.quote}"
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium gap-2">
                <span className="flex items-center gap-1 text-primary-700 font-bold truncate">
                  <Award className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                  <span className="truncate">{creator.focus}</span>
                </span>
                <span className="font-mono text-slate-400 text-[10px] flex-shrink-0">Class of '26</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW ACTIVE RECALL WORKS (4-STEP WORKFLOW) */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            How WILT Works
          </h2>
          <p className="text-xs text-slate-500">
            A frictionless 4-step loop designed for permanent memory retention
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-hover hover:border-primary-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-slate-400">
                      {step.step}
                    </span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${step.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 CORE PILLARS GRID WITH DRAW-CIRCLE ANIMATION */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <DrawCircleHeading prefix="The" highlight="4 Core Pillars" suffix="of WILT" />
          <p className="text-xs text-slate-500">
            Engineered specifically around collegiate micro-learning patterns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-hover hover:border-primary-200 transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${pillar.iconColor} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex items-center gap-2 text-slate-900">
          <HelpCircle className="w-5 h-5 text-primary-600" />
          <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4 space-y-1">
              <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM BANNER */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-primary-950 text-white text-center space-y-4 shadow-hover">
        <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold">
          Start Today • Retain Forever
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ready to post what you learned today?
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Start typing in the digital notepad or explore lessons shared by peers across finance, tech, and business colleges.
        </p>
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setCurrentView('notepad')}
            className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-btn"
          >
            Launch Notepad Slate 📝
          </button>
          <button
            onClick={() => setCurrentView('discover')}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
          >
            Explore Feed ➔
          </button>
        </div>
      </div>
    </div>
  );
};
