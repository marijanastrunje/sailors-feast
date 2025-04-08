import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
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
      <Link to="/" className="d-inline-flex align-items-center">
        <FontAwesomeIcon icon={faInstagram} />
        #sailorsfeast
      </Link>
      <div className="instagram">
      <Slider {...settings}>
  {isMobile
    ? images.map((img, i) => (
        <div key={i} className="d-flex justify-content-center">
          <img
            className="py-1"
            src={img}
            alt={`Instagram ${i + 1}`}
            title={`Instagram ${i + 1}`}
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
            }}
          />
        </div>
      ))
    : groupedImages.map((group, index) => (
        <div key={index} style={{ width: "160px", margin: "0 auto" }}>
          {group.map((img, i) => (
            <img
              key={i}
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
          ))}
        </div>
      ))}
</Slider>



      </div>
    </div>
  );
};

export default InstagramGallery;
