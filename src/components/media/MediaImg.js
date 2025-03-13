import React, { useEffect, useState } from "react";

const MediaImg = ({ id, size }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2JhY2tlbmQuc2FpbG9yc2ZlYXN0LmNvbSIsImlhdCI6MTc0MTQ0MTQwNiwibmJmIjoxNzQxNDQxNDA2LCJleHAiOjE3NDIwNDYyMDYsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.wznVpcAi2gJN7oA9u5YqIPojlYp86G1YlPUpJo7o-_c";

    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/media/" + id, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error! Status: " + response.status);
        }
        return response.json();
      })
      .then((data) => setImage(data))
      .catch((error) => console.error("Error fetching media data:", error));
  }, [id]);

  if (!image)
    return (
      <img src="https://placehold.co/600x400?text=Loading..." alt="pristojni alternativni tekst" />
    );

  const imgSize =
    image?.media_details?.sizes[size]?.source_url || image?.guid?.rendered; // ukoliko nema zadane veličine uzima guid rendered sliku, jer u ekstremnim slučajevima nema uopće veličine

  return <img src={imgSize || "/img/post-village.webp"} alt={image.alt_text || "alt text"} />;
};

export default MediaImg;
