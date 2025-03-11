import React from "react";
import axios from "axios";
import xml2js from "xml2js";
import './Delivery.css';

const Delivery = () => {
    return(
        <>
        <section id="delivery">
            <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                <h2>Marina Delivery Points:</h2>
                <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1u5Hx3EedR34xYeOG-zZPcCueSxX0I5o&ehbc=2E312F&noprof=1" width="100%" height="350"></iframe>
                </div>
            </div>
            </div>  
        </section>
        </>
    );
};

export default Delivery;        