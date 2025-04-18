import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MediaImg from "../../components/common/media/MediaImg";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import SEO from "../../components/common/SEO";
import Loader from "../../components/common/Loader"

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const BlogSingle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${backendUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPost(data[0]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju posta:", error);
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) return <Loader />;


  if (!post) return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center py-5">
          <h2>Post not found</h2>
          <p>Sorry, no article found.</p>
        </div>
      </div>
    </div>
  );

  const ogImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/img/logo/white-color-logo-horizontal-sailors-feast.svg';

  return (
    <>
      <SEO
        title={post.title?.rendered}
        description={post.excerpt?.rendered.replace(/(<([^>]+)>)/gi, "")}
        ogImage={ogImageUrl}
      />
      <article className="blog-single">
        <div className="container pb-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              {/* Header Section */}
              <header className="blog-header mb-4">
                <h1 className="blog-title mb-3" aria-label="Post title">
                  {post.title?.rendered || "Untitled Post"}
                </h1>
                
                <div className="blog-meta d-flex align-items-center mb-4">
                  <p className="blog-author mb-0">
                    By <b>{post.yoast_head_json?.author || "Sailor's Feast"}</b>
                  </p>
                  <p className="mx-2 mb-0">•</p>
                  <p className="blog-date mb-0">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </header>

              {/* Featured Image Container */}
              <div className="featured-image-container mb-5">
                <div className="blog-featured-image">
                  <MediaImg
                    mediaId={post.featured_media}
                    alt={post.title?.rendered || "Blog featured image"}
                    className="img-fluid rounded"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div 
                className="blog-content"
                aria-label="Blog content"
                dangerouslySetInnerHTML={{
                  __html: post.content?.rendered || "<p>No content available.</p>",
                }}
              />

              {/* Related Content Section */}
              <div className="related-content mt-5 pt-4 border-top">
                <h4 className="mb-4">See more of similar content:</h4>
                {/* Ovdje bi došli povezani članci */}
              </div>
            </div>
          </div>
        </div>

        <ScrollToTopButton />
      </article>
    </>
  );
};

export default BlogSingle;