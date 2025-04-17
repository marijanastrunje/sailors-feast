import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({ setError }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get("redirect") || "/";

  const loginWithGoogleToken = (id_token) => {
    console.log("✅ Sending ID token to WordPress:", id_token);
  
    fetch("https://backend.sailorsfeast.com/?rest_route=/simple-jwt-login/v1/oauth/token&provider=google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "google",
        id_token: id_token
      })      
    })
    
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.token) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("username", data.data.user_display_name);
          localStorage.setItem("user_email", data.data.user_email);
          navigate(redirect);
          window.location.reload();
        } else {
          console.error("❌ WordPress backend login error:", data);
          console.log("🔎 Detailed error response from backend:", data);
          if (setError) setError("Google login failed.");
        }
      })
      .catch((err) => {
        console.error("❌ Fetch error (network?):", err);
        if (setError) setError("Google login failed.");
      });
  };
  

  return (
    <div className="text-center mt-3">
      <p>Or log in with:</p>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const id_token = credentialResponse.credential;
          console.log("✅ Received Google ID token:", id_token);
          loginWithGoogleToken(id_token);
        }}
        onError={() => {
          if (setError) setError("Google login was cancelled.");
        }}
      />
    </div>
  );
};

export default GoogleLoginButton;
