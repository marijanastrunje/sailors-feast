import React, { useEffect, useState } from "react";
import "./MediaImg.css";

const MediaImg = ({ mediaId, alt, className = "", ...props }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Resetiramo stanje kad se mediaId promijeni
    setIsLoading(true);
    setImageLoaded(false);
    setImageUrl(null);
    
    if (!mediaId) {
      setIsLoading(false);
      return;
    }

    fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/media/${mediaId}`)
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch image data");
        return response.json();
      })
      .then(data => {
        setImageUrl(data.source_url || data.guid.rendered);
        // Ne postavljamo isLoading=false ovdje jer će to biti
        // postavljeno kada se sama slika učita
      })
      .catch(error => {
        console.error("Error fetching image:", error);
        setIsLoading(false);
      });
  }, [mediaId]);

  // Funkcija koja se poziva kad se slika učita
  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false);
  };

  // Funkcija koja se poziva u slučaju greške pri učitavanju slike
  const handleImageError = () => {
    setIsLoading(false);
  };

  return (
    <div className={`media-img-container ${className}`} {...props}>
      {/* Skeleton placeholder dok se slika učitava */}
      {isLoading && (
        <div className="media-img-skeleton animate-pulse"></div>
      )}
      
      {/* Prava slika koja se prikazuje tek kad se učita */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt || "Image"}
          className={`media-img ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export default MediaImg;