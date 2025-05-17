import React from "react";
import BoxLayout from "./Box";
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import SEO from "../../components/common/SEO";

const FeastBox = () => {

  return (
    <>
      <SEO
        title="Feast box"
        description="Discover our delicious Feast box packed with fresh snacks, drinks, and goodies, delivered straight to your boat in Croatia!"
        keywords={[
          'Sailor\'s Feast Box',
          'boat snacks',
          'Croatia delivery',
          'yacht food box',
          'sailing treats'
        ]}
        path="/feast-box"
      />
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
