import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/common/SEO";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";

const StandardBox = () => {
  return (
    <>
      <SEO
        title="Standard box"
        description="Get all your sailing essentials with our Standard box! A perfect mix of snacks, meals, and drinks delivered to your boat in Croatia."
        keywords={[
          'Standard Box',
          'boat essentials',
          'sailing snacks',
          'Croatia boat delivery',
          'Sailor\'s Feast'
        ]}
        path="/standard-box"
      />

      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">

            {/* Main heading */}
            <h1 className="display-4 mb-3">Standard Box</h1>
            
            {/* Development notice */}
            <div className="alert alert-info border-0 shadow-sm mb-4">
              <h4 className="alert-heading">
                <i className="fas fa-tools me-2"></i>
                Under Development
              </h4>
              <p className="mb-0">
                We're currently working hard to bring you the perfect Standard Box experience. 
                This box will contain all your sailing essentials - snacks, meals, and drinks 
                carefully selected for your Croatian adventure.
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

export default StandardBox;