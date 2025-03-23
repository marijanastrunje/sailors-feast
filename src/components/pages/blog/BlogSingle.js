import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MediaImg from "../../media/MediaImg";

const BlogSingle = () => {
  const { slug } = useParams(); // slug iz URL-a
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/posts?slug=${slug}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setPost(data[0]);
        }
      });
  }, [slug]);

  if (!post) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="blog-title">{post.title.rendered}</h1>

          <MediaImg mediaId={post.featured_media} alt={post.title.rendered} />

          <p className="blog-author">
            By <b>{post.yoast_head_json?.author || "Sailor's Feast"}</b> |{" "}
            {new Date(post.date).toLocaleDateString()}
          </p>

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          <h4 className="py-3">See more of similar content:</h4>
        </div>
      </div>
    </div>
  );
};

export default BlogSingle;
