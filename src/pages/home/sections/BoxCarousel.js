import React, { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import BoxCarouselSkeleton from "./BoxCarouselSkeleton"; // Import the skeleton component

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const BoxCarousel = () => {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null; // <- dodano
  
    setLoading(true);
  
    fetch(`${backendUrl}/wp-json/wp/v2/boxes?per_page=10&_embed`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setBoxes(data);
          setLoading(false);
  
          timeoutId = setTimeout(() => { // <- spremamo ID
            if (!isMounted) return;
  
            const el = document.getElementById("carouselExample");
            if (el && window.bootstrap?.Carousel) {
              new window.bootstrap.Carousel(el, {
                interval: 5000,
                ride: "carousel",
              });
            }
          }, 100);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Error fetching boxes:", err);
          setLoading(false);
        }
      });
  
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId); // <- čišćenje!
    };
  }, []);
  

  // If loading, show the skeleton component
  if (loading) return <BoxCarouselSkeleton />;
  
  // If not loading but no boxes, return null or some fallback
  if (boxes.length === 0) return null;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <h2>Food box</h2>

        <div
          className="box-carousel col-12 col-md-8 col-lg-6 p-0 carousel slide"
          id="carouselExample"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {boxes.map((box, index) => {
              const image = box._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
              const alt = box._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || box.title.rendered;

              return (
                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={box.id}>
                  <div className="box-carousel-img">
                    <img
                      src={image}
                      width={660}
                      height={350}
                      alt={alt}
                      title={alt}
                      className="d-block w-100"
                    />
                    <div className="box-carousel-text mx-5 px-sm-3 mt-4">
                      <h3 dangerouslySetInnerHTML={{ __html: box.title.rendered }} />
                      <p dangerouslySetInnerHTML={{ __html: box.content.rendered || box.content.rendered }} />
                      <Link to={`/${box.slug}`}>
                        <button className="btn btn-prim">View Box</button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className="why-us d-none d-lg-inline col-lg-3 bg-white pt-4">
          <h4 className="mb-3 text-center fw-bold">Why choose Sailor's Feast?</h4>
          <ul className="ps-2">
            <li className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
              <span>We bring you fresh, local flavors</span>
            </li>
            <li className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
              <span>You choose what suits your crew</span>
            </li>
            <li className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
              <span>We make cooking easy on board</span>
            </li>
            <li className="d-flex align-items-center">
              <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
              <span>And we pack it all with love</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default memo(BoxCarousel);