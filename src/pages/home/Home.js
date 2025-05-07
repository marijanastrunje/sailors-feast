import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/common/SEO";
import "./Home.css";

// Komponente
import Hero from "./sections/Hero";
import Advantages from "./sections/Advantages";
import SpecialOffer from "./sections/SpecialOffer";
import BoxCarousel from "./sections/BoxCarousel";
import DeliveryMap from "./sections/delivery/DeliveryMap";
import RecipeBlock from "./sections/RecipeBlock";
import HomePageBlog from "./sections/HomePageBlog";
import HomePageCategories from "../groceries/HomePageCategories";
import InstagramGallery from "../../components/common/instagram/Instagram";
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import CharterPromoSection from "./sections/Charter";

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

  return (
    <>
      <SEO
        title="Sailor's Feast | Fresh food for your boat"
        description="Sailor's Feast brings fresh food and drinks right to your boat in Croatia. Get groceries and fun snack boxes delivered fast to your marina!"
        keywords={['boat food delivery', 'sailing Croatia', 'marina groceries', 'yacht snacks', 'Sailor\'s Feast']}
        path="/"
      />
      
      <Hero />

      <section id="advantages">
        <Advantages />
      </section>

      <section id="special-offer">
        <SpecialOffer />
      </section>

      <section id="charter" className="d-none">
        <CharterPromoSection />
      </section>

      <section id="product-carousel">
        <BoxCarousel />
      </section>

      <section id="categories" className="mt-5 pt-4">
        <h2>Shop by category</h2>
        <HomePageCategories categories={categories} />
      </section>

      <section id="delivery">
        <div className="container mb-4 mt-4">
          <div className="row justify-content-center">
            <h2 className="mb-4">Marina delivery points</h2>
            <DeliveryMap />
          </div>
        </div>
      </section>

      <section id="recepies">
        <RecipeBlock />
      </section>


      <section id="recent-posts">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="row g-4">
                <div className="col-12 col-md-10">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="text-start">Recent posts</h2>
                    <Link to="/blog">View more</Link>
                  </div>
                  <HomePageBlog />
                </div>
                <div className="col-12 col-md-2 mt-0 mt-md-5">
                  <InstagramGallery />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section id="Faq">
        <Faq topic="Home" topicId={194} />
      </section>

      <ScrollToTopButton />
    </>
  );
};

export default Home;
