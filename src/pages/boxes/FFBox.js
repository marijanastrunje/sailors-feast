import React from "react";
import BoxLayout from "./Box";
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";

const FFBox = () => {

  return (
    <>
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
