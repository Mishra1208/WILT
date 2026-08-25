import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Plus,
  Trash2,
  Zap,
  BookOpen,
  Trophy,
  Brain,
  Layers,
  Code,
  Sigma,
  ListCheck,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  Link as LinkIcon,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { CATEGORIES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { MathSymbolRibbon } from '../components/tools/MathSymbolRibbon';
import { validateContent } from '../services/moderation';
import { MaskedHeading } from '../components/ui/MaskedHeading';

export const NotepadLandingView = () => {
  const { createPost, setCurrentView, openPostDetail, posts } = useApp();
  const { user } = useAuth();

  const textareaRef = useRef(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Corporate Finance');
  const [customCategory, setCustomCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [takeaways, setTakeaways] = useState(['']);
  const [terms, setTerms] = useState('');
  
  // Source of Trust state (Requirement 2)
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceContext, setSourceContext] = useState('');

  // Validation feedback state (Requirement 1 & 2)
  const [moderationError, setModerationError] = useState(null);
  const [trustError, setTrustError] = useState(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedPost, setSubmittedPost] = useState(null);
  const [isMathRibbonOpen, setIsMathRibbonOpen] = useState(false);

  const handleAddTakeaway = () => {
    setTakeaways([...takeaways, '']);
  };

  const handleUpdateTakeaway = (index, value) => {
    const updated = [...takeaways];
    updated[index] = value;
    setTakeaways(updated);
  };

  const handleRemoveTakeaway = (index) => {
    setTakeaways(takeaways.filter((_, i) => i !== index));
  };

  const handleInsertSymbol = (symbolText) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const prev = content;
      const newText = prev.substring(0, start) + symbolText + prev.substring(end);
      setContent(newText);
      // Restore cursor position right after inserted symbol
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + symbolText.length, start + symbolText.length);
      }, 50);
    } else {
      setContent((prev) => prev + " " + symbolText);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModerationError(null);
    setTrustError(null);

    // 1. PROFANITY & ABUSIVE LANGUAGE FILTER (Requirement 1)
    const moderationCheck = validateContent(
      title,
      summary,
      content,
      ...takeaways,
      terms,
      sourceContext
    );

    if (!moderationCheck.isClean) {
      setModerationError(
        `⚠️ Community Guidelines Violation: Inappropriate or abusive language detected ("${moderationCheck.abusiveWord}"). WILT is an academic student community. Please revise your text before posting.`
      );
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    // 2. SOURCE OF TRUST VALIDATION (Requirement 2)
    // Must fill EITHER sourceUrl OR sourceContext (or both)
    if (!sourceUrl.trim() && !sourceContext.trim()) {
      setTrustError(
        `🛡️ Source of Trust Required: Please provide either a reference link (where you got the info) or specify where you learned it (e.g. 'I saw it on the notice board', 'Prof. Miller's Econ Lecture') to guarantee credibility for your peers.`
      );
      return;
    }

    const filteredTakeaways = takeaways.filter((t) => t.trim() !== '');
    const extractedTerms = terms
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const finalCategory = category === 'Other' 
      ? (customCategory.trim() || 'Other') 
      : category;

    const newPost = createPost({
      title,
      category: finalCategory,
      summary: summary || title,
      content,
      keyTakeaways: filteredTakeaways.length > 0 ? filteredTakeaways : [title],
      terms: extractedTerms,
      sourceUrl: sourceUrl.trim() || null,
      sourceContext: sourceContext.trim() || null,
      author: {
        name: user?.name || "Student Scholar",
        username: user?.username || "learner",
        avatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        role: user?.major || "Student",
        badge: "🌱 Daily Learner"
      }
    });

    setSubmittedPost(newPost);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    // Reset fields
    setTitle('');
    setCustomCategory('');
    setSummary('');
    setContent('');
    setTakeaways(['']);
    setTerms('');
    setSourceUrl('');
    setSourceContext('');
    setIsMathRibbonOpen(false);
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const hasTrustSource = sourceUrl.trim().length > 0 || sourceContext.trim().length > 0;

  return (
    <div className="py-5 sm:py-8 px-3 sm:px-6 max-w-5xl mx-auto space-y-8 sm:space-y-10 animate-fadeIn">
      {/* Top ReactBits Masked Heading with Animated Hand-Drawn Scribble */}
      <MaskedHeading />

      {/* ABUSIVE LANGUAGE ERROR BANNER */}
      {moderationError && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-900 space-y-1.5 animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>Post Blocked by Content Filter</span>
          </div>
          <p className="text-xs text-rose-800 leading-relaxed font-medium pl-7">
            {moderationError}
          </p>
        </div>
      )}

      {/* STYLISH DIGITAL NOTEPAD SLATE BOX */}
      <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden transition-all">
        {/* Notepad Top Header Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-400 inline-block" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400 inline-block" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 inline-block" />
            <span className="text-[11px] sm:text-xs font-mono font-semibold text-slate-500 ml-1.5">
              📅 {currentDateStr}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Topic:
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2.5 sm:px-3 py-1 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-primary-500 cursor-pointer"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Custom Topic Input if "Other" is chosen */}
            {category === 'Other' && (
              <input
                type="text"
                required
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type custom topic..."
                className="px-2.5 sm:px-3 py-1 text-xs rounded-xl bg-white border-2 border-primary-500 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-100 animate-fadeIn"
              />
            )}
          </div>
        </div>

        {/* Notepad Typing Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-5">
          {/* Post Title */}
          <div className="space-y-1">
            <label className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g. How to calculate Fixed Assets in 10 seconds)..."
              className="w-full text-base sm:text-xl font-extrabold text-slate-900 placeholder-slate-300 focus:outline-none border-b border-slate-100 pb-2"
            />
          </div>

          {/* Quick Summary / Hook */}
          <div className="space-y-1">
            <label className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              One-Sentence Teaser (Optional)
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief 1-sentence teaser explaining why this is helpful..."
              className="w-full text-xs sm:text-sm text-slate-600 placeholder-slate-300 focus:outline-none"
            />
          </div>

          {/* MS WORD STYLE SYMBOL & FORMULA TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Math & Tools:
              </span>

              {/* MS WORD EQUATION / FORMULA PALETTE BUTTON */}
              <button
                type="button"
                onClick={() => setIsMathRibbonOpen(!isMathRibbonOpen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  isMathRibbonOpen
                    ? 'bg-primary-600 text-white shadow-btn'
                    : 'bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200'
                }`}
              >
                <Sigma className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Math & Finance Equation Palette</span>
                <span className="sm:hidden">Math Palette</span>
                {isMathRibbonOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                )}
              </button>
            </div>

            {/* Quick Symbol Shortcuts */}
            <div className="hidden sm:flex items-center gap-1">
              {['α', 'β', 'Δ', 'σ', 'μ', '∑', '√x', '±', '≈', '≠', '≤', '≥'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => handleInsertSymbol(sym)}
                  className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 text-xs font-mono font-bold text-slate-800 hover:text-primary-700 flex items-center justify-center transition-all active:scale-95"
                  title={`Insert ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* EXPANDABLE MS WORD STYLE EQUATION RIBBON */}
          {isMathRibbonOpen && (
            <MathSymbolRibbon
              onInsertSymbol={handleInsertSymbol}
              onInsertFormula={(formulaText) => handleInsertSymbol(formulaText)}
              onClose={() => setIsMathRibbonOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your explanation, mental model, or formula here... Write it so any college student can understand in 30 seconds."
              className="w-full p-4 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 leading-relaxed font-sans"
            />
          </div>

          {/* SOURCE OF TRUST / CITATION SECTION (Mandatory Requirement 2) */}
          <div className="p-5 rounded-2xl bg-slate-50 border-2 border-primary-100 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
                <span>Source of Trust & Verification (Required)</span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                hasTrustSource 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {hasTrustSource ? '✓ Source Provided' : '⚠️ Fill Option 1 OR Option 2'}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              To guarantee that peer learning notes are true and credible, you must provide <strong>at least one</strong> source of trust before publishing:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Option 1: Reference URL */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-primary-600" />
                  <span>Option 1: Reference Link / URL</span>
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => {
                    setSourceUrl(e.target.value);
                    setTrustError(null);
                  }}
                  placeholder="e.g. https://investopedia.com/terms/..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 font-mono"
                />
              </div>

              {/* Option 2: Offline Learning Context / Location */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-coral-500" />
                  <span>Option 2: Where did you learn this?</span>
                </label>
                <input
                  type="text"
                  value={sourceContext}
                  onChange={(e) => {
                    setSourceContext(e.target.value);
                    setTrustError(null);
                  }}
                  placeholder="e.g. I saw it on the economics notice board / Econ 101 Lecture"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Trust error alert */}
            {trustError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{trustError}</span>
              </div>
            )}
          </div>

          {/* Key Takeaways Builder */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-600" />
                <span>Key Takeaways (Used to auto-generate weekly MCQs)</span>
              </label>
              <button
                type="button"
                onClick={handleAddTakeaway}
                className="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            <div className="space-y-2">
              {takeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={takeaway}
                    onChange={(e) => handleUpdateTakeaway(idx, e.target.value)}
                    placeholder={`Takeaway bullet #${idx + 1}`}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500"
                  />
                  {takeaways.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTakeaway(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Glossary Terms to Extract */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Extract Terms to Community Dictionary (comma separated)
            </label>
            <input
              type="text"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="e.g. Fixed Assets, Depreciation, CapEx"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Submit Action Button */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 font-mono text-center sm:text-left">
              {content.length} characters written
            </span>

            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || !hasTrustSource}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-btn hover:shadow-hover transition-all transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Publish & Index Insight 🚀</span>
            </button>
          </div>
        </form>
      </div>

      {/* Success Notification Banner */}
      {isSubmitted && submittedPost && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                Insight Published Successfully!
              </h4>
              <p className="text-xs text-emerald-800">
                "{submittedPost.title}" is verified and active in the feed and glossary.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openPostDetail(submittedPost)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              View Card
            </button>
            <button
              onClick={() => setCurrentView('discover')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-colors"
            >
              Go to Feed ➔
            </button>
          </div>
        </div>
      )}

      {/* EXPLORE ALL FEATURES BANNER */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white shadow-hover flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
            Full Campus Platform
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Ready to explore feeds, quizzes & leaderboard?
          </h3>
          <p className="text-xs sm:text-sm text-primary-100 max-w-xl">
            Access the complete student dashboard with the Discover Feed, Weekly Active Recall Quiz (+150 XP), University Leaderboard, and Peer Glossary.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('discover')}
          className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 self-start md:self-auto flex-shrink-0"
        >
          <span>Explore All Features</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
