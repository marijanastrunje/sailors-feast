import React, { useEffect, useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Faq = ({ topic, topicId }) => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    if (!topicId) return;

    fetch(`${backendUrl}/wp-json/wp/v2/faq?faq_topic=${topicId}`)
      .then((res) => res.json())
      .then((data) => setFaqs(data))
      .catch((err) => console.error("Greška pri dohvaćanju FAQ-a:", err));
  }, [topicId]);

  if (!faqs.length) return null;

  return (
    <div className="container col-md-8 my-5">
      <h2 className="mb-4 text-center">
        Najčešća pitanja{topic ? ` – ${topic}` : ""}
      </h2>

      {/* Dodajemo inline CSS za promjenu boje ako ne želite stvarati zasebnu CSS datoteku */}
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
          >
            <h2 className="accordion-header" id={`heading-${faq.id}`}>
              <button
                className="accordion-button collapsed fw-bold"
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
              data-bs-parent={`#accordion-${topicId}`}
            >
              <div className="accordion-body bg-light">
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