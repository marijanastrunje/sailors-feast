import React, { useEffect, useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Faq = ({ topic, topicId, hideTitle = false }) => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!topicId) return;

    setIsLoading(true);
    
    fetch(`${backendUrl}/wp-json/wp/v2/faq?faq_topic=${topicId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setFaqs(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Greška pri dohvaćanju FAQ-a:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [topicId]);

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!faqs.length) return null;

  return (
    <div className="container col-md-8 my-4">
      {!hideTitle && (
        <h2 className="mb-4 text-center">
          Frequently asked questions
        </h2>
      )}

      <style>
        {`
          .accordion-button:not(.collapsed) {
            color:rgb(0, 0, 0);
            background-color: #f2f2f2;
            box-shadow: inset 0 -1px 0 rgba(0,0,0,.125);
          }
          
          .accordion-button:focus {
            border-color: #ced4da;
            box-shadow: 0 0 0 0.25rem rgba(108, 117, 125, 0.25);
          }
          
          .accordion-button:not(.collapsed)::after {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23495057'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
          }
        `}
      </style>

      <div className="accordion accordion-flush mt-4 shadow rounded border" id={`accordion-${topicId}`}>
        {faqs.map((faq, index) => (
          <div 
            className={`accordion-item ${index === 0 ? 'border-top-0' : ''} ${index === faqs.length - 1 ? 'border-bottom-0' : ''}`}
            key={faq.id}
            itemScope
            itemType="https://schema.org/Question"
          >
            <h2 className="accordion-header" id={`heading-${faq.id}`}>
              <button
                className="accordion-button collapsed fw-bold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${faq.id}`}
                aria-expanded="false"
                aria-controls={`collapse-${faq.id}`}
                itemProp="name"
              >
                {faq.title.rendered}
              </button>
            </h2>
            <div
              id={`collapse-${faq.id}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading-${faq.id}`}
              data-bs-parent={`#accordion-${topicId}`}
              itemScope
              itemType="https://schema.org/Answer"
            >
              <div className="accordion-body bg-light" itemProp="text">
                <div
                  dangerouslySetInnerHTML={{ __html: faq.content.rendered }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;