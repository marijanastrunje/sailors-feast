import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard1";
import ModalProduct from "./ModalProduct";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';

const SliderProduct = ({ subcategory }) => {

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(
        () => {
            fetch(`https://backend.sailorsfeast.com/wp-json/wc/v3/products?category=${subcategory}`, {
                headers: {
                    Authorization: "Basic " + btoa("ck_f980854fa88ca271d82caf36f6f97a787d5b02af:cs_2f0156b618001a4be0dbcf7037c99c036abbb0af")
                }
            })
            .then(response => response.json())
            .then(data => setProducts(data))
        }, [subcategory]);

        
    
        const categoriesSlider = {
            dots: false,
            arrows: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 2,
            swipeToSlide: true,
            responsive: [
              {
                breakpoint: 1000,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  infinite: true,
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                  infinite: true,
                },
              },
          ]};   

    return (
        <div className="container">
            <h2 className="text-capitalize">{subcategory}</h2>
            <Slider {...categoriesSlider}>
                {products.map((product) => (
                    <ProductCard  key={product.id} product={product} onProductClick={() => setSelectedProduct(product)} />
                ))}
            </Slider>
            <ModalProduct selectedProduct={selectedProduct} />
        </div>
    )
}  
export default SliderProduct;