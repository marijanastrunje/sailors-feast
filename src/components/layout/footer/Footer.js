import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faLinkedin,
  faSquareFacebook,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  if (location.pathname === "/login" || location.pathname === "/register") return null;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setStatus("loading");

    fetch(`${backendUrl}/wp-json/custom/v1/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Newsletter",
        email: email,
        message: "User subscribed via footer form.",
      }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setStatus("success");
          setEmail("");
        } else {
          setStatus("error");
          alert(data.message || "Subscription failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 p-3 text-center text-md-start">
            <Link to={"/"}>
              <img
                src="/img/logo/gray-color-logo-horizontal-sailors-feast.svg"
                width="250"
                height="50"
                alt="Sailor's Feast logo"
                title="Sailor's Feast logo"
              />
            </Link>
            <p className="px-2">
              Ivana Meštrovića 35, Sesvete<br />
              Phone:{" "}
              <a href="tel:+385916142773" className="text-muted">
                +385 91 614 2773
              </a>
              <br />
              E-mail:{" "}
              <a href="mailto:info@sailorsfeast.com" className="text-muted">
                info@sailorsfeast.com
              </a>
              <br />
              OIB: 42509895972<br />
              IBAN: HR9124020061101222221
            </p>
          </div>

          <div className="col-md-4 text-center pt-md-4 mb-2">
            <Link to="/charter"><p className="m-0 d-none">Charter</p></Link>
            <Link to="/faq"><p className="m-0">FAQ</p></Link>
            <Link to="/privacy-policy"><p className="m-0">Privacy Policy</p></Link>
            <Link to="/terms-and-conditions"><p>Terms&Conditions</p></Link>
          </div>

          <div className="col-md-4 text-center ms-auto px-5 pt-md-4">
            <h4>Newsletter</h4>
            <p>Subscribe to our newsletter</p>
            <form onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                className="form-control"
                placeholder="Write your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-prim my-3" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Subscribe"}
              </button>
              {status === "success" && (
                <p className="text-success m-0">Thank you for subscribing!</p>
              )}
              {status === "error" && (
                <p className="text-danger m-0">Something went wrong. Try again later.</p>
              )}
            </form>
          </div>
        </div>

        <div className="footer-bottom row text-center">
          <p>© 2025 Sailor's Feast. All Right Reserved</p>
          <div className="icons text-center">
            <a href="https://facebook.com/sailorsfeast" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FontAwesomeIcon icon={faSquareFacebook} />
            </a>
            <a href="https://instagram.com/sailorsfeast" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://twitter.com/sailorsfeast" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://linkedin.com/company/sailorsfeast" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
