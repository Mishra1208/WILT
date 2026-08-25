import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initStorage,
  getStoredPosts,
  savePost as storageSavePost,
  getStoredConcepts,
  saveConcept as storageSaveConcept,
  getStoredLeaderboard
} from '../services/storage';
import { 
  savePostToSupabase, 
  fetchPostsFromSupabase,
  saveConceptToSupabase,
  fetchConceptsFromSupabase
} from '../services/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize storage seeds and fetch remote Supabase posts & concepts
  useEffect(() => {
    initStorage();
    
    // 1. Fetch remote posts from Supabase
    fetchPostsFromSupabase().then((remotePosts) => {
      if (remotePosts && remotePosts.length > 0) {
        setPosts((current) => {
          const merged = [...remotePosts];
          current.forEach((p) => {
            if (!merged.some((m) => m.id === p.id)) {
              merged.push(p);
            }
          });
          return merged;
        });
      }
    });

    // 2. Fetch remote concepts from Supabase
    fetchConceptsFromSupabase().then((remoteConcepts) => {
      if (remoteConcepts && remoteConcepts.length > 0) {
        setConcepts((current) => {
          const merged = [...remoteConcepts];
          current.forEach((c) => {
            if (!merged.some((m) => m.term.toLowerCase() === c.term.toLowerCase())) {
              merged.push(c);
            }
          });
          return merged;
        });
      }
    });
  }, []);

  const getInitialView = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      if (page && ['privacy', 'terms', 'standards', 'about', 'discover', 'notepad', 'quiz', 'dictionary', 'leaderboard'].includes(page)) {
        return page;
      }
      const hash = window.location.hash.replace('#', '');
      if (hash && ['privacy', 'terms', 'standards', 'about', 'discover', 'notepad', 'quiz', 'dictionary', 'leaderboard'].includes(hash)) {
        return hash;
      }
    } catch (e) {}
    return 'notepad';
  };

  const [currentView, setCurrentView] = useState(getInitialView);
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
      keyTakeaways: newPostData.keyTakeaways || [],
      terms: newPostData.terms || []
    };

    const updated = storageSavePost(post);
    setPosts(updated);
    setIsNewPostModalOpen(false);

    // Save directly to Supabase cloud database
    savePostToSupabase(post);

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
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const hasLiked = user?.likedPosts?.includes(postId);
          return {
            ...p,
            likes: hasLiked ? Math.max(0, p.likes - 1) : p.likes + 1
          };
        }
        return p;
      })
    );
  };

  const openPostDetail = (post, snippet = null) => {
    setSelectedPost(post);
    setHighlightSnippet(snippet);
  };

  const closePostDetail = () => {
    setSelectedPost(null);
    setHighlightSnippet(null);
  };

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
        toggleLike
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
