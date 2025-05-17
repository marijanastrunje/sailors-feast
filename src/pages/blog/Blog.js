import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import BlogShort from "../../components/blog/BlogShort";
import BlogShortSkeleton from "../../components/blog/BlogShortSkeleton";
import InstagramGallery from "../../components/common/instagram/Instagram";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import Pagination from "../../components/ui/Pagination";
import SEO from "../../components/common/SEO"; 
import "./Blog.css";

const STORAGE_KEY = 'blog_page_state';
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://backend.sailorsfeast.com';
const ITEMS_PER_PAGE = 6;

const categories = [
  { id: 31, name: "Sailing" },
  { id: 27, name: "Cooking" },
  { id: 18, name: "Croatia" },
];

const Blog = () => {
  // Load saved state from localStorage
  const loadSavedState = () => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
    return null;
  };

  const initialState = loadSavedState() || {
    selectedCategory: null,
    currentPage: 1
  };

  // State variables
  const [posts, setPosts] = useState([]);
  const [cachedPosts, setCachedPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialState.selectedCategory);
  const [currentPage, setCurrentPage] = useState(initialState.currentPage);
  
  // Use refs to access latest state values without re-triggering effects
  const cachedPostsRef = useRef(cachedPosts);
  const currentPageRef = useRef(currentPage);
  
  // Keep refs updated with latest values
  useEffect(() => {
    cachedPostsRef.current = cachedPosts;
  }, [cachedPosts]);
  
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Derived state with useMemo
  const currentPosts = useMemo(() => {
    const indexOfLastPost = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - ITEMS_PER_PAGE;
    return posts.slice(indexOfFirstPost, indexOfLastPost);
  }, [posts, currentPage]);

  const totalPages = useMemo(() => 
    Math.ceil(posts.length / ITEMS_PER_PAGE), 
  [posts.length]);

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      selectedCategory,
      currentPage
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [selectedCategory, currentPage]);

  // Fetch posts when selected category changes
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPosts = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      // Check if we have cached data for this category
      const cacheKey = selectedCategory || 'all';
      if (cachedPostsRef.current[cacheKey]) {
        setPosts(cachedPostsRef.current[cacheKey]);
        setLoading(false);
        return;
      }
      
      const url = selectedCategory
        ? `${backendUrl}/wp-json/wp/v2/posts?_embed&categories=${selectedCategory}`
        : `${backendUrl}/wp-json/wp/v2/posts?_embed`;

      try {
        const res = await fetch(url, { signal });
        
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (isMounted && Array.isArray(data)) {
          setPosts(data);
          
          // Cache the results
          setCachedPosts(prev => ({
            ...prev,
            [cacheKey]: data
          }));
          
          // Only reset page if we're on a page that wouldn't exist in the new data
          const currentPageValue = currentPageRef.current;
          if (currentPageValue > Math.ceil(data.length / ITEMS_PER_PAGE)) {
            setCurrentPage(1);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error("Error fetching posts:", err);
          setError("Failed to load blog posts. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  // Reset category filter
  const resetCategoryFilter = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  // Render skeleton loaders
  const renderSkeletons = () => {
    return [...Array(ITEMS_PER_PAGE)].map((_, index) => (
      <BlogShortSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Join the Sailor's Feast blog for fun stories, easy recipes, and cool sailing tips! Get the best ideas to make your Croatia boat trip tasty and awesome."
        keywords={['sailing tips', 'easy recipes', 'Croatia travel', 'boat food', 'yachting blog', 'Sailor\'s Feast']}
        path="/blog"
      />
      <section id="blog">
        <div className="container-fluid pb-5">
          <div className="row justify-content-center">
            <div className="col-sm-12 col-md-10 col-lg-8 offset-lg-1">
              <h1 className="text-center">Blog</h1>
              <div className="filteri d-flex justify-content-center justify-content-md-start justify-content-lg-center pb-5 flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`btn ${
                      selectedCategory === cat.id ? "btn-secondary" : "btn-outline-secondary"
                    }`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
                {selectedCategory && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={resetCategoryFilter}
                  >
                    Show All
                  </button>
                )}
              </div>

              {loading ? (
                // Show skeletons during loading
                renderSkeletons()
              ) : error ? (
                // Show error message if fetch failed
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : currentPosts.length > 0 ? (
                // Show posts when loaded
                <>
                  {currentPosts.map((post) => (
                    <BlogShort key={post.id} post={post} />
                  ))}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                // Message if no posts found
                <p className="text-center">No posts available.</p>
              )}
            </div>

            <div className="insta-blog-sidebar col-md-2">
              <InstagramGallery />
            </div>
          </div>
        </div>
        <ScrollToTopButton />
      </section>
    </>
  );
};

export default Blog;