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

const BoxLayout = ({ categoryId, categoryMapping }) => {
  const componentMounted = useRef(true);
  const navigate = useNavigate();

  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryProducts, setSubcategoryProducts] = useState({});
  const [extraProducts, setExtraProducts] = useState([]);
  const [activeModalCategory, setActiveModalCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState({ name: "", description: "", image: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [peopleCount, setPeopleCount] = useState(4);
  const [listName, setListName] = useState("");
  const [, setSavedLists] = useState({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const token = localStorage.getItem("token");
  const loadedFromStorage = useRef(false);
  const [isFirstLoadAfterLogin, setIsFirstLoadAfterLogin] = useState(true);

  useEffect(() => {
    const savedProducts = localStorage.getItem("pendingBoxProducts");
    const savedPeopleCount = localStorage.getItem("pendingPeopleCount");

    if (savedProducts) {
      setSubcategoryProducts(JSON.parse(savedProducts));
      loadedFromStorage.current = true;
      localStorage.removeItem("pendingBoxProducts");
    }
    if (savedPeopleCount) {
      setPeopleCount(parseInt(savedPeopleCount, 10));
      localStorage.removeItem("pendingPeopleCount");
    }
  }, []);

  useEffect(() => {
    const handleLogin = () => {
      const savedProducts = localStorage.getItem("pendingBoxProducts");
      const savedPeopleCount = localStorage.getItem("pendingPeopleCount");
  
      if (savedProducts) {
        setSubcategoryProducts(JSON.parse(savedProducts));
        localStorage.removeItem("pendingBoxProducts");
      }
      if (savedPeopleCount) {
        setPeopleCount(parseInt(savedPeopleCount, 10));
        localStorage.removeItem("pendingPeopleCount");
      }
    };
  
    window.addEventListener('userLogin', handleLogin);
    return () => {
      window.removeEventListener('userLogin', handleLogin);
    };
  }, []);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories/${categoryId}`, { headers: authHeader });
        const categoryData = await categoryRes.json();
        if (!componentMounted.current) return;

        setCategoryInfo({
          name: categoryData.name || "",
          description: categoryData.description || "",
          image: categoryData.image?.src || "",
        });

        const subcatRes = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${categoryId}&per_page=50`, { headers: authHeader });
        const subcatData = await subcatRes.json();
        if (!componentMounted.current) return;

        const sortedSubcatData = subcatData.sort((a, b) => a.menu_order - b.menu_order);
        setSubcategories(sortedSubcatData);

        const allSubcategoryIds = subcatData.map(sub => sub.id).join(",");
        const productRes = await fetch(`${backendUrl}/wp-json/wc/v3/products?category=${allSubcategoryIds}&per_page=100&_fields=id,name,price,images,categories,acf`, { headers: authHeader });
        const products = await productRes.json();
        if (!componentMounted.current) return;

        const grouped = {};
        subcatData.forEach(sub => {
          grouped[sub.id] = products
            .filter(p => p.categories.some(cat => cat.id === sub.id))
            .map(product => {
              const baseQuantity = parseInt(product.acf?.boxes_product_default_quantity, 10);
              const defaultQuantity = isNaN(baseQuantity) ? 1 : baseQuantity;
              return { ...product, baseQuantity: defaultQuantity, quantity: defaultQuantity };
            });
        });

        if (!loadedFromStorage.current) {
          setSubcategoryProducts(grouped);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      componentMounted.current = false;
    };
  }, [categoryId]);

  useEffect(() => {

    if (isFirstLoadAfterLogin && loadedFromStorage.current) {
      return;
    }

    setSubcategoryProducts(prev => {
      const updated = {};
      Object.keys(prev).forEach(subcatId => {
        updated[subcatId] = prev[subcatId].map(product => {
          const scaledQuantity = Math.max(1, Math.round((product.baseQuantity / 4) * peopleCount));
          return { ...product, quantity: scaledQuantity };
        });
      });
      return updated;
    });
  }, [peopleCount, isFirstLoadAfterLogin]);
  
  const handleShowProductModal = (product) => setSelectedProduct(product);

  const handleRemoveProduct = (subcategoryId, productId) => {
    setSubcategoryProducts(prev => ({
      ...prev,
      [subcategoryId]: prev[subcategoryId].filter(p => p.id !== productId),
    }));
  };

  const handleAddProduct = (product, quantity) => {
    const lastCategoryId = product.categories?.length > 0 
      ? product.categories[product.categories.length - 1].id 
      : null;
  
    const subcategoryId = subcategories.some(sub => sub.id === lastCategoryId)
      ? lastCategoryId
      : activeModalCategory;
  
    if (!subcategoryId) {
      console.error("Unknown subcategory for adding product");
      return;
    }
  
    // NOVO: postavi baseQuantity na unos korisnika
    const baseQuantity = quantity;
  
    setSubcategoryProducts(prev => {
      const existing = prev[subcategoryId] || [];
      const existingProduct = existing.find(p => p.id === product.id);
  
      if (existingProduct) {
        return {
          ...prev,
          [subcategoryId]: existing.map(p =>
            p.id === product.id
              ? { ...p, baseQuantity: p.baseQuantity + baseQuantity }
              : p
          ),
        };
      } else {
        return {
          ...prev,
          [subcategoryId]: [
            ...existing,
            { ...product, baseQuantity: baseQuantity, quantity: baseQuantity },
          ],
        };
      }
    });
  
    setShowModal(false);
  };
  

  const fetchExtraSubcategories = useCallback(async (parentCategoryId) => {
    setExtraProducts([]);
    try {
      const res = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${parentCategoryId}`, {
        headers: authHeader,
      });
      const subcats = await res.json();
      if (!componentMounted.current) return;
  
      const productPromises = subcats.map(async (subcat) => {
        const res = await fetch(
          `${backendUrl}/wp-json/wc/v3/products?category=${subcat.id}&_fields=id,name,price,images,categories,acf`,
          { headers: authHeader }
        );
        const products = await res.json();
        return { id: subcat.id, name: subcat.name, products };
      });
  
      const withProducts = await Promise.all(productPromises);
      if (!componentMounted.current) return;
  
      setExtraProducts(withProducts);
    } catch (error) {
      console.error("Error fetching extra subcategories:", error);
      setExtraProducts([]);
    }
  }, []);

  const handleShowModal = useCallback((subcategoryId) => {
    setExtraProducts([]);
    setActiveModalCategory(subcategoryId);
    setShowModal(true);
    fetchExtraSubcategories(categoryMapping[subcategoryId]);
  }, [fetchExtraSubcategories, categoryMapping]);  

  const totalSum = useMemo(() => {
    return Object.values(subcategoryProducts).reduce((sum, products) => {
      return (
        sum +
        products.reduce(
          (subSum, product) =>
            subSum + Number(product.price || 0) * (product.quantity || 0),
          0
        )
      );
    }, 0);
  }, [subcategoryProducts]);


  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const currentBoxProductIds = new Set();
    subcategories.forEach(sub => {
      subcategoryProducts[sub.id]?.forEach(product => currentBoxProductIds.add(product.id));
    });
    cart = cart.filter(item => !item.box || currentBoxProductIds.has(item.id));
    subcategories.forEach(sub => {
      subcategoryProducts[sub.id]?.forEach(product => {
        const quantity = product.quantity || 1;
        if (quantity > 0) {
          const existing = cart.find(item => item.id === product.id);
          if (existing) {
            existing.quantity = quantity;
          } else {
            cart.push({
              id: product.id,
              image: product.images,
              title: product.name,
              price: product.price,
              quantity,
              box: true,
            });
          }
        }
      });
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  const saveToBackend = async () => {
    if (!token) {
      navigate("/login?redirect=/boxes");
      return;
    }
  
    if (!listName.trim()) {
      alert("Please enter a list name before saving.");
      return;
    }
  
    try {
      const res = await fetch(`${backendUrl}/wp-json/wp/v2/users/me?nocache=` + Date.now(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
  
      let currentLists = {};
      try {
        const parsed = JSON.parse(data.meta?.saved_lists || "{}");
        if (typeof parsed === "object" && parsed !== null) {
          currentLists = parsed;
        }
      } catch (err) {
        console.warn("Failed parsing saved_lists:", err);
      }
  
      // Pripremi box proizvode (filtriraj po `box: true`)
      const currentBoxProducts = [];
      subcategories.forEach(sub => {
        subcategoryProducts[sub.id]?.forEach(product => {
          currentBoxProducts.push({
            id: product.id,
            image: product.images,
            title: product.name,
            price: product.price,
            quantity: product.quantity,
            box: true,
          });
        });
      });
  
      const updatedLists = { ...currentLists, [listName]: currentBoxProducts };
  
      const saveRes = await fetch(`${backendUrl}/wp-json/wp/v2/users/me?no_cache=${Date.now()}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          meta: {
            saved_lists: JSON.stringify(updatedLists),
          },
        }),
      });
  
      const saveData = await saveRes.json();
      console.log("Saved lists:", updatedLists);
      console.log("Backend response:", saveData);
  
      setSavedLists(updatedLists);
      alert(`List "${listName}" has been successfully saved!`);
      navigate("/user");
    } catch (err) {
      alert("Unable to save the list.");
    }
    setShowSaveModal(false);
  };  

  const handlePeopleCountChange = (count) => {
    if (isFirstLoadAfterLogin) {

      setIsFirstLoadAfterLogin(false);
    }
    setPeopleCount(count);
  };

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      setExtraProducts([]);
    }, 300);
  }, []);

  if (isLoading) {
    return (
      <>
        <BoxHeader
          title={categoryInfo.name}
          description={categoryInfo.description}
          image={categoryInfo.image}
          totalSum={0}
          peopleCount={peopleCount}
          onPeopleCountChange={handlePeopleCountChange}
          onAddToCart={addToCart}
        />
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
        peopleCount={peopleCount}
        onPeopleCountChange={handlePeopleCountChange}
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
        onShowSaveModal={() => setShowSaveModal(true)}
        token={token}
        peopleCount={peopleCount}
        totalSum={totalSum}
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

      {showSaveModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Save Your List</h5>
                <button type="button" className="btn-close" onClick={() => setShowSaveModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter list name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-sm btn-secondary" onClick={() => setShowSaveModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-sm btn-prim" onClick={saveToBackend}>
                  Save List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default BoxLayout;
