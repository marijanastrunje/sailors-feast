import React from "react";
import { Link } from "react-router-dom";
import MediaImg from "../all-pages/media/MediaImg";
import PostCategory from "../all-pages/data/PostCategory";
import PostDate from "../all-pages/data/PostDate";
import "./BlogShort.css";

const BlogShort = ({ post, limit = 150 }) => {
  if (!post) return null;

  return (
    <div className="blog-home" role="article" aria-labelledby={"post-title-" + post.id}>
      <div className="row align-items-center">
        <div className="blog-img col-sm-5 col-md-4 col-lg-3 mb-2 mb-lg-0">
          <Link
            to={"/blog/" + post.slug}
            aria-label={"Open full post: " + (post.title && post.title.rendered ? post.title.rendered.replace(/<[^>]*>/g, "") : "Untitled Post")}
          >
            <MediaImg
              mediaId={post.featured_media}
              alt={(post.title && post.title.rendered ? post.title.rendered.replace(/<[^>]*>/g, "") : "Untitled Post")}
            />
          </Link>
        </div>
        <div className="col-12 col-sm-7 col-md-8 col-lg-9">
          <Link
            to={"/blog/" + post.slug}
            aria-label={"Read full blog post titled: " + (post.title && post.title.rendered ? post.title.rendered.replace(/<[^>]*>/g, "") : "Untitled Post")}
          >
            <h3
              id={"post-title-" + post.id}
              dangerouslySetInnerHTML={{ __html: post.title && post.title.rendered ? post.title.rendered : "Untitled Post" }}
            />
          </Link>
          <div className="mb-0">
            <PostDate date={post.date} />
            {(Array.isArray(post.categories) ? post.categories : []).map(catID => (
              <PostCategory key={catID} categoryID={catID} />
            ))}
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: (post.excerpt && post.excerpt.rendered ? post.excerpt.rendered.slice(0, limit) : "No excerpt available.")
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogShort;
