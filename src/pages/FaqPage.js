import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import SEO from "../components/common/SEO";
import Faq from "../components/common/Faq";
import Loader from "../components/common/Loader";
import './FaqPage.css'

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://backend.sailorsfeast.com';

const FaqPage = () => {
  // Sekcije za FAQ
  const sections = useMemo(() => [
    { id: "faq-home", topic: "Home", topicId: 194, icon: "fa-home" },
    { id: "groceries", topic: "Groceries", topicId: 195, icon: "fa-shopping-basket" },
    { id: "faq-boxes", topic: "Food Boxes", topicId: 196, icon: "fa-box" },
    { id: "contact", topic: "Contact", topicId: 197, icon: "fa-envelope" },
  ], []);

  const [faqSchema, setFaqSchema] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(sections[0].id);

  // Scrolling handler
  useEffect(() => {
    const handleScroll = () => {
      
      // Pronađi koji je section trenutno u viewportu
      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 150 && bottom >= 150) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Dohvaćanje FAQ podataka
  useEffect(() => {
    const fetchAllFaqs = async () => {
      let allFaqs = [];
      setIsLoading(true);

      try {
        const promises = sections.map(({ topicId }) =>
          fetch(`${backendUrl}/wp-json/wp/v2/faq?faq_topic=${topicId}`)
            .then(res => {
              if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
              }
              return res.json();
            })
        );

        const results = await Promise.all(promises);

        results.forEach((sectionFaqs) => {
          sectionFaqs.forEach((faq) => {
            allFaqs.push({
              question: faq.title.rendered.replace(/(<([^>]+)>)/gi, ""),
              answer: faq.content.rendered.replace(/(<([^>]+)>)/gi, ""),
            });
          });
        });

        const faqJsonLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": allFaqs.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": { "@type": "Answer", "text": item.answer },
          })),
        };

        setFaqSchema(faqJsonLd);
      } catch (err) {
        console.error("Error generating FAQ schema.org:", err);
        setError("Failed to load FAQ data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFaqs();
  }, [sections]);

  // Scroll to section on click
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <>
      <SEO
        title="FAQ – Sailor's Feast"
        description="Find answers to frequently asked questions about Sailor's Feast: groceries, food boxes, orders, delivery, and more."
        keywords={['faq', 'frequently asked questions', 'sailing groceries', 'yacht food boxes', 'Sailor\'s Feast help', 'Croatia yacht delivery']}
        ogImage="https://www.sailorsfeast.com/img/og/faq.jpg"
        path="/faq"
      />
      <Helmet>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <div className="container my-5">
        {/* Header */}
        <h1 className="text-center pt-4 mb-5">Frequently asked questions</h1>
        
        {/* Navigation Tabs (horizontalno za mobilne, offset za desktop) */}
        <div className="row">
          <div className="col-12">
            <div className="d-md-none">
              <div className="nav nav-pills nav-fill mb-3 border-bottom">
                {sections.map(({ id, topic, icon }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`nav-link ${activeSection === id ? 'active' : ''}`}
                  >
                    <i className={`fas ${icon} me-2 d-none d-sm-inline`}></i> {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Sidebar (samo za desktop) */}
          <div className="col-md-3 d-none d-md-block">
            <div className="position-sticky">
              <div className="list-group">
                {sections.map(({ id, topic, icon }) => (
                  <button
                    key={id}
                    className={`list-group-item list-group-item-action ${activeSection === id ? 'active' : ''}`}
                    onClick={() => scrollToSection(id)}
                  >
                    <i className={`fas ${icon} me-3`}></i> {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-md-9">
            {isLoading && <Loader />}
            
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}
            
            {!isLoading && !error && (
              <>
                {sections.map(({ id, topic, topicId }) => (
                  <section key={id} id={id} className="mb-5 pt-2">
                    <h2 className="mb-0">{topic}</h2>
                    <Faq topicId={topicId} hideTitle={true} />
                  </section>
                ))}

                {/* Need More Help */}
                <div className="mt-5 p-4 border rounded">
                  <div className="text-center">
                    <h3 className="h5">Need more help?</h3>
                    <p>Can't find what you're looking for? Contact our team directly.</p>
                    <a href="/contact" className="btn btn-prim">
                      Contact Us
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqPage;