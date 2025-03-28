import React, { useState, useEffect } from "react";
import './Blog.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import BlogShort from "./BlogShort";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 31, name: "Sailing" },
    { id: 27, name: "Cooking" },
    { id: 18, name: "Croatia" }
  ];

  // Fetch svi postovi na početku
  useEffect(() => {
    const fetchUrl = selectedCategory
    ? `https://backend.sailorsfeast.com/wp-json/wp/v2/posts?_embed&categories=${selectedCategory}`
    : `https://backend.sailorsfeast.com/wp-json/wp/v2/posts?_embed&per_page=6`;


    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => setPosts(data))
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
            {posts.length > 0 ? (
              posts.map(post => <BlogShort key={post.id} post={post} />)
            ) : (
              <p className="text-center">No posts available.</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-md-2 mt-4 mt-md-0">
            <div>
              <h4>Follow us</h4>
              <a className="d-inline-flex align-items-center" href="/">
                <FontAwesomeIcon icon={faInstagram} /> #sailorsfeast
              </a>
            </div>
            <div className="instagram">
              <div>
                <img className="py-1" src="https://placehold.co/150x150" alt="" />
                <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" />
                <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" />
              </div>
              <div>
                <img className="py-1" src="https://placehold.co/150x150" alt="" />
                <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" />
                <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </section>
  );
};

export default Blog;
