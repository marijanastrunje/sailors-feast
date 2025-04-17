import React from "react";
import { Link } from "react-router-dom";

const CharterPromoSection = () => {
  return (
    <section className="charter-promo-section py-3 bg-light">
      <div className="container col-md-8">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-lg-0">
            <img
              src="/img/charter/charter-bg.jpg"
              alt="Charter cooperation"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-6 text-center text-md-start">
            <h2 className="mb-3 text-md-start">You own a charter company?</h2>
            <p>
            We offer a partnership with no obligations. Your guests place their orders directly with us, and you simply provide extra care for them — without any extra work on your part.
            </p>
            <Link to="/charter" className="btn btn-prim">
            Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CharterPromoSection;