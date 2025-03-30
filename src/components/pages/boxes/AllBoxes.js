import React from "react";
import Faq from "../all-pages/Faq";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";
import './AllBoxes.css'

const AllBoxes = () => {
  return (
    <div className="container py-3">
      <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
        <h1 className="display-4 fw-normal text-body-emphasis">Pricing</h1>
        <p className="fs-5 text-body-secondary">
          Quickly build an effective pricing table for your potential customers with this Bootstrap example. It’s built with default Bootstrap components and utilities with little customization.
        </p>
      </div>

      <div className="row">
        {[1, 2, 3, 4].map((box) => (
          <div key={box} className="box-card col-12 col-md-6 col-xl-3 d-flex justify-content-center">
            <div className="card mb-4 shadow-sm">
              <svg
                className="bd-placeholder-img card-img-top"
                width="100%"
                height="180"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Placeholder: Image cap"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
              >
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="#868e96"></rect>
                <text x="50%" y="50%" fill="#dee2e6" dy=".3em" textAnchor="middle">
                  Image cap
                </text>
              </svg>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="display-6 text-center mb-md-5 pt-md-5">Compare plans</h2>

      <div className="table-responsive">
        <table className="table text-center">
          <thead>
            <tr>
              <th style={{ width: "34%" }}></th>
              <th style={{ width: "22%" }}>Free</th>
              <th style={{ width: "22%" }}>Pro</th>
              <th style={{ width: "22%" }}>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="text-start">Public</th>
              <td>✔️</td>
              <td>✔️</td>
              <td>✔️</td>
            </tr>
            <tr>
              <th scope="row" className="text-start">Private</th>
              <td></td>
              <td>✔️</td>
              <td>✔️</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th scope="row" className="text-start">Permissions</th>
              <td>✔️</td>
              <td>✔️</td>
              <td>✔️</td>
            </tr>
            <tr>
              <th scope="row" className="text-start">Sharing</th>
              <td></td>
              <td>✔️</td>
              <td>✔️</td>
            </tr>
            <tr>
              <th scope="row" className="text-start">Unlimited members</th>
              <td></td>
              <td>✔️</td>
              <td>✔️</td>
            </tr>
            <tr>
              <th scope="row" className="text-start">Extra security</th>
              <td></td>
              <td></td>
              <td>✔️</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="Faq">
        <Faq topicId={196} topic="Food Boxes" />
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default AllBoxes;
