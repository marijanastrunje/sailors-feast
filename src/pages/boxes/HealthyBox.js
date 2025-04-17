import React from "react";
import BoxLayout from "./Box";
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";

const HealthyBox = () => {

  return (
    <>
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
