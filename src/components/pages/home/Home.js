import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Hls from 'hls.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import SplitWeatherCard from "../../blocks/WeatherCard";  
import HomePageCategories from "../groceries/HomePageCategories";
import RecipeBlock from '../../blocks/recipe-block/RecipeBlock';
import HomePageBlog from '../blog/HomePageBlog'
import InstagramGallery from "../../instagram/Instagram";
import Faq from "../all-pages/Faq";
import ScrollToTopButton from "../all-pages/ScrollToTopButton";
import './Home.css';

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

        <section id="advantages">
            <div className="container mt-4 mt-sm-5">
                <div className="row">
                    <div className="col-md-4 advantage-item mb-4 mb-md-0">
                        <div className="row px-2 align-items-center justify-content-center">
                            <div className="advantage-image col-6 col-md-12 col-xl-6 order-1 order-md-1 text-center">
                                <img src="\img\home\advantages-sailors-feast-fresh-vegetables-herbs-spices.jpg" width={180} height={130} alt="Fresh vegetables, herbs, and spices for Sailor's Feast delivery" title="Fresh vegetables, herbs, and spices for Sailor's Feast delivery" className="object-fit-cover mb-2"/>
                            </div>
                            <div className="col-6 col-md-12 col-xl-6 order-2 order-md-2 text-start text-md-center text-xl-start p-0">
                                <h4>Fresh Ingredients</h4>
                                <p>Locally grown fruits and vegetables, always freshly delivered to your boat.</p>
                            </div>  
                        </div>
                    </div>

                    <div className="col-md-4 advantage-item mb-4 mb-md-0">
                        <div className="row px-2 align-items-center justify-content-center">
                            <div className="advantage-image col-6 col-md-12 col-xl-5 order-2 order-md-1 text-center">
                                <img src="img\home\advantages-sailors-feast-fast-delivery.jpg" width={180} height={130} alt="Fast and reliable delivery to Split marinas by Sailor's Feast" title="Fast and reliable delivery to Split marinas by Sailor's Feast" className="object-fit-cover mb-2"/>
                            </div>
                            <div className="col-6 col-md-12 col-xl-6 order-1 order-md-2 text-end text-md-center text-xl-start p-0">
                                <h4>Fast Delivery</h4>
                                <p>Fast and reliable delivery to 5 marinas around Split, Croatia.</p>
                            </div>  
                        </div>
                    </div>

                    <div className="col-md-4 advantage-item">
                        <div className="row px-2 align-items-center justify-content-center">
                            <div className="advantage-image col-6 col-md-12 col-xl-5 order-first order-md-first text-center">
                                <img src="img\home\advantages-sailors-feast-custom-order.jpg" width={180} height={130} alt="Customizable food packages by Sailor's Feast" title="Customizable food packages by Sailor's Feast" className="object-fit-cover mb-2"/>
                            </div>
                            <div className="col-6 col-md-12 col-xl-6 order-2 order-md-2 text-start text-md-center text-xl-start p-0">
                                <h4>Custom Orders</h4>
                                <p>Customizable packages tailored to your preferences and needs.</p>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
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

        <section id="product-carousel">
          <div className="container">
            <div className="row justify-content-center">
              <h2>Food box</h2>
              <div className="box-carousel col-12 col-md-6 p-0 carousel slide" id="carouselExample" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <div className="box-carousel-img">
                      <img src="img/home/home-carousel-friends-family-box.jpg" width={660} height={350} alt="Friends & Family Food Box by Sailor's Feast - perfect for group meals" title="Friends & Family Food Box by Sailor's Feast - perfect for group meals" className="d-block w-100" />
                      <div className="box-carousel-text mx-5 mx-xl-0">
                        <h3>Friends & Family Box</h3>
                        <p>Some representative placeholder content for the first slide.</p>
                        <Link to="/standard-box" className="btn btn-prim">Order CTA</Link>
                      </div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="box-carousel-img">
                      <img src="img/home/home-carusel-standard-box.jpg" alt="Standard Food Box by Sailor's Feast - essential provisions" title="Standard Food Box by Sailor's Feast - essential provisions" className="d-block w-100" />
                      <div className="box-carousel-text mx-5 mx-xl-0">
                        <h3>Standard box</h3>
                        <p>Some representative placeholder content for the second slide.</p>
                        <Link to="/standard-box" className="btn btn-prim">Order CTA</Link>
                      </div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="box-carousel-img">
                      <img src="img/home/home-carousel-feast-box.jpg" alt="Feast Food Box by Sailor's Feast - gourmet meals" title="Feast Food Box by Sailor's Feast - gourmet meals" className="d-block w-100" />
                      <div className="box-carousel-text mx-5 mx-xl-0">
                        <h3>Feast Box</h3>
                        <p>Some representative placeholder content for the third slide.</p>
                        <Link to="/standard-box" className="btn btn-prim">Order CTA</Link>
                      </div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="box-carousel-img">
                      <img src="img/home/home-carousel-healthy-box.jpg" alt="Healthy Food Box - Fresh and healthy options" title="Healthy Food Box - Fresh and healthy options" className="d-block w-100" />
                      <div className="box-carousel-text mx-5 mx-xl-0">
                        <h3>Healthy Box</h3>
                        <p>Some representative placeholder content for the third slide.</p>
                        <Link to="standard-box" className="btn btn-prim">Order CTA</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
              <div className="why-us d-none d-lg-inline col-md-3 bg-white pt-5">
                <h4 className="mb-3 text-center fw-bold">Zašto odabrati nas?</h4>
                <ul className="ps-3">
                  <li className="d-flex align-items-center mb-3">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
                    <span>Svježe lokalne namirnice</span>
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
                    <span>Prilagodljivi paketi po vašim željama</span>
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
                    <span>Praktična rješenja za obroke na brodu</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-success mx-2" />
                    <span>Ekološka ambalaža i održivost</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

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