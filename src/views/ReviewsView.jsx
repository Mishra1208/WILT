import React, { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Lock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchReviews, sendReview } from '../services/reviewsService';
import { useReveal } from './landing/useReveal';
import { Sparkle, Squiggle, Smiley } from './landing/Doodles';
import { cn } from '../lib/utils';

const MAX_LEN = 500;

// Card looks cycle through the WILT marker colours, each at a slight angle
const CARD_STYLES = [
  { bg: 'bg-white', tilt: '-rotate-[1deg]', dot: 'bg-marker-orange' },
  { bg: 'bg-highlight/60', tilt: 'rotate-[1.2deg]', dot: 'bg-ink' },
  { bg: 'bg-[#E3F4EA]', tilt: '-rotate-[0.6deg]', dot: 'bg-marker-green' },
  { bg: 'bg-white', tilt: 'rotate-[0.8deg]', dot: 'bg-marker-blue' },
  { bg: 'bg-[#E5F0FC]', tilt: '-rotate-[1.4deg]', dot: 'bg-marker-blue' },
  { bg: 'bg-[#FFE8DD]', tilt: 'rotate-[0.5deg]', dot: 'bg-marker-orange' }
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const StarIcon = ({ filled, className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const Stars = ({ value, size = 'w-4 h-4', className = '' }) => (
  <div className={cn('flex items-center gap-0.5 text-ink', className)} aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <StarIcon key={n} filled={n <= Math.round(value)} className={size} />
    ))}
  </div>
);

const RATING_WORDS = ['', 'Not for me', 'Could be better', 'It’s good', 'Really good', 'Love it!'];

/** Big clickable stars for the form */
const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div>
      <div className="flex items-center gap-1.5" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            className={cn(
              'transition-transform duration-200 cursor-pointer',
              n <= shown ? 'text-highlight scale-110' : 'text-white/35 hover:text-white/60',
              value === n && 'animate-pen-wiggle'
            )}
          >
            <StarIcon filled={n <= shown} className="w-9 h-9" />
          </button>
        ))}
      </div>
      <div className="mt-2 h-6 font-hand text-[20px] text-highlight">{RATING_WORDS[shown]}</div>
    </div>
  );
};

export const ReviewsView = () => {
  const { user, isLoggedIn, requireAuth } = useAuth();
  const root = useRef(null);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetchReviews().then(({ reviews: list }) => {
      setReviews(list);
      setLoading(false);
    });
  }, []);

  // Sensible defaults from the student's profile
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    if (!name) setName(user.username ? `@${user.username}` : '');
    const uni = user.university || '';
    if (!college && uni && !/university scholar|anonymous/i.test(uni)) setCollege(uni);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoggedIn]);

  useReveal(root, [reviews.length]);

  const stats = useMemo(() => {
    const n = reviews.length;
    const avg = n ? reviews.reduce((s, r) => s + r.rating, 0) / n : 0;
    const dist = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }));
    return { n, avg, dist };
  }, [reviews]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    setError(null);
    if (!rating) return setError('Tap the stars to give a rating.');
    if (text.trim().length < 20) return setError('Write at least a sentence so others know what you think.');
    setSending(true);
    const result = await sendReview({ name: name.trim(), college: college.trim(), rating, review: text.trim(), userId: user?.id || user?.username || '' });
    setSending(false);
    if (result.error) return setError(result.error);
    setSent(true);
    setText('');
    setRating(0);
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.55 }, colors: ['#FF6B35', '#2DB463', '#4F9DEB', '#FFD66B'] });
    } catch {
      /* ignore */
    }
  };

  const quotes = reviews.filter((r) => r.text.length <= 140).slice(0, 10);

  return (
    <div ref={root} className="bg-paper pb-20">
      {/* ---------- Hero ---------- */}
      <section className="relative px-5 sm:px-8 pt-10 sm:pt-16 pb-12 sm:pb-16 overflow-hidden">
        <Squiggle className="hidden md:block absolute right-12 top-14 w-28 text-marker-green" />
        <Sparkle className="absolute right-[38%] top-10 w-7 text-highlight" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <div className="font-hand text-[22px] text-marker-orange">Reviews</div>
            <h1 data-reveal="words" className="mt-2 text-ink font-semibold leading-[1.02] tracking-[-0.055em] text-[clamp(2.6rem,6vw,4.8rem)]">
              What students say about WILT
            </h1>
            <p data-reveal="up" className="mt-5 max-w-xl text-[18px] sm:text-[20px] leading-relaxed text-muted">
              Honest words from the people who write a note a day. Using WILT? Tell us how it's going — the good and the could-be-better.
            </p>
          </div>

          {/* Rating summary */}
          <div data-reveal="up" className="lg:col-span-5">
            <div className="relative rounded-[28px] bg-white p-6 sm:p-7 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.5)]">
              {stats.n > 0 ? (
                <div className="flex items-center gap-6">
                  <div className="text-center shrink-0">
                    <div className="text-[64px] font-bold tracking-[-0.05em] leading-none text-ink tabular-nums">{stats.avg.toFixed(1)}</div>
                    <Stars value={stats.avg} className="mt-2 justify-center" />
                    <div className="mt-1.5 text-[13px] text-muted">{stats.n} review{stats.n === 1 ? '' : 's'}</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {stats.dist.map((d) => (
                      <div key={d.star} className="flex items-center gap-2 text-[13px] text-muted">
                        <span className="w-3 tabular-nums">{d.star}</span>
                        <div className="flex-1 h-2.5 rounded-full bg-paper overflow-hidden">
                          <div
                            className="h-full rounded-full bg-marker-orange transition-[width] duration-1000 ease-out"
                            style={{ width: `${stats.n ? (d.count / stats.n) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="w-5 text-right tabular-nums">{d.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Smiley className="w-14 mx-auto text-ink" />
                  <p className="mt-3 text-[17px] font-semibold text-ink">{loading ? 'Loading reviews…' : 'No reviews yet'}</p>
                  {!loading && <p className="text-muted">Be the first to tell us what you think.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Scrolling quotes ---------- */}
      {quotes.length >= 4 && (
        <div className="relative overflow-hidden border-y border-line bg-white py-4 mb-14" aria-hidden="true">
          <div className="flex gap-4 w-max animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
            {[...quotes, ...quotes].map((q, i) => (
              <span key={i} className="shrink-0 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-paper text-[15px] text-ink">
                <Stars value={q.rating} size="w-3.5 h-3.5" />
                <span className="max-w-[420px] truncate">“{q.text}”</span>
                <span className="text-muted">— {q.name.replace(/^Sample: /, '')}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Write + wall ---------- */}
      <section className="px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Write a review */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24">
              <form onSubmit={onSubmit} className="relative rounded-[28px] bg-ink text-white p-6 sm:p-7 overflow-hidden" data-reveal="up">
                <Sparkle className="absolute right-6 top-6 w-6 text-highlight" />
                <div className="font-hand text-[20px] text-highlight">Your turn</div>
                <h2 className="mt-1 text-[28px] font-semibold tracking-[-0.03em] leading-tight">Write a review</h2>

                {sent ? (
                  <div className="mt-6 space-y-4 pop-in">
                    <CheckCircle2 className="w-10 h-10 text-marker-green" />
                    <p className="text-[18px] font-semibold">Thank you! 🎉</p>
                    <p className="text-white/70 leading-relaxed">
                      Your review is with the WILT team. It will appear here once it's been checked, usually within a day.
                    </p>
                    <button type="button" onClick={() => setSent(false)} className="text-[15px] font-semibold underline underline-offset-4 text-highlight cursor-pointer">
                      Write another
                    </button>
                  </div>
                ) : (
                  <div className={cn('mt-6 space-y-5', !isLoggedIn && 'opacity-40 pointer-events-none select-none')}>
                    <StarPicker value={rating} onChange={setRating} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                      <label className="block">
                        <span className="text-[13px] text-white/60">Name shown</span>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          maxLength={40}
                          placeholder="e.g. Priya S."
                          className="mt-1 w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-highlight focus:bg-white/15"
                        />
                      </label>
                      <label className="block">
                        <span className="text-[13px] text-white/60">College & course (optional)</span>
                        <input
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          maxLength={60}
                          placeholder="e.g. SSBF, MBA Finance"
                          className="mt-1 w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-highlight focus:bg-white/15"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="text-[13px] text-white/60">Your review</span>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
                        rows={5}
                        placeholder="What do you like? What should we improve?"
                        className="mt-1 w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/35 font-hand text-[19px] leading-snug resize-none focus:outline-none focus:border-highlight focus:bg-white/15"
                      />
                      <span className="block text-right text-[12px] text-white/45 tabular-nums">{text.length}/{MAX_LEN}</span>
                    </label>

                    {error && (
                      <div className="flex items-start gap-2 text-[14px] text-[#FFB4A0]">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="btn-marker w-full py-3.5 text-[16px] font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {sending ? 'Sending…' : (<><Send className="w-4 h-4" /> Post review</>)}
                    </button>
                    <p className="text-[12px] text-white/45 text-center">Reviews appear after a quick check by the WILT team.</p>
                  </div>
                )}

                {!isLoggedIn && !sent && (
                  <div className="absolute inset-x-0 bottom-0 top-24 flex items-center justify-center p-6">
                    <button
                      type="button"
                      onClick={() => requireAuth()}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-ink font-semibold shadow-xl cursor-pointer"
                    >
                      <Lock className="w-4 h-4" /> Sign in to write a review
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* The wall */}
          <div className="lg:col-span-7 xl:col-span-8">
            {reviews.length === 0 && !loading ? (
              <div className="rounded-[28px] border-2 border-dashed border-line p-10 text-center text-muted">
                <p className="font-hand text-[24px] text-ink">This wall is waiting for its first note.</p>
                <p className="mt-2">Reviews you and other students write will show up here.</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 gap-6 [column-fill:_balance]">
                {reviews.map((r, i) => {
                  const st = CARD_STYLES[i % CARD_STYLES.length];
                  const initial = r.name.replace(/^Sample: /, '').replace(/^@/, '').charAt(0).toUpperCase() || 'W';
                  return (
                    <article
                      key={r.id}
                      data-reveal="up"
                      className={cn(
                        'break-inside-avoid mb-6 rounded-[24px] p-6 shadow-[0_20px_40px_-32px_rgba(30,30,30,0.5)] transition-transform duration-300 hover:rotate-0 hover:-translate-y-1',
                        st.bg,
                        st.tilt
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Stars value={r.rating} />
                        {r.isSample && (
                          <span className="px-2 py-0.5 rounded-full bg-ink/10 text-[11px] font-semibold uppercase tracking-wider text-ink/60">Sample</span>
                        )}
                      </div>
                      <div className="mt-3 font-hand text-[48px] leading-[0.5] h-5 text-marker-orange" aria-hidden="true">“</div>
                      <p className="mt-1 text-[18px] leading-snug text-ink">{r.text}</p>
                      <div className="mt-5 flex items-center gap-3">
                        <span className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold', st.dot)}>{initial}</span>
                        <div className="min-w-0">
                          <div className="text-[15px] font-semibold text-ink truncate">{r.name.replace(/^Sample: /, '')}</div>
                          <div className="text-[13px] text-muted truncate">
                            {[r.college, shortDate(r.createdAt)].filter(Boolean).join(' · ')}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewsView;
