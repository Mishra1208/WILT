import React from 'react';

/**
 * Typographic page header: a big left-aligned title, a short description set in
 * the reading serif, and an optional action on the right. Filters (tabs) sit
 * underneath on a hairline. The section colour shows only in the small solid
 * mark beside the title and in the active tab.
 */
export const PageHero = ({ icon: Icon, title, description, aside, children, className = '' }) => (
  <header className={`pt-2 ${className}`}>
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
      <div className="max-w-2xl">
        <h1 className="text-[2.2rem] sm:text-[2.9rem] font-bold text-ink leading-none tracking-[-0.04em]">{title}</h1>
        {description && (
          <p className="mt-3 font-serif text-lg sm:text-xl text-muted leading-snug">{description}</p>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
    {children && <div className="mt-6">{children}</div>}
  </header>
);

/** Inline figure: number over label, separated from neighbours by a hairline */
export const HeroStat = ({ value, label }) => (
  <div className="pr-5 mr-5 border-r border-line last:border-r-0 last:mr-0 last:pr-0">
    <div className="text-2xl font-bold text-ink leading-none tabular-nums">{value}</div>
    <div className="text-sm text-muted mt-1">{label}</div>
  </div>
);

/** Underlined tab used for filters */
export const HeroChip = ({ active, children, ...props }) => (
  <button
    {...props}
    className={`relative px-1 pb-3 pt-1 mr-5 text-[15px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
      active ? 'text-ink' : 'text-muted hover:text-ink'
    }`}
  >
    {children}
    <span
      className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-colors ${active ? 'bg-primary-700' : 'bg-transparent'}`}
    />
  </button>
);

/** Wrapper that draws the hairline under a row of HeroChips */
export const TabRow = ({ children, className = '' }) => (
  <div className={`flex items-end overflow-x-auto no-scrollbar border-b border-line ${className}`}>{children}</div>
);

/** Primary action for the header's right side */
export const HeroAction = ({ icon: Icon, children, ...props }) => (
  <button
    {...props}
    className="btn-iris w-full lg:w-auto px-5 py-3 rounded-lg font-semibold text-[15px] flex items-center justify-center gap-2 cursor-pointer"
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
);

export default PageHero;
