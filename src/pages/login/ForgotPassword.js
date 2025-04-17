import React, { useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = () => {
        fetch(`${backendUrl}/?rest_route=/simple-jwt-login/v1/user/reset_password`, {
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
                setMessage("Error: " + (data?.data?.message || "Something went wrong."));
            }
        })
        .catch(() => {
            setMessage("Error: Unable to process request.");
        });
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center py-5" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4 text-center">Forgot Password</h2>
            
            <div className="w-100 mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input 
                    type="email" 
                    id="email"
                    aria-label="Email address for password reset"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>

            <button className="btn btn-primary w-100 mb-3" onClick={handleReset}>
                Reset Password
            </button>

            {message && (
                <div className="alert alert-info w-100 text-center" role="alert">
                    {message}
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
