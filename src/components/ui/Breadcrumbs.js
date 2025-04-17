import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb p-2 p-md-3 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={index}
              className={`breadcrumb-item${isLast ? " active" : ""}`}
              aria-current={isLast ? "page" : undefined}
            >
              {item.link && !isLast ? (
                <Link to={item.link}>{item.name}</Link>
              ) : (
                <span>{item.name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
