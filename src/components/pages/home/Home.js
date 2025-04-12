import React, { useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// Samo osnovne komponente učitane odmah
import ScrollToTopButton from "../all-pages/ScrollToTopButton";

// Lazy loading komponenti
const HeroVideo = React.lazy(() => import("./sections/HeroVideo"));
const Advantages = React.lazy(() => import("./sections/Advantages"));
const BoxCarousel = React.lazy(() => import("./sections/BoxCarousel"));
const SpecialOffer = React.lazy(() => import("./sections/SpecialOffer"));
const DeliveryMap = React.lazy(() => import("./sections/delivery/DeliveryMap"));
const RecipeBlock = React.lazy(() => import("./sections/RecipeBlock"));
const HomePageBlog = React.lazy(() => import("./sections/HomePageBlog"));
const HomePageCategories = React.lazy(() => import("../groceries/HomePageCategories"));
const InstagramGallery = React.lazy(() => import("../all-pages/instagram/Instagram"));
const Faq = React.lazy(() => import("../all-pages/Faq"));

// API config
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const wcKey = process.env.REACT_APP_WC_KEY;
const wcSecret = process.env.REACT_APP_WC_SECRET;
const authHeader = "Basic " + btoa(`${wcKey}:${wcSecret}`);

// Skeleton loaders za svaku sekciju
const HeroSkeleton = () => (
  <div className="skeleton-hero w-100" style={{ height: "80vh", background: "#f0f0f0" }}></div>
);

const AdvantagesSkeleton = () => (
  <div className="container py-4">
    <div className="row">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="col-md-3 col-6 mb-4">
          <div className="skeleton-advantage d-flex flex-column align-items-center">
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#e0e0e0" }}></div>
            <div style={{ width: "80%", height: "20px", background: "#e0e0e0", marginTop: "15px" }}></div>
            <div style={{ width: "60%", height: "15px", background: "#e0e0e0", marginTop: "10px" }}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SpecialOfferSkeleton = () => (
  <div className="container py-4">
    <div className="skeleton-special-offer" style={{ height: "300px", background: "#f0f0f0", borderRadius: "8px" }}></div>
  </div>
);

const BoxCarouselSkeleton = () => (
  <div className="container py-4">
    <div style={{ width: "200px", height: "30px", background: "#e0e0e0", marginBottom: "20px" }}></div>
    <div className="row">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="col-md-3 col-6 mb-4">
          <div className="skeleton-product" style={{ height: "300px", background: "#f0f0f0", borderRadius: "8px" }}></div>
        </div>
      ))}
    </div>
  </div>
);

const CategoriesSkeleton = () => (
  <div className="container py-4">
    <div style={{ width: "200px", height: "30px", background: "#e0e0e0", marginBottom: "20px" }}></div>
    <div className="row">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="col-md-2 col-4 mb-4">
          <div className="skeleton-category" style={{ height: "150px", background: "#f0f0f0", borderRadius: "8px" }}></div>
        </div>
      ))}
    </div>
  </div>
);

const DeliveryMapSkeleton = () => (
  <div className="container py-4">
    <div className="skeleton-map" style={{ height: "400px", background: "#f0f0f0", borderRadius: "8px" }}></div>
  </div>
);

const RecipeBlockSkeleton = () => (
  <div className="container py-4">
    <div className="row">
      <div className="col-6">
        <div style={{ width: "100px", height: "30px", background: "#e0e0e0" }}></div>
      </div>
      <div className="col-6 text-end">
        <div style={{ width: "80px", height: "20px", background: "#e0e0e0", float: "right" }}></div>
      </div>
    </div>
    <div className="row mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="col-md-4 mb-4">
          <div className="skeleton-recipe" style={{ height: "300px", background: "#f0f0f0", borderRadius: "8px" }}></div>
        </div>
      ))}
    </div>
  </div>
);

const BlogSkeleton = () => (
  <div className="py-4">
    <div style={{ width: "150px", height: "30px", background: "#e0e0e0", marginBottom: "20px" }}></div>
    <div className="row">
      {[1, 2].map((i) => (
        <div key={i} className="col-md-6 mb-4">
          <div className="skeleton-blog" style={{ height: "200px", background: "#f0f0f0", borderRadius: "8px" }}></div>
        </div>
      ))}
    </div>
  </div>
);

const InstagramSkeleton = () => (
  <div className="py-4">
    <div style={{ width: "150px", height: "30px", background: "#e0e0e0", marginBottom: "20px" }}></div>
    <div className="row">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="col-6 mb-2">
          <div style={{ height: "100px", background: "#f0f0f0" }}></div>
        </div>
      ))}
    </div>
  </div>
);

const FaqSkeleton = () => (
  <div className="container py-4">
    <div style={{ width: "100px", height: "30px", background: "#e0e0e0", marginBottom: "20px" }}></div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="mb-3" style={{ height: "60px", background: "#f0f0f0", borderRadius: "8px" }}></div>
    ))}
  </div>
);

const Home = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=0&per_page=20`, {
      headers: { Authorization: authHeader }
    })
      .then(response => response.json())
      .then(data => {
        const filtered = data
          .filter(category => ![17, 108, 206, 198, 202].includes(category.id))
          .sort((a, b) => a.menu_order - b.menu_order);
        setCategories(filtered);
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });
  }, []);

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroVideo />
      </Suspense>

      <section id="advantages">
        <Suspense fallback={<AdvantagesSkeleton />}>
          <Advantages />
        </Suspense>
      </section>

      <section id="special-offer">
        <Suspense fallback={<SpecialOfferSkeleton />}>
          <SpecialOffer />
        </Suspense>
      </section>

      <section id="product-carousel">
        <Suspense fallback={<BoxCarouselSkeleton />}>
          <BoxCarousel />
        </Suspense>
      </section>

      <section id="categories" className="py-md-5">
        <Suspense fallback={<CategoriesSkeleton />}>
          <h2>Shop by category</h2>
          <HomePageCategories categories={categories} />
        </Suspense>
      </section>

      <section id="delivery">
        <Suspense fallback={<DeliveryMapSkeleton />}>
          <DeliveryMap />
        </Suspense>
      </section>

      <section id="recepies">
        <div className="container col-md-9 px-5">
          <div className="row align-items-center mb-3">
            <div className="col-6">
              <Link to="/recipes"><h2 className="text-start">Recipes</h2></Link>
            </div>
            <div className="col-6 text-end">
              <Link to="/recipes">View more</Link>
            </div>
          </div>
        </div>
        <Suspense fallback={<RecipeBlockSkeleton />}>
          <RecipeBlock />
        </Suspense>
      </section>

      <section id="recent-posts">
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-11 col-sm-12 col-md-9 col-lg-7">
              <h2 className="text-start">Recent posts</h2>
              <Suspense fallback={<BlogSkeleton />}>
                <HomePageBlog />
              </Suspense>
            </div>
            <div className="col-md-3 col-lg-2">
              <Suspense fallback={<InstagramSkeleton />}>
                <InstagramGallery />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <section id="Faq">
        <Suspense fallback={<FaqSkeleton />}>
          <Faq topic="Home" topicId={194} />
        </Suspense>
      </section>

      <ScrollToTopButton />
    </>
  );
};

export default Home;