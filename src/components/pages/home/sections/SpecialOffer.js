import { Link } from "react-router-dom";
import SplitWeatherCard from "./delivery/WeatherCard";

const SpecialOffer = () => (

    <div className="container me-md-3">
      <div className="row justify-content-center justify-content-lg-end">
        <div className="col-md-6 text-center pb-2">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <img src="img/home/special-offer-icon-fire-percent.png" width={60} height={60} alt="Fire icon" />
            <h2 className="mb-0">Special offer</h2>
          </div>
          <div>
            <p>Join our Sailor's Feast community and unlock <strong>exclusive benefits!</strong> Members enjoy discounts, special packages, and access to an easy-to-use interactive platform.</p>
            <p>Plan ahead and save! Place your order by <b>31.03.2025.</b> to enjoy up to <strong>20% off</strong> and special gift.</p>
            <Link to="/groceries" className="btn btn-prim me-2">Place Your Order</Link>
        </div>
        </div>
        <div className="d-none d-md-block col-md-4 col-lg-3 offset-lg-1">
          <SplitWeatherCard />
        </div>
      </div>
    </div>

);

export default SpecialOffer;
