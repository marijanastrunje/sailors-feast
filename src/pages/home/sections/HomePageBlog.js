import React, { useEffect, useState } from "react";
import BlogShort from "../../../components/blog/BlogShort";
import BlogShortSkeleton from "../../../components/blog/BlogShortSkeleton";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const BlogBlock = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${backendUrl}/wp-json/wp/v2/posts?per_page=3&_embed`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju postova:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading
        ? [...Array(3)].map((_, i) => <BlogShortSkeleton key={i} />)
        : posts.map((post) => <BlogShort key={post.id} post={post} limit={190} />)
      }
    </>
  );
};

export default BlogBlock;
