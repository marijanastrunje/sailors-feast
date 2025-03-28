import React, { useEffect, useState } from "react";

const TermsAndConditions = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/pages?slug=termsconditions")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setContent(data[0].content.rendered);
        }
      })
      .catch(err => console.error("Greška pri dohvaćanju sadržaja:", err));
  }, []);

  if (!content) return <p>Učitavanje...</p>;

  return (
    <section className="container col-md-8 py-5">
      <h1 className="text-center mb-4">Terms&Conditions</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
};

export default TermsAndConditions;
