import React, { useEffect, useState } from "react";
import BlogBlock from '../../blocks/blog-block/BlogBlock';
import { useParams } from "react-router-dom";

const BlogSingle = () => {

    const {id} = useParams();
    const [post, setPost] = useState([]);

    useEffect(
            () => {
                fetch('https://jsonplaceholder.typicode.com/posts/' + id)
                    .then((response) => response.json())
                    .then(data => setPost(data))
            }, []
    
        );

    return (
        <div className="container">
        <div className="row">
        <div className="col-md-8">

            <h1 className="blog-title">{post.title}</h1>
            
            <p className="blog-author">
                By <b>Author Name</b> | {new Date().toLocaleDateString()}
            </p>
            
            <div className="blog-content">
                <p>{post.body}</p>
                <p>{post.body}</p>
            </div>
            
            <div className="blog-content">
                <p>{post.body}</p>
                <p>{post.body}</p>
            </div>
            <h4 className="py-3">See more of similar content:</h4>
            <BlogBlock limit={3} />
        </div> 
        </div>   
        </div>
    );
};

export default BlogSingle;
