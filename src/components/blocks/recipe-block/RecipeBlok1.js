import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './RecipeBlock.css';

const RecipeBlock1 = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
    ],
  };
    return(
        <>
        <div className="container">
            <div className="row">
            <div className="recepti col-md-10 mx-auto">
            <Slider {...settings}>
            <div className="card">
              <a href="recipe.html"><img src="img/home/recepie-2.png" alt="" className="card-img-top p-2" /></a>
              <div className="card-body p-2 pt-0">
                <div className="recipe-meta">
                  <div className="row">
                  <div className="col-8 col-md-8 d-flex">
                    <span><img src="img/recipes/time.svg" width="20px" height="20px" /></span>
                    <time>15-25 min</time>
                  </div> 
                  <div className="col-4 col-md-4 d-flex justify-content-end">
                    <img src="img/recipes/hand.svg" className="me-1" width="18px" height="18px" alt="" />
                    <img src="img/recipes/oven.svg" className="me-1" width="18px" height="20px" alt="" />
                    <img src="img/recipes/stove.svg" className="me-0" width="20px" height="20px" alt="" />
                  </div>  
                  </div> 
                </div>
                <div className="recipe-tags pb-1 d-flex justify-content-center">
                  <a href="lunch.html" className="me-1"><span className="lunch">Lunch</span></a>
                  <a href="fit.html"><span className="other me-1">Fit</span></a>
                  <a href="healthy.html" className="me-1"><span className="healthy">Healthy</span></a>
                  <a href="fit.html"><span className="fit">Fit</span></a>
                </div>
                <a href="recipe.html"><h3 className="recipe-title text-center mb-0">Tuna Mex Salad</h3></a>
                <p className="recipe-description text-center">A delicious and quick wrap perfect for lunch.</p>
              </div>  
            </div>

            <div className="card">
              <a href="recipe.html"><img src="img/home/recepie-1.png" alt="" className="card-img-top p-2" /></a>
              <div className="card-body p-2 pt-0">
                <div className="recipe-meta">
                  <div className="row">
                  <div className="col-8 col-md-8 d-flex">
                    <span><img src="img/recipes/time1.svg" width="20px" height="20px" /></span>
                    <time>15-25 min</time>
                  </div> 
                  <div className="col-4 col-md-4 d-flex justify-content-end">
                    <img src="img/recipes/hand1.svg" className="me-1" width="18px" height="18px" alt="" />
                    <img src="img/recipes/oven1.svg" className="me-1" width="20px" height="18px" alt="" />
                    <img src="img/recipes/stove1.svg" className="me-0" width="20px" height="20px" alt="" />
                  </div>  
                  </div> 
                </div>
                <div className="recipe-tags pb-1 d-flex justify-content-center">
                  <a href="lunch.html" className="me-1"><span className="lunch">Lunch</span></a>
                  <a href="fit.html"><span className="other me-1">Fit</span></a>
                  <a href="healthy.html" className="me-1"><span className="healthy">Healthy</span></a>
                  <a href="fit.html"><span className="fit">Fit</span></a>
                </div>
                <a href="recipe.html"><h3 className="recipe-title text-center mb-0">Chicken Ranch Wrap</h3></a>
                <p className="recipe-description text-center">A delicious and quick wrap perfect for lunch.</p>
              </div>  
            </div>

            <div className="card">
              <a href="recipe.html"><img src="img/home/recepie-3.png" alt="" className="card-img-top p-2" /></a>
              <div className="card-body p-2 pt-0">
                <div className="recipe-meta">
                  <div className="row">
                  <div className="col-8 col-md-8 d-flex">
                    <span><img src="img/recipes/time.svg" width="20px" height="20px" /></span>
                    <time>15-25 min</time>
                  </div> 
                  <div className="col-4 col-md-4 d-flex justify-content-end">
                    <img src="img/recipes/hand.svg" className="me-1" width="18px" height="18px" alt="" />
                    <img src="img/recipes/oven.svg" className="me-1" width="20px" height="18px" alt="" />
                    <img src="img/recipes/stove.svg" className="me-0" width="20px" height="20px" alt="" />
                  </div>  
                  </div> 
                </div>
                <div className="recipe-tags pb-1 d-flex justify-content-center">
                  <a href="lunch.html" className="me-1"><span className="lunch">Lunch</span></a>
                  <a href="fit.html"><span className="other me-1">Fit</span></a>
                  <a href="healthy.html" className="me-1"><span className="healthy">Healthy</span></a>
                  <a href="fit.html"><span className="fit">Fit</span></a>
                </div>
                <a href="recipe.html"><h3 className="recipe-title text-center mb-0">Strawberry Pancake</h3></a>
                <p className="recipe-description text-center">A delicious and quick wrap perfect for lunch.</p>
              </div>  
            </div>

            <div className="card">
              <a href="recipe.html"><img src="img/home/recepie-2.png" alt="" className="card-img-top p-2" /></a>
              <div className="card-body p-2 pt-0">
                <div className="recipe-meta">
                  <div className="row">
                  <div className="col-8 col-md-8 d-flex">
                    <span><img src="img/recipes/time.svg" width="20px" height="20px" /></span>
                    <time>15-25 min</time>
                  </div> 
                  <div className="col-4 col-md-4 d-flex justify-content-end">
                    <img src="img/recipes/hand.svg" className="me-1" width="18px" height="18px" alt="" />
                    <img src="img/recipes/oven.svg" className="me-1" width="20px" height="18px" alt="" />
                    <img src="img/recipes/stove.svg" className="me-0" width="20px" height="20px" alt="" />
                  </div>  
                  </div> 
                </div>
                <div className="recipe-tags pb-1 d-flex justify-content-center">
                  <a href="lunch.html" className="me-1"><span className="lunch">Lunch</span></a>
                  <a href="fit.html"><span className="other me-1">Fit</span></a>
                  <a href="healthy.html" className="me-1"><span className="healthy">Healthy</span></a>
                  <a href="fit.html"><span className="fit">Fit</span></a>
                </div>
                <a href="recipe.html"><h3 className="recipe-title text-center mb-0">Tuna Mex Salad</h3></a>
                <p className="recipe-description text-center">A delicious and quick wrap perfect for lunch.</p>
              </div>  
            </div>

            <div className="card">
              <a href="recipe.html"><img src="img/home/recepie-1.png" alt="" className="card-img-top p-2" /></a>
              <div className="card-body p-2 pt-0">
                <div className="recipe-meta">
                  <div className="row">
                  <div className="col-8 col-md-8 d-flex">
                    <span><img src="img/recipes/time.svg" width="20px" height="20px" /></span>
                    <time>15-25 min</time>
                  </div> 
                  <div className="col-4 col-md-4 d-flex justify-content-end">
                    <img src="img/recipes/hand.svg" className="me-1" width="18px" height="18px" alt="" />
                    <img src="img/recipes/oven.svg" className="me-1" width="20px" height="18px" alt="" />
                    <img src="img/recipes/stove.svg" className="me-0" width="20px" height="20px" alt="" />
                  </div>  
                  </div> 
                </div>
                <div className="recipe-tags pb-1 d-flex justify-content-center">
                  <a href="lunch.html" className="me-1"><span className="lunch">Lunch</span></a>
                  <a href="fit.html"><span className="other me-1">Fit</span></a>
                  <a href="healthy.html" className="me-1"><span className="healthy">Healthy</span></a>
                  <a href="fit.html"><span className="fit">Fit</span></a>
                </div>
                <a href="recipe.html"><h3 className="recipe-title text-center mb-0">Chicken Ranch Wrap</h3></a>
                <p className="recipe-description text-center">A delicious and quick wrap perfect for lunch.</p>
              </div>  
            </div>

            <div className="card">
              <a href="recipe.html"><img src="img/home/recepie-3.png" alt="" className="card-img-top p-2" /></a>
              <div className="card-body p-2 pt-0">
                <div className="recipe-meta">
                  <div className="row">
                  <div className="col-8 col-md-8 d-flex">
                    <span><img src="img/recipes/time.svg" width="20px" height="20px" /></span>
                    <time>15-25 min</time>
                  </div> 
                  <div className="col-4 col-md-4 d-flex justify-content-end">
                    <img src="img/recipes/hand.svg" className="me-1" width="18px" height="18px" alt="" />
                    <img src="img/recipes/oven.svg" className="me-1" width="20px" height="18px" alt="" />
                    <img src="img/recipes/stove.svg" className="me-0" width="20px" height="20px" alt="" />
                  </div>  
                  </div> 
                </div>
                <div className="recipe-tags pb-1 d-flex justify-content-center">
                  <a href="lunch.html" className="me-1"><span className="lunch">Lunch</span></a>
                  <a href="fit.html"><span className="other me-1">Fit</span></a>
                  <a href="healthy.html" className="me-1"><span className="healthy">Healthy</span></a>
                  <a href="fit.html"><span className="fit">Fit</span></a>
                </div>
                <a href="recipe.html"><h3 className="recipe-title text-center mb-0">Strawberry Pancake</h3></a>
                <p className="recipe-description text-center">A delicious and quick wrap perfect for lunch.</p>
              </div>  
            </div>
            </Slider>
            </div>
            </div>
        </div>

        
        </>
    );
};

export default RecipeBlock1;       