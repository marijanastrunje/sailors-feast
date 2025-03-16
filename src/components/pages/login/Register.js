import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import './LoginRegister.css';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const redirect = queryParams.get("redirect") || "/";


    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = (e) => {
        setIsLoading(true);
        e.preventDefault();

        fetch("https://backend.sailorsfeast.com/wp-json/simple-jwt-login/v1/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: form.username,
                email: form.email,
                password: form.password
            })
        })
        .then(response => response.json())
        .then(data => {
            setIsLoading(false);
            if (data?.code) {
                setError("Registration failed: " + data.message);
                return;
            }

            // Automatski login nakon registracije
            fetch("https://backend.sailorsfeast.com/wp-json/jwt-auth/v1/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: form.email, // Koristi email za prijavu
                    password: form.password
                })
            })
            .then(response => response.json())
            .then(loginData => {
                if (loginData?.code) {
                    setError("Login failed after registration.");
                    return;
                }

                localStorage.setItem("token", loginData.token);
                localStorage.setItem("username", loginData.user_display_name);
                navigate(redirect);
                window.location.reload();
            });
        })
        .catch(() => {
            setIsLoading(false);
            setError("Something went wrong. Please try again.");
        });
    };

    return (
        <section id="register">
            <div className="row vh-100">
                <div className="col-lg-6 login-visual d-none d-lg-inline position-relative">
                    <img className="object-fit-cover w-100 h-100 position-absolute" src="img/login/login-visual.jpg" alt="Visual" />
                    <div className="login-logo">
                        <Link to={"/"}>
                            <img src="/img/logo/white-color-logo-horizontal-sailors-feast.svg" width={450} height={90} alt="Sailor's Feast logo" />
                        </Link>
                    </div>
                </div>

                <div className="col-lg-6 login-form text-center p-5 p-lg-3 mt-lg-5 mx-auto">
                    <h3 className="mb-0 mt-lg-5">Create Account</h3>
                    <p>Sign up to get started</p>

                    <form className={isLoading ? "loading" : ""} onSubmit={handleRegister}>
                        <div className="input-group">
                            <label className="text-start w-100">Username</label>
                            <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
                            <input type="text" name="username" value={form.username} onChange={handleChange} className="form-control" placeholder="Enter your username" required />
                        </div>

                        <div className="input-group">
                            <label className="text-start w-100">Email address</label>
                            <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="Enter your email" required />
                        </div>

                        <div className="input-group">
                            <label className="text-start w-100">Password</label>
                            <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
                            <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" placeholder="Create a password" required />
                        </div>

                        <div>
                            {error && <p className="alert alert-danger p-1 p-sm-2 text-center">{error}</p>}
                            <button type="submit" className="btn w-100 mt-4">Sign Up</button>
                        </div>
                    </form>

                    <div className="text-center mt-3">
                        <p>Already have an account? <Link to={"/login"}>Log in</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
