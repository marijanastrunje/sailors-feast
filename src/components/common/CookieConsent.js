import React, { useEffect, useState } from "react";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    } else if (consent === "accepted") {
      enableAnalytics();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    enableAnalytics();
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setVisible(false);
  };

  const enableAnalytics = () => {
    if (!window.dataLayer) return;
    window.dataLayer.push({
      event: "cookie_consent",
      consent: "granted",
    });
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "#FDFBF7",
        color: "#333",
        padding: "15px 20px",
        textAlign: "center",
        zIndex: 9999,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <p style={{ marginBottom: "10px" }}>
        We use cookies to improve your experience. By clicking "Accept", you allow cookies for analytics purposes.{" "}
        <a href="/privacy-policy" style={{ color: "#CC4425", textDecoration: "underline" }}>
          Learn more
        </a>
      </p>
      <div>
        <button
          onClick={handleAccept}
          style={{
            backgroundColor: "#CC4425",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            marginRight: "10px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          style={{
            backgroundColor: "#ccc",
            color: "#333",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
