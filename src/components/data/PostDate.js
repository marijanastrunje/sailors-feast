import React from "react";

const PostDate = ({ date }) => {
    // Pretvaramo string datuma u Date objekt i dohvaćamo godinu
    const year = new Date(date).getFullYear();

    return <span className="year">{year}</span>;
};

export default PostDate;
