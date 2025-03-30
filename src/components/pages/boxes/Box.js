import React, { useEffect, useState } from "react";
import BoxProductTable from "./BoxProductTable";
import ModalProduct from "../groceries/ModalProduct";
import BoxModal from "./BoxModal";
import "./Box.css";

const BoxLayout = ({ categoryId, image, categoryMapping }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryProducts, setSubcategoryProducts] = useState({});
  const [extraProducts, setExtraProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`https://backend.sailorsfeast.com/wp-json/wc/v3/products/categories?parent=${categoryId}`, {
      headers: {
        Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af:cs_2f0156b618001a4be0dbcf7037c99c036abbb0af"),
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
  fetch(`https://backend.sailorsfeast.com/wp-json/wc/v3/products/categories/${categoryId}`, {
    headers: {
      Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af:cs_2f0156b618001a4be0dbcf7037c99c036abbb0af"),
    },
  })
    .then(response => response.json())
    .then(data => {
      setCategoryInfo({
        name: data.name,
        description: data.description,
        image: data.image?.src || "",
      });
    })
    .catch(error => {
      console.error("Greška pri dohvaćanju kategorije:", error);
    });
}, [categoryId]);


  const fetchProducts = (subcategoryId) => {
    fetch(`https://backend.sailorsfeast.com/wp-json/wc/v3/products?category=${subcategoryId}`, {
      headers: {
        Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af:cs_2f0156b618001a4be0dbcf7037c99c036abbb0af"),
      },
    })
      .then(response => response.json())
      .then(data => {
        setSubcategoryProducts(prev => ({ ...prev, [subcategoryId]: data }));
      });
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  
      const handleShowProductModal = (product) => {
          setSelectedProduct(product);
      };

  const handleRemoveProduct = (subcategoryId, productId) => {
    setSubcategoryProducts(prev => ({
      ...prev,
      [subcategoryId]: prev[subcategoryId].filter(product => product.id !== productId),
    }));
  };

  const fetchExtraSubcategories = async (parentCategoryId) => {
    const response = await fetch(
      `https://backend.sailorsfeast.com/wp-json/wc/v3/products/categories?parent=${parentCategoryId}`,
      {
        headers: {
          Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af:cs_2f0156b618001a4be0dbcf7037c99c036abbb0af"),
        },
      }
    );
    const subcategories = await response.json();

    const subcategoriesWithProducts = await Promise.all(
      subcategories.map(async (subcategory) => {
        const response = await fetch(
          `https://backend.sailorsfeast.com/wp-json/wc/v3/products?category=${subcategory.id}`,
          {
            headers: {
              Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af:cs_2f0156b618001a4be0dbcf7037c99c036abbb0af"),
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

  const handleAddProduct = async (product, quantity) => {


    let targetSubcategoryId = null;

    for (const [subcategoryId, categoryId] of Object.entries(categoryMapping)) {
        // 1. Ako je proizvod već direktno u toj kategoriji
        if (product.categories.some(cat => cat.id === subcategoryId || cat.id === categoryId)) {
            targetSubcategoryId = parseInt(subcategoryId);
            break;
        }

        // 2. Ako proizvod ima samo podkategoriju, dohvati roditelja kategorije
        for (const cat of product.categories) {
            try {
                const response = await fetch(`https://backend.sailorsfeast.com/wp-json/wc/v3/products/categories/${cat.id}`, {
                    headers: {
                        Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af:cs_2f0156b618001a4be0dbcf7037c99c036abbb0af"),
                    },
                });
                const categoryData = await response.json();

                console.log(` Kategorija ${cat.id} ima parent ID:`, categoryData.parent);

                if (categoryData.parent === categoryId) {
                    targetSubcategoryId = parseInt(subcategoryId);
                    break;
                }
            } catch (error) {
                console.error(" Greška pri dohvaćanju roditeljske kategorije:", error);
            }
        }

        if (targetSubcategoryId) break;
    }

    if (!targetSubcategoryId) {
        console.warn(" Nije pronađena odgovarajuća podkategorija za proizvod:", product.name);
        return;
    }

    setSubcategoryProducts((prev) => {
        const existingProducts = prev[targetSubcategoryId] || [];
        
        if (existingProducts.some(p => p.id === product.id)) {
            console.warn(" Proizvod je već dodan u podkategoriju:", product.name);
            return prev;
        }

        return {
            ...prev,
            [targetSubcategoryId]: [...existingProducts, { ...product, quantity }]
        };
    });

    setShowModal(false);
};

  return (
    <>
      <BoxProductTable
        title={categoryInfo.name} 
        description={categoryInfo.description} 
        image={categoryInfo.image}
        subcategories={subcategories}
        subcategoryProducts={subcategoryProducts}
        setSubcategoryProducts={setSubcategoryProducts}
        onShowProductModal={handleShowProductModal}
        handleRemoveProduct={handleRemoveProduct}
        handleShowModal={handleShowModal}
        categoryMapping={categoryMapping}
      />
      {showModal && (
        <BoxModal
          extraProducts={extraProducts}
          handleAddProduct={handleAddProduct}
          closeModal={() => setShowModal(false)}
          onShowProductModal={handleShowProductModal}
        />
      )}
      {selectedProduct && (<ModalProduct  product={selectedProduct}  onClose={() => setSelectedProduct(null)} />)}
    </>
  );
};

export default BoxLayout;
