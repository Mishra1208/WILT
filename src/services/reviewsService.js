/**
 * Reviews: read approved reviews and send new ones through /api/reviews,
 * which stores them in the owners' Google Sheet.
 */

// SAMPLE reviews: shown ONLY in local development (npm run dev) so the page
// design can be previewed. They are never included on the live site.
export const SAMPLE_REVIEWS = import.meta.env.DEV
  ? [
      { id: 's1', isSample: true, name: 'Sample: Priya S.', college: 'MBA (Finance), Pune', rating: 5, text: 'The weekly quiz is the only reason I still remember the difference between CRR and SLR. Writing one note a day takes two minutes.', createdAt: '2026-10-30T10:00:00Z' },
      { id: 's2', isSample: true, name: 'Sample: Rahul K.', college: 'MBA (Marketing), Pune', rating: 5, text: 'Knowledge Quest saved me before my placement viva. I read the business news there every morning with my chai.', createdAt: '2026-10-29T10:00:00Z' },
      { id: 's3', isSample: true, name: 'Sample: Ananya M.', college: 'BBA, Mumbai', rating: 4, text: "Love reading what classmates learned. Some notes explain things better than our textbook. Would like dark mode!", createdAt: '2026-10-28T10:00:00Z' },
      { id: 's4', isSample: true, name: 'Sample: Arjun P.', college: 'MBA (Banking), Pune', rating: 5, text: 'Simple idea, really well done. The "Did you forget? Read it here" link after a wrong answer is genius.', createdAt: '2026-10-27T10:00:00Z' },
      { id: 's5', isSample: true, name: 'Sample: Sneha R.', college: 'B.Com, Delhi', rating: 4, text: 'Good for revision before exams. I wish I could add images to my notes more easily on my phone.', createdAt: '2026-10-25T10:00:00Z' },
      { id: 's6', isSample: true, name: 'Sample: Vikram T.', college: 'MBA (Fintech), Bengaluru', rating: 5, text: 'Climbing the leaderboard every week has become a friendly competition in our section.', createdAt: '2026-10-24T10:00:00Z' }
    ]
  : [];

/** Returns { reviews, configured }. Never throws. */
export const fetchReviews = async () => {
  try {
    const res = await fetch('/api/reviews');
    const data = await res.json();
    const real = Array.isArray(data.reviews) ? data.reviews : [];
    return { reviews: [...real, ...SAMPLE_REVIEWS], configured: Boolean(data.configured) };
  } catch {
    return { reviews: SAMPLE_REVIEWS, configured: false };
  }
};

/** Returns { ok } or { error } */
export const sendReview = async (review) => {
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data.error || 'Could not send your review. Please try again.' };
    return { ok: true };
  } catch {
    return { error: 'Could not reach WILT. Check your connection and try again.' };
  }
};
