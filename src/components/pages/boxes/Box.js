import React, { useEffect, useState, useCallback, useMemo } from "react";
import BoxProductTable from "./BoxProductTable";
import ModalProduct from "../groceries/ModalProduct";
import BoxModal from "./BoxModal";
import BoxHeader from "./BoxHeader";
import "./Box.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const wcKey = process.env.REACT_APP_WC_KEY;
const wcSecret = process.env.REACT_APP_WC_SECRET;
const authHeader = {
  Authorization: "Basic " + btoa(`${wcKey}:${wcSecret}`),
};

const BoxLayout = ({ categoryId, categoryMapping }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryProducts, setSubcategoryProducts] = useState({});
  const [extraProducts, setExtraProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState({ name: "", description: "", image: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch samo info o kategoriji – odmah za header
    fetch(`${backendUrl}/wp-json/wc/v3/products/categories/${categoryId}`, {
      headers: authHeader,
    })
      .then((res) => res.json())
      .then((data) => {
        setCategoryInfo({
          name: data.name,
          description: data.description,
          image: data.image?.src || "",
        });
      })
      .catch((err) => {
        console.error("Greška u dohvaćanju kategorije:", err);
      });
  }, [categoryId]);

  useEffect(() => {
    // Grupirani fetch proizvoda za sve subkategorije
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${categoryId}`, {
          headers: authHeader,
        });
        const subcategoriesData = await res.json();
        setSubcategories(subcategoriesData);

        const allSubcategoryIds = subcategoriesData.map(sub => sub.id).join(",");

        const productRes = await fetch(`${backendUrl}/wp-json/wc/v3/products?category=${allSubcategoryIds}&per_page=100`, {
          headers: authHeader,
        });
        const allProducts = await productRes.json();

        const grouped = {};
        subcategoriesData.forEach(sub => {
          grouped[sub.id] = allProducts.filter(prod =>
            prod.categories.some(cat => cat.id === sub.id)
          );
        });

        setSubcategoryProducts(grouped);
        setIsLoading(false);
      } catch (error) {
        console.error("Greška u dohvaćanju proizvoda:", error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleShowProductModal = (product) => {
    setSelectedProduct(product);
  };

  const handleRemoveProduct = (subcategoryId, productId) => {
    setSubcategoryProducts(prev => ({
      ...prev,
      [subcategoryId]: prev[subcategoryId].filter(p => p.id !== productId),
    }));
  };

  const fetchExtraSubcategories = useCallback(async (parentCategoryId) => {
    const res = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${parentCategoryId}`, {
      headers: authHeader,
    });
    const subcats = await res.json();

    const withProducts = await Promise.all(
      subcats.map(async subcat => {
        const res = await fetch(`${backendUrl}/wp-json/wc/v3/products?category=${subcat.id}`, {
          headers: authHeader,
        });
        const products = await res.json();
        return { id: subcat.id, name: subcat.name, products };
      })
    );

    setExtraProducts(withProducts);
  }, []);

  const handleShowModal = (categoryId) => {
    fetchExtraSubcategories(categoryId);
    setShowModal(true);
  };

  const handleAddProduct = async (product, quantity) => {
    let targetSubcategoryId = null;

    for (const [subId, parentId] of Object.entries(categoryMapping)) {
      const matches = product.categories.some(
        (cat) => cat.id === parseInt(subId) || cat.id === parentId
      );

      if (matches) {
        targetSubcategoryId = parseInt(subId);
        break;
      }

      for (const cat of product.categories) {
        const res = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories/${cat.id}`, {
          headers: authHeader,
        });
        const catData = await res.json();
        if (catData.parent === parentId) {
          targetSubcategoryId = parseInt(subId);
          break;
        }
      }

      if (targetSubcategoryId) break;
    }

    if (!targetSubcategoryId) return;

    setSubcategoryProducts(prev => {
      const existing = prev[targetSubcategoryId] || [];
      if (existing.find(p => p.id === product.id)) return prev;

      return {
        ...prev,
        [targetSubcategoryId]: [...existing, { ...product, quantity }],
      };
    });

    setShowModal(false);
  };

  const totalSum = useMemo(() => {
    return subcategories.reduce((sum, sub) => {
      return (
        sum +
        (subcategoryProducts[sub.id]?.reduce((s, p) => s + p.price * (p.quantity || 1), 0) || 0)
      );
    }, 0);
  }, [subcategories, subcategoryProducts]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const currentBoxProductIds = new Set();
    subcategories.forEach((subcategory) => {
      subcategoryProducts[subcategory.id]?.forEach((product) => {
        currentBoxProductIds.add(product.id);
      });
    });

    cart = cart.filter((item) => !item.box || currentBoxProductIds.has(item.id));

    subcategories.forEach((subcategory) => {
      subcategoryProducts[subcategory.id]?.forEach((product) => {
        const quantity = product.quantity || 1;
        if (quantity > 0) {
          const existingProduct = cart.find((item) => item.id === product.id);
          if (existingProduct) {
            existingProduct.quantity = quantity;
          } else {
            cart.push({
              id: product.id,
              image: product.images,
              title: product.name,
              price: product.price,
              quantity: quantity,
              box: true,
            });
          }
        }
      });
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    window.location.href = "/cart";
  };

  if (isLoading) {
    return <p className="text-center my-5">Loading boxes...</p>;
  }

  return (
    <>
      <BoxHeader
        title={categoryInfo.name}
        description={categoryInfo.description}
        image={categoryInfo.image}
        totalSum={totalSum}
        onAddToCart={addToCart}
      />

      <BoxProductTable
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

      {selectedProduct && (
        <ModalProduct product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
};

export default BoxLayout;