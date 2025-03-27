import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';

const BookmarkToggle = ({ itemId, metaKey = "saved_recipes", className = "", onChange }) => {
  const token = localStorage.getItem("token");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(metaKey) || "[]");
    setIsSaved(saved.includes(itemId));
  }, [itemId, metaKey]);

  const handleClick = () => {
    if (!token) return;

    const saved = JSON.parse(localStorage.getItem(metaKey) || "[]");
    let updated;

    if (saved.includes(itemId)) {
      updated = saved.filter(id => id !== itemId);
      setIsSaved(false);
      onChange?.("removed");
    } else {
      updated = [...saved, itemId];
      setIsSaved(true);
      onChange?.("added");
    }

    localStorage.setItem(metaKey, JSON.stringify(updated));

    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        meta: {
          [metaKey]: JSON.stringify(updated)
        }
      })
    }).catch(err => console.error("Greška pri spremanju bookmarka:", err));
  };

  if (!token) return null;

  return (
    <span
      className={`bookmark-toggle ${className}`}
      title={isSaved ? "Ukloni iz spremljenih" : "Spremi"}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={isSaved ? solidBookmark : regularBookmark} className="bookmarkIcon" />
    </span>
  );
};

export default BookmarkToggle;
