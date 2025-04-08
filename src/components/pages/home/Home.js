import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Hls from 'hls.js';
import Advantages from './sections/Advantages'
import SplitWeatherCard from "./sections/delivery/WeatherCard";  
import HomePageCategories from "../groceries/HomePageCategories";
import RecipeBlock from './sections/RecipeBlock';
import HomePageBlog from './sections/HomePageBlog'
import InstagramGallery from "../all-pages/instagram/Instagram";
import Faq from "../all-pages/Faq";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";
import './Home.css';
import BoxCarousel from "./sections/BoxCarousel";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const wcKey = process.env.REACT_APP_WC_KEY;
const wcSecret = process.env.REACT_APP_WC_SECRET;
const authHeader = "Basic " + btoa(`${wcKey}:${wcSecret}`);

const Home = () => {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/wp-json/wc/v3/products/categories?parent=0&per_page=20`, {
      headers: {
        Authorization: authHeader
      }
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



  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('https://customer-609qhr7irtatscxi.cloudflarestream.com/428703937b6861109fcb800a8d3fcce5/manifest/video.m3u8');
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src =
        'https://customer-609qhr7irtatscxi.cloudflarestream.com/428703937b6861109fcb800a8d3fcce5/manifest/video.m3u8';
    }
  }, []);

    return(
        <>
        <section id="hero" className="align-items-md-center justify-content-md-start mb-0">
            <video ref={videoRef} autoPlay muted loop width={1440} height={600} className="position-absolute w-100 h-100 object-fit-cover">
            </video>
            <div className="hero-text ps-md-5 ms-md-5">
                <img src="img/home/hand-drawn-boat-symbol-for-sailors-feast.png" alt="Hand-drawn boat symbol for Sailor's Feast" title="Hand-drawn boat symbol for Sailor's Feast" width={70} height={80} className="icon-dynamic me-2 mt-2"/> 
                <div>
                    <h1 className="m-0">Sailor's Feast</h1>
                    <h2 className="text-start mb-1">Yacht Supply Croatia</h2>
                    <p>We provide fresh food and drinks delivered directly to your boat.</p>
                    <Link to="/groceries"  className="btn btn-prim" aria-label="Plan your meals and order food packages now">Shop now</Link> 
                </div>              
            </div> 
        </section>

        <Advantages />
        
        <section id="special-offer">
            <div className="container me-md-3">
                <div className="row justify-content-center justify-content-lg-end">
                    <div className="col-md-6 text-center pb-2">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                            <img src="img/home/special-offer-icon-fire-percent.png" width={60} height={60} alt="Fire icon with a percent sign representing special offer" title="Fire icon with a percent sign representing special offer" />
                            <h2 className="mb-0">Special offer</h2>
                        </div>
                        <div>
                            <p>Join our Sailor's Feast community and unlock <strong>exclusive benefits!</strong> Members enjoy discounts, special packages, and access to an easy-to-use interactive platform.</p>
                            <p>Plan ahead and save! Place your order by <b>31.03.2025.</b> to enjoy up to <strong>20% off</strong> and special gift.</p>
                            <Link to="/groceries" className="btn btn-prim me-2">Place Your Order</Link>
                        </div>  
                    </div>
                    <div className="d-none d-md-block col-md-4 col-lg-3 offset-lg-1">
                      <SplitWeatherCard />
                    </div>
                </div>
            </div>    
        </section>

        <section id="categories" className="py-md-5">
          <h2>Shop by category</h2>
            <HomePageCategories categories={categories} />
        </section> 

        <BoxCarousel />

        <section id="your-box" className="bg-white py-3">
          <div className="container d-flex flex-column justify-content-center align-items-center">
              <h2>Mix & Match</h2>
              <img className="mb-3" src="https://placehold.co/300x50" alt="" title=""/>
              <p className="text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae enim pharetra, venenatis nunc eget, finibus est. Proin velit </p>
              <Link to="/groceries" className="btn btn-prim">Order CTA</Link>
          </div> 
        </section>

        <section id="delivery">
            <div className="container">
              <div className="row justify-content-center">
                  <h2>Marina Delivery Points:</h2>
                  <div className="col-md-8">
                    <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1u5Hx3EedR34xYeOG-zZPcCueSxX0I5o&ehbc=2E312F&noprof=1" width="100%" height="350" title="Sailor's Feast - Marina Delivery Points Map"></iframe>
                  </div>
              </div>
            </div>  
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