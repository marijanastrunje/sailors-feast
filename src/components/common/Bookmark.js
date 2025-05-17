import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';

const BookmarkToggle = ({ itemId, metaKey = "saved_recipes", className = "", onChange }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");
  const localKey = `${metaKey}_${userId}`;

  const [isSaved, setIsSaved] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(localKey) || "[]");
    setIsSaved(saved.includes(itemId));
  }, [itemId, localKey]);

  const handleClick = async () => {
    if (!token || !userId || updating) return;

    setUpdating(true);

    const saved = JSON.parse(localStorage.getItem(localKey) || "[]");
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

    localStorage.setItem(localKey, JSON.stringify(updated));

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/wp-json/wp/v2/users/me?no_cache=${Date.now()}`, {
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
      });
    } catch (err) {
      console.error("Greška pri spremanju bookmarka:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (!token || !userId) return null;

  return (
    <span
      className={`bookmark-toggle ${className}`}
      title={isSaved ? "Ukloni iz spremljenih" : "Spremi"}
      onClick={handleClick}
      role="button"
      aria-pressed={isSaved}
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
    >
      <FontAwesomeIcon icon={isSaved ? solidBookmark : regularBookmark} className="bookmarkIcon" />
    </span>
  );
};

export default BookmarkToggle;
