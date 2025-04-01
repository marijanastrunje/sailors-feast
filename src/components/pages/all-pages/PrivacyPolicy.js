import React, { useEffect, useState } from "react";

const PrivacyPolicyPage = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/wp-json/wp/v2/pages?slug=privacy-policy`)
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
    <section className="container col-md-8 py-5">
      <h1 className="text-center mb-4">Privacy Policy</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
};

export default PrivacyPolicyPage;
