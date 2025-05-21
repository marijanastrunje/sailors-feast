import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/common/SEO";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";

const HealthyBox = () => {
  return (
    <>
      <SEO
        title="Healthy box"
        description="Stay energized at sea with our Healthy box! Enjoy fresh, nutritious snacks and meals delivered right to your boat in Croatia."
        keywords={[
          'Healthy Box',
          'healthy boat snacks',
          'sailing nutrition',
          'Croatia food delivery',
          'Sailor\'s Feast'
        ]}
        path="/healthy-box"
      />

      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">

            {/* Main heading */}
            <h1 className="display-4 mb-3">Healthy Box</h1>
            
            {/* Development notice */}
            <div className="alert alert-info border-0 shadow-sm mb-4">
              <h4 className="alert-heading">
                <i className="fas fa-tools me-2"></i>
                Under Development
              </h4>
              <p className="mb-0">
                We're currently working hard to bring you the perfect Healthy Box experience. 
                This box will contain fresh, nutritious snacks and meals that will keep you 
                feeling your best during your Croatian sailing adventure.
              </p>
            </div>

            {/* Link to Feast Box */}
            <div className="mb-4">
              <Link to="/feast-box" className="btn btn-prim btn-lg">
                <i className="fas fa-utensils me-2"></i>
                Try our Feast Box instead
              </Link>
            </div>

            {/* Contact info */}
            <div className="mt-5 pt-4 border-top">
              <p className="text-muted mb-2">
                Have questions or special requests?
              </p>
              <p className="text-muted">
                <i className="fas fa-envelope me-2"></i>
                Contact us at{" "}
                <a href="mailto:info@sailorsfeast.com" className="text-decoration-none">
                  info@sailorsfeast.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
    </>
  );
};

export default HealthyBox;