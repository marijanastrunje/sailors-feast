import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CategoriesSidebar from "./CategoriesSidebar";
import MobileCategoriesSlider from "./MobileCategoriesSlider";
import MobileSubcategoriesSlider from "./MobileSubcategoriesSlider";
import ProductsGrid from "./ProductsGrid";
import ModalProduct from "./ModalProduct";
import Pagination from "../../components/ui/Pagination";
import ProductsGridSkeleton from './ProductsGridSkeleton';
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import SEO from "../../components/common/SEO";

import './Groceries.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const wcKey = process.env.REACT_APP_WC_KEY;
const wcSecret = process.env.REACT_APP_WC_SECRET;
const authHeader = "Basic " + btoa(`${wcKey}:${wcSecret}`);

// Memoize ProductsGrid for better performance
const MemoizedProductsGrid = memo(ProductsGrid);

// Persistence helpers
const saveToSessionStorage = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to sessionStorage:', error);
  }
};

const loadFromSessionStorage = (key) => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from sessionStorage:', error);
    return null;
  }
};

const Groceries = () => {
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [subcategories, setSubcategories] = useState({});
  const [activeSubcategoryName, setActiveSubcategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [, setIsLoadingAllProducts] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const searchInitiatedRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedCategoryId = location.state?.categoryId;
  const containerRef = useRef(null);
  const contentStartRef = useRef(null);

  // Initialize caches from session storage or create new ones
  const allProductsCache = useRef(loadFromSessionStorage('allProductsCache') || null);
  const productsByCategory = useRef(loadFromSessionStorage('productsByCategory') || {});
  const subcategoriesCache = useRef(loadFromSessionStorage('subcategoriesCache') || {});
  const fetchCache = useRef({});

  // Ažurirana funkcija scrollToContent koja koristi URL parametar
  const scrollToContent = useCallback(() => {
    // Provjera je li ovo prvi posjet
    const searchParams = new URLSearchParams(location.search);
    const shouldScroll = searchParams.get('scroll') === 'true';
    
    // Ako nema parametra za scroll, prikaži hero sekciju (ne radi scroll)
    if (!shouldScroll) {
      return;
    }
    
    if (contentStartRef.current) {
      // Dobivanje pozicije elementa
      const elementPosition = contentStartRef.current.getBoundingClientRect().top;
      // Izračun pozicije za scroll (trenutna pozicija + scroll pozicija - 89px offset)
      const offsetPosition = elementPosition + window.pageYOffset - 89;
      
      // Koristite scrollTo s izračunatom pozicijom
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    } else {
      // Fallback u slučaju da ref nije dostupan
      window.scrollTo({ 
        top: 0,
        behavior: "smooth" 
      });
    }
  }, [location.search]);
  
  // Save caches to session storage when component unmounts
  useEffect(() => {
    // No need to return cleanup function
    const handleBeforeUnload = () => {
      if (allProductsCache.current) {
        saveToSessionStorage('allProductsCache', allProductsCache.current);
      }
      if (Object.keys(productsByCategory.current).length > 0) {
        saveToSessionStorage('productsByCategory', productsByCategory.current);
      }
      if (Object.keys(subcategoriesCache.current).length > 0) {
        saveToSessionStorage('subcategoriesCache', subcategoriesCache.current);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      handleBeforeUnload(); // Save on unmount
      window.addEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Direct API search
  const directSearchProducts = useCallback((term) => {
    if (!term) return;
    
    setIsLoadingProducts(true);
    console.log(`Performing direct API search for: "${term}"`);

    // Check if we have this search cached
    const cacheKey = `search_${term.toLowerCase().trim()}`;
    const cachedResults = loadFromSessionStorage(cacheKey);
    
    if (cachedResults) {
      console.log(`Using cached search results for: "${term}"`);
      setFilteredProducts(cachedResults);
      setIsLoadingProducts(false);
      return;
    }

    fetch(`${backendUrl}/wp-json/wc/v3/products?search=${encodeURIComponent(term)}&per_page=100`, {
      headers: { Authorization: authHeader }
    })
      .then(res => res.json())
      .then(data => {
        console.log(`Found ${data.length} products directly from API for search: "${term}"`);
        setFilteredProducts(data);
        
        // Cache the search results
        saveToSessionStorage(cacheKey, data);
      })
      .catch(error => {
        console.error("Error during direct API search:", error);
      })
      .finally(() => {
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
      searchInitiatedRef.current = true;
      directSearchProducts(search);
    } else {
      setSearchTerm("");
      setIsSearchActive(false);
      setFilteredProducts(products);
    }
  }, [location.search, products, directSearchProducts]);

  // Fetch all products once for searching - with improved caching
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
            return fetchBatch(currentPage + 1, newAccumulated);
          } else {
            return newAccumulated;
          }
        });
    };

    return fetchBatch()
      .then(allProductsData => {
        // Cache the data for future use
        allProductsCache.current = allProductsData;
        saveToSessionStorage('allProductsCache', allProductsData);
        
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
        saveToSessionStorage('productsByCategory', productsByCat);
        
        setAllProducts(allProductsData);
        return allProductsData;
      })
      .catch(error => {
        console.error("Error fetching all products:", error);
        return [];
      })
      .finally(() => {
        setIsLoadingAllProducts(false);
      });
  }, []);

  // Optimized function to fetch category products with better caching
  const fetchProducts = useCallback((categoryId, isDirectClick = false) => {
    if (!categoryId) return;

    if (isDirectClick) {
      // Dodajte scroll=true parametar u URL kada korisnik klikne na kategoriju
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('scroll', 'true');
      
      // Ažurirajte URL bez resetiranja stranice
      navigate(`/groceries?${searchParams.toString()}`, { replace: true });
      
      // Pozovite scrollToContent da provjeri treba li scrollati
      scrollToContent();
    }
    
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
        console.log(`Using ${cachedProducts.length} cached products for category ${categoryId}`);
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
        saveToSessionStorage('productsByCategory', productsByCategory.current);
        
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
  }, [isSearchActive, navigate, location.search, scrollToContent]);

  // Enhanced search function that searches through all products - with debounce
  const searchAllProducts = useCallback((term) => {
    if (!term) {
      setFilteredProducts(products);
      return;
    }

    setIsLoadingProducts(true);

    // Check if we have this search cached
    const cacheKey = `local_search_${term.toLowerCase().trim()}`;
    const cachedResults = loadFromSessionStorage(cacheKey);
    
    if (cachedResults) {
      console.log(`Using cached local search results for: "${term}"`);
      setFilteredProducts(cachedResults);
      setIsLoadingProducts(false);
      return;
    }

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
      
      // Cache the search results
      saveToSessionStorage(cacheKey, filtered);
      
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

  // Debounced search - prevent too many searches when typing
  useEffect(() => {
    if (isSearchActive && searchTerm && !searchInitiatedRef.current) {
      const debounceTimer = setTimeout(() => {
        searchAllProducts(searchTerm);
      }, 300); // 300ms debounce
      
      return () => clearTimeout(debounceTimer);
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

  // Optimized subcategories fetch - fixes the double loading issue
  const fetchSubcategories = useCallback((categoryId) => {
    if (!categoryId) return;

    // Dodajte scroll=true parametar u URL kada korisnik klikne na kategoriju
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('scroll', 'true');
    
    // Ažurirajte URL bez resetiranja stranice
    navigate(`/groceries?${searchParams.toString()}`, { replace: true });
    
    // Pozovite scrollToContent da provjeri treba li scrollati
    scrollToContent();
    
    // Clear search if active when changing categories
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
      console.log(`Using ${sorted.length} cached subcategories for category ${categoryId}`);
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
    setIsLoadingProducts(true);

    // IMPORTANT: Don't fetch products for the category immediately
    // This is the key change to prevent double loading
    
    fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${categoryId}&per_page=100`, {
      headers: { Authorization: authHeader }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.menu_order - b.menu_order);
        
        // Cache the subcategories
        subcategoriesCache.current[categoryId] = sorted;
        saveToSessionStorage('subcategoriesCache', subcategoriesCache.current);
        
        setSubcategories(prev => ({ ...prev, [categoryId]: sorted }));
        
        // Only fetch products now that we know whether to use category or subcategory
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
      })
      .catch(error => {
        console.error(`Error fetching subcategories for ${categoryId}:`, error);
        // If error, try to fetch category products
        fetchProducts(categoryId, true);
      })
      .finally(() => {
        delete fetchCache.current[cacheKey];
      });
  }, [fetchProducts, openCategory, isSearchActive, navigate, location.search, scrollToContent]);

  // Optimized main categories fetch with cache
  useEffect(() => {
    const excluded = [17, 108, 206, 198, 202];
    
    // Check if we have categories in session storage
    const cachedCategories = loadFromSessionStorage('categories');
    if (cachedCategories && cachedCategories.length > 0) {
      setCategories(cachedCategories);
      return;
    }
    
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
        saveToSessionStorage('categories', filtered);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        delete fetchCache.current[cacheKey];
      });
  }, [categories.length]);

  // Load initial category - only once when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !openCategory && !isSearchActive) {
      const initialId = preselectedCategoryId || categories[0].id;
      fetchSubcategories(initialId);
    }
  }, [categories, preselectedCategoryId, fetchSubcategories, openCategory, isSearchActive]);

  // Preload subcategories for faster navigation - with smarter caching
  useEffect(() => {
    const preloadSubcategories = async () => {
      // Only preload after initial render and if we have categories
      if (categories.length > 0) {
        // Preload subcategories for first few categories in the background
        const categoriesToPreload = categories.slice(0, 5);
        for (const category of categoriesToPreload) {
          if (!subcategoriesCache.current[category.id]) {
            try {
              const response = await fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=${category.id}&per_page=100`, {
                headers: { Authorization: authHeader }
              });
              const data = await response.json();
              const sorted = data.sort((a, b) => a.menu_order - b.menu_order);
              subcategoriesCache.current[category.id] = sorted;
              
              // Update session storage periodically to avoid too many writes
              if (Math.random() < 0.2) { // 20% chance to update storage
                saveToSessionStorage('subcategoriesCache', subcategoriesCache.current);
              }
            } catch (error) {
              console.error(`Error preloading subcategories for ${category.id}:`, error);
            }
          }
        }
        
        // Ensure storage is updated after all preloads
        saveToSessionStorage('subcategoriesCache', subcategoriesCache.current);
      }
    };
    
    preloadSubcategories();
  }, [categories]);

  const handleShowModal = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  // Reset pagination when subcategory changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubcategory]);

  // Clear search when clicking in certain areas - with cleanup
  useEffect(() => {
    const handleClickOutside = (event) => {
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
        searchInitiatedRef.current
      ) {
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
  
  // Pagination calculations - memoized to prevent unnecessary recalculations
  const paginationData = React.useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginatedProducts = filteredProducts.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    );
    return { totalPages, paginatedProducts };
  }, [filteredProducts, currentPage, productsPerPage]);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
      
      // Dodajte scroll=true parametar u URL pri promjeni stranice
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('scroll', 'true');
      
      // Ažurirajte URL bez resetiranja stranice
      navigate(`/groceries?${searchParams.toString()}`, { replace: true });
      
      // Pozovite scrollToContent
      scrollToContent();
    }
  }, [paginationData.totalPages, location.search, navigate, scrollToContent]);

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

  // Clear search button handler - extracted to reduce inline function creation
  const handleClearSearch = useCallback(() => {
    navigate('/groceries', { replace: true });
    setIsSearchActive(false);
    setSearchTerm("");
    searchInitiatedRef.current = false;
  }, [navigate]);

  return (
    <>
      <SEO
        title="Groceries | Sailor's Feast"
        description="Shop fresh groceries, snacks, and drinks for your sailing trip in Croatia. Get everything delivered right to your boat for an easy, fun vacation!"
        keywords={[
          'boat groceries',
          'sailing snacks',
          'yacht delivery Croatia',
          'fresh food on boat',
          'Sailor\'s Feast groceries'
        ]}
        path="/groceries"
      />
      <div ref={containerRef}>
        <div className="groceries-hero p-2 text-center" aria-label="Groceries hero section">
          <h1 className="display-5 fw-bold text-white position-relative z-2">Groceries</h1>
          <div className="col-lg-6 mx-auto">
            <p className="lead mb-4 text-white position-relative z-2">
            Find everything you need for your trip. Browse by category, search for your favorites, and add items with a single click. We'll deliver it all fresh to your boat.
            </p>
          </div>
          <div ref={contentStartRef}></div>
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
                    onClick={handleClearSearch}
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
                  {paginationData.paginatedProducts.length > 0 ? (
                    <>
                      <MemoizedProductsGrid products={paginationData.paginatedProducts} onShowModal={handleShowModal} />
                      {paginationData.totalPages > 1 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={paginationData.totalPages}
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
                            onClick={handleClearSearch}
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
    </>
  );
};

export default Groceries;