import React from "react";
import BoxLayout from "./Box";
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";

const FeastBox = () => {

  return (
    <>
      <BoxLayout
        categoryId={202}
        categoryMapping={{
          203: 93, // subcategory.id : category.id
          204: 39,
          205: 114,
        }}
      />

      <div id="Faq">
          <Faq topicId={196} topic="Food Boxes" />
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default FeastBox;
