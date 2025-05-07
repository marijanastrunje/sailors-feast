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
        password: "",
        user_type: ""
    });

    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        user_type: "",
        general: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    
        // Ako je ranije bilo greške i korisnik sad nešto unosi, očisti tu grešku
        if (errors[name] && value.trim() !== "") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: ""
            }));
        }
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

        const newErrors = {
            first_name: form.first_name.trim() ? "" : "First name is required",
            last_name: form.last_name.trim() ? "" : "Last name is required",
            email: /\S+@\S+\.\S+/.test(form.email) ? "" : "Please enter a valid email",
            password: form.password.length >= 6 ? "" : "Password must be at least 6 characters",
            user_type: form.user_type ? "" : "Please select a user type",
            general: ""
        };

        if (!captchaValue) {
            newErrors.general = "Please confirm that you're not a robot.";
        }

        const hasErrors = Object.values(newErrors).some(error => error);

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

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
                meta: { user_type: form.user_type }
            });
        })
        .then((data) => {
            if (data?.code) {
                if (data.code === "existing_user_login" || data.code === "existing_user_email") {
                    setErrors({ ...errors, email: "Email address is already in use" });
                } else {
                    setErrors({ ...errors, general: "Registration failed: " + data.message });
                }
                return Promise.reject("Registration error");
            }

            return loginUser(form.email, form.password);
        })
        .then((loginData) => {
            if (loginData?.code) {
                setErrors({ ...errors, general: "Login failed after registration." });
                return;
            }

            localStorage.setItem("token", loginData.token);
            localStorage.setItem("username", loginData.user_display_name);
            localStorage.setItem("user_email", form.email);
            localStorage.setItem("user_type", form.user_type);
            window.dispatchEvent(new Event('userLogin'));
            navigate(redirect);
        })
        .catch((err) => {
            console.error("Register error:", err);
            setErrors(prev => ({
                ...prev,
                general: err.message || "Something went wrong. Please try again."
            }));
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

                            <h3 className="mb-0 mt-lg-2" id="register-heading">Create Account</h3>
                            <p className="mb-0">Sign up to get started</p>

                            <form
                                className={isLoading ? "loading" : ""}
                                onSubmit={handleRegister}
                                aria-labelledby="register-heading"
                            >
                                <div className="input-group mt-2">
                                    <label className="text-start w-100">User Type</label>
                                    <div className="d-flex gap-3 mt-1">
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="guest"
                                                name="user_type"
                                                className="form-check-input"
                                                value="guest"
                                                checked={form.user_type === "guest"}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="guest">Guest</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="crew"
                                                name="user_type"
                                                className="form-check-input"
                                                value="crew"
                                                checked={form.user_type === "crew"}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="crew">Crew</label>
                                        </div>
                                    </div>
                                    {errors.user_type && <div className="text-danger w-100 text-start small mt-1">{errors.user_type}</div>}
                                </div>

                                <div className="input-group mt-2">
                                    <label className="text-start w-100" htmlFor="first_name">First Name</label>
                                    <span className="input-group-text rounded-start"><FontAwesomeIcon icon={faUser} /></span>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={handleChange}
                                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                        placeholder="Enter your first name"
                                        aria-label="First name"
                                    />
                                    {errors.first_name && <div className="invalid-feedback text-start">{errors.first_name}</div>}
                                </div>

                                <div className="input-group mt-2">
                                    <label className="text-start w-100" htmlFor="last_name">Last Name</label>
                                    <span className="input-group-text rounded-start"><FontAwesomeIcon icon={faUser} /></span>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={handleChange}
                                        className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                        placeholder="Enter your last name"
                                        aria-label="Last name"
                                    />
                                    {errors.last_name && <div className="invalid-feedback text-start">{errors.last_name}</div>}
                                </div>

                                <div className="input-group mt-2">
                                    <label className="text-start w-100" htmlFor="email">Email address</label>
                                    <span className="input-group-text rounded-start"><FontAwesomeIcon icon={faEnvelope} /></span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        placeholder="Enter your email"
                                        aria-label="Email"
                                    />
                                    {errors.email && <div className="invalid-feedback text-start">{errors.email}</div>}
                                </div>

                                <div className="input-group mt-2">
                                    <label className="text-start w-100" htmlFor="password">Password</label>
                                    <span className="input-group-text rounded-start"><FontAwesomeIcon icon={faLock} /></span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        placeholder="Create a password (min. 6 characters)"
                                        aria-label="Password"
                                    />
                                    <button
                                        type="button"
                                        className="input-group-text"
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                    {errors.password && <div className="invalid-feedback text-start">{errors.password}</div>}
                                </div>

                                <div className="recaptcha-wrapper mt-2">
                                <ReCAPTCHA
                                    sitekey={siteKey}
                                    onChange={(value) => {
                                        setCaptchaValue(value);
                                        if (errors.general === "Please confirm that you're not a robot.") {
                                            setErrors((prevErrors) => ({
                                                ...prevErrors,
                                                general: ""
                                            }));
                                        }
                                    }}
                                />
                                </div>

                                {errors.general && (
                                    <p className="alert alert-danger p-1 p-sm-2 text-center mt-3" role="alert">
                                        {errors.general}
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

                            <div className="text-center mt-1">
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
