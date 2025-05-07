import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faShip, 
  faAnchor, 
  faCheckCircle, 
  faEnvelope, 
  faPhone, 
  faShoppingBasket, 
  faUsers 
} from "@fortawesome/free-solid-svg-icons";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import DeliveryMap from "../home/sections/delivery/DeliveryMap";
import "./CharterLandingPage.css";

const CharterLandingPage = () => {
  const [isVisible, setIsVisible] = useState({
    benefits: false,
    howItWorks: false,
    testimonials: false,
    materials: false,
    contact: false,
    keyPoints: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = {
        benefits: document.getElementById('benefits'),
        howItWorks: document.getElementById('how-it-works'),
        testimonials: document.getElementById('testimonials'),
        materials: document.getElementById('materials'),
        keyPoints: document.getElementById('key-points'),
        contact: document.getElementById('contact-charter')
      };

      Object.entries(sections).forEach(([key, section]) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight - 100) {
            setIsVisible(prev => ({ ...prev, [key]: true }));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Initialize sections visibility on component mount
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Hardcoded data for the landing page
  const benefitsData = [
    {
      icon: faShip,
      title: "Simplified Guest Experience",
      description: "Provide value-added service without any extra work for your crew or staff."
    },
    {
      icon: faAnchor,
      title: "Increased Guest Satisfaction",
      description: "Guests enjoy fresh local ingredients and more time on the water."
    },
    {
      icon: faShoppingBasket,
      title: "High-Quality Local Products",
      description: "We source the best Croatian products for an authentic sailing experience."
    },
    {
      icon: faUsers,
      title: "No Contractual Obligations",
      description: "Flexible partnership that adapts to your charter's specific needs."
    }
  ];

  const stepsData = [
    {
      number: "01",
      title: "Share Our Information",
      description: "Simply forward our contact details or prepared email template to your clients."
    },
    {
      number: "02",
      title: "We Handle Everything",
      description: "Guests contact us directly and place their orders according to their preferences."
    },
    {
      number: "03",
      title: "Fresh Delivery",
      description: "We prepare and deliver the order directly to the boat at the requested time."
    },
    {
      number: "04",
      title: "Happy Guests",
      description: "Your guests enjoy their sailing holiday with fresh supplies and more time on water."
    }
  ];

  const testimonialsData = [
    {
      text: "Partnering with Sailor's Feast has been a game-changer for our charter business. Our guests love the convenience, and we appreciate the professional service.",
      author: "Marina Charter Ltd.",
      location: "Split, Croatia"
    },
    {
      text: "The quality of products and reliability of delivery has made Sailor's Feast our go-to recommendation for all our sailing clients. It's a win-win for everyone.",
      author: "Adriatic Sailing",
      location: "Kaštela, Croatia"
    },
    {
      text: "Our international clients especially appreciate the ease of ordering local Croatian products without the stress of grocery shopping in an unfamiliar place.",
      author: "Blue Sail Croatia",
      location: "Trogir, Croatia"
    }
  ];

  const materialsData = [
    {
      title: "Email Template",
      description: "Ready-to-use email text to send to your guests",
      icon: faEnvelope,
      type: "doc",
      link: "#"
    },
    {
      title: "Product Catalog",
      description: "Downloadable PDF with our products and pricing",
      icon: faShoppingBasket,
      type: "pdf",
      link: "#"
    },
    {
      title: "Partnership Overview",
      description: "Detailed information about our charter partnership program",
      icon: faShip,
      type: "pdf",
      link: "#"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="charter-hero d-flex align-items-center text-white position-relative">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-6 charter-hero-content">
              <h1 className="text-white fw-bold mb-3">Charter Partner Program</h1>
              <p className="text-white fs-5 mb-3">
                Enhance your guests' sailing experience with fresh, local food delivered directly to their boat. 
                Partner with Sailor's Feast for a seamless provisioning service that adds value to your charter offering.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a href="#contact-charter" className="btn btn-prim btn-lg px-4">
                  Become a Partner
                </a>
                <Link to="/groceries" className="btn btn-outline-light btn-lg px-4">
                  Browse Products
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="charter-hero-image rounded shadow">
                <img 
                  src="/img/charter/delivery.jpg" 
                  alt="Charter boat with delivered groceries" 
                  className="img-fluid rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-4 bg-light">
        <div className="container">
          <div className={`row text-center mb-4 fade-in ${isVisible.benefits ? 'active' : ''}`}>
            <div className="col-lg-8 mx-auto">
              <h2 className="mb-3">Partner Benefits</h2>
              <p className="lead">
                Joining the Sailor's Feast charter partner program brings multiple advantages to your business and enhances your guests' experience.
              </p>
            </div>
          </div>
          <div className="row g-4">
            {benefitsData.map((benefit, index) => (
              <div 
                key={index} 
                className={`col-md-6 col-lg-3 fade-in-up ${isVisible.benefits ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="charter-benefit-card h-100 p-4 text-center">
                  <div className="charter-icon-wrapper mb-3">
                    <FontAwesomeIcon icon={benefit.icon} className="charter-icon" />
                  </div>
                  <h3 className="h5 mb-3">{benefit.title}</h3>
                  <p className="mb-0">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-4">
        <div className="container">
          <div className={`row text-center mb-5 fade-in ${isVisible.howItWorks ? 'active' : ''}`}>
            <div className="col-lg-8 mx-auto">
              <h2 className="mb-3">How It Works</h2>
              <p className="lead">
                Our partnership process is designed to be simple and efficient, with no extra work for your team.
              </p>
            </div>
          </div>
          <div className="charter-steps-container">
            <div className="row g-4">
              {stepsData.map((step, index) => (
                <div 
                  key={index} 
                  className={`col-md-6 col-lg-3 fade-in-up ${isVisible.howItWorks ? 'active' : ''}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="charter-step-card h-100 p-4 text-center">
                    <div className="charter-step-number">{step.number}</div>
                    <h3 className="h5 mt-3 mb-3">{step.title}</h3>
                    <p className="mb-0">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Example Email Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="/img/charter/delivery.jpg" 
                alt="Email example" 
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="mb-4">Sample Email for Your Guests</h2>
              <div className="charter-email-example p-4 rounded shadow-sm">
                <p><strong>Subject:</strong> Enhance Your Sailing Experience with Food Delivery Service</p>
                <hr />
                <p>Dear [Guest Name],</p>
                <p>We're excited for your upcoming charter with us! To make your experience even better, we've partnered with Sailor's Feast, a premium food delivery service that brings fresh groceries directly to your boat.</p>
                <p>Benefits include:</p>
                <ul>
                  <li>Fresh, local Croatian products</li>
                  <li>Delivery right to your boat</li>
                  <li>More time enjoying your sailing holiday</li>
                  <li>Customizable orders to suit your preferences</li>
                </ul>
                <p>Visit <a href="https://sailorsfeast.com" target="_blank" rel="noopener noreferrer">sailorsfeast.com</a> or call +385 91 306 0267 to place your order.</p>
                <p>Looking forward to welcoming you aboard!</p>
                <p>Best regards,<br />[Your Name]<br />[Charter Company]</p>
              </div>
              <button className="btn btn-prim mt-3">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                Copy Email Template
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-4">
        <div className="container">
          <div className={`row text-center mb-4 fade-in ${isVisible.testimonials ? 'active' : ''}`}>
            <div className="col-lg-8 mx-auto">
              <h2 className="mb-3">What We Aim For</h2>
              <p className="lead">
                Our partnership program is designed to benefit charter companies like yours with these outcomes.
              </p>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {testimonialsData.map((testimonial, index) => (
              <div 
                key={index} 
                className={`col-md-6 col-lg-4 fade-in-up ${isVisible.testimonials ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="charter-testimonial-card h-100 p-4">
                  <div className="charter-quote-mark">"</div>
                  <p className="charter-testimonial-text mb-3">{testimonial.text}</p>
                  <div className="charter-testimonial-author">
                    <p className="fw-bold mb-0">Our Vision</p>
                    <p className="text-muted small">for {testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section id="materials" className="py-4 bg-light">
        <div className="container">
          <div className={`row text-center mb-4 fade-in ${isVisible.materials ? 'active' : ''}`}>
            <div className="col-lg-8 mx-auto">
              <h2 className="mb-3">Partnership Materials</h2>
              <p className="lead">
                Download these resources to help promote our service to your guests.
              </p>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {materialsData.map((material, index) => (
              <div 
                key={index} 
                className={`col-md-6 col-lg-4 fade-in-up ${isVisible.materials ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="charter-material-card h-100 p-4 text-center">
                  <div className="charter-material-icon mb-3">
                    <FontAwesomeIcon icon={material.icon} />
                  </div>
                  <h3 className="h5 mb-2">{material.title}</h3>
                  <p className="mb-3">{material.description}</p>
                  <a 
                    href={material.link} 
                    className="btn btn-outline-secondary btn-sm"
                    download
                  >
                    Download {material.type.toUpperCase()}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section id="key-points" className="py-4">
        <div className="container">
          <div className={`row align-items-center fade-in ${isVisible.keyPoints ? 'active' : ''}`}>
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="mb-4">Why Charter Companies Will Choose Us</h2>
              <ul className="charter-feature-list">
                <li className="charter-feature-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="charter-check-icon" />
                  <div>
                    <h3 className="h5 mb-1">Zero Added Work</h3>
                    <p>You simply share our information - we handle everything else directly with your guests.</p>
                  </div>
                </li>
                <li className="charter-feature-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="charter-check-icon" />
                  <div>
                    <h3 className="h5 mb-1">Premium Quality</h3>
                    <p>We select only the best local Croatian products to ensure customer satisfaction.</p>
                  </div>
                </li>
                <li className="charter-feature-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="charter-check-icon" />
                  <div>
                    <h3 className="h5 mb-1">Reliable Delivery</h3>
                    <p>On-time delivery to 5 marinas in the Split area, with plans for expansion.</p>
                  </div>
                </li>
                <li className="charter-feature-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="charter-check-icon" />
                  <div>
                    <h3 className="h5 mb-1">Flexible Solution</h3>
                    <p>Customers can order pre-designed boxes or create fully customized orders.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="charter-map-container">
              <DeliveryMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-charter" className="py-4">
        <div className="container">
          <div className={`row text-center mb-4 fade-in ${isVisible.contact ? 'active' : ''}`}>
            <div className="col-lg-8 mx-auto">
              <h2 className="mb-3">Become Our Partner</h2>
              <p className="lead">
                Fill out the form below to start a partnership or learn more about our program.
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className={`col-lg-8 fade-in-up ${isVisible.contact ? 'active' : ''}`}>
              <div className="charter-contact-card p-4 rounded shadow-sm">
                <form className="charter-contact-form">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="companyName" className="form-label">Charter Company</label>
                      <input type="text" className="form-control" id="companyName" placeholder="Your charter company name" required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="contactPerson" className="form-label">Contact Person</label>
                      <input type="text" className="form-control" id="contactPerson" placeholder="Your name" required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="email" className="form-control" id="email" placeholder="your@email.com" required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input type="tel" className="form-control" id="phone" placeholder="+385 XX XXX XXXX" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="location" className="form-label">Primary Marina Location</label>
                      <input type="text" className="form-control" id="location" placeholder="Marina name or city" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="fleetSize" className="form-label">Fleet Size</label>
                      <input type="number" className="form-control" id="fleetSize" placeholder="Number of boats" />
                    </div>
                    <div className="col-12">
                      <label htmlFor="message" className="form-label">Additional Information</label>
                      <textarea className="form-control" id="message" rows="3" placeholder="Tell us about your needs or questions"></textarea>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="privacyCheck" required />
                        <label className="form-check-label" htmlFor="privacyCheck">
                          I agree with the <Link to="/privacy-policy" target="_blank">privacy policy</Link>
                        </label>
                      </div>
                    </div>
                    <div className="col-12 text-center">
                      <button type="submit" className="btn btn-prim btn-lg px-4 mt-3">Submit Partnership Request</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Contact Section */}
      <section className="py-4">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="charter-contact-method p-4 h-100">
                <FontAwesomeIcon icon={faPhone} className="charter-contact-icon mb-3" />
                <h3 className="h5 mb-2">Call Us Directly</h3>
                <p>Speak with our partnership team</p>
                <a href="tel:+385913060267" className="btn btn-outline-secondary btn-sm">
                  +385 91 306 0267
                </a>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="charter-contact-method p-4 h-100">
                <FontAwesomeIcon icon={faEnvelope} className="charter-contact-icon mb-3" />
                <h3 className="h5 mb-2">Email Us</h3>
                <p>Send your partnership inquiry</p>
                <a href="mailto:partners@sailorsfeast.com" className="btn btn-outline-secondary btn-sm">
                  partners@sailorsfeast.com
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="charter-contact-method p-4 h-100">
                <FontAwesomeIcon icon={faShip} className="charter-contact-icon mb-3" />
                <h3 className="h5 mb-2">Visit Our Office</h3>
                <p>Meet us in person in Split</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm">
                  View on Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="row text-center mb-4">
            <div className="col-lg-8 mx-auto">
              <h2 className="mb-3">Frequently Asked Questions</h2>
              <p className="lead">
                Get answers to common questions about our charter partnership program.
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="charterFaqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Are there any costs for charter companies?
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#charterFaqAccordion">
                    <div className="accordion-body">
                      No, there are no costs for charter companies. Our partnership program is completely free for you. We handle all transactions directly with the guests, so there's no financial commitment required from your side.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      How far in advance should guests place their orders?
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#charterFaqAccordion">
                    <div className="accordion-body">
                      We recommend that guests place their orders at least 48 hours before their desired delivery time. However, we can accommodate last-minute orders subject to availability. During peak season (July-August), we strongly recommend ordering 3-5 days in advance.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Can guests with dietary restrictions use your service?
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#charterFaqAccordion">
                    <div className="accordion-body">
                      Absolutely! We cater to various dietary needs including vegetarian, vegan, gluten-free, lactose-free, and more. Guests can either choose our specialized boxes or customize their orders completely according to their requirements. We're committed to accommodating all dietary restrictions.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                      How should we promote your service to our guests?
                    </button>
                  </h2>
                  <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#charterFaqAccordion">
                    <div className="accordion-body">
                      We provide you with ready-made promotional materials including email templates, brochures, and digital content that you can share with your guests. The most effective approach is to include our service information in your pre-arrival communications and mention it during the booking process as an additional convenience for guests.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFive">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                      What payment methods do you accept from guests?
                    </button>
                  </h2>
                  <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#charterFaqAccordion">
                    <div className="accordion-body">
                      We accept credit/debit cards (Visa, Mastercard), PayPal, and bank transfers. For guests' convenience, we also offer payment on delivery options (cash or card). All financial transactions are handled directly between us and the guests.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="charter-cta-section py-4 text-white text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="text-white mb-3">Ready to Enhance Your Charter Service?</h2>
              <p className="lead text-white mb-3">
                Join Sailor's Feast to provide an exceptional sailing experience for your guests.
              </p>
              <a href="#contact-charter" className="btn btn-prim btn-lg px-5">
                Start Partnership Now
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <ScrollToTopButton />
    </>
  );
};

export default CharterLandingPage;