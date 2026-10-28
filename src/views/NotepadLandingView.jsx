import React, { useState, useRef } from 'react';
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
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  Paperclip,
  Tag as TagIcon,
  Compass,
  Zap,
  Trophy
} from 'lucide-react';
import { CATEGORIES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getOrCreateGuestUser } from '../services/storage';
import { validateContent } from '../services/moderation';
import { uploadAttachmentToStorage } from '../services/supabase';
import { cn } from '../lib/utils';
import { useDraftState } from '../hooks/useDraftState';
import { LandingHero } from './landing/LandingHero';
import { FreshNotes } from './landing/FreshNotes';
import { Faq } from './landing/Faq';
import { ClosingCta } from './landing/ClosingCta';
import { useReveal } from './landing/useReveal';
import { topicColor } from '../lib/topicColor';

export const NotepadLandingView = () => {
  const { createPost, setCurrentView, posts, leaderboard, concepts, openPostDetail } = useApp();
  const recentPosts = (posts || []).slice(0, 5);
  const topThree = (leaderboard || []).filter((u) => (u.xp || 0) > 0).slice(0, 3);
  const pageRef = useRef(null);
  useReveal(pageRef, [(posts || []).length]);
  const heroAvatars = [...new Set((posts || []).map((p) => p.author?.avatar).filter(Boolean))].slice(0, 4);

  const scrollToWrite = () => {
    const el = document.getElementById('write');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setIsExpanded(true);
    setTimeout(() => {
      const box = el && el.querySelector('textarea');
      if (box) box.focus({ preventScroll: true });
    }, 600);
  };
  const { user, requireAuth } = useAuth();

  // Layout & Form States
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      return Boolean(localStorage.getItem('wilt_draft_v1_notepad_references') || localStorage.getItem('wilt_draft_v1_notepad_attachments'));
    } catch (e) {
      return false;
    }
  });
  const [title, setTitle] = useDraftState('notepad_title', '');
  const [text, setText] = useDraftState('notepad_text', '');
  const [references, setReferences] = useDraftState('notepad_references', ['']);
  const [attachments, setAttachments] = useDraftState('notepad_attachments', []);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  
  // Status & Moderation
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [publishSynced, setPublishSynced] = useState(true);
  const [moderationError, setModerationError] = useState(null);
  const [referenceError, setReferenceError] = useState(null);

  // Modal State for Topic / Category Selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useDraftState('notepad_category', 'Tech & AI');
  const [customCategory, setCustomCategory] = useDraftState('notepad_custom_category', '');
  const [isPublishing, setIsPublishing] = useState(false);

  // Dynamic Reference List Handlers
  const handleAddReference = () => {
    setReferences(prev => [...prev, '']);
  };

  const handleReferenceChange = (index, value) => {
    if (referenceError) setReferenceError(null);
    setReferences(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleRemoveReference = (index) => {
    setReferences(prev => prev.filter((_, i) => i !== index));
  };

  // Custom Link Dialog Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [inputLinkUrl, setInputLinkUrl] = useState('');
  const [linkError, setLinkError] = useState(null);

  // Attachment Handlers
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAttachment(true);

    try {
      // Upload raw file to Supabase Storage bucket 'attachments'
      const publicUrl = await uploadAttachmentToStorage(file);

      if (publicUrl) {
        const newAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          type: type, // 'image' | 'file'
          url: publicUrl
        };
        setAttachments(prev => [...prev, newAttachment]);
      } else {
        // Fallback: If bucket is not created yet or fails, use local Blob URL (0 network egress)
        const localBlobUrl = URL.createObjectURL(file);
        const newAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          type: type,
          url: localBlobUrl
        };
        setAttachments(prev => [...prev, newAttachment]);
      }
    } catch (err) {
      console.warn('Attachment upload failed:', err);
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const handleOpenLinkModal = () => {
    setInputLinkUrl('');
    setLinkError(null);
    setIsLinkModalOpen(true);
  };

  const handleConfirmAddLink = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputLinkUrl.trim();
    if (!trimmed) {
      setLinkError('Please enter a valid URL link');
      return;
    }
    
    let formattedUrl = trimmed;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newAttachment = {
      id: Date.now(),
      name: formattedUrl.replace(/^https?:\/\//, ''),
      type: 'link',
      url: formattedUrl
    };
    setAttachments(prev => [...prev, newAttachment]);
    setIsLinkModalOpen(false);
  };

  // Step 1: Open Topic / Category Selection Modal
  const handleOpenModal = (e) => {
    if (e) e.preventDefault();
    if (!requireAuth()) return;
    if (!text.trim() && !title.trim()) return;

    setModerationError(null);
    setReferenceError(null);

    // Reference Check: Ensure at least one reference is provided
    const activeReferences = references.filter(r => r && r.trim() !== "");
    if (activeReferences.length === 0) {
      setReferenceError("A reference/source is required to post. Please provide at least one link, book, or paper source.");
      setIsExpanded(true);
      return;
    }

    // Moderation Check
    const check = validateContent(title, text, ...references);
    if (!check.isClean) {
      setModerationError(check.reason);
      return;
    }

    // Auto-infer title if user didn't specify
    if (!title.trim()) {
      const lines = text.trim().split('\n').filter(Boolean);
      const inferredTitle = lines[0] ? (lines[0].length > 60 ? lines[0].substring(0, 57) + '...' : lines[0]) : 'New Learning Insight';
      setTitle(inferredTitle);
    }

    setIsModalOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleOpenModal(e);
    }
  };

  // Step 2: Final Publish Submission
  const handleFinalPublish = async (e) => {
    e.preventDefault();

    const activeReferences = references.filter(r => r && r.trim() !== "");
    if (activeReferences.length === 0) {
      setReferenceError("A reference/source is required to post.");
      setIsModalOpen(false);
      setIsExpanded(true);
      return;
    }

    const categoryCheck = validateContent(customCategory);
    if (!categoryCheck.isClean) {
      setModerationError(categoryCheck.reason);
      setIsModalOpen(false);
      return;
    }

    setIsPublishing(true);

    const finalCategory = category === 'Other' ? (customCategory.trim() || 'General Knowledge') : category;

    const activeUser = user || getOrCreateGuestUser();

    // Convert ALL activeReferences into attachment objects (links or text sources) to guarantee persistence in Supabase concepts table
    const finalAttachments = [...attachments];
    activeReferences.forEach((refStr) => {
      const trimmed = refStr.trim();
      if (!trimmed) return;

      const isUrl = /^(https?:\/\/|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i.test(trimmed);

      if (isUrl) {
        const formattedUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
        if (!finalAttachments.some((a) => a.url === formattedUrl)) {
          finalAttachments.push({
            id: `att-link-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: trimmed,
            type: 'link',
            url: formattedUrl
          });
        }
      } else {
        if (!finalAttachments.some((a) => a.name === trimmed)) {
          finalAttachments.push({
            id: `att-ref-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: trimmed,
            type: 'reference_source',
            url: ''
          });
        }
      }
    });

    const primarySource = activeReferences[0] || (finalAttachments[0] ? finalAttachments[0].url || finalAttachments[0].name : 'Self-Learned Insight');
    const additionalSources = activeReferences.slice(1).join(', ');

    const created = await createPost({
      title: title.trim() || 'Daily Learning Note',
      category: finalCategory,
      summary: title.trim() || text.trim().substring(0, 80),
      content: text.trim(),
      keyTakeaways: [title.trim() || 'Key Insight'],
      terms: [],
      sourceUrl: primarySource,
      sourceContext: additionalSources || 'Verified Learner Post',
      attachments: finalAttachments,
      author: {
        name: `@${activeUser.username}`,
        username: activeUser.username,
        avatar: activeUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        role: activeUser.major || "Student Scholar",
        badge: "🌱 Daily Learner"
      }
    });

    setIsPublishing(false);
    setIsModalOpen(false);
    setPublishSynced(Boolean(created?.synced));
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
    setReferences(['']);
    setAttachments([]);
    setCustomCategory('');
    setIsExpanded(false);
    setReferenceError(null);

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4500);
  };

  return (
    <div ref={pageRef} className="bg-paper">
      <LandingHero
        onBrowse={() => setCurrentView('discover')}
        notesCount={(posts || []).length}
        avatars={heroAvatars}
      >
        {/* Moderation Error Banner */}
        {moderationError && (
          <div className="w-full p-3.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{moderationError}</span>
          </div>
        )}

        {/* Success Toast */}
        {isSubmitted && (
          <div className={cn(
            "w-full p-4 rounded-lg border text-sm font-semibold flex items-center justify-between gap-3 animate-fadeIn shadow-sm",
            publishSynced ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-amber-50 border-amber-300 text-amber-900"
          )}>
            <div className="flex items-center gap-2.5 text-left">
              {publishSynced
                ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                : <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />}
              <span>
                {publishSynced
                  ? 'Insight published to Learning Hub! 🎉'
                  : "Saved on this device only — we couldn't reach the server, so other students can't see it yet. Please check your connection."}
              </span>
            </div>
            <button 
              onClick={() => setCurrentView('discover')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition-all shadow-xs"
            >
              View Hub ➔
            </button>
          </div>
        )}

        {/* DYNAMIC EXPANDABLE TYPE & POST BOX */}
        <form 
          onSubmit={handleOpenModal}
          onClick={() => setIsExpanded(true)}
          className={cn(
            "w-full relative rounded-[28px] bg-white border p-6 sm:p-8 text-left box-border shadow-[0_30px_60px_-36px_rgba(30,30,30,0.45)] transition-colors",
            isExpanded ? "border-ink/40" : "border-line hover:border-ink/25"
          )}
        >
          {/* 1. TOP TITLE FIELD (Revealed on click/focus) */}
          {isExpanded && (
            <div className="mb-3 pb-3 border-b border-slate-100 animate-fadeIn">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title / Heading of your insight..."
                className="w-full text-xl sm:text-2xl font-bold tracking-[-0.02em] text-ink placeholder-muted/70 focus:outline-none bg-transparent"
              />
            </div>
          )}

          {(title.trim() || text.trim()) && (
            <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-md bg-ink text-xs font-medium text-white">
              Draft saved on this device
            </div>
          )}

          {/* 2. MAIN CONTENT TEXTAREA & RIGHT SIDE ATTACHMENTS TOOLBAR */}
          <div className="flex gap-3 sm:gap-4 items-start relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onKeyDown={handleKeyDown}
              placeholder={isExpanded ? "Explain it the way you'd tell a friend: what it is, why it matters, an example…" : "e.g. Why EBITDA isn't the same as cash flow…"}
              className={cn(
                "ruled w-full bg-transparent text-ink placeholder-muted/70 text-[18px] leading-[36px] focus:outline-none resize-none",
                isExpanded ? "h-[180px] sm:h-[216px]" : "h-[144px] sm:h-[180px]"
              )}
            />

            {/* RIGHT SIDE ATTACHMENT ACTION BAR */}
            <div className="flex flex-col gap-1 shrink-0">
              {/* Photo Upload Button */}
              <label 
                title="Attach Photo / Image" 
                className="w-9 h-9 rounded-md text-muted hover:text-ink hover:bg-haze flex items-center justify-center cursor-pointer transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'image')} 
                />
              </label>

              {/* Document File Upload Button */}
              <label 
                title="Attach Document / PDF" 
                className="w-9 h-9 rounded-md text-muted hover:text-ink hover:bg-haze flex items-center justify-center cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4" />
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'file')} 
                />
              </label>

              {/* URL Link Attachment Button */}
              <button
                type="button"
                onClick={handleOpenLinkModal}
                title="Attach Reference Link"
                className="w-9 h-9 rounded-md text-muted hover:text-ink hover:bg-haze flex items-center justify-center cursor-pointer transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ATTACHMENTS PREVIEW CHIPS */}
          {(attachments.length > 0 || isUploadingAttachment) && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
              {isUploadingAttachment && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-primary-600 animate-spin" />
                  <span>Uploading to cloud storage...</span>
                </div>
              )}
              {attachments.map(att => (
                <div key={att.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary-50 border border-primary-200 text-primary-800 text-xs font-bold">
                  {att.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-primary-600" />}
                  {att.type === 'file' && <FileText className="w-3.5 h-3.5 text-primary-600" />}
                  {att.type === 'link' && <LinkIcon className="w-3.5 h-3.5 text-primary-600" />}
                  <span className="max-w-[150px] truncate">{att.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                    className="w-4 h-4 rounded-full hover:bg-primary-200 text-primary-600 flex items-center justify-center ml-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 3. REFERENCE LIST BOXES SECTION (With + Button) */}
          {isExpanded && (
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Reference List / Sources</span>
                  <span className="text-rose-500 font-bold text-[11px] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    * Required
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleAddReference}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-primary-600" />
                  <span>Add Reference</span>
                </button>
              </div>

              {/* Reference Error Warning */}
              {referenceError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{referenceError}</span>
                </div>
              )}

              <div className="space-y-2">
                {references.map((refItem, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={refItem}
                        onChange={(e) => handleReferenceChange(idx, e.target.value)}
                        placeholder={`Reference ${idx + 1} link / book / paper source...`}
                        className={cn(
                          "w-full px-3.5 py-1.5 text-xs rounded-xl border text-slate-900 font-medium focus:outline-none transition-all",
                          referenceError && !refItem.trim()
                            ? "bg-rose-50/60 border-rose-300 focus:border-rose-500 focus:bg-white"
                            : "bg-slate-50 border-slate-200 focus:border-primary-500 focus:bg-white"
                        )}
                      />
                    </div>
                    {references.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveReference(idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON & SHORTCUT */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 hidden sm:inline">
              ⌘ + Enter to post
            </span>
            <button
              type="submit"
              disabled={!text.trim() && !title.trim()}
              className="btn-marker px-6 py-3 flex items-center gap-2 text-[15px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ml-auto"
            >
              <span>Post</span>
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </div>
        </form>

      </LandingHero>

      <FreshNotes posts={posts || []} onOpen={(p) => requireAuth(() => openPostDetail(p))} onSeeAll={() => setCurrentView('discover')} />


      <Faq />
      <ClosingCta onWrite={scrollToWrite} />

      {/* TOPIC / CATEGORY SELECTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          {/* Backdrop */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-200 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary-100/70 text-primary-600">
                  <TagIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    Select Topic / Category
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Choose where to file this insight in the hub
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

            {/* Post Preview Summary */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-xs font-bold text-slate-900 line-clamp-1">
                {title || 'Untitled Insight'}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {text}
              </div>
            </div>

            <form onSubmit={handleFinalPublish} className="space-y-4">
              {/* Category Selector */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Topic / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-primary-500 cursor-pointer"
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
                    className="w-full mt-2 px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-primary-400 text-slate-900 font-bold focus:outline-none"
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
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-primary-600 hover:bg-primary-700 shadow-btn transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isPublishing ? (
                    <span>Publishing...</span>
                  ) : (
                    <span>Post</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM IN-APP LINK ATTACHMENT DIALOG MODAL */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          {/* Backdrop */}
          <div 
            onClick={() => setIsLinkModalOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-200 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary-100/70 text-primary-600">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    Attach Reference Link
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Paste article, repository, or website URL
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {linkError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{linkError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmAddLink} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Reference URL
                </label>
                <div className="relative flex items-center">
                  <LinkIcon className="w-4 h-4 absolute left-3.5 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    autoFocus
                    required
                    value={inputLinkUrl}
                    onChange={(e) => setInputLinkUrl(e.target.value)}
                    placeholder="https://investopedia.com/... or github.com/..."
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-primary-600 hover:bg-primary-700 shadow-btn transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Attach Link</span>
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
