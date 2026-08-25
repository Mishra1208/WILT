import React from 'react';
import { Bell, Trophy, Sparkles, Heart, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsView = () => {
  const { setCurrentView } = useApp();

  const notifications = [
    {
      id: 1,
      type: 'quiz',
      title: 'Weekly Recall Quiz Ready!',
      description: '5 new questions based on top peer cards are available. Test your knowledge to win +150 XP!',
      time: '10 mins ago',
      icon: Sparkles,
      iconColor: 'bg-coral-50 text-coral-600',
      action: () => setCurrentView('quiz'),
      actionLabel: 'Take Quiz'
    },
    {
      id: 2,
      type: 'leaderboard',
      title: 'Campus Leaderboard Update',
      description: 'Alex Sterling (@alex_fintech) just climbed to #1 on the NYU Stern hierarchy chart with 2,840 XP.',
      time: '2 hours ago',
      icon: Trophy,
      iconColor: 'bg-amber-50 text-amber-600',
      action: () => setCurrentView('leaderboard'),
      actionLabel: 'View Podium'
    },
    {
      id: 3,
      type: 'like',
      title: 'New Upvotes on your card',
      description: 'Priya Sharma and 8 others upvoted your note on Balance Sheet PPE Shortcuts.',
      time: '5 hours ago',
      icon: Heart,
      iconColor: 'bg-rose-50 text-rose-600'
    },
    {
      id: 4,
      type: 'concept',
      title: 'Glossary Term Approved',
      description: 'Your term definition for "Cash Reserve Ratio" has been verified and added to the community dictionary.',
      time: '1 day ago',
      icon: CheckCircle,
      iconColor: 'bg-emerald-50 text-emerald-600',
      action: () => setCurrentView('dictionary'),
      actionLabel: 'View Glossary'
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Stay updated on your quiz challenges, leaderboard rank shifts, and peer interactions.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${n.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {n.description}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-1.5 block font-mono">
                    {n.time}
                  </span>
                </div>
              </div>

              {n.action && (
                <button
                  onClick={n.action}
                  className="px-4 py-2 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold whitespace-nowrap transition-colors"
                >
                  {n.actionLabel}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
