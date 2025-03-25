import React, { useEffect, useState } from 'react';
import Slider from "react-slick";

const Pubertetlije = () => {
    const [posts, setPosts] = useState([]);

    var heroCategories = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
    };

      useEffect(() => {
            fetch('https://frontend.internetskimarketing.eu/backend/wp-admin/term.php?taxonomy=dob&tag_ID=229')
                .then(response => response.json())
                .then(data => setPosts(data))
                .catch(error => console.error('Error fetching posts:', error));
        }, []);
        console.log(posts)
        return (
            <div className="container blog">
                <div className="treca-boja">
                <h1>Pubertetlije</h1>
                <p>Tko su pubertetlije? To su psi u najluđim godinama. Sigurni smo da ste vidjeli pokoji meme na internetu koji uspoređuje pse u pubertetu s bijesnim dinosaurima, e pa, to nije daleko od istine.</p>
                </div>
                <div>
                <Slider {...heroCategories}>
                    {posts.map(post => (
                        <div className="row mb-5 top-post treca-boja">
                            <div className="col-md-5 klasa-poravnanja">
                            </div>
                            <div className="col-md-6 offset-md-1 klasa-poravnanja">
                                <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                                <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                            </div>
                         </div>
                    ))}
                </Slider>
                </div>
            </div>
        );
    };
   
    export default Pubertetlije;