import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://itokltjrkzqmbbagjnme.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_hqJIezaDpWiy6kHjoabvEg_3_scOStB';

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
 * 1. Record weekly digest newsletter subscriber in Supabase
 */
export const subscribeToNewsletter = async (email) => {
  if (!email || !email.includes('@')) {
    return { success: false, status: 'invalid', message: 'Please enter a valid email address.' };
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // Check if the subscriber already exists in Supabase
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        status: 'already_exists',
        message: 'You are already subscribed to the Weekly Digest! 📬'
      };
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: cleanEmail,
          source: 'wilt_footer_digest',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        return {
          success: false,
          status: 'already_exists',
          message: 'You are already subscribed to the Weekly Digest! 📬'
        };
      }
      console.warn('Supabase newsletter info:', error.message);
      return { success: false, status: 'error', message: 'Failed to subscribe. Please try again.' };
    }

    return {
      success: true,
      status: 'subscribed',
      message: 'Subscribed Successfully! 🎉',
      data
    };
  } catch (err) {
    console.warn('Supabase newsletter catch:', err);
    return { success: false, status: 'error', message: 'Something went wrong. Please try again.' };
  }
};

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
      .gte('created_at', '2026-09-07T00:00:00.000Z')
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
      .gte('created_at', '2026-09-07T00:00:00.000Z')
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
      .gte('created_at', '2026-09-07T00:00:00.000Z')
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
        .gte('created_at', '2026-09-07T00:00:00.000Z')
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

/**
 * 4. Save or Update Student Profile in Supabase
 */
export const saveUserProfileToSupabase = async (user) => {
  if (!user || !user.username) return { success: false };

  try {
    const cleanUsername = (user.username || 'anonymous').replace(/^@/, '').toLowerCase().trim();
    const payload = {
      id: user.id || `user_${cleanUsername}`,
      username: cleanUsername,
      name: `@${cleanUsername}`,
      avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
      email: user.email || '',
      phone: user.phone || '',
      university: user.university || 'Anonymous Campus',
      major: user.major || 'Guest Scholar',
      xp: user.xp !== undefined && user.xp !== null ? Number(user.xp) : 0,
      tier: user.tier || 'Curious Scholar',
      rank: Number(user.rank) || 1,
      accuracy: user.accuracy !== undefined && user.accuracy !== null ? Number(user.accuracy) : 0,
      quizzes_completed: Number(user.quizzesCompleted) || 0,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert([payload])
      .select();

    if (error) {
      console.warn('Supabase user profile info:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase user profile catch:', err);
    return { success: false, error: err.message };
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
          accuracy_percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 100,
          xp_earned: xpEarned,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase quiz attempt info:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase quiz attempt catch:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch real live audience leaderboard from Supabase
 */
export const fetchLeaderboardFromSupabase = async () => {
  try {
    const [profilesRes, attemptsRes] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('*')
        .gte('updated_at', '2026-09-07T00:00:00.000Z')
        .order('xp', { ascending: false }),
      supabase
        .from('quiz_attempts')
        .select('*')
        .gte('created_at', '2026-09-07T00:00:00.000Z')
        .order('created_at', { ascending: false })
    ]).catch(() => [{ data: [] }, { data: [] }]);

    const profiles = profilesRes?.data || [];
    const attempts = attemptsRes?.data || [];

    const handleMap = new Map();

    if (profiles && profiles.length > 0) {
      profiles.forEach((p) => {
        const handle = (p.username || p.name || 'anonymous').replace(/^@/, '').toLowerCase().trim();
        const userXp = Number(p.xp) || 0;
        const quizzesDone = Number(p.quizzes_completed) || 0;
        if (handle && !handle.startsWith('archived_reset_') && (userXp > 0 || quizzesDone > 0)) {
          handleMap.set(handle, {
            id: p.id || `user_${handle}`,
            name: `@${handle}`,
            username: handle,
            avatar: p.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${handle}`,
            university: p.university || 'Anonymous Campus',
            major: p.major || 'Guest Scholar',
            xp: userXp,
            accuracy: Number(p.accuracy) || 90,
            tier: p.tier || 'Curious Scholar',
            quizzesCompleted: quizzesDone
          });
        }
      });
    }

    if (attempts && attempts.length > 0) {
      attempts.forEach((a) => {
        const handle = (a.user_handle || 'anonymous').replace(/^@/, '').toLowerCase().trim();
        const earnedXp = Number(a.xp_earned) || 0;
        if (handle && !handle.startsWith('archived_reset_') && earnedXp > 0) {
          if (!handleMap.has(handle)) {
            handleMap.set(handle, {
              id: `anon_${handle}`,
              name: `@${handle}`,
              username: handle,
              avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${handle}`,
              university: 'Anonymous Campus',
              major: 'Guest Scholar',
              xp: earnedXp,
              accuracy: Number(a.accuracy_percentage) || 90,
              tier: 'Curious Scholar',
              quizzesCompleted: 1
            });
          } else {
            const existing = handleMap.get(handle);
            if (earnedXp > existing.xp) {
              existing.xp = earnedXp;
              existing.accuracy = Number(a.accuracy_percentage) || existing.accuracy;
            }
          }
        }
      });
    }

    const leaderboardList = Array.from(handleMap.values());
    leaderboardList.sort((a, b) => (b.xp || 0) - (a.xp || 0));

    return leaderboardList.map((item, idx) => {
      let tier = "Curious Scholar";
      if (item.xp >= 2500) tier = "Mastermind";
      else if (item.xp >= 1800) tier = "Grandmaster";
      else if (item.xp >= 1200) tier = "Fellow Analyst";
      else if (item.xp >= 600) tier = "Curious Scholar";

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

// Local storage fallback for newsletter
const saveLocalNewsletter = (email) => {
  try {
    const key = 'wilt_local_newsletter_v1';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    if (!list.includes(email)) {
      list.push(email);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch (e) {}
};

/**
 * Subscribe email to newsletter_subscribers table in Supabase
 */
export const subscribeNewsletterToSupabase = async (email, source = 'wilt_footer_digest') => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return { success: false, message: 'Invalid email' };

  // Save to local backup
  saveLocalNewsletter(cleanEmail);

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: cleanEmail,
          source: source
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase newsletter insert info:', error.message);
      return { success: true, message: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.warn('Supabase newsletter catch:', err.message);
    return { success: true };
  }
};

/**
 * Report a bug in Supabase bug_reports table
 */
export const reportBugToSupabase = async (bugData) => {
  try {
    const { data, error } = await supabase
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
      // Fallback save to localStorage
      try {
        const local = JSON.parse(localStorage.getItem('wilt_bug_reports_v1') || '[]');
        local.push({ ...bugData, timestamp: new Date().toISOString() });
        localStorage.setItem('wilt_bug_reports_v1', JSON.stringify(local));
      } catch (e) {}
    }
    return { success: true };
  } catch (err) {
    console.warn('Supabase bug report catch:', err.message);
    try {
      const local = JSON.parse(localStorage.getItem('wilt_bug_reports_v1') || '[]');
      local.push({ ...bugData, timestamp: new Date().toISOString() });
      localStorage.setItem('wilt_bug_reports_v1', JSON.stringify(local));
    } catch (e) {}
    return { success: true };
  }
};
