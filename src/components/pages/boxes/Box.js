import React, { useEffect, useState, useCallback, useMemo } from "react";
import BoxProductTable from "./BoxProductTable";
import ModalProduct from "../groceries/ModalProduct";
import BoxModal from "./BoxModal";
import BoxHeader from "./BoxHeader";
import BoxLayoutSkeleton from "./BoxLayoutSkeleton";
import "./Box.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const wcKey = process.env.REACT_APP_WC_KEY;
const wcSecret = process.env.REACT_APP_WC_SECRET;
const authHeader = {
  Authorization: "Basic " + btoa(`${wcKey}:${wcSecret}`),
};

// Cache za API pozive
const apiCache = {
  categories: {},
  products: {},
  timestamp: Date.now()
};

// Cache istječe nakon 5 minuta
const CACHE_EXPIRATION = 5 * 60 * 1000;

const BoxLayout = ({ categoryId, categoryMapping }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryProducts, setSubcategoryProducts] = useState({});
  const [extraProducts, setExtraProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState({ name: "", description: "", image: "" });
  const [isLoading, setIsLoading] = useState(true);
  // Uklonjena nekorištena varijabla headerLoaded
  
  // Fetch samo info o kategoriji – odmah za header
  useEffect(() => {
    const cacheKey = `category_${categoryId}`;
    
    // Prvo provjeri cache
    if (apiCache.categories[cacheKey] && (Date.now() - apiCache.timestamp < CACHE_EXPIRATION)) {
      setCategoryInfo(apiCache.categories[cacheKey]);
      return; // Uklonjen setHeaderLoaded
    }
    
    fetch(`${backendUrl}/wp-json/wc/v3/products/categories/${categoryId}`, {
      headers: authHeader,
    })
      .then((res) => res.json())
      .then((data) => {
        const info = {
          name: data.name,
          description: data.description,
          image: data.image?.src || "",
        };
        
        // Spremanje u cache
        apiCache.categories[cacheKey] = info;
        apiCache.timestamp = Date.now();
        
        setCategoryInfo(info);
        // Uklonjen setHeaderLoaded
      })
      .catch((err) => {
        console.error("Greška u dohvaćanju kategorije:", err);
        // Uklonjen setHeaderLoaded
      });
  }, [categoryId]);

  // Grupirani fetch proizvoda za sve subkategorije
  useEffect(() => {
    const fetchProducts = async () => {
      const cacheKey = `subcategories_${categoryId}`;
      
      try {
        // Prvo provjeri cache
        if (apiCache.categories[cacheKey] && (Date.now() - apiCache.timestamp < CACHE_EXPIRATION)) {
          setSubcategories(apiCache.categories[cacheKey].subcategoriesData);
          setSubcategoryProducts(apiCache.categories[cacheKey].grouped);
          setIsLoading(false);
          return;
        }
        
        const res = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${categoryId}`, {
          headers: authHeader,
        });
        const subcategoriesData = await res.json();
        setSubcategories(subcategoriesData);

        // Optimizirano učitavanje - dodali smo _fields parametar da smanjimo veličinu odgovora
        const allSubcategoryIds = subcategoriesData.map(sub => sub.id).join(",");
        const productRes = await fetch(
          `${backendUrl}/wp-json/wc/v3/products?category=${allSubcategoryIds}&per_page=100&_fields=id,name,price,images,categories`, 
          {
            headers: authHeader,
          }
        );
        const allProducts = await productRes.json();

        const grouped = {};
        subcategoriesData.forEach(sub => {
          grouped[sub.id] = allProducts.filter(prod =>
            prod.categories.some(cat => cat.id === sub.id)
          );
        });

        // Spremanje u cache
        apiCache.categories[cacheKey] = {
          subcategoriesData,
          grouped
        };
        apiCache.timestamp = Date.now();

        setSubcategoryProducts(grouped);
        setIsLoading(false);
      } catch (error) {
        console.error("Greška u dohvaćanju proizvoda:", error);
        setIsLoading(false);
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
    const cacheKey = `extras_${parentCategoryId}`;
    
    // Prvo provjeri cache
    if (apiCache.categories[cacheKey] && (Date.now() - apiCache.timestamp < CACHE_EXPIRATION)) {
      setExtraProducts(apiCache.categories[cacheKey]);
      return;
    }
    
    const res = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${parentCategoryId}`, {
      headers: authHeader,
    });
    const subcats = await res.json();

    const withProducts = await Promise.all(
      subcats.map(async subcat => {
        const res = await fetch(
          `${backendUrl}/wp-json/wc/v3/products?category=${subcat.id}&_fields=id,name,price,images,categories`, 
          {
            headers: authHeader,
          }
        );
        const products = await res.json();
        return { id: subcat.id, name: subcat.name, products };
      })
    );
    
    // Spremanje u cache
    apiCache.categories[cacheKey] = withProducts;
    apiCache.timestamp = Date.now();

    setExtraProducts(withProducts);
  }, []);

  const handleShowModal = (categoryId) => {
    fetchExtraSubcategories(categoryId);
    setShowModal(true);
  };

  const handleAddProduct = async (product, quantity) => {
    // Postojeći kod...
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
    // Postojeći kod...
  };

  // Koristimo skeleton loader dok se sadržaj učitava
  if (isLoading) {
    return <BoxLayoutSkeleton />;
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

// Spremanje cache u localStorage pri napuštanju stranice
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    try {
      localStorage.setItem('box_api_cache', JSON.stringify(apiCache));
    } catch (e) {
      console.error('Error saving cache to localStorage', e);
    }
  });

  // Učitavanje cache iz localStorage
  try {
    const savedCache = localStorage.getItem('box_api_cache');
    if (savedCache) {
      const parsedCache = JSON.parse(savedCache);
      if (parsedCache && (Date.now() - parsedCache.timestamp < CACHE_EXPIRATION)) {
        Object.assign(apiCache, parsedCache);
      }
    }
  } catch (e) {
    console.error('Error loading cache from localStorage', e);
  }
}

export default BoxLayout;