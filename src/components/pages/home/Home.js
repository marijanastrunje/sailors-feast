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

  // Fallback loader
  const Loader = () => <div className="text-center p-3">Loading...</div>;

  return (
    <>
      <Suspense fallback={<Loader />}>

      <HeroVideo />

        <section id="advantages">
          <Advantages />
        </section>

        <section id="special-offer">
          <SpecialOffer />
        </section>

        <section id="product-carousel">
          <BoxCarousel />
        </section>

        <section id="categories" className="py-md-5">
          <h2>Shop by category</h2>
          <HomePageCategories categories={categories} />
        </section>

        <section id="delivery">
          <DeliveryMap />
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
          <RecipeBlock />
        </section>

        <section id="recent-posts">
          <div className="container-fluid py-5">
            <div className="row justify-content-center">
              <div className="col-11 col-sm-12 col-md-9 col-lg-7">
                <h2 className="text-start">Recent posts</h2>
                <HomePageBlog />
              </div>
              <div className="col-md-3 col-lg-2">
                <InstagramGallery />
              </div>
            </div>
          </div>
        </section>

        <section id="Faq">
          <Faq topic="Home" topicId={194} />
        </section>
      </Suspense>

      <ScrollToTopButton />
    </>
  );
};

export default Home;