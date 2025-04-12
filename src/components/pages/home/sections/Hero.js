import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSkeleton from "./HeroSkeleton";

const Hero = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Predefinirani URL glavne slike za preload
  const knownFeaturedImageUrl = "https://backend.sailorsfeast.com/wp-content/uploads/2023/04/video-poster.jpg";
  
  useEffect(() => {
    setLoading(true);
    
    // Dodajemo preload i za sliku (kao dinamični fallback)
    const preloadMainImage = () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = knownFeaturedImageUrl;
      link.as = 'image';
      link.type = 'image/jpeg';
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
    };
    
    // Preloada sliku samo ako već ne postoji preload tag
    if (!document.querySelector(`link[rel="preload"][href="${knownFeaturedImageUrl}"]`)) {
      preloadMainImage();
    }

    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/pages?slug=sailors-feast&_embed")
      .then((res) => res.json())
      .then((data) => {
        setHeroData(data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load hero content:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <HeroSkeleton />;
  
  if (!heroData) return null;

  const { title, content, acf, _embedded } = heroData;
  const featuredImage = _embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const boatLogo = acf?.boat_logo?.url;

  return (
    <section id="hero" className="align-items-md-center justify-content-md-start mb-0 position-relative">
      {featuredImage && (
        <img
          src={featuredImage}
          alt={title.rendered}
          className="position-absolute w-100 h-100 object-fit-cover"
          width={1440}
          height={600}
          fetchpriority="high"
          decoding="async"
        />
      )}
      <div className="hero-text ps-md-5 ms-md-5">
        {boatLogo && (
          <img
            src={boatLogo}
            alt="Hand-drawn boat symbol for Sailor's Feast"
            title="Hand-drawn boat symbol for Sailor's Feast"
            width={70}
            height={80}
            className="icon-dynamic me-2 mt-2"
            loading="lazy"
            decoding="async"
          />
        )}
        <div>
          <h1 className="m-0" dangerouslySetInnerHTML={{ __html: title.rendered }} />
          <div dangerouslySetInnerHTML={{ __html: content.rendered }} />
          <Link to="/groceries" className="btn btn-prim" aria-label="Plan your meals and order food packages now">
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;