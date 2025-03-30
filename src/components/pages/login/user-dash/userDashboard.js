import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBillingData from "../../cart-checkout/useBillingData";

import Sidebar from "./Sidebar";
import ProfileData from "./ProfileData";
import SavedLists from "./SavedLists";
import SavedRecipes from "./SavedRecipes";
import Orders from "./Orders";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const UserDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [billing, setBilling, fetchUserData] = useBillingData();
  const [savedLists, setSavedLists] = useState({});
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedRecipeData, setSavedRecipeData] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

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

        if (data.meta?.saved_lists) {
          setSavedLists(JSON.parse(data.meta.saved_lists));
        }

        if (data.meta?.saved_recipes) {
          setSavedRecipes(JSON.parse(data.meta.saved_recipes));
        }
      })
      .catch((err) => console.error("Error fetching user data:", err));

    fetchUserData();
  }, [navigate, token, fetchUserData]);

  useEffect(() => {
    if (savedRecipes.length === 0) return;

    Promise.all(
      savedRecipes.map((id) =>
        fetch(`${backendUrl}/wp-json/wp/v2/recipe/${id}?_embed`).then((res) =>
          res.json()
        )
      )
    )
      .then((recipes) => {
        setSavedRecipeData(recipes);
      })
      .catch((err) => console.error("Error fetching recipes:", err));
  }, [savedRecipes]);

  const saveUserData = () => {
    if (!token) {
      alert("You are not logged in!");
      return;
    }

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
        return <div>Invoice display</div>; // Placeholder for <Invoices />
      case "saved-recipes":
        return <SavedRecipes savedRecipeData={savedRecipeData} setSavedRecipeData={setSavedRecipeData} />;
      case "saved-posts":
        return <div>Saved posts display</div>; // Placeholder for <SavedPosts />
      case "delete-profile":
        return <div>Delete profile</div>; // Placeholder for <DeleteProfile />
      case "logout":
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate("/");
        return null;
      default:
        return <ProfileData billing={billing} setBilling={setBilling} saveUserData={saveUserData} />;
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-grow-1 p-3">{renderTabContent()}</div>
    </div>
  );
};

export default UserDashboard;
