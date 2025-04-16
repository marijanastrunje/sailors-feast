import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBillingData from "../../cart-checkout/useBillingData";
import ProfileData from "./ProfileData";
import SavedLists from "./SavedLists";
import SavedRecipes from "./SavedRecipes";
import Orders from "./Orders";
import ReCAPTCHA from "react-google-recaptcha";
import "./UserDashboard.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const siteKey = process.env.REACT_APP_SITE_KEY;

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
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [captchaValue, setCaptchaValue] = useState(null);

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

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (!captchaValue) {
      alert("Please confirm you're not a robot.");
      return;
    }

    fetch(`${backendUrl}/wp-json/custom/v1/verify-recaptcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: captchaValue }),
    })
      .then((res) => res.json())
      .then((captchaResult) => {
        if (!captchaResult.success) {
          throw new Error("reCAPTCHA failed.");
        }

        return fetch(`${backendUrl}/wp-json/custom/v1/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactForm),
        });
      })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          alert(data.message);
          setContactForm({ name: "", email: "", message: "" });
          setCaptchaValue(null);
        } else {
          alert(data.message || "An error occurred.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert(err.message || "Sending failed.");
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
      case "contact":
        return (
          <div className="contact-form-container col-11 col-md-8 mt-5 mx-auto">
            <h2 className="mb-4">Contact Us</h2>
            <form onSubmit={handleContactSubmit} aria-labelledby="contact-form-title">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  className="form-control"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  aria-label="Your name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your email"
                  className="form-control"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  aria-label="Your email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your message"
                  className="form-control"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  aria-label="Your message"
                  required
                ></textarea>
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="privacyConsent"
                  aria-required="true"
                  required
                />
                <label className="form-check-label" htmlFor="privacyConsent">
                  I agree to the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
                </label>
              </div>

              <div className="mb-3">
                <ReCAPTCHA sitekey={siteKey} onChange={(value) => setCaptchaValue(value)} />
              </div>

              <button
                className="btn btn-secondary w-100"
                type="submit"
                aria-label="Submit contact form"
              >
                Send
              </button>
            </form>
          </div>
        );
      case "saved-recipes":
        return <SavedRecipes savedRecipeData={savedRecipeData} setSavedRecipeData={setSavedRecipeData} />;
      case "logout":
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        window.dispatchEvent(new Event('userLogout'));
        navigate("/");
        return null;
      default:
        return <ProfileData billing={billing} setBilling={setBilling} saveUserData={saveUserData} />;
    }
  };

  const tabs = [
    { id: "profile", label: "My Profile" },
    { id: "saved-lists", label: "Saved Lists" },
    { id: "saved-recipes", label: "Saved Recipes" },
    { id: "orders", label: "Orders" },
    { id: "contact", label: "Contact Us" },
    { id: "logout", label: "Logout" },
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
          <div className="sidebar-header">User Account</div>
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
                <p className="m-0">
                  {tab.label}
                </p>
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