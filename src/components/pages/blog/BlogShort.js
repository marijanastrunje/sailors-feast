import React from "react";
import { Link } from "react-router-dom";
import MediaImg from "../../media/MediaImg";
import PostCategory from "../../data/PostCategory";
import PostDate from "../../data/PostDate";
import "./BlogShort.css";

const BlogShort = ({ post, limit = 150 }) => {
  const excerpt =
    post?.excerpt?.rendered?.slice(0, limit) || "No excerpt available.";
  const titleText = post.title?.rendered?.replace(/<[^>]*>/g, "") || "Untitled Post";
  const postId = `post-title-${post.id}`;

  return (
    <div className="blog-home" role="article" aria-labelledby={postId}>
      <div className="row align-items-center">
        <div className="blog-img col-sm-5 col-md-4 col-lg-3 mb-2 mb-lg-0">
          <Link
            to={`/blog/${post.slug}`}
            aria-label={`Open full post: ${titleText}`}
          >
            <MediaImg
              mediaId={post.featured_media}
              alt={titleText}
            />
          </Link>
        </div>
        <div className="col-12 col-sm-7 col-md-8 col-lg-9">
          <Link
            to={`/blog/${post.slug}`}
            aria-label={`Read full blog post titled: ${titleText}`}
          >
            <h3 id={postId} dangerouslySetInnerHTML={{ __html: post.title?.rendered || "Untitled Post" }} />
          </Link>
          <div className="mb-0">
            <PostDate date={post.date} />
            {Array.isArray(post.categories) &&
              post.categories.map((catID) => (
                <PostCategory key={catID} categoryID={catID} />
              ))}
          </div>
          <p dangerouslySetInnerHTML={{ __html: excerpt }} />
        </div>
      </div>
    </div>
  );
};

export default BlogShort;
