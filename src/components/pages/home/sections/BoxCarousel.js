import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const BoxCarousel = () => {
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/wp-json/wp/v2/boxes?per_page=10&_embed`)
      .then(res => res.json())
      .then(data => {
        setBoxes(data);

        // Inicijaliziraj Bootstrap carousel ručno
        setTimeout(() => {
          const el = document.getElementById("carouselExample");
          if (el && window.bootstrap?.Carousel) {
            new window.bootstrap.Carousel(el, {
              interval: 5000,
              ride: "carousel",
            });
          }
        }, 100);
      })
      .catch(err => console.error("Error fetching boxes:", err));
  }, []);

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
                      <div className="box-carousel-text mx-5 px-sm-3">
                        <h3 dangerouslySetInnerHTML={{ __html: box.title.rendered }} />
                        <p dangerouslySetInnerHTML={{ __html: box.content.rendered || box.content.rendered }} />
                        <Link to={`/${box.slug}`}>
                          <button className="btn btn-prim mt-2">View Box</button>
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

          <div className="why-us d-none d-lg-inline col-lg-3 bg-white pt-5">
            <h4 className="mb-3 text-center fw-bold">Zašto odabrati nas?</h4>
            <ul className="ps-3">
              <li className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
                <span>Svježe lokalne namirnice</span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
                <span>Prilagodljivi paketi po vašim željama</span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
                <span>Praktična rješenja za obroke na brodu</span>
              </li>
              <li className="d-flex align-items-center">
                <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
                <span>Ekološka ambalaža i održivost</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

  );
};

export default BoxCarousel;
