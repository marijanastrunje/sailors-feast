import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './LoginRegister.css'

const Login = () => {

    const navigate = useNavigate();

    useEffect( () => {
        if(localStorage.getItem('token')){
            navigate('/');
        }    
    }, [navigate])

    const[form, setForm] = useState({
        username: "",
        password: ""

    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value

        });
    }

    const handleLogin = (e) => {
        setIsLoading(true);
        e.preventDefault();
        fetch(
            'https://backend.sailorsfeast.com/wp-json/jwt-auth/v1/token',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            }   
        )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
        setIsLoading(false);
        setForm({
            username: "",
            password: ""
        });    
        if(data?.code) {
            setError("Invalid username or password. Please try again.");
            return;
        }      

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user_display_name);
        navigate('/');
        window.location.reload();
    });
    }

    return(
        <>
        <section id="login">
            <div className="row vh-100">
                <div className="col-lg-6 login-visual d-none d-lg-inline position-relative">
                    <img className="object-fit-cover w-100 h-100 position-absolute" src="img\login/login-visual.jpg" />
                    <div className="login-logo">
                        <Link to={"/"}>
                            <img src="/img/logo/white-color-logo-horizontal-sailors-feast.svg" width={450} height={90} alt="Sailor's Feast logo" title="Sailor's Feast logo"/>
                        </Link>
                    </div>
                </div> 

                <div className="col-lg-6 login-form text-center p-5 p-lg-3 mt-lg-5 mx-auto">
                    <div className="d-flex d-lg-none">
                        <Link to={"/"}>
                            <img src="/img/logo/white-color-logo-horizontal-sailors-feast.svg" width={450} height={90} alt="Sailor's Feast logo" title="Sailor's Feast logo"/>
                        </Link>
                    </div>
                    <h3 className="mb-0 mt-lg-5">Welcome Back</h3>
                    <p>Log in to your account</p>

                    <form className={isLoading ? "loading" : ""} onSubmit={handleLogin}>   
                        <div class="input-group">
                            <label class="text-start w-100">Email address</label>
                            <span class="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                            <input type="email" name="username" value={form.username} onChange={handleChange} class="form-control" placeholder="Enter your email" required />
                        </div>

                        <div class="input-group">
                            <label class="text-start w-100">Password</label>
                            <span class="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
                            <input type="password" name="password" value={form.password} onChange={handleChange} class="form-control" placeholder="Enter your password" required />
                        </div>

                        <div class="d-flex mb-3">
                            <input type="checkbox" /><label className="text-start ms-1 w-100">Remember me</label>
                            <div className="text-end"><Link>Forgot password?</Link>
                            </div>
                        </div>

                        <div>
                           {error ? <p className="alert alert-danger p-1 p-sm-2 text-center">{error}</p> : "" } 
                        <button type="submit" class="btn w-100">Log In</button>
                        </div>
                    </form>

                    <div class="text-center mt-3">
                        <p>Don't have an account? <Link to={"/Register"}>Sign up</Link></p>
                    </div>
                </div>
            </div>        
        </section>
        </>
    );
};

export default Login;     