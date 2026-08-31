import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CornerDownLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Link as LinkIcon, 
  BookOpen, 
  X, 
  Sparkles,
  Layers
} from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { CATEGORIES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { validateContent } from '../services/moderation';
import GradientText from '../components/ui/GradientText';
import DotPattern from '../components/ui/DotPattern';
import MaskedLottieText from '../components/ui/MaskedLottieText';
import DiaTextReveal from '../components/ui/DiaTextReveal';
import SplitText from '../components/ui/SplitText';
import { cn } from '../lib/utils';

export const NotepadLandingView = () => {
  const { createPost, setCurrentView } = useApp();
  const { user } = useAuth();

  const [text, setText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [moderationError, setModerationError] = useState(null);

  // Modal State for Source of Trust & Links
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Corporate Finance');
  const [customCategory, setCustomCategory] = useState('');
  const [sourceType, setSourceType] = useState('url'); // 'url' | 'context'
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceContext, setSourceContext] = useState('');
  const [trustError, setTrustError] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Step 1: When user clicks ↳ or presses Cmd+Enter on the main box
  const handleOpenModal = (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    setModerationError(null);

    // 1. Moderation Check
    const check = validateContent(text);
    if (check.isAbusive) {
      setModerationError(check.reason);
      return;
    }

    // Infer title from first line
    const lines = text.trim().split('\n').filter(Boolean);
    const inferredTitle = lines[0].length > 60 ? lines[0].substring(0, 57) + '...' : lines[0];
    setTitle(inferredTitle);

    // Open Source Verification Modal
    setIsModalOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleOpenModal(e);
    }
  };

  // Step 2: Final Publish Submission inside Dialogue Box
  const handleFinalPublish = async (e) => {
    e.preventDefault();
    setTrustError(null);

    // Validate Source of Trust
    if (sourceType === 'url' && (!sourceUrl.trim() || !sourceUrl.includes('.'))) {
      setTrustError('Please provide a valid source article or reference link (e.g. investopedia.com).');
      return;
    }
    if (sourceType === 'context' && !sourceContext.trim()) {
      setTrustError('Please specify course name, lecture, or textbook reference.');
      return;
    }

    setIsPublishing(true);

    const lines = text.trim().split('\n').filter(Boolean);
    const finalCategory = category === 'Other' ? (customCategory.trim() || 'General Knowledge') : category;

    await createPost({
      title: title.trim() || lines[0],
      category: finalCategory,
      summary: title.trim() || lines[0],
      content: text.trim(),
      takeaways: [title.trim() || lines[0]],
      terms: '',
      sourceUrl: sourceType === 'url' ? sourceUrl.trim() : 'Classroom / Lecture Source',
      sourceContext: sourceType === 'context' ? sourceContext.trim() : (sourceUrl.trim() || 'Web Verified Source'),
      author: {
        name: user?.name || "Student Scholar",
        username: user?.username || "learner",
        avatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        role: user?.major || "Student",
        badge: "🌱 Daily Learner"
      }
    });

    setIsPublishing(false);
    setIsModalOpen(false);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    // Reset Form
    setText('');
    setTitle('');
    setSourceUrl('');
    setSourceContext('');
    setCustomCategory('');

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4500);
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-4 py-12 select-none overflow-hidden bg-white">
      {/* MagicUI DotPattern Background with Subtle Radial Gradient Mask */}
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(650px_circle_at_center,white,transparent)] fill-slate-300/70"
        )}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-5">
        
        {/* Sleek Floating Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-primary-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Campus Micro-Learning & Peer Insight Slate</span>
        </div>

        {/* Welcome Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl font-normal text-slate-500 tracking-wide font-sans">
          Hello, Welcome to
        </p>

        {/* ReactBits GradientText + SplitText WILT Title */}
        <div className="relative flex flex-col items-center select-none my-1 w-full max-w-full overflow-hidden">
          <GradientText
            colors={["#5227FF", "#FF9FFC", "#B497CF"]}
            animationSpeed={8}
            showBorder={false}
          >
            <SplitText
              text="WILT"
              className="text-5xl sm:text-8xl md:text-[10.5rem] font-black tracking-tight uppercase leading-none font-display px-2 sm:px-4"
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="0px"
              textAlign="center"
            />
          </GradientText>

          {/* Elegant Expanded Acronym Badge */}
          <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2 text-[9px] sm:text-xs font-extrabold tracking-[0.14em] sm:tracking-[0.22em] text-slate-500 uppercase flex-wrap justify-center">
            <span>WHAT</span>
            <span className="w-1 h-1 rounded-full bg-primary-500 inline-block" />
            <span>I</span>
            <span className="w-1 h-1 rounded-full bg-primary-500 inline-block" />
            <span className="text-primary-600 font-black">LEARNED</span>
            <span className="w-1 h-1 rounded-full bg-primary-500 inline-block" />
            <span>TODAY</span>
          </div>

          {/* Subtle Curved Accent Line */}
          <svg className="w-36 sm:w-60 h-2.5 text-primary-500/70 mt-1.5" viewBox="0 0 200 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7C50 2 150 2 197 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Moderation Error Banner */}
        {moderationError && (
          <div className="w-full max-w-2xl p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{moderationError}</span>
          </div>
        )}

        {/* Success Toast */}
        {isSubmitted && (
          <div className="w-full max-w-2xl p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fadeIn shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Insight & Source of Trust published to Learning Hub! 🎉</span>
            </div>
            <button 
              onClick={() => setCurrentView('discover')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition-all shadow-xs"
            >
              View Hub ➔
            </button>
          </div>
        )}

        {/* Minimal Type & Post Box (Pure White, Zero Shadows/Shades) */}
        <form 
          onSubmit={handleOpenModal}
          className="w-full max-w-2xl mt-4 relative rounded-[24px] sm:rounded-[36px] bg-white border border-slate-300 p-4 sm:p-8 text-left transition-colors focus-within:border-slate-600 box-border overflow-hidden"
        >
          {/* Location 2: Centered Lottie Watermark Animation Floating Inside Text Box Area */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 z-0">
            <div className="w-44 sm:w-56 h-44 sm:h-56">
              <DotLottieReact
                src="https://lottie.host/5e442ac2-7c1a-409d-bd82-e0bb29865217/wWauCc4g7H.lottie"
                loop
                autoplay
              />
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell us what you have learned Today....."
            className="w-full h-40 sm:h-52 bg-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base font-medium leading-relaxed focus:outline-none resize-none pr-10 pb-10 sm:pr-0 sm:pb-0 relative z-10"
          />

          {/* Corner Return Button ↳ */}
          <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-6 flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              ⌘ + Enter to post
            </span>
            <button
              type="submit"
              disabled={!text.trim()}
              title="Click to add links & verify source"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary-600 hover:bg-primary-700 text-white shadow-btn flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              <CornerDownLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* DIALOGUE BOX MODAL: ACQUIRE LINKS & SOURCE OF TRUST */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          {/* Backdrop Blur */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-200 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary-100/70 text-primary-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    Publish & Verify Source
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Add proof/links of where you learned this concept
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Banner inside Modal */}
            {trustError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{trustError}</span>
              </div>
            )}

            <form onSubmit={handleFinalPublish} className="space-y-4">
              {/* Post Title Field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Post Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title for your insight..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>

              {/* Topic Category */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Topic / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-primary-500"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {category === 'Other' && (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Type custom topic name..."
                    className="w-full mt-2 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-primary-400 text-slate-900 font-bold focus:outline-none"
                  />
                )}
              </div>

              {/* Source of Trust Type Toggle */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Source of Trust (Proof)
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSourceType('url')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      sourceType === 'url'
                        ? 'bg-primary-50 text-primary-700 border border-primary-300 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Article / Web Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSourceType('context')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      sourceType === 'context'
                        ? 'bg-primary-50 text-primary-700 border border-primary-300 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Class / Textbook</span>
                  </button>
                </div>

                {sourceType === 'url' ? (
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="Paste reference link (e.g. https://investopedia.com/...)..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  />
                ) : (
                  <input
                    type="text"
                    value={sourceContext}
                    onChange={(e) => setSourceContext(e.target.value)}
                    placeholder="e.g. Econ 101 Lecture with Prof. Smith, Ch. 4..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-primary-600 hover:bg-primary-700 shadow-btn transition-all flex items-center gap-2 transform active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isPublishing ? (
                    <span>Publishing...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Publish & Index Insight 🚀</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotepadLandingView;
