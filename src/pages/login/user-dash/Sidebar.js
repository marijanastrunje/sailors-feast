import React from "react";
import "./Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { key: "profile", label: "Profile" },
    { key: "orders", label: "Orders" },
    { key: "invoices", label: "Invoices" },
    { key: "saved-lists", label: "Saved Lists" },
    { key: "saved-recipes", label: "Saved Recipes" },
    { key: "saved-posts", label: "Favorites" },
    { key: "delete-profile", label: "Delete Profile" },
    { key: "logout", label: "Logout" },
  ];

  return (
    <nav className="sidebar p-3 border-end bg-white" role="navigation" aria-label="User dashboard sidebar">
      <ul className="list-unstyled mb-0">
        {menuItems.map(({ key, label }) => (
          <li
            key={key}
            className={`py-2 px-3 ${activeTab === key ? "bg-light fw-bold" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveTab(key)}
            aria-current={activeTab === key ? "page" : undefined}
          >
            {label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
