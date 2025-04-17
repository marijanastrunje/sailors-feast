import React from "react";
import BoxLayout from "./Box";
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";

const StandardBox = () => {

  return (
    <>
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
