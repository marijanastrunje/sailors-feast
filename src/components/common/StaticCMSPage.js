import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";

const StaticCMSPage = ({ className, title, slug }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/wp-json/wp/v2/pages?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setContent(data[0].content.rendered);
          } else {
            setError("Content not found.");
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("An error occurred while loading content.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) return <Loader message="Loading content..." />;
  if (error) return <p className="text-danger text-center py-5">{error}</p>;

  return (
    <section className="container col-md-8 pt-3 pb-5">
      <h1 className="text-center mb-4">{title}</h1>
      <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
};

export default StaticCMSPage;
