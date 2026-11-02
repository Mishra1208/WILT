import React, { useEffect, useState } from 'react';
import { PenLine } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { goWrite } from '../../lib/goWrite';

/**
 * Floating pen in the bottom-right corner of every page. One click (or the
 * "N" key) takes the student to the notebook with the cursor ready.
 * On the home page it hides while the notebook itself is on screen.
 */
export const WriteFab = () => {
  const { currentView, setCurrentView } = useApp();
  const [notebookVisible, setNotebookVisible] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  // On the home page, hide while the notebook is visible
  useEffect(() => {
    if (currentView !== 'notepad') {
      setNotebookVisible(false);
      return undefined;
    }
    let io;
    const t = setTimeout(() => {
      const el = document.getElementById('write');
      if (!el || !('IntersectionObserver' in window)) return;
      io = new IntersectionObserver(([entry]) => setNotebookVisible(entry.isIntersecting), { threshold: 0.15 });
      io.observe(el);
    }, 300);
    return () => {
      clearTimeout(t);
      if (io) io.disconnect();
    };
  }, [currentView]);

  // A little wiggle every so often so it gets noticed (skipped for reduced motion)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 900);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  // "N" anywhere (while not typing) starts a new note
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'n' && e.key !== 'N') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target?.isContentEditable) return;
      e.preventDefault();
      goWrite(currentView, setCurrentView);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentView, setCurrentView]);

  const hidden = currentView === 'notepad' && notebookVisible;

  return (
    <button
      onClick={() => goWrite(currentView, setCurrentView)}
      aria-label="Write today's note"
      title="Write today's note (N)"
      className={`group fixed z-40 right-5 bottom-5 sm:right-7 sm:bottom-7 h-14 sm:h-16 pl-[18px] sm:pl-5 pr-[18px] sm:pr-5 rounded-full bg-ink text-white
        flex items-center gap-0 hover:gap-2.5 shadow-[0_18px_40px_-14px_rgba(30,30,30,0.65)]
        transition-all duration-300 ease-out cursor-pointer
        ${hidden ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'}`}
    >
      {/* soft orange ring that pulses behind the pen */}
      <span className="absolute inset-0 rounded-full ring-2 ring-marker-orange/60 animate-ping-slow pointer-events-none" aria-hidden="true" />
      <span className={`relative w-7 h-7 rounded-full bg-marker-orange text-ink flex items-center justify-center shrink-0 ${wiggle ? 'animate-pen-wiggle' : ''}`}>
        <PenLine className="w-4 h-4" />
      </span>
      <span className="relative max-w-0 overflow-hidden whitespace-nowrap text-[15px] font-semibold transition-all duration-300 ease-out group-hover:max-w-[180px] group-focus-visible:max-w-[180px]">
        Write today's note
      </span>
      <kbd className="relative hidden lg:group-hover:inline-flex items-center justify-center w-5 h-5 rounded bg-white/15 text-[11px] font-semibold">N</kbd>
    </button>
  );
};

export default WriteFab;
