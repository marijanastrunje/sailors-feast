import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SplitWeatherCard from "./delivery/WeatherCard";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SpecialOffer = () => {
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/wp-json/wp/v2/pages?slug=special-offer`)
      .then(res => res.json())
      .then(data => setPage(data[0]));
  }, []);

  if (!page) return null;

  return (
    <div className="container me-md-3">
      <div className="row justify-content-center justify-content-lg-end">
        <div className="col-md-6 text-center pb-2">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <img
              src="img/home/special-offer-icon-fire-percent.png"
              width={60}
              height={60}
              alt="Fire icon"
            />
            <h2 className="mb-0">{page.title.rendered}</h2>
          </div>
          <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
          <Link to="/groceries" className="btn btn-prim me-2">
            Place Your Order
          </Link>
        </div>
        <div className="d-none d-md-block col-md-4 col-lg-3 offset-lg-1">
          <SplitWeatherCard />
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
