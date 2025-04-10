import React from "react";
import { Link } from "react-router-dom";

const HeroVideo = () => {

  return (
    <section id="hero" className="align-items-md-center justify-content-md-start mb-0 position-relative">
        <img
          src="/img/home/video-poster.jpg"
          alt="Sailor's Feast poster"
          className="position-absolute w-100 h-100 object-fit-cover"
          width={1440}
          height={600}
        />
      <div className="hero-text ps-md-5 ms-md-5">
        <img
          src="img/home/hand-drawn-boat-symbol-for-sailors-feast.png"
          alt="Hand-drawn boat symbol for Sailor's Feast"
          title="Hand-drawn boat symbol for Sailor's Feast"
          width={70}
          height={80}
          className="icon-dynamic me-2 mt-2"
        />
        <div>
          <h1 className="m-0">Sailor's Feast</h1>
          <h2 className="text-start mb-1">Yacht Supply Croatia</h2>
          <p>We bring fresh food and tasty drinks right to your boat, so you can enjoy more time on the water.</p>
          <Link to="/groceries" className="btn btn-prim" aria-label="Plan your meals and order food packages now">
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroVideo;
