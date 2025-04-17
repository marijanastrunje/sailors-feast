import React from "react";
import Faq from "../components/common/Faq";

const FaqPage = () => {
  const sections = [
    { id: "faq-home", topic: "Home", topicId: 194 },
    { id: "groceries", topic: "Groceries", topicId: 195 },
    { id: "faq-boxes", topic: "Food Boxes", topicId: 196 },
    { id: "contact", topic: "Contact", topicId: 197 },
  ];

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Najčešća pitanja</h1>

      {sections.map(({ id, topic, topicId }) => (
        <section key={id} id={id} className="mb-5">
          <Faq topic={topic} topicId={topicId} />
        </section>
      ))}
    </div>
  );
};

export default FaqPage;
