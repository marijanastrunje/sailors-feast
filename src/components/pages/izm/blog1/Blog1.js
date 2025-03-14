import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostDate from "../../../data/PostDate";
import PostAuthor from "../../../data/PostAuthor";
import "./Blog1.css";

const Blog1 = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("https://frontend.internetskimarketing.eu/backend/wp-json/wp/v2/posts?per_page=30")
            .then(response => response.json())
            .then(data => {
                setPosts(data);
            })
            .catch(error => console.error("Error fetching posts:", error));
    }, []);

    return (
        <div className="container blog1">
            <h1>Blog</h1>
            {posts.map(post => (
                <div className="row mb-3" key={post.id}>
                    <div className="col-md-5">
        
                    <img src={post.img} alt={post.title} title={post.title} />
                    
                    </div>
                    <div className="col-md-6 offset-md-1">
                        <Link to={"/blog1/" + post.slug}>
                            <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                            <PostDate date={post.date} />
                            <PostAuthor authorID={post.author} />
                        </Link>
                        <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Blog1;
