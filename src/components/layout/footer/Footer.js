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

    if(location.pathname === '/login') return null;
    if(location.pathname === '/register') return null;

    return(
        <footer className="footer">
            <div className="container">
                <div className="row">
                <div className="col-md-4 p-3 text-center text-md-start">
                    <Link to={"/"}>
                    <img src="/img/logo/gray-color-logo-horizontal-sailors-feast.svg" width="250" height="50" alt="Sailor's Feast logo" title="Sailor's Feast logo" />
                    </Link>
                    <p className="px-2">
                        Ivana Meštrovića 35, Sesvete<br />
                        Phone: <a href="tel:+385955399166">+385 95 539 9166</a><br />
                        E-mail: <a href="mailto:info@sailorsfeast.com">info@sailorsfeast.com</a><br />
                        OIB: 42509895972<br />
                        IBAN: HR9124020061101222221
                    </p>
                </div>

                <div className="col-md-4 text-center pt-md-4 mb-2">
                    <Link to="/charter"><p className="m-0">Charter</p></Link>
                    <Link to="/faq"><p className="m-0">FAQ</p></Link>
                    <Link to="/privacy-policy"><p className="m-0">Privacy Policy</p></Link>
                    <Link to="/terms-and-conditions"><p>Terms&Conditions</p></Link>
                </div>
                
                <div className="col-md-4 text-center ms-auto px-5 pt-md-4">
                    <h4>Newsletter</h4>
                    <p>Subscribe to our newsletter</p>
                    <div><input type="text" placeholder="Write your email here" className="form-control"/></div>
                    <Link className="btn btn-prim my-3">Subscribe</Link>
                </div>
                </div>
                <div className="footer-bottom row text-center">
                    <p>© 2025 Sailor's Feast. All Right Reserved</p>
                <div className="icons text-center">
                    <Link to="/linkedin" aria-label="Facebook"><FontAwesomeIcon icon={faSquareFacebook} /></Link>
                    <Link to="/linkedin" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></Link>
                    <Link to="/linkedin"aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} /></Link>
                    <Link to="/linkedin" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedin} /></Link>
                </div>
                </div>
            </div>
            </footer>
    );
};

export default Footer;