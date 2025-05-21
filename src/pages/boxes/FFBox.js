import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/common/SEO";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";

const FFBox = () => {
  return (
    <>
      <SEO
        title="Friends & Family box"
        description="Make sailing even more fun with our Friends & Family box! Packed with snacks, drinks, and goodies everyone on board will love, delivered to your boat in Croatia."
        keywords={[
          'Friends & Family Box',
          'boat snacks',
          'family sailing',
          'Croatia food delivery',
          'Sailor\'s Feast'
        ]}
        path="/friends-family-box"
      />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            {/* Box image placeholder or icon */}
            <div className="mb-4">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light"
                style={{ width: "120px", height: "120px" }}
              >
                <i className="fas fa-users fa-3x text-muted"></i>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="display-4 mb-3">Friends & Family Box</h1>
            
            {/* Development notice */}
            <div className="alert alert-info border-0 shadow-sm mb-4">
              <h4 className="alert-heading">
                <i className="fas fa-tools me-2"></i>
                Coming Soon
              </h4>
              <p className="mb-0">
                We're crafting the perfect Friends & Family Box that will make your sailing 
                adventure even more enjoyable. Packed with snacks, drinks, and goodies that 
                everyone on board will love!
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

export default FFBox;