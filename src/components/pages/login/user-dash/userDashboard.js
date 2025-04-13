import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBillingData from "../../cart-checkout/useBillingData";
import ProfileData from "./ProfileData";
import SavedLists from "./SavedLists";
import SavedRecipes from "./SavedRecipes";
import Orders from "./Orders";
import "./UserDashboard.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const UserDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [billing, setBilling, fetchUserData] = useBillingData();
  const [savedLists, setSavedLists] = useState({});
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedRecipeData, setSavedRecipeData] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login?redirect=/user", { replace: true });
      return;
    }

    fetch(`${backendUrl}/wp-json/wp/v2/users/me?nocache=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("user_id", data.id);
        if (data.meta?.saved_lists) setSavedLists(JSON.parse(data.meta.saved_lists));
        if (data.meta?.saved_recipes) setSavedRecipes(JSON.parse(data.meta.saved_recipes));
      })
      .catch((err) => console.error("Error fetching user data:", err));

    fetchUserData();
  }, [navigate, token, fetchUserData]);

  useEffect(() => {
    if (savedRecipes.length === 0) return;
    Promise.all(
      savedRecipes.map((id) =>
        fetch(`${backendUrl}/wp-json/wp/v2/recipe/${id}?_embed`).then((res) => res.json())
      )
    )
      .then(setSavedRecipeData)
      .catch((err) => console.error("Error fetching recipes:", err));
  }, [savedRecipes]);

  useEffect(() => {
    if (!isMobile) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      const minSwipeDistance = 70;

      if (swipeDistance > minSwipeDistance && !isSidebarOpen) setIsSidebarOpen(true);
      else if (swipeDistance < -minSwipeDistance && isSidebarOpen) setIsSidebarOpen(false);
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, isSidebarOpen]);

  const saveUserData = () => {
    if (!token) return alert("You are not logged in!");

    fetch(`${backendUrl}/wp-json/wp/v2/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(billing),
    })
      .then((res) => res.json())
      .then((updatedData) => {
        if (updatedData.id) {
          alert("Your profile has been updated!");
          fetchUserData();
        } else {
          alert("There was an error saving your data.");
        }
      })
      .catch((err) => {
        console.error("Error saving data:", err);
        alert("There was an error saving your data.");
      });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileData billing={billing} setBilling={setBilling} saveUserData={saveUserData} />;
      case "saved-lists":
        return <SavedLists savedLists={savedLists} setSavedLists={setSavedLists} />;
      case "orders":
        return <Orders />;
      case "invoices":
        return <div>Invoice display</div>;
      case "saved-recipes":
        return <SavedRecipes savedRecipeData={savedRecipeData} setSavedRecipeData={setSavedRecipeData} />;
      case "logout":
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate("/");
        return null;
      default:
        return <ProfileData billing={billing} setBilling={setBilling} saveUserData={saveUserData} />;
    }
  };

  const tabs = [
    { id: "profile", label: "Moj profil" },
    { id: "saved-lists", label: "Spremljene liste" },
    { id: "orders", label: "Narudžbe" },
    { id: "invoices", label: "Računi" },
    { id: "saved-recipes", label: "Spremljeni recepti" },
    { id: "logout", label: "Odjava" },
  ];

  return (
    <div className="dashboard-wrapper">
      {isMobile && (
        <div
          className={`dashboard-dragger ${isSidebarOpen ? "open" : ""}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isSidebarOpen ? "arrow open" : "arrow"}
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}

      {isMobile && isSidebarOpen && (
        <div className="dashboard-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className="dashboard-layout">
        <aside className={`dashboard-sidebar ${isMobile && !isSidebarOpen ? "hidden" : ""}`}>
          <div className="sidebar-header">Korisnički račun</div>
          <nav>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="dashboard-main">{renderTabContent()}</main>
      </div>
    </div>
  );
};

export default UserDashboard;