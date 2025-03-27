import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBillingData from "../../cart-checkout/useBillingData";

import Sidebar from "./Sidebar";
import ProfileData from "./ProfileData";
import SavedLists from "./SavedLists";
import SavedRecipes from "./SavedRecipes";

// TODO: Importaj ostale komponente (Orders, Invoices, SavedRecipes, SavedPosts, DeleteProfile, Logout)

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

    fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/users/me?nocache=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.meta && data.meta.saved_lists) {
          setSavedLists(JSON.parse(data.meta.saved_lists));
        }
        if (data.meta && data.meta.saved_lists) {
          setSavedLists(JSON.parse(data.meta.saved_lists));
        }
        if (data.meta && data.meta.saved_recipes) {
          setSavedRecipes(JSON.parse(data.meta.saved_recipes));
        }
      })
      .catch((err) => console.error("Greška pri dohvaćanju podataka:", err));

    fetchUserData();
  }, [navigate, token, fetchUserData]);

  useEffect(() => {
    if (savedRecipes.length === 0) return;
  
    Promise.all(
      savedRecipes.map((id) =>
        fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/recipe/${id}?_embed`)
          .then((res) => res.json())
      )
    )
      .then((recipes) => {
        setSavedRecipeData(recipes);
      })
      .catch((err) => console.error("Greška pri dohvaćanju recepata:", err));
  }, [savedRecipes]);
  

  const saveUserData = () => {
    if (!token) {
      alert("Niste prijavljeni!");
      return;
    }

    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/users/me", {
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
          alert("Podaci su uspješno ažurirani!");
          fetchUserData();
        } else {
          alert("Greška pri spremanju podataka.");
        }
      })
      .catch((err) => {
        console.error("Greška pri spremanju podataka:", err);
        alert("Greška pri spremanju podataka.");
      });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileData billing={billing} setBilling={setBilling} saveUserData={saveUserData} />;
      case "saved-lists":
        return <SavedLists savedLists={savedLists} setSavedLists={setSavedLists} />;
      case "orders":
        return <div>Prikaz narudžbi</div>; // zamijenit ćemo s <Orders />
      case "invoices":
        return <div>Prikaz računa</div>; // zamijenit ćemo s <Invoices />
      case "saved-recipes":
        return <SavedRecipes savedRecipeData={savedRecipeData} setSavedRecipeData={setSavedRecipeData}/>;
      case "saved-posts":
        return <div>Prikaz spremljenih postova</div>; // zamijenit ćemo s <SavedPosts />
      case "delete-profile":
        return <div>Brisanje profila</div>; // zamijenit ćemo s <DeleteProfile />
      case "logout":
        localStorage.removeItem("token");
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
