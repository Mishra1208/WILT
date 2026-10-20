import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://sphxwnaiviqaujhravoo.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_HKYlHuCNLP4rSmMeKcqxxQ_I4VnI3Hw';

// Initialize Supabase Client
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

/**
 * 2. Save user post / knowledge slate entry to Supabase
 */
export const savePostToSupabase = async (post) => {
  if (!post) return { success: false };

  try {
    const { data, error } = await supabase
      .from('posts')
      .upsert([
        {
          id: post.id,
          title: post.title,
          category: post.category,
          tags: post.tags,
          summary: post.summary,
          content: post.content,
          author_name: post.author?.name || 'Anonymous Scholar',
          author_handle: post.author?.username || 'scholar',
          author_avatar: post.author?.avatar || '',
          key_takeaways: post.keyTakeaways || [],
          terms: post.terms || [],
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase post insert info:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase post catch:', err);
    return { success: false, error: err.message };
  }
};

export const saveCommentToSupabase = async (postId, comment) => {
  if (!postId || !comment) return { success: false };

  try {
    const payload = {
      id: comment.id || `comment-${Date.now()}`,
      term: postId,
      category: 'post_comment',
      definition: JSON.stringify(comment),
      plain_explanation: comment.text || '',
      contributor: comment.author?.username || 'learner',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('concepts')
      .upsert([payload])
      .select();

    if (error) {
      console.warn('Supabase save comment error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase save comment catch:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch all post comments from Supabase
 */
export const fetchCommentsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('concepts')
      .select('*')
      .eq('category', 'post_comment')
      .gte('created_at', '2026-09-07T05:45:00.000Z')
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.warn('Supabase fetch comments error:', error.message);
      return [];
    }

    return (data || []).map((row) => {
      try {
        const parsed = JSON.parse(row.definition);
        return {
          postId: row.term,
          ...parsed
        };
      } catch (e) {
        return {
          id: row.id,
          postId: row.term,
          text: row.plain_explanation,
          author: { username: row.contributor || 'learner', name: `@${row.contributor || 'learner'}` },
          createdAt: 'Recently'
        };
      }
    });
  } catch (err) {
    console.warn('Supabase fetch comments catch:', err);
    return [];
  }
};

/**
 * Upload attachment file directly to Supabase Storage bucket 'attachments'
 * Returns the public URL string or null on failure.
 */
export const uploadAttachmentToStorage = async (file) => {
  if (!file) return null;

  try {
    const fileExt = file.name.split('.').pop() || 'file';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from('attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.warn('Supabase storage upload info:', error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    return urlData?.publicUrl || null;
  } catch (err) {
    console.warn('Supabase storage upload catch:', err);
    return null;
  }
};

/**
 * Save post attachment (photo, document, link) to Supabase
 */
export const saveAttachmentToSupabase = async (postId, attachment) => {
  if (!postId || !attachment) return { success: false };

  try {
    // Sanitize away base64 data URLs to prevent database bloat
    const safeAttachment = {
      ...attachment,
      url: (attachment.url && attachment.url.startsWith('data:')) ? '' : attachment.url
    };

    const payload = {
      id: attachment.id || `att-${Date.now()}`,
      term: postId,
      category: 'post_attachment',
      definition: JSON.stringify(safeAttachment),
      plain_explanation: attachment.name || '',
      contributor: 'scholar',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('concepts')
      .upsert([payload])
      .select();

    if (error) {
      console.warn('Supabase save attachment error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase save attachment catch:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch all post attachments from Supabase
 */
export const fetchAttachmentsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('concepts')
      .select('*')
      .eq('category', 'post_attachment')
      .gte('created_at', '2026-09-07T05:45:00.000Z')
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.warn('Supabase fetch attachments error:', error.message);
      return [];
    }

    return (data || []).map((row) => {
      try {
        const parsed = JSON.parse(row.definition);
        // Strip legacy huge base64 data URLs to prevent egress spikes
        let safeUrl = parsed.url || '';
        if (safeUrl.startsWith('data:')) {
          safeUrl = '';
        }

        return {
          postId: row.term,
          ...parsed,
          url: safeUrl
        };
      } catch (e) {
        return {
          id: row.id,
          postId: row.term,
          name: row.plain_explanation,
          type: 'file',
          url: ''
        };
      }
    });
  } catch (err) {
    console.warn('Supabase fetch attachments catch:', err);
    return [];
  }
};

/**
 * Save or Update Post Like in Supabase
 */
export const saveLikeToSupabase = async (postId, username, isLiked) => {
  if (!postId) return { success: false };

  try {
    const cleanUser = (username || 'scholar').replace(/^@/, '').toLowerCase().trim();
    const likeId = `like-${postId}-${cleanUser}`;

    const payload = {
      id: likeId,
      term: postId,
      category: 'post_like',
      definition: JSON.stringify({ postId, username: cleanUser, liked: isLiked }),
      plain_explanation: isLiked ? 'liked' : 'unliked',
      contributor: cleanUser,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('concepts')
      .upsert([payload])
      .select();

    if (error) {
      console.warn('Supabase save like error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase like catch:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch all active post likes from Supabase
 */
export const fetchLikesFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('concepts')
      .select('*')
      .eq('category', 'post_like')
      .neq('plain_explanation', 'unliked')
      .gte('created_at', '2026-09-07T05:45:00.000Z')
      .limit(500);

    if (error) {
      console.warn('Supabase fetch likes error:', error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      postId: row.term,
      username: row.contributor || 'scholar'
    }));
  } catch (err) {
    console.warn('Supabase fetch likes catch:', err);
    return [];
  }
};

/**
 * 3. Fetch all posts from Supabase
 */
export const fetchPostsFromSupabase = async () => {
  try {
    const [postsRes, allComments, allAttachments, allLikes] = await Promise.all([
      supabase
        .from('posts')
        .select('*')
        .gte('created_at', '2026-09-07T05:45:00.000Z')
        .order('created_at', { ascending: false })
        .limit(100),
      fetchCommentsFromSupabase().catch(() => []),
      fetchAttachmentsFromSupabase().catch(() => []),
      fetchLikesFromSupabase().catch(() => [])
    ]);

    const { data, error } = postsRes || {};

    if (error) {
      console.warn('Supabase fetch posts info:', error.message);
      return [];
    }

    return (data || []).map((row) => {
      const postComments = (allComments || []).filter((c) => c.postId === row.id);
      const postAttachments = (allAttachments || []).filter((a) => a.postId === row.id);
      const postLikes = (allLikes || []).filter((l) => l.postId === row.id);

      return {
        id: row.id,
        title: row.title,
        category: row.category,
        tags: row.tags || [row.category],
        summary: row.summary,
        content: row.content,
        readTime: '2 min read',
        createdAt: 'Recently',
        likes: postLikes.length,
        savedCount: 0,
        author: {
          name: row.author_name,
          username: row.author_handle,
          avatar: row.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          university: 'University Student',
          major: 'Finance & Tech'
        },
        keyTakeaways: row.key_takeaways || [],
        terms: row.terms || [],
        sourceUrl: row.source_url || '',
        sourceContext: row.source_context || '',
        attachments: postAttachments.length > 0 ? postAttachments : (row.attachments || []),
        comments: postComments.length > 0 ? postComments : (row.comments || [])
      };
    });
  } catch (err) {
    console.warn('Supabase fetch posts catch:', err);
    return [];
  }
};

// Columns that are safe to read publicly. email / phone are deliberately excluded.
export const PUBLIC_PROFILE_COLUMNS = 'id, username, name, avatar, university, major, xp, tier, rank, accuracy, quizzes_completed, updated_at';

/**
 * 4. Save or Update Student Profile in Supabase
 * Only signed-in accounts are persisted. Contact details (email / phone) are never
 * written to the public profile table — Clerk is the source of truth for those.
 */
export const saveUserProfileToSupabase = async (user) => {
  if (!user || !user.username || !user.id) return { success: false };
  if (user.isGuest || String(user.id).startsWith('guest-')) return { success: false, skipped: true };

  try {
    const cleanUsername = (user.username || 'anonymous').replace(/^@/, '').toLowerCase().trim();
    const payload = {
      id: user.id,
      username: cleanUsername,
      name: `@${cleanUsername}`,
      avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
      university: user.university || 'Anonymous Campus',
      major: user.major || 'Guest Scholar',
      xp: Number(user.xp) || 0,
      tier: user.tier || 'Novice',
      rank: Number(user.rank) || 1,
      accuracy: Number(user.accuracy) || 0,
      quizzes_completed: Number(user.quizzesCompleted) || 0,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('user_profiles').upsert([payload]);

    if (error) {
      console.warn('Supabase user profile info:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.warn('Supabase user profile catch:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Load a signed-in account's saved profile (public columns only).
 * Returns { profile } on success (profile may be null if the account is new),
 * or { error } if Supabase could not be reached.
 */
export const fetchUserProfileFromSupabase = async (accountId) => {
  if (!accountId) return { profile: null };
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(PUBLIC_PROFILE_COLUMNS)
      .eq('id', accountId)
      .maybeSingle();
    if (error) return { error: error.message };
    return { profile: data || null };
  } catch (err) {
    return { error: err.message };
  }
};

/**
 * True if another account already uses this username.
 * Returns false when Supabase can't be reached (we don't block sign-in on it).
 */
export const isUsernameTakenInSupabase = async (username, accountId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username)
      .neq('id', accountId)
      .limit(1);
    if (error) return false;
    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    return false;
  }
};

/**
 * Lifetime quiz accuracy for a handle, computed from real attempts:
 * total correct answers / total questions answered.
 */
export const fetchQuizStatsFromSupabase = async (handle) => {
  if (!handle) return null;
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('score, total_questions')
      .eq('user_handle', handle.replace(/^@/, '').toLowerCase().trim());
    if (error || !data) return null;
    const totalCorrect = data.reduce((sum, a) => sum + (Number(a.score) || 0), 0);
    const totalAnswered = data.reduce((sum, a) => sum + (Number(a.total_questions) || 0), 0);
    return { totalCorrect, totalAnswered, attempts: data.length };
  } catch (err) {
    return null;
  }
};

/**
 * 5. Save Quiz Attempt to Supabase
 */
export const saveQuizAttemptToSupabase = async ({ userHandle, userName, score, totalQuestions, xpEarned }) => {
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert([
        {
          user_handle: userHandle || 'anonymous',
          user_name: userName || 'Student Scholar',
          score: score,
          total_questions: totalQuestions,
          accuracy_percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
          xp_earned: xpEarned,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.warn('Supabase quiz attempt info:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.warn('Supabase quiz attempt catch:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch real live audience leaderboard from Supabase.
 * - Reads only public profile columns (never email / phone).
 * - Accuracy is computed from real quiz attempts (correct / answered), never a placeholder.
 */
export const fetchLeaderboardFromSupabase = async () => {
  try {
    const [profilesRes, attemptsRes] = await Promise.all([
      supabase
        .from('user_profiles')
        .select(PUBLIC_PROFILE_COLUMNS)
        .gte('updated_at', '2026-09-07T05:45:00.000Z')
        .order('xp', { ascending: false })
        .limit(500),
      supabase
        .from('quiz_attempts')
        .select('user_handle, score, total_questions, xp_earned, created_at')
        .gte('created_at', '2026-09-07T05:45:00.000Z')
        .order('created_at', { ascending: false })
        .limit(2000)
    ]).catch(() => [{ data: [] }, { data: [] }]);

    const profiles = profilesRes?.data || [];
    const attempts = attemptsRes?.data || [];

    // Aggregate real attempt stats per handle
    const statsByHandle = new Map();
    attempts.forEach((a) => {
      const handle = (a.user_handle || '').replace(/^@/, '').toLowerCase().trim();
      if (!handle || handle === 'anonymous' || handle.startsWith('archived_reset_')) return;
      const s = statsByHandle.get(handle) || { correct: 0, answered: 0, quizzes: 0, xp: 0 };
      s.correct += Number(a.score) || 0;
      s.answered += Number(a.total_questions) || 0;
      s.quizzes += 1;
      s.xp += Number(a.xp_earned) || 0;
      statsByHandle.set(handle, s);
    });

    const accuracyFor = (stats, fallback) => {
      if (stats && stats.answered > 0) return Math.round((stats.correct / stats.answered) * 100);
      const n = Number(fallback);
      return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0;
    };

    const handleMap = new Map();

    profiles.forEach((p) => {
      const handle = (p.username || p.name || '').replace(/^@/, '').toLowerCase().trim();
      if (!handle || handle.startsWith('archived_reset_')) return;
      const stats = statsByHandle.get(handle);
      const userXp = Number(p.xp) || 0;
      const quizzesDone = Math.max(Number(p.quizzes_completed) || 0, stats?.quizzes || 0);
      if (userXp <= 0 && quizzesDone <= 0) return;
      handleMap.set(handle, {
        id: p.id || `user_${handle}`,
        name: `@${handle}`,
        username: handle,
        avatar: p.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${handle}`,
        university: p.university || 'Anonymous Campus',
        major: p.major || 'Guest Scholar',
        xp: userXp,
        accuracy: accuracyFor(stats, p.accuracy),
        quizzesCompleted: quizzesDone
      });
    });

    // Handles that only exist in quiz_attempts (no profile row)
    statsByHandle.forEach((stats, handle) => {
      if (handleMap.has(handle) || stats.xp <= 0) return;
      handleMap.set(handle, {
        id: `anon_${handle}`,
        name: `@${handle}`,
        username: handle,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${handle}`,
        university: 'Anonymous Campus',
        major: 'Guest Scholar',
        xp: stats.xp,
        accuracy: accuracyFor(stats, 0),
        quizzesCompleted: stats.quizzes
      });
    });

    const leaderboardList = Array.from(handleMap.values());
    leaderboardList.sort((a, b) => (b.xp || 0) - (a.xp || 0));

    return leaderboardList.map((item, idx) => {
      let tier = 'Novice';
      if (item.xp >= 2500) tier = 'Mastermind';
      else if (item.xp >= 1800) tier = 'Grand Scholar';
      else if (item.xp >= 1200) tier = 'Fellow Analyst';
      else if (item.xp >= 600) tier = 'Curious Scholar';

      return {
        ...item,
        rank: idx + 1,
        tier,
        trophy: idx === 0 ? "🥇 Gold Champion" : idx === 1 ? "🥈 Silver Rank" : idx === 2 ? "🥉 Bronze Rank" : null
      };
    });
  } catch (err) {
    console.warn('Supabase fetch leaderboard catch:', err);
    return [];
  }
};

/**
 * 6. Save Peer Dictionary Concept to Supabase
 */
export const saveConceptToSupabase = async (concept) => {
  if (!concept || !concept.term) return { success: false };

  try {
    const { data, error } = await supabase
      .from('concepts')
      .upsert([
        {
          id: concept.id,
          term: concept.term,
          category: concept.category,
          definition: concept.definition,
          plain_explanation: concept.plainExplanation,
          formula: concept.formula || '',
          examples: concept.examples || '',
          contributor: concept.contributor || 'peer',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase concept info:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase concept catch:', err);
    return { success: false, error: err.message };
  }
};

/**
 * 7. Fetch Peer Dictionary Concepts from Supabase
 */
export const fetchConceptsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('concepts')
      .select('*')
      .not('category', 'in', '("post_comment","post_attachment")')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.warn('Supabase fetch concepts info:', error.message);
      return [];
    }

    return (data || [])
      .filter((row) => row.category !== 'post_comment' && row.category !== 'post_attachment' && !row.term.startsWith('post-'))
      .map((row) => ({
        id: row.id,
        term: row.term,
        category: row.category,
        definition: row.definition,
        plainExplanation: row.plain_explanation,
        formula: row.formula || '',
        examples: row.examples || '',
        contributor: row.contributor || 'peer'
      }));
  } catch (err) {
    console.warn('Supabase fetch concepts catch:', err);
    return [];
  }
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Subscribe email to newsletter_subscribers table in Supabase.
 * Returns { success, status, message }. success is true ONLY when the row was saved
 * (or the email is already on the list). Write-only: never reads the subscriber list.
 */
export const subscribeNewsletterToSupabase = async (email, source = 'wilt_footer_digest') => {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!EMAIL_PATTERN.test(cleanEmail)) {
    return { success: false, status: 'invalid', message: 'Please enter a valid email address.' };
  }

  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: cleanEmail, source }]);

    if (error) {
      if (error.code === '23505' || /duplicate|unique/i.test(error.message || '')) {
        return { success: true, status: 'already_exists', message: "You're already subscribed." };
      }
      console.warn('Supabase newsletter insert info:', error.message);
      return { success: false, status: 'error', message: "Couldn't subscribe right now. Please try again." };
    }
    return { success: true, status: 'subscribed', message: 'Subscribed!' };
  } catch (err) {
    console.warn('Supabase newsletter catch:', err?.message);
    return { success: false, status: 'error', message: "Couldn't reach the server. Check your connection and try again." };
  }
};

/**
 * Report a bug in Supabase bug_reports table.
 * Returns { success, message }. success is true ONLY when Supabase confirmed the insert.
 */
export const reportBugToSupabase = async (bugData) => {
  try {
    const { error } = await supabase
      .from('bug_reports')
      .insert([
        {
          page: bugData.page || 'Not Specified',
          issue_type: bugData.issueType || 'General Bug',
          description: bugData.description || '',
          email: bugData.email || null,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.warn('Supabase bug_reports notice:', error.message);
      return { success: false, message: "Your report couldn't be sent. Please try again, or email wilt.support@gmail.com." };
    }
    return { success: true };
  } catch (err) {
    console.warn('Supabase bug report catch:', err?.message);
    return { success: false, message: "Couldn't reach the server. Check your connection and try again, or email wilt.support@gmail.com." };
  }
};
