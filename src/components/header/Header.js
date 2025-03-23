import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faUser, faBars, faCartShopping,faMagnifyingGlass, faHouse, 
    faBasketShopping, faBoxOpen, faSpoon, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {

    const [username, setUsername] = useState(null);
    const [menu, setMenu] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const handleCartUpdate = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
        };

        handleCartUpdate(); 
        window.addEventListener("cartUpdated", handleCartUpdate);
        return () => window.removeEventListener("cartUpdated", handleCartUpdate);
    }, []);

    useEffect(() => {
        const user = localStorage.getItem('username');
        if (user) setUsername(user);
    }, []);

    useEffect(() => {
        document.body.style.marginTop = (location.pathname === "/login" || location.pathname === "/register") ? "0px" : "89px";
    }, [location.pathname]);

    const toggleMenu = () => setMenu(prev => !prev);
    const toggleSearch = () => setIsSearchVisible(prev => !prev);
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.reload();
    };

    useEffect(() => {
        setMenu(false); // Svaka promjena rute zatvara meni
    }, [location.pathname]);
    

    if (location.pathname === "/login" || location.pathname === "/register") return null;

    return (
        <header>
            {/* Top Navbar */}
            <nav className="top-navbar navbar-expand-md fixed-top">
                <div className="container-fluid d-flex">
                    <Link to="tel:+385955399166" title="Call us for more details">
                        <FontAwesomeIcon icon={faPhone} className="me-2 me-md-1" />
                        <span className="d-none d-sm-inline me-3">+385 95 539 9166</span>
                    </Link>
                    <Link to="mailto:info@sailorsfeast.com" title="Send us email">
                        <FontAwesomeIcon icon={faEnvelope} className="me-1" />
                        <span className="d-none d-sm-inline">info@sailorsfeast.com</span>
                    </Link>
                    {username ? (
                        <div className="dropdown ms-auto me-0">
                            <button className="btn-user dropdown-toggle p-0" id="userDropdown" data-bs-toggle="dropdown">
                                <Link className="user"><FontAwesomeIcon icon={faUser} className="me-1" />{username}</Link>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end p-0">
                                <li><Link to="/user" className="dropdown-item">User Dashboard</Link></li>
                                <li><hr className="dropdown-divider m-0" /></li>
                                <li><button className="dropdown-item text-danger" onClick={logout}>Logout</button></li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="user ms-auto me-sm-3 me-1">
                            <FontAwesomeIcon icon={faUser} className="me-1" />Login
                        </Link>
                    )}
                </div>
            </nav>

            {/* Main Navbar */}
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid">
                    <button onClick={toggleMenu} className="navbar-toggler p-2">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <Link to="/" className="navbar-brand mx-auto ms-md-4">
                        <img src="/img/logo/white-color-logo-horizontal-sailors-feast.svg" width={230} height={40} alt="Sailor's Feast logo" />
                    </Link>
                    <div className="d-flex align-items-center order-lg-2">
                        <button id="search-icon" className="search-button mx-1 mx-md-2" onClick={toggleSearch}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                        <div id="search-box" className={`search-box col-12 col-md-4 ${isSearchVisible ? '' : 'd-none'}`}>
                            <form className="d-flex p-2">
                                <input type="text" className="form-control" placeholder="Upiši pojam za pretraživanje" />
                                <button className="btn btn-outline-success ms-1" type="submit">Search</button>
                            </form>
                        </div>
                        <Link to="/cart" id="ikone" className="me-2 me-md-4">
                            <FontAwesomeIcon icon={faCartShopping} />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>
                    </div>
                    <div className={`collapse navbar-collapse order-lg-1 ${menu ? 'show' : ''}`} id="navbarSupportedContent">
                        <ul className="navbar-nav mx-auto mb-lg-0">
                            <li className="nav-item me-2"><Link to="/" onClick={toggleMenu} className="nav-link"><FontAwesomeIcon icon={faHouse} className="mx-2 d-md-none" />Home</Link></li>
                            <li className="nav-item me-2"><Link to="/groceries" onClick={toggleMenu} className="nav-link"><FontAwesomeIcon icon={faBasketShopping} className="mx-2 d-md-none" />Groceries</Link></li>
                            <li className="nav-item dropdown me-2">
                                <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown"><FontAwesomeIcon icon={faBoxOpen} className="mx-2 d-md-none" />Food Box</Link>
                                <ul className="dropdown-menu">
                                    <li><Link to="/standard-box" onClick={toggleMenu} className="dropdown-item">Standard Box</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="ff-box.html">Friends&Family Box</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="feast-box.html">Feast Box</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="healthy-box.html">Healthy Box</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link to="/all-boxes" className="dropdown-item">All boxes</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item me-2"><Link to="/recipes" className="nav-link" ><FontAwesomeIcon icon={faSpoon} className="mx-2 d-md-none" />Recipes</Link></li>
                            <li className="nav-item me-2"><Link to="/blog" onClick={toggleMenu} className="nav-link"><FontAwesomeIcon icon={faBookOpen} className="mx-2 d-md-none" />Blog</Link></li>
                            <li className="nav-item"><Link to="/contact" onClick={toggleMenu} className="nav-link"><FontAwesomeIcon icon={faPhone} className="mx-2 d-md-none" />Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
