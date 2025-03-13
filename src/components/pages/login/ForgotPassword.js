import React, { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = () => {
        fetch('https://backend.sailorsfeast.com/?rest_route=/simple-jwt-login/v1/user/reset_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setMessage("Check your email for password reset instructions.");
            } else {
                setMessage("Error: " + data.data.message);
            }
        });
    };

    return (
        <div className="container">
            <h2>Forgot Password</h2>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={handleReset}>Reset Password</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
