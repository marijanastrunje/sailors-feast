import React, { useEffect, useState } from "react";

const Faq = ({ topic, topicId }) => {
  const [faqs, setFaqs] = useState([]);

  // Dohvati FAQ-eve za zadani topic
  useEffect(() => {
    fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/faq?faq_topic=${topicId}`)
      .then(res => res.json())
      .then(data => setFaqs(data));
  }, [topicId]);

  return (
    <div className="container col-md-8 my-5">
      <h2 className="mb-4">Najčešća pitanja {topic ? `– ${topic}` : ""}</h2>

      <div className="accordion accordion-flush mt-4" id={`accordion-${topic}`}>
        {faqs.map((faq) => (
          <div className="accordion-item" key={faq.id}>
            <h2 className="accordion-header" id={`heading-${faq.id}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${faq.id}`}
                aria-expanded="false"
                aria-controls={`collapse-${faq.id}`}
              >
                {faq.title.rendered}
              </button>
            </h2>
            <div
              id={`collapse-${faq.id}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading-${faq.id}`}
              data-bs-parent={`#accordion-${topic}`}
            >
              <div className="accordion-body">
                <div dangerouslySetInnerHTML={{ __html: faq.content.rendered }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
