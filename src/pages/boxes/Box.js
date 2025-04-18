import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const CACHE_EXPIRATION = 60 * 60 * 1000;
let globalCache = {};

try {
  const savedCache = localStorage.getItem('box_api_cache');
  if (savedCache) {
    const parsedCache = JSON.parse(savedCache);
    if (parsedCache && (Date.now() - parsedCache.timestamp < CACHE_EXPIRATION)) {
      globalCache = parsedCache;
    }
  }
} catch (e) {
  console.error('Error loading cache from localStorage', e);
}

const BoxLayout = ({ categoryId, categoryMapping }) => {
  const componentMounted = useRef(true);
  const apiCache = useRef(globalCache);
  const navigate = useNavigate();

  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryProducts, setSubcategoryProducts] = useState({});
  const [extraProducts, setExtraProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState({ name: "", description: "", image: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [headerLoaded, setHeaderLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [activeModalCategory, setActiveModalCategory] = useState(null);

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      const cacheKey = `category_${categoryId}`;
      if (apiCache.current[cacheKey] && (Date.now() - apiCache.current.timestamp < CACHE_EXPIRATION)) {
        setCategoryInfo(apiCache.current[cacheKey]);
        setHeaderLoaded(true);
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories/${categoryId}`, {
          headers: authHeader,
        });
        const data = await res.json();
        if (!componentMounted.current) return;

        const info = {
          name: data.name || "",
          description: data.description || "",
          image: data.image?.src || "",
        };

        if (!apiCache.current) apiCache.current = { timestamp: Date.now() };
        apiCache.current[cacheKey] = info;
        apiCache.current.timestamp = Date.now();

        setCategoryInfo(info);
        setHeaderLoaded(true);
      } catch (err) {
        console.error("Greška u dohvaćanju kategorije:", err);
        setHeaderLoaded(true);
      }
    };

    const fetchSubcategoriesAndProducts = async () => {
      const cacheKey = `subcategories_${categoryId}`;
      if (apiCache.current && apiCache.current[cacheKey] && (Date.now() - apiCache.current.timestamp < CACHE_EXPIRATION)) {
        setSubcategories(apiCache.current[cacheKey].subcategoriesData);
        setSubcategoryProducts(apiCache.current[cacheKey].grouped);
        setProductsLoaded(true);
        return;
      }

      try {
        const subcatRes = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${categoryId}`, {
          headers: authHeader,
        });
        const subcategoriesData = await subcatRes.json();
        if (!componentMounted.current) return;
        setSubcategories(subcategoriesData);

        if (subcategoriesData.length > 0) {
          const allSubcategoryIds = subcategoriesData.map(sub => sub.id).join(",");
          const productRes = await fetch(
            `${backendUrl}/wp-json/wc/v3/products?category=${allSubcategoryIds}&per_page=100&_fields=id,name,price,images,categories`,
            { headers: authHeader }
          );
          const allProducts = await productRes.json();
          if (!componentMounted.current) return;

          const grouped = {};
          subcategoriesData.forEach(sub => {
            grouped[sub.id] = allProducts.filter(prod =>
              prod.categories.some(cat => cat.id === sub.id)
            );
          });

          if (!apiCache.current) apiCache.current = { timestamp: Date.now() };
          apiCache.current[cacheKey] = {
            subcategoriesData,
            grouped
          };
          apiCache.current.timestamp = Date.now();

          setSubcategoryProducts(grouped);
        }

        setProductsLoaded(true);
      } catch (error) {
        console.error("Greška u dohvaćanju proizvoda:", error);
        setProductsLoaded(true);
      }
    };

    fetchCategoryInfo();
    fetchSubcategoriesAndProducts();

    return () => {
      componentMounted.current = false;
      try {
        localStorage.setItem('box_api_cache', JSON.stringify(apiCache.current));
        globalCache = apiCache.current;
      } catch (e) {
        console.error('Error saving cache to localStorage', e);
      }
    };
  }, [categoryId]);

  useEffect(() => {
    if (headerLoaded && productsLoaded) {
      setIsLoading(false);
    }
  }, [headerLoaded, productsLoaded]);

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
    setExtraProducts([]);
    const cacheKey = `extras_${parentCategoryId}`;
    if (apiCache.current && apiCache.current[cacheKey] && (Date.now() - apiCache.current.timestamp < CACHE_EXPIRATION)) {
      setExtraProducts(apiCache.current[cacheKey]);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${parentCategoryId}`, {
        headers: authHeader,
      });
      const subcats = await res.json();
      if (!componentMounted.current) return;

      const productPromises = subcats.map(async subcat => {
        const res = await fetch(
          `${backendUrl}/wp-json/wc/v3/products?category=${subcat.id}&_fields=id,name,price,images,categories`,
          { headers: authHeader }
        );
        const products = await res.json();
        return { id: subcat.id, name: subcat.name, products };
      });

      const withProducts = await Promise.all(productPromises);
      if (!componentMounted.current) return;

      if (!apiCache.current) apiCache.current = { timestamp: Date.now() };
      apiCache.current[cacheKey] = withProducts;
      apiCache.current.timestamp = Date.now();

      setExtraProducts(withProducts);
    } catch (error) {
      console.error("Greška u dohvaćanju dodatnih subkategorija:", error);
      setExtraProducts([]);
    }
  }, []);

  const handleShowModal = useCallback((subcategoryId) => {
    setExtraProducts([]);
    setActiveModalCategory(subcategoryId);
    setShowModal(true);
    fetchExtraSubcategories(categoryMapping[subcategoryId]);
  }, [fetchExtraSubcategories, categoryMapping]);

  const handleAddProduct = (product, quantity) => {
    const productSubcategoryId = product.categories?.find(cat =>
      subcategories.some(sub => sub.id === cat.id)
    )?.id;

    const subcategoryId = productSubcategoryId || activeModalCategory;

    if (!subcategoryId) {
      console.error("Nije poznata podkategorija za dodavanje proizvoda");
      return;
    }

    setSubcategoryProducts(prev => {
      const existing = prev[subcategoryId] || [];
      const existingProduct = existing.find(p => p.id === product.id);

      if (existingProduct) {
        return {
          ...prev,
          [subcategoryId]: existing.map(p =>
            p.id === product.id
              ? { ...p, quantity: (p.quantity || 0) + quantity }
              : p
          )
        };
      } else {
        return {
          ...prev,
          [subcategoryId]: [...existing, { ...product, quantity }]
        };
      }
    });

    setShowModal(false);
  };

  const totalSum = useMemo(() => {
    return subcategories.reduce((sum, sub) => {
      return (
        sum +
        (subcategoryProducts[sub.id]?.reduce((s, p) => s + Number(p.price || 0) * (p.quantity || 1), 0) || 0)
      );
    }, 0);
  }, [subcategories, subcategoryProducts]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Pronađi ID-eve proizvoda iz boxa
    const currentBoxProductIds = new Set();
    subcategories.forEach((subcategory) => {
      subcategoryProducts[subcategory.id]?.forEach((product) => {
        currentBoxProductIds.add(product.id);
      });
    });
  
    // Filtriraj postojeće iz košarice
    cart = cart.filter((item) => !item.box || currentBoxProductIds.has(item.id));
  
    // Dodaj/azuriraj proizvode iz boxa
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
  
    // Spremi i ažuriraj
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };
  

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      setExtraProducts([]);
      setActiveModalCategory(null);
    }, 300);
  }, []);

  if (isLoading) {
    return (
      <>
        {headerLoaded && (
          <BoxHeader
            title={categoryInfo.name}
            description={categoryInfo.description}
            image={categoryInfo.image}
            totalSum={0}
            isLoading={true}
            onAddToCart={addToCart}
          />
        )}
        <BoxLayoutSkeleton />
      </>
    );
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
          closeModal={handleCloseModal}
          onShowProductModal={handleShowProductModal}
          categoryMapping={categoryMapping}
        />
      )}

      {selectedProduct && (
        <ModalProduct product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
};

export default BoxLayout;
