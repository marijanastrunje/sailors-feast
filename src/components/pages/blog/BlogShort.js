import React from "react";
import { Link } from "react-router-dom";
import MediaImg from "../../media/MediaImg";
import PostCategory from "../../data/PostCategory";
import PostDate from "../../data/PostDate";
import './BlogShort.css'


const BlogShort = ({ post, limit }) => {
    return (
        <div className="blog-home" key={post.id}>
            <div className="row align-items-center">
                <div className="media-img-container col-sm-5 col-md-4 col-lg-3 mb-2 mb-lg-0">
                <MediaImg id={post.featured_media}/>
                </div>
                <div className="col-12 col-sm-7 col-md-8 col-lg-9">
                <Link to={"/blog/" + post.slug}>
                    <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                </Link>
                    <p className="mb-0">
                        <PostDate date={post.date} />
                        {post.categories.map(catID => (
                        <PostCategory key={catID} categoryID={catID} />
                        ))}
                        <span className="category">{post.category}</span>
                    </p>
                    <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered.slice(0, limit)}} />
                </div>
            </div>
        </div>
    );
};

export default BlogShort;