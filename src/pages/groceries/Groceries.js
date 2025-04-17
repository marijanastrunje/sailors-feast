import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../all-pages/Breadcrumbs";
import CategoriesSidebar from "./CategoriesSidebar";
import MobileCategoriesSlider from "./MobileCategoriesSlider";
import MobileSubcategoriesSlider from "./MobileSubcategoriesSlider";
import ProductsGrid from "./ProductsGrid";
import ModalProduct from "./ModalProduct";
import Pagination from "../../components/ui/Pagination";
import ProductsGridSkeleton from './ProductsGridSkeleton';
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";

import './Groceries.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const wcKey = process.env.REACT_APP_WC_KEY;
const wcSecret = process.env.REACT_APP_WC_SECRET;
const authHeader = "Basic " + btoa(`${wcKey}:${wcSecret}`);

const Groceries = () => {
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [subcategories, setSubcategories] = useState({});
  const [activeSubcategoryName, setActiveSubcategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for searching
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true); // Start with loading
  const [, setIsLoadingAllProducts] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false); // Changed to false to remove initial spinner
  const searchInitiatedRef = useRef(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedCategoryId = location.state?.categoryId;
  const containerRef = useRef(null);

  // Cache for all products - to avoid repeated fetches
  const allProductsCache = useRef(null);
  
  // Product cache by category
  const productsByCategory = useRef({});
  
  // Subcategories cache
  const subcategoriesCache = useRef({});
  
  // Simple cache to prevent duplicate fetches
  const fetchCache = useRef({});

  // Nova funkcija koja direktno pretražuje proizvode preko API-ja
  const directSearchProducts = useCallback((term) => {
    setIsLoadingProducts(true);
    console.log(`Performing direct API search for: "${term}"`);

    // Direktno pretražujemo proizvode preko WooCommerce API-ja
    fetch(`${backendUrl}/wp-json/wc/v3/products?search=${encodeURIComponent(term)}&per_page=100`, {
      headers: { Authorization: authHeader }
    })
      .then(res => res.json())
      .then(data => {
        console.log(`Found ${data.length} products directly from API for search: "${term}"`);
        setFilteredProducts(data);
        setIsLoadingProducts(false);
      })
      .catch(error => {
        console.error("Error during direct API search:", error);
        setIsLoadingProducts(false);
      });
  }, []);

  // Get search term from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
      setIsSearchActive(true);
      searchInitiatedRef.current = true; // označavamo da je search pokrenut preko URL-a

      // Odmah pretražujemo ako imamo search parametar
      directSearchProducts(search);
    } else {
      setSearchTerm("");
      setIsSearchActive(false);
      setFilteredProducts(products);
    }
  }, [location.search, products, directSearchProducts]);

  // Fetch all products once for searching - this happens in the background
  const fetchAllProducts = useCallback(() => {
    // If we already have all products cached, use them
    if (allProductsCache.current) {
      setAllProducts(allProductsCache.current);
      return Promise.resolve(allProductsCache.current);
    }

    setIsLoadingAllProducts(true);

    // Fetch all products in batches of 100
    const fetchBatch = (page = 1, accumulated = []) => {
      return fetch(`${backendUrl}/wp-json/wc/v3/products?per_page=100&page=${page}`, {
        headers: { Authorization: authHeader }
      })
        .then(res => {
          const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
          return res.json().then(data => ({ data, totalPages, currentPage: page }));
        })
        .then(({ data, totalPages, currentPage }) => {
          const newAccumulated = [...accumulated, ...data];
          
          if (currentPage < totalPages) {
            // Fetch next batch
            return fetchBatch(currentPage + 1, newAccumulated);
          } else {
            // We've fetched all pages
            return newAccumulated;
          }
        });
    };

    return fetchBatch()
      .then(allProductsData => {
        // Cache the data for future use
        allProductsCache.current = allProductsData;
        
        // Also organize products by category for quick access
        const productsByCat = {};
        allProductsData.forEach(product => {
          product.categories.forEach(category => {
            if (!productsByCat[category.id]) {
              productsByCat[category.id] = [];
            }
            productsByCat[category.id].push(product);
          });
        });
        productsByCategory.current = productsByCat;
        
        setAllProducts(allProductsData);
        setIsLoadingAllProducts(false);
        return allProductsData;
      })
      .catch(error => {
        console.error("Error fetching all products:", error);
        setIsLoadingAllProducts(false);
        return [];
      });
  }, []);

  // Optimized function to fetch category products
  const fetchProducts = useCallback((categoryId, isDirectClick = false) => {
    // Clear search if this is a direct category click
    const searchParams = new URLSearchParams(location.search);
    const hasSearchParam = searchParams.has('search');

    if (isDirectClick && isSearchActive && !hasSearchParam) {
      navigate('/groceries', { replace: true });
      setIsSearchActive(false);
      setSearchTerm("");
    }
    
    // If we already have products for this category cached, use them
    if (productsByCategory.current[categoryId]) {
      if (isDirectClick) {
        const cachedProducts = productsByCategory.current[categoryId];
        setProducts(cachedProducts);
        setFilteredProducts(cachedProducts);
        setInitialLoad(false);
        setIsLoadingProducts(false);
      }
      return;
    }
    
    // Check if we already have this request in progress
    const cacheKey = `products_${categoryId}`;
    if (fetchCache.current[cacheKey]) {
      console.log("Skipping duplicate fetch for products", categoryId);
      return;
    }

    setIsLoadingProducts(true);
    fetchCache.current[cacheKey] = true;

    // Fetch products for this category
    fetch(`${backendUrl}/wp-json/wc/v3/products?category=${categoryId}&per_page=100`, {
      headers: { Authorization: authHeader }
    })
      .then(res => res.json())
      .then(data => {
        // Cache the products for this category
        productsByCategory.current[categoryId] = data;
        
        if (isDirectClick) {
          setProducts(data);
          setFilteredProducts(data);
          setInitialLoad(false);
        }
      })
      .catch(error => {
        console.error(`Error fetching products for category ${categoryId}:`, error);
      })
      .finally(() => {
        setIsLoadingProducts(false);
        delete fetchCache.current[cacheKey];
      });
  }, [isSearchActive, navigate, location.search]);

  // Enhanced search function that searches through all products
  const searchAllProducts = useCallback((term) => {
    if (!term) {
      setFilteredProducts(products);
      return;
    }

    setIsLoadingProducts(true);

    // First check if we have all products
    const performSearch = (productsToSearch) => {
      const searchLower = term.toLowerCase();
      const searchTerms = searchLower.split(" ").filter(Boolean);

      // Advanced search with multiple terms (each term must be present in at least one field)
      const filtered = productsToSearch.filter(product => {
        const name = product.name?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";
        const shortDesc = product.short_description?.toLowerCase() || "";
        const slug = product.slug?.toLowerCase() || "";
        const sku = product.sku?.toLowerCase() || "";
        
        // Each term must be found in at least one field
        return searchTerms.every(term =>
          name.includes(term) || 
          description.includes(term) || 
          shortDesc.includes(term) || 
          slug.includes(term) ||
          sku.includes(term)
        );
      });
      
      setFilteredProducts(filtered);
      setIsLoadingProducts(false);
    };

    // If we already have all products, search through them
    if (allProducts.length > 0) {
      performSearch(allProducts);
    } else {
      // Otherwise fetch all products first
      fetchAllProducts()
        .then(allProductsData => {
          performSearch(allProductsData);
        });
    }
  }, [products, allProducts, fetchAllProducts]);

  // Apply search filter when search term changes (osim početnog učitavanja)
  useEffect(() => {
    // Samo za lokalne pretrage, ne za inicijalne (koje koriste direktno API pretraživanje)
    if (isSearchActive && searchTerm && !searchInitiatedRef.current) {
      searchAllProducts(searchTerm);
    } else if (!isSearchActive) {
      setFilteredProducts(products);
    }
  }, [searchTerm, isSearchActive, products, searchAllProducts]);

  // Start fetching all products in the background after initial load
  useEffect(() => {
    if (!initialLoad && !allProductsCache.current && !isSearchActive) {
      fetchAllProducts();
    }
  }, [initialLoad, fetchAllProducts, isSearchActive]);

  // Optimized subcategories fetch
  const fetchSubcategories = useCallback((categoryId) => {
    // Clear search if active when changing categories
    const searchParams = new URLSearchParams(location.search);
    const hasSearchParam = searchParams.has('search');

    if (isSearchActive && !hasSearchParam) {
      navigate('/groceries', { replace: true });
      setIsSearchActive(false);
      setSearchTerm("");
    }
    
    // Skip if we're already showing this category
    if (openCategory === categoryId) {
      return;
    }

    // Immediate UI update - even before fetch completes
    setOpenCategory(categoryId);
    setCurrentPage(1);
    
    // If we have subcategories cached, use them immediately
    if (subcategoriesCache.current[categoryId]) {
      const sorted = subcategoriesCache.current[categoryId];
      setSubcategories(prev => ({ ...prev, [categoryId]: sorted }));
      
      if (sorted.length > 0) {
        const firstSub = sorted[0];
        setActiveSubcategoryName(firstSub.name);
        setActiveSubcategory(firstSub.id);
        fetchProducts(firstSub.id, true);
      } else {
        setActiveSubcategoryName("");
        setActiveSubcategory(null);
        fetchProducts(categoryId, true);
      }
      return;
    }
    
    // Check if we already have this request in progress
    const cacheKey = `subcategories_${categoryId}`;
    if (fetchCache.current[cacheKey]) {
      console.log("Skipping duplicate fetch for subcategories", categoryId);
      return;
    }

    fetchCache.current[cacheKey] = true;

    // Start fetching products for the category immediately (in parallel)
    // This speeds up the perceived load time
    fetchProducts(categoryId, true);

    fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${categoryId}&per_page=100`, {
      headers: { Authorization: authHeader }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.menu_order - b.menu_order);
        
        // Cache the subcategories
        subcategoriesCache.current[categoryId] = sorted;
        setSubcategories(prev => ({ ...prev, [categoryId]: sorted }));
        
        // Only need to update active subcategory here if there are subcategories
        if (sorted.length > 0) {
          const firstSub = sorted[0];
          setActiveSubcategoryName(firstSub.name);
          setActiveSubcategory(firstSub.id);
          fetchProducts(firstSub.id, true);
        } else {
          setActiveSubcategoryName("");
          setActiveSubcategory(null);
          // Already fetching category products above
        }
      })
      .catch(error => {
        console.error(`Error fetching subcategories for ${categoryId}:`, error);
      })
      .finally(() => {
        delete fetchCache.current[cacheKey];
      });
  }, [fetchProducts, openCategory, isSearchActive, navigate, location.search]);

  // Optimized main categories fetch - use a default empty array while loading
  useEffect(() => {
    const excluded = [17, 108, 206, 198, 202];
    
    // Set default empty categories if not loaded yet
    if (categories.length === 0) {
      setCategories([]);
    }

    const cacheKey = 'categories';
    if (fetchCache.current[cacheKey]) {
      return;
    }

    fetchCache.current[cacheKey] = true;

    fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=0&per_page=100`, {
      headers: { Authorization: authHeader }
    })
      .then(res => res.json())
      .then(data => {
        const filtered = data
          .filter(cat => !excluded.includes(cat.id))
          .sort((a, b) => a.menu_order - b.menu_order);
        setCategories(filtered);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        delete fetchCache.current[cacheKey];
      });
  }, [categories.length]);

  // Load initial category
  useEffect(() => {
    if (categories.length > 0 && !openCategory && !isSearchActive) {
      const initialId = preselectedCategoryId || categories[0].id;
      fetchSubcategories(initialId);
    }
  }, [categories, preselectedCategoryId, fetchSubcategories, openCategory, isSearchActive]);

  // Preload subcategories for faster navigation
  useEffect(() => {
    const preloadSubcategories = async () => {
      // Only preload after initial render and if we have categories
      if (!initialLoad && categories.length > 0) {
        // Preload subcategories for first few categories in the background
        const categoriesToPreload = categories.slice(0, 5);
        for (const category of categoriesToPreload) {
          if (!subcategoriesCache.current[category.id]) {
            try {
              const response = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${category.id}&per_page=100`, {
                headers: { Authorization: authHeader }
              });
              const data = await response.json();
              subcategoriesCache.current[category.id] = data.sort((a, b) => a.menu_order - b.menu_order);
            } catch (error) {
              console.error(`Error preloading subcategories for ${category.id}:`, error);
            }
          }
        }
      }
    };
    
    preloadSubcategories();
  }, [initialLoad, categories]);

  const handleShowModal = (product) => {
    setSelectedProduct(product);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  // Resetiraj na prvu stranicu kad se promijeni aktivna podkategorija
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubcategory]);


  // Clear search when clicking in certain areas
  useEffect(() => {
    const handleClickOutside = (event) => {
      // klik izvan područja pretrage
      const clickedOutsideSearch = containerRef.current &&
        !event.target.closest('.search-box') &&
        !event.target.closest('.autocomplete-results') &&
        !event.target.closest('.modal') &&
        !event.target.closest('.desktop-scroll') &&
        !event.target.closest('.navbar') &&
        (event.target.closest('.groceries-hero') ||
          event.target.closest('.product-grid') ||
          event.target.closest('#Faq'));
  
      if (
        isSearchActive &&
        clickedOutsideSearch &&
        searchInitiatedRef.current // samo ako je search iniciran
      ) {
        // očisti search samo kad korisnik eksplicitno klikne izvan
        navigate('/groceries', { replace: true });
        setIsSearchActive(false);
        setSearchTerm("");
        searchInitiatedRef.current = false;
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchActive, navigate]);
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); 
    }
  };

  // Lazy loading for FAQ
  const [isVisible, setIsVisible] = useState({
    faq: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const faqSection = document.getElementById('Faq');
      if (faqSection) {
        const faqPosition = faqSection.getBoundingClientRect();
        if (faqPosition.top < window.innerHeight + 300) {
          setIsVisible(prev => ({ ...prev, faq: true }));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <div className="groceries-hero p-2 text-center" aria-label="Groceries hero section">
        <h1 className="display-5 fw-bold text-white position-relative z-2">Groceries</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4 text-white position-relative z-2">
          Find everything you need for your trip. Browse by category, search for your favorites, and add items with a single click. We'll deliver it all fresh to your boat.
          </p>
        </div>
      </div>

      <Breadcrumbs items={[{ name: "Home", link: "/" }, { name: "Groceries" }]} />

      {!isSearchActive && (
        <>
          <MobileCategoriesSlider
            categories={categories}
            fetchSubcategories={fetchSubcategories}
            activeCategory={openCategory}
          />

          <MobileSubcategoriesSlider
            subcategories={subcategories}
            openCategory={openCategory}
            fetchProducts={fetchProducts}
            excludedSubcategories={[671, 669, 670]}
            setActiveSubcategoryName={setActiveSubcategoryName}
            setActiveSubcategory={setActiveSubcategory}
            activeSubcategory={activeSubcategory}
          />
        </>
      )}

      <div className="container-fluid mx-auto" aria-label="Groceries product section">
        <div className="row">
          {!isSearchActive && (
            <div className="col-sm-4 col-md-3 desktop-scroll d-none d-sm-block">
              <h5 title="Category list heading">Categories</h5>
              <CategoriesSidebar
                categories={categories}
                openCategory={openCategory}
                subcategories={subcategories}
                fetchSubcategories={fetchSubcategories}
                fetchProducts={(id) => fetchProducts(id, true)}
                setActiveSubcategoryName={setActiveSubcategoryName}
                setActiveSubcategory={setActiveSubcategory}
                activeSubcategory={activeSubcategory}
              />
            </div>
          )}

          <div className={`${isSearchActive ? 'col-12' : 'col-sm-8'} mx-auto px-3`}>
            {isSearchActive ? (
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>
                  Search results: <span className="text-prim">"{searchTerm}"</span>
                  <small className="ms-2 text-muted">({filteredProducts.length})</small>
                </h2>
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  onClick={() => {
                    navigate('/groceries', { replace: true });
                    setIsSearchActive(false);
                    setSearchTerm("");
                    searchInitiatedRef.current = false;
                  }}
                >
                  Clear search
                </button>
              </div>
            ) : (
              activeSubcategoryName && (
                <h2 className="mb-3">{activeSubcategoryName}</h2>
              )
            )}

            {isLoadingProducts ? (
              <ProductsGridSkeleton count={16} />
            ) : (
              <>
                {paginatedProducts.length > 0 ? (
                  <>
                    <ProductsGrid products={paginatedProducts} onShowModal={handleShowModal} />
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                ) : (
                  <div className="alert alert-info my-5 text-center">
                    <h4>No products found</h4>
                    {isSearchActive && (
                      <p>
                        No products match your search term "{searchTerm}".
                        <br />
                        <button
                          className="btn btn-outline-primary mt-3"
                          onClick={() => {
                            navigate('/groceries', { replace: true });
                            setIsSearchActive(false);
                            setSearchTerm("");
                            searchInitiatedRef.current = false;
                          }}
                        >
                          Clear search
                        </button>
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {selectedProduct && (
          <ModalProduct
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>

      <div id="Faq" aria-label="FAQ section">
        {isVisible.faq && <Faq topicId={195} topic="Groceries" />}
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default Groceries;