import React, { useEffect, useState } from "react";
import "./PrivacyPolicy.css";

const TermsAndConditions = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/wp-json/wp/v2/pages?slug=termsconditions`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setContent(data[0].content.rendered);
        }
      })
      .catch((err) => console.error("Greška pri dohvaćanju sadržaja:", err));
  }, []);

  if (!content) return <p className="text-center py-5">Učitavanje...</p>;

  return (
    <section className="container col-md-8 pt-3 pb-5">
      <h1 className="text-center mb-4">Terms & Conditions</h1>
      <div className="privacy-policy-content" dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
};

export default TermsAndConditions;
