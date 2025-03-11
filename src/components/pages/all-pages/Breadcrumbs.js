import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
        <ol className="breadcrumb p-2 p-md-3 m-0">
            {items.map((item, index) => (
            // Ako je zadnji breadcrumb, dodaj klasu "active" i označi ga kao trenutnu stranicu    
            <li key={index} className={`breadcrumb-item ${index === items.length - 1 ? "active" : ""}`} aria-current={index === items.length - 1 ? "page" : undefined}>
                {item.link ? (
                <Link to={item.link}>{item.name}</Link>
                ) : (
                item.name
                )}
            </li>
            ))}
        </ol>
    </nav>
  );
};

export default Breadcrumbs;
