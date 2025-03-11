import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './BlogBlock.css';

const BlogBlock = ({ limit }) => {
   const [posts, setPosts] = useState([]);
   
       useEffect(() => {
           fetch("https://frontend.internetskimarketing.eu/backend/wp-json/wp/v2/posts?per_page=30")
               .then(response => response.json())
               .then(data => {
                   setPosts(data);
               })
               .catch(error => console.error("Error fetching posts:", error));
       }, []);
    
    const limitedPosts = limit ? posts.slice(0, limit) : posts;

    return (
        <>
            {limitedPosts.map(post => (
                <div className="blog-home" key={post.id}>
                    <div className="row align-items-center">
                        <div className="col-12 col-sm-5 col-md-4 col-lg-3 mb-2 mb-lg-0">
                            <img src={post.img} alt={post.title} title={post.title} />
                        </div>
                        <div className="col-12 col-sm-7 col-md-8 col-lg-9">
                            <h3>
                                <Link to={'/BlogSingle/' + post.id}>{post.title.slice (0, 30)}</Link>
                            </h3>
                            <p>
                                <span className="year">{post.year}</span>
                                <span className="category">{post.category}</span>
                            </p>
                            <p className="mb-0">
                                {post.body.slice(0, 100)}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default BlogBlock;
