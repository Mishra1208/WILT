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
  HelpCircle,
  Globe2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { generateWeeklyQuiz } from '../services/quizEngine';
import { saveQuizAttemptToSupabase } from '../services/supabase';
import { getStoredLeaderboard } from '../services/storage';

export const QuizView = () => {
  const { posts, openPostDetail, setCurrentView, setLeaderboard } = useApp();
  const { user, addXP, requireAuth } = useAuth();

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const [userAnswers, setUserAnswers] = useState({});

  const startNewQuiz = () => {
    if (!requireAuth()) return;
    const questions = generateWeeklyQuiz(posts, 5);
    setQuizQuestions(questions);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setUserAnswers({});
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

    setUserAnswers((prev) => ({ ...prev, [currentIdx]: selectedOption }));
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
      
      // Award XP and update leaderboard immediately
      addXP(earnedXP, true);
      setLeaderboard(getStoredLeaderboard());

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

    if (question.isNews || question.toiUrl) {
      window.open(question.toiUrl || 'https://timesofindia.indiatimes.com/business', '_blank', 'noopener,noreferrer');
      return;
    }

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

  // Quiz Lobby
  if (!quizStarted) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5 font-display">
            <span>Weekly Recall Challenge</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-coral-50 text-coral-600 border border-coral-100 font-mono">
              Week 34
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            5 randomized MCQs selected from community peer learning cards & Times of India breaking business news. Test your retention and rank on the campus leaderboard.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Questions</div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">5 MCQs</div>
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
            <div className="leading-relaxed font-medium">
              <span className="font-bold">Active recall rule:</span> If you answer any question incorrectly, our recall engine will instantly display <span className="font-bold underline">"Did you forget about it? Read full article / post"</span> with a direct link to the original news article or peer post.
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-600 font-mono font-bold">
              Playing as: <span className="text-primary-600">@{user?.username || 'scholar'}</span> • {user?.xp || 0} XP
            </div>
            <button
              onClick={startNewQuiz}
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-btn transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Challenge</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Results
  if (isQuizCompleted) {
    const accuracy = Math.round((score / quizQuestions.length) * 100);
    const xpWon = score * 20 + 50;

    return (
      <div className="p-8 max-w-3xl mx-auto space-y-6 animate-fadeIn pb-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              Quiz Completed!
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Your results and score have been saved to your campus standing.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 py-5 border-y border-slate-100">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">Score</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                {score} / {quizQuestions.length}
              </div>
              <span className="text-xs font-bold text-emerald-600">{accuracy}%</span>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">XP Gained</div>
              <div className="text-3xl font-extrabold text-coral-600 mt-1 font-mono">
                +{xpWon}
              </div>
              <span className="text-xs text-slate-500 font-mono font-bold">Total: {user?.xp || 0} XP</span>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">Leaderboard Rank</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                #{user?.rank || 1}
              </div>
              <span className="text-xs text-primary-600 font-bold">{user?.tier || 'Scholar'}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={startNewQuiz}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>
            <button
              onClick={() => setCurrentView('leaderboard')}
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-btn flex items-center gap-2 transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>View Campus Leaderboard</span>
            </button>
          </div>
        </div>

        {/* FULL QUESTIONS & ANSWERS RECALL REVIEW */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Detailed Questions & Active Recall Review
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {quizQuestions.length} Questions Reviewed
            </span>
          </div>

          <div className="space-y-4">
            {quizQuestions.map((q, qIdx) => {
              const userChoice = userAnswers[qIdx];
              const isUserCorrect = userChoice === q.correctIndex;

              return (
                <div key={qIdx} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary-600 font-mono uppercase">
                      Q{qIdx + 1} • {q.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 ${
                      isUserCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isUserCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctIndex;
                      const isSelected = optIdx === userChoice;

                      let optStyle = "bg-slate-50 text-slate-700 border-slate-200";
                      if (isCorrect) {
                        optStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold";
                      } else if (isSelected && !isCorrect) {
                        optStyle = "bg-rose-50 border-rose-300 text-rose-900 line-through";
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${optStyle}`}>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                          {isCorrect && <span className="text-[10px] uppercase font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">Correct Answer ✓</span>}
                          {isSelected && !isCorrect && <span className="text-[10px] uppercase font-extrabold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">Your Choice ✗</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* EXPLANATION & DIRECT SOURCE LINK */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                      💡 <span className="font-bold">Explanation:</span> {q.explanation}
                    </p>
                    {q.isNews || q.toiUrl ? (
                      <a
                        href={q.toiUrl || 'https://timesofindia.indiatimes.com/business'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer mt-1"
                      >
                        <Globe2 className="w-3.5 h-3.5" />
                        <span>Read Full Article on Times of India</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : q.postTitle ? (
                      <button
                        onClick={() => handleReadSourcePost(q)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer mt-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Open Source Post: "{q.postTitle}"</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Question
  const currentQ = quizQuestions[currentIdx];
  const isWrong = isAnswerSubmitted && selectedOption !== currentQ.correctIndex;

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
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${style}`}
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
              <span>
                {currentQ.isNews ? 'Did you forget this news? Read it here:' : 'Did you forget about it? Read it here:'}
              </span>
            </div>

            <p className="text-xs text-amber-950 leading-relaxed font-medium whitespace-pre-line">
              {currentQ.explanation}
            </p>

            <div className="pt-1">
              {currentQ.isNews || currentQ.toiUrl ? (
                <a
                  href={currentQ.toiUrl || 'https://timesofindia.indiatimes.com/business'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-btn transition-all transform active:scale-95 cursor-pointer"
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Read Full Article on Times of India</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={() => handleReadSourcePost(currentQ)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-btn transition-all transform active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open Source Post: "{currentQ.postTitle}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          {!isAnswerSubmitted ? (
            <button
              disabled={selectedOption === null}
              onClick={handleSubmitAnswer}
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-btn disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all flex items-center gap-2 cursor-pointer"
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

export default QuizView;
