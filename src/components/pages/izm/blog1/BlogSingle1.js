import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";

const BlogSingle1 = () => {

    const {id} = useParams();    
    const [post, setPost] = useState(null);

    useEffect(
        () => {
            fetch('https://frontend.internetskimarketing.eu/backend/wp-json/wp/v2/posts?slug=' + id)
            .then(response => response.json())
            .then(data => setPost(data[0]))
        }, [id]
    );

    if (!post) {
        return <p>Loading...</p>; 
    } 

    return(
        <div className="col-md-6 mx-auto">
            <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </div>
    );
};

export default BlogSingle1;