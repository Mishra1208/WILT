import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Sigma,
  ShieldCheck,
  AlertTriangle,
  Link as LinkIcon,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { CATEGORIES } from '../../data/seedData';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { MathSymbolRibbon } from '../tools/MathSymbolRibbon';
import { validateContent } from '../../services/moderation';

export const NewPostModal = () => {
  const { isNewPostModalOpen, setIsNewPostModalOpen, createPost } = useApp();
  const { user } = useAuth();

  const textareaRef = useRef(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Accounting');
  const [customCategory, setCustomCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [takeaways, setTakeaways] = useState(['']);
  const [terms, setTerms] = useState('');

  // Source of Trust
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceContext, setSourceContext] = useState('');

  // Errors
  const [moderationError, setModerationError] = useState(null);
  const [trustError, setTrustError] = useState(null);

  const [isMathRibbonOpen, setIsMathRibbonOpen] = useState(false);

  if (!isNewPostModalOpen) return null;

  const handleInsertSymbol = (symbolText) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const prev = content;
      const newText = prev.substring(0, start) + symbolText + prev.substring(end);
      setContent(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + symbolText.length, start + symbolText.length);
      }, 50);
    } else {
      setContent((prev) => prev + " " + symbolText);
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setModerationError(null);
    setTrustError(null);

    // 1. Profanity check
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
      return;
    }

    // 2. Source of Trust check (Link OR Location required)
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

    createPost({
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
        badge: "🌱 Knowledge Sharer"
      }
    });

    setTitle('');
    setCustomCategory('');
    setSummary('');
    setContent('');
    setTakeaways(['']);
    setTerms('');
    setSourceUrl('');
    setSourceContext('');
  };

  const hasTrustSource = sourceUrl.trim().length > 0 || sourceContext.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Share What You Learned Today
              </h2>
              <p className="text-xs text-slate-500">
                Teach a concept in 30 seconds for your peers
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewPostModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abusive Language Error */}
        {moderationError && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-900 space-y-1.5 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>Post Blocked by Content Filter</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed font-medium pl-6">
              {moderationError}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category / Topic
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 font-semibold"
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
                  placeholder="Type custom topic..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border-2 border-primary-500 text-slate-900 font-bold focus:outline-none animate-fadeIn"
                />
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Post Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to calculate Fixed Assets in 10 seconds"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Summary / One-Liner Hook
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short explanation of why this is helpful"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 font-medium"
            />
          </div>

          {/* Math & Symbol Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Math & Tools:
              </span>
              <button
                type="button"
                onClick={() => setIsMathRibbonOpen(!isMathRibbonOpen)}
                className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isMathRibbonOpen
                    ? 'bg-primary-600 text-white shadow-btn'
                    : 'bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200'
                }`}
              >
                <Sigma className="w-3.5 h-3.5" />
                <span>Math & Formula Palette</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1">
              {['α', 'β', 'Δ', 'σ', 'μ', '∑', '√x', '±', '≈', '≠', '≤', '≥'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => handleInsertSymbol(sym)}
                  className="w-6 h-6 rounded-md bg-slate-50 hover:bg-primary-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 hover:text-primary-700 flex items-center justify-center transition-all"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {isMathRibbonOpen && (
            <MathSymbolRibbon
              onInsertSymbol={handleInsertSymbol}
              onInsertFormula={(formulaText) => handleInsertSymbol(formulaText)}
              onClose={() => setIsMathRibbonOpen(false)}
            />
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Explanation & Mental Model
            </label>
            <textarea
              ref={textareaRef}
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explain clearly in simple terms, include formulas, analogies, or code blocks..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 font-sans leading-relaxed"
            />
          </div>

          {/* SOURCE OF TRUST (Mandatory Requirement 2) */}
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-primary-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 uppercase">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
                <span>Source of Trust & Verification (Required)</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                hasTrustSource 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {hasTrustSource ? '✓ Provided' : '⚠️ Option 1 OR 2 Required'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-primary-600" />
                  <span>Option 1: Reference Link</span>
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => {
                    setSourceUrl(e.target.value);
                    setTrustError(null);
                  }}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-coral-500" />
                  <span>Option 2: Where did you learn it?</span>
                </label>
                <input
                  type="text"
                  value={sourceContext}
                  onChange={(e) => {
                    setSourceContext(e.target.value);
                    setTrustError(null);
                  }}
                  placeholder="e.g. Notice board / Econ 101 Lecture"
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900"
                />
              </div>
            </div>

            {trustError && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{trustError}</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Key Takeaways (Used in Weekly Quizzes)
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
                    placeholder={`Takeaway #${idx + 1}`}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 font-medium"
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Extract Terms into Community Glossary (comma separated)
            </label>
            <input
              type="text"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="e.g. Fixed Assets, Depreciation, CapEx"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewPostModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || !hasTrustSource}
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-btn transition-all transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Publish Verified Insight</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
