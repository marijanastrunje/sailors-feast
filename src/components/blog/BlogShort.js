import React from "react";
import { Link } from "react-router-dom";
import MediaImg from "../common/media/MediaImg";
import PostCategory from "../common/data/PostCategory";
import PostDate from "../common/data/PostDate";
import "./BlogShort.css";

const BlogShort = ({ post, limit = 200 }) => {
  if (!post) return null;

  const cleanTitle = post.title?.rendered?.replace(/<[^>]*>/g, "") || "Untitled Post";
  const excerptText = post.excerpt?.rendered || "";

  const truncateAtWord = (html, limit) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    if (text.length <= limit) return text;
    const trimmed = text.slice(0, limit);
    return trimmed.slice(0, trimmed.lastIndexOf(" ")) + "...";
  };

  return (
    <article
      className="container d-flex align-items-center blog-home"
      aria-labelledby={`post-title-${post.id}`}
    >
      <div className="row">
        <div className="blog-img col-sm-5 col-md-4 col-lg-4 mb-2 mb-lg-0">
          <Link
            to={`/blog/${post.slug}`}
            aria-label={`Open full post: ${cleanTitle}`}
          >
            <MediaImg
              className="cover-img"
              mediaId={post.featured_media}
              alt={cleanTitle}
            />
          </Link>
        </div>

        <div className="col-12 col-sm-7 col-md-8 col-lg-8">
          <Link
            to={`/blog/${post.slug}`}
            aria-label={`Read full blog post titled: ${cleanTitle}`}
          >
            <h3
              id={`post-title-${post.id}`}
              dangerouslySetInnerHTML={{ __html: post.title?.rendered || "Untitled Post" }}
            />
          </Link>

          <div className="mb-0">
            <PostDate date={post.date} />
            {(Array.isArray(post.categories) ? post.categories : []).map((catID) => (
              <PostCategory key={catID} categoryID={catID} />
            ))}
          </div>

          <p>{truncateAtWord(excerptText, limit)}</p>
        </div>
      </div>
    </article>
  );
};

export default React.memo(BlogShort);
