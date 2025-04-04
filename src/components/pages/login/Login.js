import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import "./LoginRegister.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const siteKey = process.env.REACT_APP_SITE_KEY;

const Login = () => {
    const [captchaValue, setCaptchaValue] = useState(null);
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

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (!captchaValue) {
            alert("Please confirm you're not a robot!");
            return;
        }

        setIsLoading(true);
        setError("");

        fetch(`${backendUrl}/wp-json/custom/v1/verify-recaptcha`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: captchaValue }),
        })
            .then((res) => res.json())
            .then((captchaResult) => {
                if (!captchaResult.success) {
                    throw new Error("Captcha verification failed. Please try again.");
                }

                return fetch(`${backendUrl}/wp-json/jwt-auth/v1/token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            })
            .then((res) => res.json())
            .then((data) => {
                if (data?.code) {
                    throw new Error("Invalid email or password. Please try again.");
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.user_display_name);
                localStorage.setItem("user_email", form.username);

                navigate(redirect);
                window.location.reload();
            })
            .catch((err) => {
                console.error("Login error:", err);
                setError(err.message || "Something went wrong. Please try again.");
            })
            .finally(() => {
                setIsLoading(false);
                setForm({ username: "", password: "" });
            });
    };

    return (
        <section id="login" aria-labelledby="login-heading">
            <div className="row vh-100">
                <div className="col-lg-6 login-visual d-none d-lg-inline position-relative">
                    <img
                        className="object-fit-cover w-100 h-100 position-absolute"
                        src="/img/login/login-visual.jpg"
                        alt="Login background"
                        title="Login background"
                    />
                    <div className="login-logo">
                        <Link to="/" title="Go to homepage">
                            <img
                                src="/img/logo/white-color-logo-horizontal-sailors-feast.svg"
                                width={450}
                                height={90}
                                alt="Sailor's Feast logo"
                                title="Sailor's Feast logo"
                            />
                        </Link>
                    </div>
                </div>

                <div className="col-lg-6 login-form text-center p-5 p-lg-3 mt-lg-4 mx-auto">
                    <div className="d-flex d-lg-none">
                        <Link to="/" title="Go to homepage">
                            <img
                                src="/img/logo/white-color-logo-horizontal-sailors-feast.svg"
                                width={450}
                                height={90}
                                alt="Sailor's Feast logo"
                                title="Sailor's Feast logo"
                            />
                        </Link>
                    </div>

                    <h3 className="mb-0 mt-lg-5" id="login-heading">Welcome Back</h3>
                    <p>Log in to your account</p>

                    <form
                        className={isLoading ? "loading" : ""}
                        onSubmit={handleLogin}
                        aria-labelledby="login-heading"
                    >
                        <div className="input-group">
                            <label className="text-start w-100" htmlFor="username">Email address</label>
                            <span className="input-group-text rounded-start">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                            <input
                                type="email"
                                id="username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter your email"
                                aria-label="Email address"
                                required
                            />
                        </div>

                        <div className="input-group mt-3">
                            <label className="text-start w-100" htmlFor="password">Password</label>
                            <span className="input-group-text rounded-start">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter your password"
                                aria-label="Password"
                                required
                            />
                        </div>

                        <div className="d-flex mb-3 align-items-center">
                            <input type="checkbox" id="remember-me" aria-label="Remember me" />
                            <label htmlFor="remember-me" className="text-start ms-1 w-100">Remember me</label>
                            <div className="text-end">
                                <Link to="/forgot-password" title="Recover your password">Forgot password?</Link>
                            </div>
                        </div>

                        <div className="mt-3">
                            <ReCAPTCHA sitekey={siteKey} onChange={handleCaptchaChange} />
                        </div>

                        {error && (
                            <p className="alert alert-danger p-1 p-sm-2 text-center" role="alert">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="btn btn-prim w-100"
                            disabled={isLoading}
                            aria-label="Submit login form"
                        >
                            {isLoading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className="text-center mt-3">
                        <p>
                            Don’t have an account?{" "}
                            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} title="Go to registration page">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
