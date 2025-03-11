import React, { useEffect, useState } from "react";
import BoxHeader from "./BoxHeader";
import BoxProductTable from "./BoxProductTable";
import BoxModal from "./BoxModal";
import "./Box.css";

const BoxLayout = ({ categoryId, image, categoryMapping }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryProducts, setSubcategoryProducts] = useState({});
  const [extraProducts, setExtraProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`https://sailorsfeast.com/wp-json/wc/v3/products/categories?parent=${categoryId}`, {
      headers: {
        Authorization: "Basic " + btoa("ck_971b783339775575928ecdba150f83870eb118b1:cs_eaa4759ea0dd6465903fea8879f9f711fe496949"),
      },
    })
      .then(response => response.json())
      .then(data => {
        setSubcategories(data);
        data.forEach(subcategory => fetchProducts(subcategory.id));
      });
  }, [categoryId]);

  const [categoryInfo, setCategoryInfo] = useState({ name: "", description: "" });

useEffect(() => {
  fetch(`https://sailorsfeast.com/wp-json/wc/v3/products/categories/${categoryId}`, {
    headers: {
      Authorization: "Basic " + btoa("ck_971b783339775575928ecdba150f83870eb118b1:cs_eaa4759ea0dd6465903fea8879f9f711fe496949"),
    },
  })
    .then(response => response.json())
    .then(data => {
      setCategoryInfo({
        name: data.name,
        description: data.description,
      });
    })
    .catch(error => {
      console.error("Greška pri dohvaćanju kategorije:", error);
    });
}, [categoryId]);


  const fetchProducts = (subcategoryId) => {
    fetch(`https://sailorsfeast.com/wp-json/wc/v3/products?category=${subcategoryId}`, {
      headers: {
        Authorization: "Basic " + btoa("ck_971b783339775575928ecdba150f83870eb118b1:cs_eaa4759ea0dd6465903fea8879f9f711fe496949"),
      },
    })
      .then(response => response.json())
      .then(data => {
        setSubcategoryProducts(prev => ({ ...prev, [subcategoryId]: data }));
      });
  };

  const handleRemoveProduct = (subcategoryId, productId) => {
    setSubcategoryProducts(prev => ({
      ...prev,
      [subcategoryId]: prev[subcategoryId].filter(product => product.id !== productId),
    }));
  };

  const fetchExtraSubcategories = async (parentCategoryId) => {
    const response = await fetch(
      `https://sailorsfeast.com/wp-json/wc/v3/products/categories?parent=${parentCategoryId}`,
      {
        headers: {
          Authorization: "Basic " + btoa("ck_971b783339775575928ecdba150f83870eb118b1:cs_eaa4759ea0dd6465903fea8879f9f711fe496949"),
        },
      }
    );
    const subcategories = await response.json();

    const subcategoriesWithProducts = await Promise.all(
      subcategories.map(async (subcategory) => {
        const response = await fetch(
          `https://sailorsfeast.com/wp-json/wc/v3/products?category=${subcategory.id}`,
          {
            headers: {
              Authorization: "Basic " + btoa("ck_971b783339775575928ecdba150f83870eb118b1:cs_eaa4759ea0dd6465903fea8879f9f711fe496949"),
            },
          }
        );
        const products = await response.json();
        return { id: subcategory.id, name: subcategory.name, products };
      })
    );

    setExtraProducts(subcategoriesWithProducts);
  };

  const handleShowModal = (categoryId) => {
    fetchExtraSubcategories(categoryId);
    setShowModal(true);
  };

  const handleAddProduct = (product) => {
    console.log("Dodajem proizvod:", product);
  };

  return (
    <>
      <BoxHeader  />
      <BoxProductTable
        title={categoryInfo.name} 
        description={categoryInfo.description} 
        image={image}
        subcategories={subcategories}
        subcategoryProducts={subcategoryProducts}
        handleRemoveProduct={handleRemoveProduct}
        handleShowModal={handleShowModal}
        categoryMapping={categoryMapping}
      />
      {showModal && (
        <BoxModal
          extraProducts={extraProducts}
          handleAddProduct={handleAddProduct}
          closeModal={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default BoxLayout;
