import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1 = email form, 2 = code and new password
    const [showPassword, setShowPassword] = useState(false); // Novo stanje za prikaz lozinke

    // Korak 1: Zatraži kod za reset lozinke koji će biti poslan na email
    const handleRequestCode = () => {
        if (!email) {
            setMessage("Please enter your email address.");
            return;
        }

        setIsLoading(true);
        
        // Koristimo POST zahtjev za generiranje koda i slanje emaila
        fetch(`${backendUrl}/?rest_route=/simple-jwt-login/v1/user/reset_password&email=${encodeURIComponent(email)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || `Server returned status ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                setMessage("Reset code has been sent to your email. Please check your inbox and enter the code below.");
                setStep(2); // Prijeđi na sljedeći korak
            } else {
                setMessage("Error: " + (data?.message || data?.data?.message || "Something went wrong."));
            }
        })
        .catch((error) => {
            console.error("Request code error:", error);
            setMessage("Error: " + error.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    // Korak 2: Postavi novu lozinku s kodom
    const handleResetPassword = () => {
        if (!email || !resetCode || !newPassword) {
            setMessage("Please enter the reset code and your new password.");
            return;
        }

        setIsLoading(true);
        
        // Koristimo PUT zahtjev za resetiranje lozinke s kodom
        fetch(`${backendUrl}/?rest_route=/simple-jwt-login/v1/user/reset_password&email=${encodeURIComponent(email)}&code=${encodeURIComponent(resetCode)}&new_password=${encodeURIComponent(newPassword)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || `Server returned status ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                setMessage("Your password has been successfully reset. You can now log in with your new password.");
                // Očistimo polja nakon uspješnog resetiranja
                setEmail("");
                setResetCode("");
                setNewPassword("");
                setStep(1); // Povratak na prvi korak
            } else {
                setMessage("Error: " + (data?.message || data?.data?.message || "Something went wrong."));
            }
        })
        .catch((error) => {
            console.error("Reset password error:", error);
            setMessage("Error: " + error.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    // Funkcija za prebacivanje prikaza lozinke
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center py-5" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4 text-center">Reset Password</h2>
            
            {step === 1 ? (
                // Prvi korak - email forma
                <>
                    <div className="w-100 mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input 
                            type="email" 
                            id="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {message && (
                        <div className={`alert ${message.includes("Error") ? "alert-danger" : "alert-info"} w-100 text-center p-2`} role="alert">
                            {message}
                        </div>
                    )}

                    <button 
                        className="btn btn-primary w-100 mb-3" 
                        onClick={handleRequestCode}
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send Reset Code"}
                    </button>
                </>
            ) : (
                // Drugi korak - kod i nova lozinka
                <>
                    <div className="w-100 mb-3">
                        <label htmlFor="resetCode" className="form-label">Reset Code</label>
                        <input 
                            type="text" 
                            id="resetCode"
                            className="form-control"
                            placeholder="Enter reset code from email"
                            value={resetCode}
                            onChange={e => setResetCode(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="w-100 mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <div className="input-group">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="newPassword"
                                className="form-control"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <button 
                                className="btn btn-outline-secondary" 
                                type="button" 
                                onClick={togglePasswordVisibility}
                                disabled={isLoading}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`alert ${message.includes("Error") ? "alert-danger" : message.includes("success") ? "alert-success" : "alert-info"} w-100 text-center p-2`} role="alert">
                            {message}
                        </div>
                    )}

                    <button 
                        className="btn btn-primary w-100 mb-3" 
                        onClick={handleResetPassword}
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                    
                    <button 
                        className="btn btn-link w-100" 
                        onClick={() => {
                            setStep(1);
                            setMessage("");
                        }}
                        disabled={isLoading}
                    >
                        Back
                    </button>
                </>
            )}
        </div>
    );
};

export default ForgotPassword;