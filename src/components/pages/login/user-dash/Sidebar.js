import React from "react";
import './Sidebar.css'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { key: "profile", label: "Profil" },
    { key: "orders", label: "Narudžbe" },
    { key: "invoices", label: "Računi" },
    { key: "saved-lists", label: "Liste kupnji" },
    { key: "saved-recipes", label: "Spremljeni recepti" },
    { key: "saved-posts", label: "Favoriti" },
    { key: "delete-profile", label: "Brisanje profila" },
    { key: "logout", label: "Odjavi se" },
  ];

  return (
    <div className="sidebar p-3 border-end bg-white">
      <ul className="list-unstyled">
        {menuItems.map(({ key, label }) => (
          <li
            key={key}
            className={`py-2 px-3 ${activeTab === key ? "bg-light fw-bold" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
