import React, { useState, useEffect } from "react";
import BlogShort from "./BlogShort";
import InstagramGallery from "../../instagram/Instagram";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";
import Pagination from "../all-pages/Pagination"; // ✅ dodaj ovo
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🔹 PAGINACIJA
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: 31, name: "Sailing" },
    { id: 27, name: "Cooking" },
    { id: 18, name: "Croatia" }
  ];

  useEffect(() => {
    const fetchUrl = selectedCategory
      ? `https://backend.sailorsfeast.com/wp-json/wp/v2/posts?_embed&categories=${selectedCategory}`
      : `https://backend.sailorsfeast.com/wp-json/wp/v2/posts?_embed&`;

    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setCurrentPage(1); // 🔹 Reset na prvu stranicu kod nove kategorije
      })
      .catch(error => console.error("Error fetching posts:", error));
  }, [selectedCategory]);

  return (
    <section id="blog">
      <div className="container py-5">
        <div className="row justify-content-center">
          <h1 className="text-center text-md-start text-lg-center">Blog</h1>

          <div className="col-sm-12 col-md-10 col-lg-8 offset-lg-2">
            {/* Filteri */}
            <div className="filteri d-flex justify-content-center justify-content-md-start justify-content-lg-center pb-5 flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`btn ${selectedCategory === cat.id ? "btn-secondary" : "btn-outline-secondary"}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
              {selectedCategory && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedCategory(null)}
                >
                  Show All
                </button>
              )}
            </div>

            {/* Postovi */}
            {currentPosts.length > 0 ? (
              <>
                {currentPosts.map(post => <BlogShort key={post.id} post={post} />)}
                {posts.length > itemsPerPage && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(posts.length / itemsPerPage)}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <p className="text-center">No posts available.</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="insta-blog-sidebar col-md-2">
            <InstagramGallery />
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </section>
  );
};

export default Blog;
