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
      .order('created_at', { ascending: true });

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
 * Save post attachment (photo, document, link) to Supabase
 */
export const saveAttachmentToSupabase = async (postId, attachment) => {
  if (!postId || !attachment) return { success: false };

  try {
    const payload = {
      id: attachment.id || `att-${Date.now()}`,
      term: postId,
      category: 'post_attachment',
      definition: JSON.stringify(attachment),
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
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase fetch attachments error:', error.message);
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
 * 3. Fetch all posts from Supabase
 */
export const fetchPostsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .gt('created_at', '2026-09-02T22:18:00.000Z')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch posts info:', error.message);
      return [];
    }

    const allComments = await fetchCommentsFromSupabase();
    const allAttachments = await fetchAttachmentsFromSupabase();

    return (data || []).map((row) => {
      const postComments = allComments.filter((c) => c.postId === row.id);
      const postAttachments = allAttachments.filter((a) => a.postId === row.id);
      return {
        id: row.id,
        title: row.title,
        category: row.category,
        tags: row.tags || [row.category],
        summary: row.summary,
        content: row.content,
        readTime: '2 min read',
        createdAt: 'Recently',
        likes: 0,
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
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert([
        {
          id: user.id || `user_${user.username}`,
          username: user.username,
          name: user.name,
          avatar: user.avatar,
          email: user.email || '',
          phone: user.phone || '',
          university: user.university || 'University Student',
          major: user.major || 'Finance & Tech',
          xp: user.xp || 150,
          tier: user.tier || 'Curious Scholar',
          rank: user.rank || 12,
          accuracy: user.accuracy || 90,
          quizzes_completed: user.quizzesCompleted || 0,
          updated_at: new Date().toISOString()
        }
      ], { onConflict: 'username' })
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
      .order('created_at', { ascending: false });

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
