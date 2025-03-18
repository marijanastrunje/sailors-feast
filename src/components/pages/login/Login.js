import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import "./LoginRegister.css";

const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const redirect = queryParams.get("redirect") || "/";

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate(redirect);
        }
    }, [navigate, redirect]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Pošalji podatke za prijavu
            const loginResponse = await fetch(
                "https://backend.sailorsfeast.com/wp-json/jwt-auth/v1/token",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            const data = await loginResponse.json();
            setIsLoading(false);
            setForm({ username: "", password: "" });

            if (data?.code) {
                setError("Invalid username or password. Please try again.");
                return;
            }

            // Spremi token i preusmjeri korisnika
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user_display_name);
            navigate(redirect);
            window.location.reload();

        } catch (error) {
            console.error("Login error:", error);
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <section id="login">
            <div className="row vh-100">
                <div className="col-lg-6 login-visual d-none d-lg-inline position-relative">
                    <img className="object-fit-cover w-100 h-100 position-absolute" src="/img/login/login-visual.jpg" alt="Login visual" />
                    <div className="login-logo">
                        <Link to="/">
                            <img src="/img/logo/white-color-logo-horizontal-sailors-feast.svg" width={450} height={90} alt="Sailor's Feast logo" />
                        </Link>
                    </div>
                </div>

                <div className="col-lg-6 login-form text-center p-5 p-lg-3 mt-lg-5 mx-auto">
                    <div className="d-flex d-lg-none">
                        <Link to="/">
                            <img src="/img/logo/white-color-logo-horizontal-sailors-feast.svg" width={450} height={90} alt="Sailor's Feast logo" />
                        </Link>
                    </div>

                    <h3 className="mb-0 mt-lg-5">Welcome Back</h3>
                    <p>Log in to your account</p>

                    <form className={isLoading ? "loading" : ""} onSubmit={handleLogin}>

                        <div className="input-group">
                            <label className="text-start w-100">Email address</label>
                            <span className="input-group-text rounded-start"><FontAwesomeIcon icon={faEnvelope} /></span>
                            <input type="email" name="username" value={form.username} onChange={handleChange} className="form-control" placeholder="Enter your email" required />
                        </div>

                        <div className="input-group">
                            <label className="text-start w-100">Password</label>
                            <span className="input-group-text rounded-start"><FontAwesomeIcon icon={faLock} /></span>
                            <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" placeholder="Enter your password" required />
                        </div>

                        <div className="d-flex mb-3">
                            <input type="checkbox" id="remember-me" />
                            <label htmlFor="remember-me" className="text-start ms-1 w-100">Remember me</label>
                            <div className="text-end"><Link to="/forgot-password">Forgot password?</Link></div>
                        </div>

                        {error && <p className="alert alert-danger p-1 p-sm-2 text-center">{error}</p>}

                        <button type="submit" className="btn btn-prim w-100" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className="text-center mt-3">
                        <p>Don't have an account? <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}>Sign up</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
