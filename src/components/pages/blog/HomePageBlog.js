import React, { useEffect, useState } from "react";
import BlogShort from "./BlogShort";

const BlogBlock = () => {
   const [posts, setPosts] = useState([]);
   
       useEffect(() => {
           fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/posts?per_page=3")
               .then(response => response.json())
               .then(data => {
                   setPosts(data);
               })
               .catch(error => console.error("Error fetching posts:", error));
       }, []);

    return (
        <>
            {posts.map(post => (
                <BlogShort key={post.id} post={post} limit={150} />
            ))}
        </>
    );
};

export default BlogBlock;
