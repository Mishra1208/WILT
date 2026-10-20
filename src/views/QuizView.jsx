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
import { PageHero, HeroStat, HeroAction } from '../components/widgets/PageHero';
import { ScoreRing } from '../components/widgets/ScoreRing';

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

  const XP_PER_CORRECT = 30; // 5 questions x 30 = 150 XP max, 0 XP if nothing is correct

  const handleNextQuestion = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      // `score` already includes the last answer (counted in handleSubmitAnswer)
      const finalScore = score;
      const total = quizQuestions.length;
      const earnedXP = finalScore * XP_PER_CORRECT;

      // Award XP (may be 0) and record real accuracy for this attempt
      addXP(earnedXP, { correct: finalScore, total });
      setLeaderboard(getStoredLeaderboard());

      saveQuizAttemptToSupabase({
        userHandle: user?.username || 'anonymous',
        userName: user?.name || 'Student Scholar',
        score: finalScore,
        totalQuestions: total,
        xpEarned: earnedXP
      });

      if (finalScore > 0) {
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
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
      <div className="px-5 sm:px-8 py-8 sm:py-10 max-w-4xl mx-auto space-y-10">
        <PageHero
          title="Weekly quiz"
          description="Five questions from your classmates' notes and this week's business news. Each correct answer is worth 30 XP."
          aside={<HeroAction onClick={startNewQuiz} icon={Sparkles}>Start quiz</HeroAction>}
        >
          <div className="flex">
            <HeroStat value="5" label="questions" />
            <HeroStat value="150" label="XP available" />
            <HeroStat value={user?.xp || 0} label="your XP" />
          </div>
        </PageHero>

        <ol className="grid grid-cols-1 sm:grid-cols-3 border-t border-line">
          {[
            { title: 'Read the question', body: 'Every question comes from a real note or news story.' },
            { title: 'Pick an answer', body: 'Choose one of four options, then check it.' },
            { title: 'Learn from misses', body: 'Get one wrong and we link you to the original source.' }
          ].map(({ title, body }, i) => (
            <li key={title} className="pt-5 pb-2 sm:pr-6 border-b sm:border-b-0 border-line">
              <span className="text-sm font-semibold text-primary-700 tabular-nums">Step {i + 1}</span>
              <h3 className="mt-1 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-1 font-serif text-[17px] text-muted leading-snug">{body}</p>
            </li>
          ))}
        </ol>

        <p className="text-[15px] text-muted">
          Playing as <span className="font-semibold text-ink">@{user?.username || 'scholar'}</span>
        </p>
      </div>
    );
  }

  // Quiz Results
  if (isQuizCompleted) {
    const accuracy = quizQuestions.length > 0 ? Math.round((score / quizQuestions.length) * 100) : 0;
    const xpWon = score * XP_PER_CORRECT;

    return (
      <div className="px-5 sm:px-8 py-8 max-w-3xl mx-auto space-y-8 pb-16">
        <section className="night-panel rounded-2xl p-6 sm:p-10 text-center">
          <ScoreRing score={score} total={quizQuestions.length} />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-6 tracking-[-0.035em]">
            {score === quizQuestions.length ? 'Perfect round' : score >= Math.ceil(quizQuestions.length * 0.6) ? 'Nice work' : score > 0 ? 'Keep going' : 'Review and try again'}
          </h2>
          <p className="font-serif text-lg text-white/70 mt-2">
            {score === 0 ? 'No XP this time. Check the sources below, then have another go.' : 'Your score has been added to the leaderboard.'}
          </p>

          <div className="mt-7 grid grid-cols-3 max-w-md mx-auto divide-x divide-white/15">
            {[
              [`${accuracy}%`, 'accuracy'],
              [`+${xpWon}`, 'XP earned'],
              [user?.xp || 0, 'total XP']
            ].map(([v, l]) => (
              <div key={l}>
                <div className="text-2xl font-bold text-white tabular-nums">{v}</div>
                <div className="text-sm text-white/60 mt-0.5">{l}</div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              onClick={startNewQuiz}
              className="px-5 py-3 rounded-md border border-white/25 hover:bg-white/10 text-white text-[15px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Play again
            </button>
            <button
              onClick={() => setCurrentView('leaderboard')}
              className="px-6 py-3 rounded-md bg-highlight text-night text-[15px] font-semibold flex items-center justify-center gap-2 hover:bg-[#FFEA8F] transition-colors cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              See leaderboard
            </button>
          </div>
        </section>

        {/* FULL QUESTIONS & ANSWERS RECALL REVIEW */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-ink">
              Your answers
            </h3>
            <span className="text-sm text-slate-600">
              {score} of {quizQuestions.length} correct
            </span>
          </div>

          <div className="space-y-4">
            {quizQuestions.map((q, qIdx) => {
              const userChoice = userAnswers[qIdx];
              const isUserCorrect = userChoice === q.correctIndex;

              return (
                <div key={qIdx} className="p-5 sm:p-6 rounded-xl bg-white border border-line space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary-700">
                      Question {qIdx + 1} <span className="text-slate-500 font-medium">· {q.category}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      isUserCorrect ? 'bg-mint-50 text-mint-700' : 'bg-rose-50 text-rose-700'
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

                  <h4 className="font-display text-lg font-bold text-ink leading-snug whitespace-pre-line">
                    {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctIndex;
                      const isSelected = optIdx === userChoice;

                      let optStyle = "bg-white text-slate-700 border-slate-200";
                      if (isCorrect) {
                        optStyle = "bg-mint-50 border-mint-500 text-mint-700 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        optStyle = "bg-rose-50 border-rose-300 text-rose-800 line-through";
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-xl border text-sm flex items-center justify-between gap-3 ${optStyle}`}>
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold">{String.fromCharCode(65 + optIdx)}</span>
                            <span>{opt}</span>
                          </div>
                          {isCorrect && <span className="shrink-0 text-xs font-semibold text-white bg-mint-500 px-2 py-0.5 rounded-full">Correct</span>}
                          {isSelected && !isCorrect && <span className="shrink-0 text-xs font-semibold text-white bg-rose-400 px-2 py-0.5 rounded-full no-underline">Your answer</span>}
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
                        className="btn-iris inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs shadow-2xs transition-all cursor-pointer mt-1"
                      >
                        <Globe2 className="w-3.5 h-3.5" />
                        <span>Read Full Article on Times of India</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : q.postTitle ? (
                      <button
                        onClick={() => handleReadSourcePost(q)}
                        className="btn-iris inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs shadow-2xs transition-all cursor-pointer mt-1"
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
    <div className="px-5 sm:px-8 py-8 max-w-3xl mx-auto space-y-6">
      {/* Progress: one segment per question, coloured by result */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">
            Question {currentIdx + 1} <span className="text-slate-500 font-medium">of {quizQuestions.length}</span>
          </span>
          <span className="font-semibold text-ink">
            {score} <span className="text-slate-500 font-medium">correct</span>
          </span>
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          {quizQuestions.map((q, i) => {
            const answered = userAnswers[i] !== undefined;
            const right = answered && userAnswers[i] === q.correctIndex;
            return (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                  answered ? (right ? 'bg-mint-500' : 'bg-rose-400') : i === currentIdx ? 'bg-primary-500' : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      <div key={currentIdx} className="animate-rise p-5 sm:p-8 rounded-xl bg-white border border-line space-y-6">
        <div>
          <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${currentQ.isNews ? 'text-[#B4233C]' : 'text-primary-700'}`}>
            {currentQ.isNews ? <Globe2 className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
            {currentQ.isNews ? 'Business news' : 'Peer post'} · {currentQ.category}
          </span>
          <h3 className="text-[22px] sm:text-[26px] font-semibold text-ink mt-2 leading-snug tracking-[-0.02em] whitespace-pre-line">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isThisSelected = selectedOption === idx;
            let style = "bg-white border-line text-ink hover:border-ink/30";
            let badge = "bg-slate-100 text-slate-600";

            if (isAnswerSubmitted) {
              if (idx === currentQ.correctIndex) {
                style = "bg-mint-50 border-mint-500 text-mint-700 font-semibold animate-pop";
                badge = "bg-mint-500 text-white";
              } else if (isThisSelected && idx !== currentQ.correctIndex) {
                style = "bg-rose-50 border-rose-300 text-rose-800";
                badge = "bg-rose-400 text-white";
              } else {
                style = "opacity-50 border-slate-200 bg-white";
              }
            } else if (isThisSelected) {
              style = "bg-primary-50 border-primary-600 text-ink font-medium";
              badge = "bg-primary-600 text-white";
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-lg border text-[16px] transition-colors flex items-center justify-between gap-3 cursor-pointer ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-md flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-colors ${badge}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswerSubmitted && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-mint-600 flex-shrink-0" />
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
          <div className="p-5 rounded-lg bg-[#FFF9DB] border border-[#F3E2A0] space-y-3">
            <div className="flex items-center gap-2 text-ink text-[15px] font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                {currentQ.isNews ? 'Did you forget this news? Read it here:' : 'Did you forget about it? Read it here:'}
              </span>
            </div>

            <p className="font-serif text-[17px] text-ink/85 leading-snug whitespace-pre-line">
              {currentQ.explanation}
            </p>

            <div className="pt-1">
              {currentQ.isNews || currentQ.toiUrl ? (
                <a
                  href={currentQ.toiUrl || 'https://timesofindia.indiatimes.com/business'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-iris inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Read Full Article on Times of India</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={() => handleReadSourcePost(currentQ)}
                  className="btn-iris inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
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
              className="btn-iris px-6 py-3 rounded-md text-[15px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Check answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-md bg-ink hover:bg-ink/90 text-white text-[15px] font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>{currentIdx + 1 === quizQuestions.length ? 'See results' : 'Next question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
