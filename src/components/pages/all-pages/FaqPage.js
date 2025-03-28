import React from "react";
import Faq from "./Faq";

const FaqPage = () => {
  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Najčešća pitanja</h1>


      {/* Sekcije sa FAQ-ovima */}
      <section id="faq-home" className="mb-5">
        <Faq topic="Home" topicId={194} />
      </section>

      <section id="groceries">
        <Faq topicId={195} topic="Groceries" />
      </section>

      <section id="faq-boxes" className="mb-5">
        <Faq topic="Food Boxes" topicId={196} />
      </section>
    
      <section id="contact" className="mb-5">
        <Faq topic="Contact" topicId={197} />
      </section>
      
    </div>
  );
};

export default FaqPage;
