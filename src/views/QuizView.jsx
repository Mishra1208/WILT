import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Trophy,
  AlertCircle,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { generateWeeklyQuiz } from '../services/quizEngine';
import { saveQuizAttemptToSupabase } from '../services/supabase';

export const QuizView = () => {
  const { posts, openPostDetail, setCurrentView } = useApp();
  const { user, isLoggedIn, setIsAuthModalOpen, addXP } = useAuth();

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const startNewQuiz = () => {
    const questions = generateWeeklyQuiz(posts, 5);
    setQuizQuestions(questions);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
    setQuizStarted(true);
  };

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    const currentQ = quizQuestions[currentIdx];
    const isCorrect = selectedOption === currentQ.correctIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      const finalScore = score + (selectedOption === quizQuestions[currentIdx]?.correctIndex ? 1 : 0);
      const earnedXP = finalScore * 20 + 50;
      addXP(earnedXP, true);

      // Save Quiz attempt to Supabase
      saveQuizAttemptToSupabase({
        userHandle: user?.username || 'anonymous',
        userName: user?.name || 'Student Scholar',
        score: finalScore,
        totalQuestions: quizQuestions.length,
        xpEarned: earnedXP
      });

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleReadSourcePost = (question) => {
    if (!question) return;

    let matchedPost = posts.find(
      (p) =>
        p.id === question.postId ||
        (p.title && question.postTitle && p.title.toLowerCase() === question.postTitle.toLowerCase()) ||
        (p.title && question.postTitle && p.title.toLowerCase().includes(question.postTitle.toLowerCase())) ||
        (p.title && question.postTitle && question.postTitle.toLowerCase().includes(p.title.toLowerCase()))
    );

    if (!matchedPost) {
      matchedPost = {
        id: question.postId || `virtual-post-${Date.now()}`,
        title: question.postTitle || "Active Recall Study Guide",
        category: question.category || "General Knowledge",
        tags: [question.category || "Study Guide"],
        author: {
          name: "@learner",
          username: "learner",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
          role: "Verified Scholar"
        },
        readTime: "1 min read",
        createdAt: "Recently",
        summary: question.sourceSnippet || question.explanation || question.postTitle,
        content: `${question.explanation}\n\n💡 Core Takeaway & Active Recall Snippet:\n${question.sourceSnippet || question.explanation}`,
        keyTakeaways: [question.sourceSnippet || question.explanation],
        comments: []
      };
    }

    openPostDetail(matchedPost, question.sourceSnippet);
  };

  // Auth Gate
  if (!isLoggedIn) {
    return (
      <div className="p-8 max-w-2xl mx-auto animate-fadeIn">
        <div className="p-10 rounded-3xl bg-white border border-slate-200/80 shadow-soft text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-coral-50 text-coral-600 flex items-center justify-center mx-auto">
            <Trophy className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Weekly Active Recall Challenge
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Test your knowledge against peer posts from this week, earn XP, and compete on the campus leaderboard.
          </p>
          <div className="pt-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-btn transition-all"
            >
              Sign In to Play & Rank
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Lobby
  if (!quizStarted) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Weekly Recall Challenge</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-coral-50 text-coral-600 border border-coral-100">
              Week 34
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            5 randomized MCQs selected from community peer learning cards.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-4 shadow-soft">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                No Learning Cards Published Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                The active recall engine generates questions directly from peer lessons. Publish your first 30-second card on the Notepad Slate to unlock quizzes!
              </p>
            </div>
            <button
              onClick={() => setCurrentView('notepad')}
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-btn"
            >
              Open Notepad Slate 📝
            </button>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Questions</div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">{Math.min(5, posts.length)} MCQs</div>
              </div>
              <div className="p-4 rounded-2xl bg-coral-50 border border-coral-100 text-center">
                <div className="text-[11px] font-bold text-coral-500 uppercase">Reward</div>
                <div className="text-xl font-extrabold text-coral-600 mt-1">+150 XP</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <div className="text-[11px] font-bold text-emerald-500 uppercase">Smart Review</div>
                <div className="text-xl font-extrabold text-emerald-600 mt-1">Instant Link</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary-50/70 border border-primary-100 text-xs text-primary-900 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Active recall rule:</span> If you answer any question incorrectly, our recall engine will instantly display <span className="font-bold underline">"Did you forget about it? Read it here"</span> with a direct link to the original peer post.
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 font-mono">
                Ready, @{user?.username || 'scholar'}? • {user?.xp || 0} XP
              </div>
              <button
                onClick={startNewQuiz}
                className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-btn transition-all flex items-center gap-2 transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Challenge</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quiz Results
  if (isQuizCompleted) {
    const accuracy = Math.round((score / quizQuestions.length) * 100);
    const xpWon = score * 20 + 50;

    return (
      <div className="p-8 max-w-2xl mx-auto space-y-6 animate-fadeIn">
        <div className="p-10 rounded-3xl bg-white border border-slate-200/80 shadow-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto animate-bounce">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Quiz Completed!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your results and score have been saved to your campus standing.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 py-5 border-y border-slate-100">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">Score</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                {score} / {quizQuestions.length}
              </div>
              <span className="text-xs font-semibold text-emerald-600">{accuracy}%</span>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">XP Gained</div>
              <div className="text-3xl font-extrabold text-coral-600 mt-1">
                +{xpWon}
              </div>
              <span className="text-xs text-slate-500">Total: {user.xp} XP</span>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">Rank</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                #{user.rank}
              </div>
              <span className="text-xs text-primary-600 font-semibold">{user.tier}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={startNewQuiz}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>
            <button
              onClick={() => setCurrentView('leaderboard')}
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-btn flex items-center gap-2 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>View Leaderboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Question
  const currentQ = quizQuestions[currentIdx];
  const isWrong = isAnswerSubmitted && selectedOption !== currentQ.correctIndex;
  const isCorrect = isAnswerSubmitted && selectedOption === currentQ.correctIndex;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Question Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-primary-600 uppercase tracking-wider">
          Question {currentIdx + 1} of {quizQuestions.length}
        </span>
        <span className="font-mono font-bold text-slate-700">
          Score: {score}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-6">
        <div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
            {currentQ.category}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2.5 leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isThisSelected = selectedOption === idx;
            let style = "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300";

            if (isAnswerSubmitted) {
              if (idx === currentQ.correctIndex) {
                style = "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold";
              } else if (isThisSelected && idx !== currentQ.correctIndex) {
                style = "bg-rose-50 border-rose-300 text-rose-900";
              } else {
                style = "opacity-40 border-slate-200";
              }
            } else if (isThisSelected) {
              style = "bg-primary-50 border-primary-500 text-primary-900 font-bold shadow-sm";
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold bg-white border border-current flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswerSubmitted && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                )}
                {isAnswerSubmitted && isThisSelected && idx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* RECALL CALLOUT BANNER ON WRONG ANSWER */}
        {isWrong && (
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Did you forget about it? Read it here:</span>
            </div>

            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {currentQ.explanation}
            </p>

            <div className="pt-1">
              <button
                onClick={() => handleReadSourcePost(currentQ)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-btn transition-all transform active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Source: "{currentQ.postTitle}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          {!isAnswerSubmitted ? (
            <button
              disabled={selectedOption === null}
              onClick={handleSubmitAnswer}
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-btn disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all flex items-center gap-2"
            >
              <span>{currentIdx + 1 === quizQuestions.length ? 'See Results' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
