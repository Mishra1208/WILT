import React, { useState } from 'react';
import { AlertTriangle, X, Send, CheckCircle2, Bug, HelpCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { reportBugToSupabase } from '../../services/supabase';

const PAGE_OPTIONS = [
  'Knowledge Quest',
  'Notepad Slate (Landing)',
  'Discover Feed',
  'Dictionary & Glossary',
  'Weekly Quiz',
  'Leaderboard',
  'Revision & Cards',
  'Saved Vault',
  'User Account & Settings',
  'Other / General'
];

const ISSUE_OPTIONS = [
  'UI Display / Visual Glitch',
  'Button / Link Not Working',
  'Wrong Content / Typo',
  'Feature Crashing / Blank Screen',
  'Slow Loading / Performance',
  'Other Issue'
];

export const ReportBugModal = () => {
  const { isReportBugModalOpen, closeReportBugModal } = useApp();
  const [page, setPage] = useState('Knowledge Quest');
  const [issueType, setIssueType] = useState('UI Display / Visual Glitch');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isReportBugModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please describe the problem you encountered.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const bugData = {
      page,
      issueType,
      description: description.trim(),
      email: email.trim()
    };

    await reportBugToSupabase(bugData);

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setPage('Knowledge Quest');
    setIssueType('UI Display / Visual Glitch');
    setDescription('');
    setEmail('');
    setIsSubmitted(false);
    setErrorMsg(null);
    closeReportBugModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
                <Bug className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">
                  Report a Bug
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Found something broken? Let us know so we can fix it right away!
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Field 1: Page Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                1. Which Page or Feature?
              </label>
              <select
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 cursor-pointer"
              >
                {PAGE_OPTIONS.map((p, idx) => (
                  <option key={idx} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Field 2: Issue Type Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                2. What Type of Problem?
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 cursor-pointer"
              >
                {ISSUE_OPTIONS.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Field 3: Problem Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                3. What is the Problem?
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe what happened or what you clicked when the bug occurred..."
                className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
              />
            </div>

            {/* Field 4: Contact Email (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                4. Your Email or Handle <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu or @username"
                className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
              />
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 font-display">
                Bug Report Submitted!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                Thank you for helping us improve WILT! Our development team has received your report and will look into it immediately.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReportBugModal;
