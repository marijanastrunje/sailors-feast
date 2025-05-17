import React from "react";
import BoxLayout from "./Box";
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import SEO from "../../components/common/SEO";

const StandardBox = () => {

  return (
    <>
      <SEO
        title="Standard box"
        description="Get all your sailing essentials with the our Standard box! A perfect mix of snacks, meals, and drinks delivered to your boat in Croatia."
        keywords={[
          'Standard Box',
          'boat essentials',
          'sailing snacks',
          'Croatia boat delivery',
          'Sailor\'s Feast'
        ]}
        path="/standard-box"
      />

      <BoxLayout
        categoryId={108}
        categoryMapping={{
          136: 93, // subcategory.id : category.id
          109: 39,
          113: 114,
        }}
      />

      <div id="Faq">
          <Faq topicId={196} topic="Food Boxes" />
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default StandardBox;
