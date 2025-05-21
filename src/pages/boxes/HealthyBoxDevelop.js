import React from "react";
import BoxLayout from "./Box";
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import SEO from "../../components/common/SEO";

const HealthyBox = () => {

  return (
    <>
      <SEO
        title="Healthy box"
        description="Stay energized at sea with our Healthy box! Enjoy fresh, nutritious snacks and meals delivered right to your boat in Croatia."
        keywords={[
          'Healthy Box',
          'healthy boat snacks',
          'sailing nutrition',
          'Croatia food delivery',
          'Sailor\'s Feast'
        ]}
        path="/healthy-box"
      />

      <BoxLayout
        categoryId={206}
        categoryMapping={{
          207: 93, // subcategory.id : category.id
          208: 39,
          209: 114,
        }}
      />

      <div id="Faq">
          <Faq topicId={196} topic="Food Boxes" />
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default HealthyBox;
