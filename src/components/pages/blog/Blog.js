import React, { useState, useEffect } from "react";
import './Blog.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import BlogShort from "./BlogShort";

const Blog = () => {

    const [posts, setPosts] = useState([]);
   
       useEffect(() => {
           fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/posts?per_page=30&categories_exclude=65,66,73,74&orderby=date&order=desc")
               .then(response => response.json())
               .then(data => {
                   setPosts(data);
               })
               .catch(error => console.error("Error fetching posts:", error));
       }, []);

    return(

        <>
        <section id="blog">
        <div className="container py-5">
            <div className="row justify-content-center">
            <h1>Blog</h1>
            <div className="col-sm-12 col-md-10 col-lg-8">
                <div className="filteri d-flex justify-content-center pb-5">
               <a href="">Cooking</a>
               <a href="">Croatia</a>
               <a href="">Tips</a> 
               </div>
               {posts.map(post => (
                <BlogShort key={post.id} post={post} />
            ))}    
            </div>

            <div className="col-md-2">
                <div>
                    <h4>Follow us</h4>
                    <a className="d-inline-flex align-items-center" href="#"><FontAwesomeIcon icon={faInstagram} />#sailorsfeast</a>
                </div>
                <div className="instagram">
                    <div>
                    <img className="py-1" src="https://placehold.co/150x150" alt="" title=""/>              
                    <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" title=""/> 
                    <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" title=""/>
                    </div>
                    <div>
                    <img className="py-1" src="https://placehold.co/150x150" alt="" title=""/>
                    <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" title=""/>
                    <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" title=""/>
                    </div>
                    <div>
                    <img className="py-1" src="https://placehold.co/150x150" alt="" title=""/>              
                    <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" title=""/> 
                    <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" title=""/>
                    </div>
                    <div>
                    <img className="py-1" src="https://placehold.co/150x150" alt="" title=""/>
                    <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" title=""/>
                    <img className="py-1 d-none d-md-inline" src="https://placehold.co/150x150" alt="" title=""/>
                    </div>
                </div>
                </div>
            </div>
        </div>
        </section>
        </>
    );
};

export default Blog;        
