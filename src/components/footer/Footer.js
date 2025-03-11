import React from "react";
import { Link, useLocation } from "react-router-dom";
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faInstagram, 
    faTwitter, 
    faLinkedin,
    faSquareFacebook, 
  } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {

    const location = useLocation();    

    if(location.pathname === '/Login') return null;

    return(
        <footer className="footer">
            <div className="container">
                <div className="row">
                <div className="col-md-4 p-3 text-center text-md-start">
                    <Link to={"/"}>
                    <img src="/img/logo/gray-color-logo-horizontal-sailors-feast.svg" width="250" height="50" alt="Sailor's Feast logo" title="Sailor's Feast logo" />
                    </Link>
                    <p className="px-2">Ivana Meštrovića 35, Sesvete<br/>
                    Phone: +385 95 539 9166 <br/>
                    E-mail: info@sailorsfeast.com
                    OIB:42509895972
                    IBAN:HR9124020061101222221</p>
                </div>
                
                <div className="col-md-4 text-center ms-auto px-5 pt-md-4">
                    <h4>Newsletter</h4>
                    <p>Subscribe to our newsletter to get more free tip</p>
                    <div><input type="text" placeholder="Write your email here" className="form-control"/></div>
                    <a href="#" className="btn my-3">Subscribe</a>
                </div>
                </div>
                <div className="footer-bottom row text-center">
                    <p>© 2025 Sailor's Feast. All Right Reserved</p>
                <div className="icons text-center">
                    <a href="#"><FontAwesomeIcon icon={faSquareFacebook} /></a>
                    <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                    <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
                </div>
                </div>
            </div>
            </footer>
    );
};

export default Footer;