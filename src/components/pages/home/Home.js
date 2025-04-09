import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import HeroVideo from "./sections/HeroVideo";
import Advantages from "./sections/Advantages";
import SpecialOffer from "./sections/SpecialOffer";
import BoxCarousel from "./sections/BoxCarousel";
import DeliveryMap from "./sections/delivery/DeliveryMap";
import RecipeBlock from "./sections/RecipeBlock";
import HomePageBlog from "./sections/HomePageBlog";

import HomePageCategories from "../groceries/HomePageCategories";
import InstagramGallery from "../all-pages/instagram/Instagram";
import Faq from "../all-pages/Faq";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";

import "./Home.css";

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
      
      <HeroVideo />

      <section id="advantages">
        <Advantages />
      </section>

      <section id="special-offer">
        <SpecialOffer />
      </section>

      <section id="categories" className="py-md-5">
        <h2>Shop by category</h2>
        <HomePageCategories categories={categories} />
      </section>

      <section id="product-carousel">
        <BoxCarousel />
      </section>

      <section id="your-box" className="bg-white py-3">
        <div className="container d-flex flex-column justify-content-center align-items-center">
          <h2>Mix & Match</h2>
          <img className="mb-3" src="https://placehold.co/300x50" alt="Divider" title="Divider" />
          <p className="text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae enim pharetra, venenatis nunc eget, finibus est.
          </p>
          <Link to="/groceries" className="btn btn-prim">Order CTA</Link>
        </div>
      </section>

      <section id="delivery">
        <DeliveryMap />
      </section>

      <section id="recepies">
        <div className="container">
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
        <div className="container py-5 me-md-4 me-lg-3">
          <div className="row justify-content-center">
            <div className="col-11 col-sm-12 col-md-9 col-lg-8">
              <h3>Recent posts</h3>
              <HomePageBlog />
            </div>
            <div className="col-md-3 col-lg-2 offset-lg-1">
              <InstagramGallery />
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
