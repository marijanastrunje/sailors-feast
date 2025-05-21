import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="hero" className="align-items-md-center justify-content-md-center mb-0 position-relative" style={{ zIndex: 10 }}>
      <img
        src="/img/home/hero.jpg"
        alt="Sailor's Feast hero"
        className="position-absolute w-100 h-100 object-fit-cover"
        width={1440}
        height={600}
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero-text position-relative text-white text-center px-3">
        <div className="d-flex align-items-center justify-content-start mb-3">
          <img
            src="/img/home/brod-original.png"
            alt="Hand-drawn boat symbol"
            width={70}
            height={80}
            className="me-3"
            loading="lazy"
            decoding="async"
          />
          <div className="text-start">
            <h1 className="m-0">Sailor's Feast</h1>
            <h2 className="m-0 fw-bold fs-3 text-start">Yacht supply Croatia</h2>
          </div>
        </div>

        <p className="fs-5 fw-semibold mb-3">
          We bring fresh food and tasty drinks right to your boat,
          so you can enjoy more time on the water.
        </p>

        <Link to="/groceries" className="btn btn-lg btn-prim">
          Shop now
        </Link>
      </div>
    </section>
  );
};

export default Hero;