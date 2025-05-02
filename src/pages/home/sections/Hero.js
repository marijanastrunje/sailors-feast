import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="hero" className="align-items-md-center justify-content-md-start mb-0 position-relative" style={{ zIndex: 10 }}>
      <img
        src="/img/home/hero.jpg"
        alt="Sailor's Feast hero"
        className="position-absolute w-100 h-100 object-fit-cover"
        width={1440}
        height={600}
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero-text ps-md-5 ms-md-5">
        <img
          src="/img/home/brod-original.png" 
          alt="Hand-drawn boat symbol for Sailor's Feast"
          width={70}
          height={80}
          className="icon-dynamic me-2"
          loading="lazy"
          decoding="async"
        />
        <div>
          <h1 className="m-0">Sailor's Feast</h1>
          <h2 className="text-start mb-0">Yacht supply Croatia</h2>
          <p>We bring fresh food and tasty drinks right to your boat, so you can enjoy more time on the water.</p>
          <Link to="/groceries" className="btn btn-prim">
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;