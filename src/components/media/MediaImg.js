import React, { useEffect, useState } from "react";

const MediaImg = ({ mediaId, alt }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (!mediaId) return;

        fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/media/${mediaId}`)
            .then(response => response.json())
            .then(data => {
                setImageUrl(data.source_url || data.guid.rendered);
            })
            .catch(error => console.error("Error fetching image:", error));
    }, [mediaId]);

    return (
        <img 
            src={imageUrl || "https://placehold.co/600x400?text=No+Image"} 
            alt={alt || "Image"} 
            className="img-fluid"
        />
    );
};

export default MediaImg;
