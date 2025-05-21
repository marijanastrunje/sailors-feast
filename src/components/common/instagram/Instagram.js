import { useEffect, useState } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const InstagramGallery = () => {
  const [images, setImages] = useState([]);

  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  handleResize(); // pozovi odmah
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  useEffect(() => {
    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/pages/1375?_embed")
      .then((res) => res.json())
      .then((data) => {
        const acf = data.acf || {};
        const imageUrls = [];

        for (let i = 1; i <= 10; i++) {
          const img = acf[`instagram_image_${i}`];
          if (img && img.url) {
            imageUrls.push(img.sizes?.thumbnail || img.url);
          }
        }

        setImages(imageUrls);
      });
  }, []);

  // Grupiranje po 3 slike
const groupedImages = [];
for (let i = 0; i < images.length; i += 3) {
  groupedImages.push(images.slice(i, i + 3));
}

  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    dots: false,
    arrows: false,
    infinite: true,
    
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };
  return (
    <div>
      <h4>Follow us</h4>
      <a href="https://www.instagram.com/sailorsfeast/" className="d-inline-flex align-items-center" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faInstagram} />
        #sailorsfeast
      </a>
      <div className="instagram">
      <Slider {...settings}>
        {isMobile
          ? images.map((img, i) => (
              <div key={i} className="d-flex justify-content-center instagram-img">
                <img
                  className="py-1"
                  src={img}
                  alt={`Instagram ${i + 1}`}
                  title={`Instagram ${i + 1}`}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ))
          : groupedImages.map((group, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                {group.map((img, i) => (
                  <div key={i} className="instagram-img">
                    <img
                      className="my-1"
                      src={img}
                      alt={`Instagram ${i + 1}`}
                      title={`Instagram ${i + 1}`}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
      </Slider>




      </div>
    </div>
  );
};

export default InstagramGallery;
