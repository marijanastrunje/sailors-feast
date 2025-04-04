import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Faq from "../all-pages/Faq";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const siteKey = process.env.REACT_APP_SITE_KEY;

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("loading");

    if (!captchaValue) {
      alert("Please confirm you're not a robot.");
      setStatus("error");
      return;
    }

    fetch(`${backendUrl}/wp-json/custom/v1/verify-recaptcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: captchaValue }),
    })
      .then((res) => res.json())
      .then((captchaResult) => {
        if (!captchaResult.success) {
          throw new Error("reCAPTCHA failed.");
        }

        return fetch(`${backendUrl}/wp-json/custom/v1/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setStatus("success");
          alert(data.message);
          setForm({ name: "", email: "", message: "" });
          setCaptchaValue(null);
        } else {
          setStatus("error");
          alert(data.message || "An error occurred.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setStatus("error");
        alert(err.message || "Sending failed.");
      });
  };

  return (
    <>
      <div className="my-5">
        <div className="p-2 text-center bg-body-tertiary">
          <div className="container py-3">
            <h1 className="text-body-emphasis">Contact Us</h1>
            <p className="col-lg-8 mx-auto lead">
              Reach out with questions, suggestions, or for help with your order.
              We're happy to assist you!
            </p>
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h2 className="mb-3">Contact Info</h2>
            <p>
              Sailor's Feast<br />
              +385 95 539 9166<br />
              Street and number<br />
              City
            </p>
          </div>

          <div className="col-md-6">
            <form onSubmit={handleSubmit} aria-labelledby="contact-form-title">
              <h3 id="contact-form-title" className="mb-4">Send us a message</h3>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  aria-label="Your name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  aria-label="Your email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your message"
                  className="form-control"
                  value={form.message}
                  onChange={handleChange}
                  aria-label="Your message"
                  required
                ></textarea>
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="privacyConsent"
                  aria-required="true"
                  required
                />
                <label className="form-check-label" htmlFor="privacyConsent">
                  I agree to the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
                </label>
              </div>

              <div className="mb-3">
                <ReCAPTCHA sitekey={siteKey} onChange={(value) => setCaptchaValue(value)} />
              </div>

              <button
                className="btn btn-secondary"
                type="submit"
                aria-label="Submit contact form"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      <div id="Faq">
        <Faq topicId={197} topic="Contact" />
      </div>
    </>
  );
};

export default ContactForm;
