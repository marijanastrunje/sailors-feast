import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./LoginRegister.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const siteKey = process.env.REACT_APP_SITE_KEY;

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const redirect = queryParams.get("redirect") || "/user";

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const registerUser = (userData) => {
        return fetch(`${backendUrl}/wp-json/simple-jwt-login/v1/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        }).then(response => response.json());
    };

    const loginUser = (email, password) => {
        return fetch(`${backendUrl}/wp-json/jwt-auth/v1/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password }),
        }).then(response => response.json());
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!captchaValue) {
            setError("Please confirm that you're not a robot.");
            setIsLoading(false);
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
                throw new Error("Captcha verification failed.");
            }

            return registerUser({
                username: form.email,
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                password: form.password,
            });
        })
        .then((data) => {
            if (data?.code) {
                setError("Registration failed: " + data.message);
                return Promise.reject("Registration error");
            }

            return loginUser(form.email, form.password);
        })
        .then((loginData) => {
            if (loginData?.code) {
                setError("Login failed after registration.");
                return;
            }

            localStorage.setItem("token", loginData.token);
            localStorage.setItem("username", loginData.user_display_name);
            localStorage.setItem("user_email", form.email);
            navigate(redirect);
            window.location.reload();
        })
        .catch((err) => {
            console.error("Register error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <section id="register" aria-labelledby="register-heading">
            <div className="container-fluid p-0 overflow-hidden">
                <div className="row vh-100">
                    <div className="col-lg-6 login-visual d-none d-lg-inline position-relative">
                        <img
                            className="object-fit-cover w-100 h-100 position-absolute"
                            src="/img/login/login-visual.jpg"
                            alt="Registration background"
                            title="Registration background"
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

                    <div className="col-lg-6 login-form text-center p-4 p-lg-3 mx-auto">
                        <div className="login-form-container">
                            <div className="d-lg-none login-logo">
                                <Link to="/" title="Go to homepage">
                                    <img
                                        src="/img/logo/gray-color-logo-horizontal-sailors-feast.svg"
                                        width={280}
                                        height={56}
                                        alt="Sailor's Feast logo"
                                        title="Sailor's Feast logo"
                                    />
                                </Link>
                            </div>

                            <h3 className="mb-0 mt-lg-4" id="register-heading">Create Account</h3>
                            <p>Sign up to get started</p>

                            <form
                                className={isLoading ? "loading" : ""}
                                onSubmit={handleRegister}
                                aria-labelledby="register-heading"
                            >
                                <div className="input-group">
                                    <label className="text-start w-100" htmlFor="first_name">First Name</label>
                                    <span className="input-group-text rounded-start"><FontAwesomeIcon icon={faUser} /></span>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter your first name"
                                        aria-label="First name"
                                        required
                                    />
                                </div>

                                <div className="input-group mt-3">
                                    <label className="text-start w-100" htmlFor="last_name">Last Name</label>
                                    <span className="input-group-text rounded-start"><FontAwesomeIcon icon={faUser} /></span>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter your last name"
                                        aria-label="Last name"
                                        required
                                    />
                                </div>

                                <div className="input-group mt-3">
                                    <label className="text-start w-100" htmlFor="email">Email address</label>
                                    <span className="input-group-text rounded-start"><FontAwesomeIcon icon={faEnvelope} /></span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter your email"
                                        aria-label="Email"
                                        required
                                    />
                                </div>

                                <div className="input-group mt-3">
                                    <label className="text-start w-100" htmlFor="password">Password</label>
                                    <span className="input-group-text rounded-start"><FontAwesomeIcon icon={faLock} /></span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Create a password"
                                        aria-label="Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="input-group-text"
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>

                                <div className="recaptcha-wrapper mt-3">
                                    <ReCAPTCHA sitekey={siteKey} onChange={(value) => setCaptchaValue(value)} />
                                </div>

                                {error && (
                                    <p className="alert alert-danger p-1 p-sm-2 text-center mt-3" role="alert">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-prim w-100 mt-2"
                                    disabled={isLoading}
                                    aria-label="Submit registration form"
                                >
                                    {isLoading ? "Signing up..." : "Sign Up"}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <p>
                                    Already have an account?{" "}
                                    <Link to="/login" title="Go to login page" className="text-prim">Log in</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;