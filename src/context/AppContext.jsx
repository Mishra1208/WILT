import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initStorage,
  getStoredPosts,
  savePost as storageSavePost,
  saveAllPostsToStorage,
  getStoredConcepts,
  saveConcept as storageSaveConcept,
  getStoredLeaderboard
} from '../services/storage';
import { 
  savePostToSupabase, 
  fetchPostsFromSupabase,
  saveConceptToSupabase,
  fetchConceptsFromSupabase,
  saveCommentToSupabase,
  saveAttachmentToSupabase,
  fetchLeaderboardFromSupabase,
  supabase
} from '../services/supabase';
import { getOrCreateGuestUser } from '../services/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  // Initialize storage seeds and fetch remote Supabase posts, concepts & live leaderboard
  useEffect(() => {
    initStorage();
    
    // 1. Fetch remote posts from Supabase (Supabase is single source of truth)
    const loadLivePosts = () => {
      fetchPostsFromSupabase().then((remotePosts) => {
        const cleanList = remotePosts || [];
        setPosts(cleanList);
        saveAllPostsToStorage(cleanList);
        setIsPostsLoading(false);
      }).catch(() => {
        setIsPostsLoading(false);
      });
    };

    loadLivePosts();
    // Safety-net poll only — the Realtime subscription below (#4) is the
    // primary sync path for posts, comments, and attachments. This just
    // guards against a dropped websocket, so it can afford to be slow.
    const postsInterval = setInterval(() => {
      if (!document.hidden) loadLivePosts();
    }, 60000);

    // 2. Fetch remote concepts from Supabase
    fetchConceptsFromSupabase().then((remoteConcepts) => {
      setConcepts((current) => {
        const merged = [...(remoteConcepts || [])];
        INITIAL_CONCEPTS.forEach((c) => {
          if (!merged.some((m) => m.term.toLowerCase() === c.term.toLowerCase())) {
            merged.push(c);
          }
        });
        return merged;
      });
    }).catch(() => {
      setConcepts(INITIAL_CONCEPTS);
    });

    // 3. Fetch live audience leaderboard from Supabase
    const loadLiveLeaderboard = () => {
      fetchLeaderboardFromSupabase().then((remoteLeaderboard) => {
        const guestUser = getOrCreateGuestUser();
        let list = remoteLeaderboard || [];
        
        // Ensure active guest user with positive XP exists in list
        if (guestUser && (guestUser.xp > 0 || guestUser.quizzesCompleted > 0)) {
          const exists = list.some(u => u.username === guestUser.username || u.id === guestUser.id);
          if (!exists) {
            list = [...list, {
              id: guestUser.id,
              name: `@${guestUser.username}`,
              username: guestUser.username,
              avatar: guestUser.avatar,
              university: guestUser.university || 'Anonymous Campus',
              major: guestUser.major || 'Guest Scholar',
              xp: guestUser.xp || 0,
              accuracy: guestUser.accuracy || 0,
              tier: guestUser.tier || 'Curious Scholar'
            }];
          }
        }
        list.sort((a, b) => (b.xp || 0) - (a.xp || 0));
        list = list.map((item, idx) => ({ ...item, rank: idx + 1 }));

        setLeaderboard(list);
      });
    };

    loadLiveLeaderboard();
    const leaderboardInterval = setInterval(() => {
      if (!document.hidden) loadLiveLeaderboard();
    }, 30000);

    // 4. Supabase Realtime listener for instant cross-tab / cross-browser post push
    let postsChannel;
    try {
      postsChannel = supabase
        .channel('realtime:posts')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
          loadLivePosts();
        })
        .subscribe();
    } catch (e) {}

    return () => {
      clearInterval(postsInterval);
      clearInterval(leaderboardInterval);
      if (postsChannel && supabase.removeChannel) {
        supabase.removeChannel(postsChannel);
      }
    };
  }, []);

  const getViewFromPath = () => {
    try {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase().trim();
      const validViews = [
        'notepad', 'discover', 'dictionary', 'quiz', 'knowledge-quest', 'quest',
        'leaderboard', 'revision', 'saved', 'about',
        'notifications', 'settings', 'privacy', 'terms', 'standards'
      ];
      if (path === 'knowledge-quest' || path === 'quest') return 'knowledge-quest';
      if (path === 'settings') return 'about';
      if (validViews.includes(path)) {
        return path;
      }
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      if (page) {
        if (page === 'knowledge-quest' || page === 'quest') return 'knowledge-quest';
        if (page === 'settings') return 'about';
        if (validViews.includes(page)) return page;
      }
    } catch (e) {}
    return 'notepad';
  };

  const [currentView, setCurrentViewState] = useState(getViewFromPath);

  const setCurrentView = (newView, replace = false) => {
    const normalizedView = (newView === 'quest' || newView === 'knowledge-quest') ? 'knowledge-quest' : newView;
    setCurrentViewState(normalizedView);
    try {
      const targetPath = normalizedView === 'notepad' ? '/' : `/${normalizedView}`;
      if (window.location.pathname !== targetPath) {
        if (replace) {
          window.history.replaceState({ view: normalizedView }, '', targetPath);
        } else {
          window.history.pushState({ view: normalizedView }, '', targetPath);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handlePopState = () => {
      const view = getViewFromPath();
      setCurrentViewState(view);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [posts, setPosts] = useState(() => getStoredPosts());
  const [concepts, setConcepts] = useState(() => getStoredConcepts());
  const [leaderboard, setLeaderboard] = useState(() => getStoredLeaderboard());

  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isNewConceptModalOpen, setIsNewConceptModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [highlightSnippet, setHighlightSnippet] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  const createPost = (newPostData) => {
    const post = {
      id: `post-${Date.now()}`,
      title: newPostData.title,
      category: newPostData.category || "General Knowledge",
      tags: newPostData.tags || [newPostData.category],
      author: newPostData.author,
      readTime: `${Math.max(1, Math.ceil((newPostData.content?.length || 100) / 400))} min read`,
      createdAt: "Just now",
      timestamp: Date.now(),
      likes: 0,
      savedCount: 0,
      summary: newPostData.summary,
      content: newPostData.content,
      sourceUrl: newPostData.sourceUrl || "",
      sourceContext: newPostData.sourceContext || "",
      attachments: newPostData.attachments || [],
      keyTakeaways: newPostData.keyTakeaways || [],
      terms: newPostData.terms || []
    };

    const updated = storageSavePost(post);
    setPosts(updated);
    setIsNewPostModalOpen(false);

    // Save directly to Supabase cloud database
    savePostToSupabase(post);
    if (newPostData.attachments && newPostData.attachments.length > 0) {
      newPostData.attachments.forEach((att) => {
        saveAttachmentToSupabase(post.id, att);
      });
    }

    // If terms were extracted, ensure they exist in peer dictionary
    if (newPostData.terms && newPostData.terms.length > 0) {
      newPostData.terms.forEach(term => {
        const exists = concepts.some(c => c.term.toLowerCase() === term.toLowerCase());
        if (!exists) {
          const autoConcept = {
            id: `concept-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            term: term,
            category: newPostData.category,
            definition: `Core concept introduced in "${post.title}".`,
            plainExplanation: newPostData.summary || "Shared by peer community.",
            formula: "",
            examples: `Used in ${post.title}`,
            relatedPostId: post.id,
            contributor: newPostData.author?.username || "peer"
          };
          const updatedConcepts = storageSaveConcept(autoConcept);
          setConcepts(updatedConcepts);
        }
      });
    }

    return post;
  };

  const createConcept = (newConceptData) => {
    const concept = {
      id: `concept-${Date.now()}`,
      term: newConceptData.term,
      category: newConceptData.category || "General",
      definition: newConceptData.definition,
      plainExplanation: newConceptData.plainExplanation,
      formula: newConceptData.formula || "",
      examples: newConceptData.examples || "",
      relatedPostId: newConceptData.relatedPostId || null,
      contributor: newConceptData.contributor || "peer"
    };
    const updated = storageSaveConcept(concept);
    setConcepts(updated);
    setIsNewConceptModalOpen(false);

    // Save to Supabase cloud database
    saveConceptToSupabase(concept);
    return concept;
  };

  const toggleLike = (postId, user) => {
    let targetUpdatedPost = null;

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const hasLiked = user?.likedPosts?.includes(postId);
          const newLikes = hasLiked ? Math.max(0, (p.likes || 0) - 1) : (p.likes || 0) + 1;
          const updated = {
            ...p,
            likes: newLikes
          };
          targetUpdatedPost = updated;
          return updated;
        }
        return p;
      })
    );

    if (targetUpdatedPost) {
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(targetUpdatedPost);
      }
      storageSavePost(targetUpdatedPost);
      savePostToSupabase(targetUpdatedPost);
      try {
        const bc = new BroadcastChannel('wilt_comments_channel');
        bc.postMessage({ type: 'SYNC_POST', post: targetUpdatedPost });
        bc.close();
      } catch (e) {}
    }
  };

  const addCommentToPost = (postId, commentText, currentUser) => {
    if (!commentText.trim()) return false;

    const activeUser = currentUser || getOrCreateGuestUser();
    let targetUpdatedPost = null;

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const currentComments = p.comments || [];
          const newComment = {
            id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            author: {
              name: `@${activeUser.username}`,
              username: activeUser.username,
              avatar: activeUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
              role: activeUser.major || 'Student Scholar'
            },
            text: commentText.trim(),
            createdAt: 'Just now'
          };

          const updatedPost = {
            ...p,
            comments: [...currentComments, newComment]
          };

          targetUpdatedPost = updatedPost;

          if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(updatedPost);
          }

          storageSavePost(updatedPost);
          savePostToSupabase(updatedPost);
          saveCommentToSupabase(postId, newComment);

          return updatedPost;
        }
        return p;
      })
    );

    if (targetUpdatedPost) {
      try {
        const bc = new BroadcastChannel('wilt_comments_channel');
        bc.postMessage({ type: 'SYNC_POST', post: targetUpdatedPost });
        bc.close();
      } catch (e) {}
    }

    return true;
  };

  // Cross-tab (same device) instant comment/post sync via BroadcastChannel.
  // Cross-device sync is already handled by the Supabase Realtime
  // subscription set up above (#4) — no polling needed here.
  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel('wilt_comments_channel');
      bc.onmessage = (event) => {
        if (event.data && event.data.type === 'SYNC_POST' && event.data.post) {
          const syncedPost = event.data.post;
          setPosts((prev) =>
            prev.map((p) => (p.id === syncedPost.id ? syncedPost : p))
          );
          if (selectedPost && selectedPost.id === syncedPost.id) {
            setSelectedPost(syncedPost);
          }
        }
      };
    } catch (e) {}

    return () => {
      if (bc) bc.close();
    };
  }, [selectedPost?.id]);

  const openPostDetail = (post, snippet = null) => {
    setSelectedPost(post);
    setHighlightSnippet(snippet);
  };

  const closePostDetail = () => {
    setSelectedPost(null);
    setHighlightSnippet(null);
  };

  // Saved Items Management (Posts & News)
  const [savedPostIds, setSavedPostIds] = useState(() => {
    try {
      const raw = localStorage.getItem('wilt_saved_posts_v8');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [savedNewsArticles, setSavedNewsArticles] = useState(() => {
    try {
      const raw = localStorage.getItem('wilt_saved_news_v8');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleSavePost = (postId) => {
    setSavedPostIds((prev) => {
      const updated = prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId];
      localStorage.setItem('wilt_saved_posts_v8', JSON.stringify(updated));
      return updated;
    });
  };

  const isPostSaved = (postId) => savedPostIds.includes(postId);

  const toggleSaveNews = (article) => {
    setSavedNewsArticles((prev) => {
      const exists = prev.some((a) => a.id === article.id);
      const updated = exists ? prev.filter((a) => a.id !== article.id) : [...prev, article];
      localStorage.setItem('wilt_saved_news_v8', JSON.stringify(updated));
      return updated;
    });
  };

  const isNewsSaved = (articleId) => savedNewsArticles.some((a) => a.id === articleId);

  const [isReportBugModalOpen, setIsReportBugModalOpen] = useState(false);
  const openReportBugModal = () => setIsReportBugModalOpen(true);
  const closeReportBugModal = () => setIsReportBugModalOpen(false);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        posts,
        setPosts,
        concepts,
        setConcepts,
        leaderboard,
        setLeaderboard,
        isNewPostModalOpen,
        setIsNewPostModalOpen,
        isNewConceptModalOpen,
        setIsNewConceptModalOpen,
        selectedPost,
        highlightSnippet,
        openPostDetail,
        closePostDetail,
        createPost,
        createConcept,
        toggleLike,
        addCommentToPost,
        savedPostIds,
        savedNewsArticles,
        toggleSavePost,
        isPostSaved,
        toggleSaveNews,
        isNewsSaved,
        isReportBugModalOpen,
        setIsReportBugModalOpen,
        openReportBugModal,
        closeReportBugModal,
        isPostsLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
