import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MediaImg from "../../media/MediaImg";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const BlogSingle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/wp-json/wp/v2/posts?slug=${slug}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPost(data[0]);
        }
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju posta:", error);
      });
  }, [slug]);

  if (!post) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="blog-title" aria-label="Post title">
            {post.title?.rendered || "Untitled Post"}
          </h1>

          <MediaImg
            mediaId={post.featured_media}
            alt={post.title?.rendered || "Blog featured image"}
          />

          <p className="blog-author">
            By <b>{post.yoast_head_json?.author || "Sailor's Feast"}</b> |{" "}
            {new Date(post.date).toLocaleDateString()}
          </p>

          <div
            className="blog-content"
            aria-label="Blog content"
            dangerouslySetInnerHTML={{
              __html: post.content?.rendered || "<p>No content available.</p>",
            }}
          />

          <h4 className="py-3">See more of similar content:</h4>
        </div>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default BlogSingle;
