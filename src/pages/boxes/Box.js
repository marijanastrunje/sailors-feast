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

const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hour
let globalCache = {};

// Initialize cache from localStorage if available
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

  // Update loading state when header or products load
  useEffect(() => {
    setIsLoading(!(headerLoaded && productsLoaded));
  }, [headerLoaded, productsLoaded]);

  // Fetch category info and subcategories with products
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

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
          signal
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
        if (err.name !== 'AbortError') {
          console.error("Error fetching category:", err);
        }
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
          signal
        });
        const subcategoriesData = await subcatRes.json();
        if (!componentMounted.current) return;
        setSubcategories(subcategoriesData);

        if (subcategoriesData.length > 0) {
          const allSubcategoryIds = subcategoriesData.map(sub => sub.id).join(",");
          const productRes = await fetch(
            `${backendUrl}/wp-json/wc/v3/products?category=${allSubcategoryIds}&per_page=100&_fields=id,name,price,images,categories`,
            { headers: authHeader, signal }
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
        if (error.name !== 'AbortError') {
          console.error("Error fetching products:", error);
        }
        setProductsLoaded(true);
      }
    };

    fetchCategoryInfo();
    fetchSubcategoriesAndProducts();

    return () => {
      controller.abort();
      componentMounted.current = false;
      
      // Optimize cache storage by removing unnecessary data
      try {
        const cacheToSave = {...apiCache.current};
        // Remove potentially large temporary data before saving
        delete cacheToSave.tempData;
        
        localStorage.setItem('box_api_cache', JSON.stringify(cacheToSave));
        globalCache = cacheToSave;
      } catch (e) {
        console.error('Error saving cache to localStorage', e);
      }
    };
  }, [categoryId]);

  // Memoized handler for showing product modal
  const handleShowProductModal = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  // Memoized handler for removing products
  const handleRemoveProduct = useCallback((subcategoryId, productId) => {
    setSubcategoryProducts(prev => ({
      ...prev,
      [subcategoryId]: prev[subcategoryId].filter(p => p.id !== productId),
    }));
  }, []);

  // Fetch extra products for subcategories
  const fetchExtraSubcategories = useCallback(async (parentCategoryId) => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    setExtraProducts([]);
    const cacheKey = `extras_${parentCategoryId}`;
    if (apiCache.current && apiCache.current[cacheKey] && (Date.now() - apiCache.current.timestamp < CACHE_EXPIRATION)) {
      setExtraProducts(apiCache.current[cacheKey]);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${parentCategoryId}`, {
        headers: authHeader,
        signal
      });
      const subcats = await res.json();
      if (!componentMounted.current) return;

      const productPromises = subcats.map(async subcat => {
        const res = await fetch(
          `${backendUrl}/wp-json/wc/v3/products?category=${subcat.id}&_fields=id,name,price,images,categories`,
          { headers: authHeader, signal }
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
      if (error.name !== 'AbortError') {
        console.error("Error fetching extra subcategories:", error);
      }
      setExtraProducts([]);
    }
    
    return () => {
      controller.abort();
    };
  }, []);

  // Memoized handler for showing modal
  const handleShowModal = useCallback((subcategoryId) => {
    setExtraProducts([]);
    setActiveModalCategory(subcategoryId);
    setShowModal(true);
    fetchExtraSubcategories(categoryMapping[subcategoryId]);
  }, [fetchExtraSubcategories, categoryMapping]);

  // Memoized handler for adding products
  const handleAddProduct = useCallback((product, quantity) => {
    const productSubcategoryId = product.categories?.find(cat =>
      subcategories.some(sub => sub.id === cat.id)
    )?.id;

    const subcategoryId = productSubcategoryId || activeModalCategory;

    if (!subcategoryId) {
      console.error("Unknown subcategory for adding product");
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
  }, [subcategories, activeModalCategory]);

  // Memoized calculation for total sum
  const totalSum = useMemo(() => {
    return subcategories.reduce((sum, sub) => {
      return (
        sum +
        (subcategoryProducts[sub.id]?.reduce((s, p) => s + Number(p.price || 0) * (p.quantity || 1), 0) || 0)
      );
    }, 0);
  }, [subcategories, subcategoryProducts]);

  // Memoized subcategory products list for optimized rendering
  const subcategoryProductsList = useMemo(() => {
    return Object.entries(subcategoryProducts).map(([id, products]) => ({
      id: parseInt(id, 10),
      products
    }));
  }, [subcategoryProducts]);

  // Debounced add to cart function
  const addToCart = useCallback(() => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
      // Find product IDs from box
      const currentBoxProductIds = new Set();
      subcategories.forEach((subcategory) => {
        subcategoryProducts[subcategory.id]?.forEach((product) => {
          currentBoxProductIds.add(product.id);
        });
      });
    
      // Filter existing items from cart
      cart = cart.filter((item) => !item.box || currentBoxProductIds.has(item.id));
    
      // Add/update products from box
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
    
      // Save and update
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500); // Prevent double-clicks
    }
  }, [subcategories, subcategoryProducts, navigate, isAddingToCart]);

  // Memoized handler for closing modal
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
        isAddingToCart={isAddingToCart}
      />

      <BoxProductTable
        subcategories={subcategories}
        subcategoryProducts={subcategoryProducts}
        subcategoryProductsList={subcategoryProductsList}
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