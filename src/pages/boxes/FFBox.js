import React from "react";
import BoxLayout from "./Box";
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import SEO from "../../components/common/SEO";

const FFBox = () => {

  return (
    <>
      <SEO
        title="Friends & Family box"
        description="Make sailing even more fun with our Friends & Family box! Packed with snacks, drinks, and goodies everyone on board will love, delivered to your boat in Croatia."
        keywords={[
          'Friends & Family Box',
          'boat snacks',
          'family sailing',
          'Croatia food delivery',
          'Sailor\'s Feast'
        ]}
        path="/friends-family-box"
      />
      <BoxLayout
        categoryId={198}
        categoryMapping={{
          199: 93, // subcategory.id : category.id
          200: 39,
          201: 114,
        }}
      />

      <div id="Faq">
          <Faq topicId={196} topic="Food Boxes" />
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default FFBox;
