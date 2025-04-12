import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    const isFoodBoxActive = currentPath.startsWith('/standard-box') ||
                            currentPath.startsWith('/feast-box') ||
                            currentPath.startsWith('/friends-family-box') ||
                            currentPath.startsWith('/healthy-box') ||
                            currentPath === '/all-boxes';

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.trim().length > 1) {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/wp-json/wc/v3/products?search=${searchTerm}`, {
                headers: {
                    Authorization: 'Basic ' + btoa(`${process.env.REACT_APP_WC_KEY}:${process.env.REACT_APP_WC_SECRET}`)
                }
                });
                const data = await res.json();
                setSearchResults(data.slice(0, 5)); // prikazujemo max 5 prijedloga
            } catch (err) {
                console.error("Greška kod pretraživanja:", err);
                setSearchResults([]);
            }
            } else {
            setSearchResults([]);
            }
        }, 400); // debounce 400ms
        
        return () => clearTimeout(delayDebounce);
        }, [searchTerm]);


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
        if (location.pathname === "/login") {
          document.body.classList.add("login-page");
          document.body.classList.remove("register-page");
        } else if (location.pathname === "/register") {
          document.body.classList.add("register-page");
          document.body.classList.remove("login-page");
        } else {
          document.body.classList.remove("login-page", "register-page");
        }
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
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Preload search results by fetching them first
            navigate(`/groceries?search=${encodeURIComponent(searchTerm.trim())}`, { replace: true });
            setSearchTerm('');
            setSearchResults([]);
            setIsSearchVisible(false);
        }
    };

    const handleSearchItemClick = (productName) => {
        setSearchTerm('');
        setSearchResults([]);
        setIsSearchVisible(false);
        // For product names, go directly to groceries page with search
        navigate(`/groceries?search=${encodeURIComponent(productName)}`);
    };

    if (location.pathname === "/login" || location.pathname === "/register") return null;

    return (
        <header>
            {/* Top Navbar */}
            <nav className="top-navbar navbar-expand-md fixed-top">
                <div className="container-fluid d-flex align-items-center">
                    <Link to="tel:+385955399166" title="Call us for more details" className="d-flex align-items-center mt-1">
                        <FontAwesomeIcon icon={faPhone} className="me-3 me-md-1" />
                        <span className="d-none d-sm-inline me-3">+385 95 539 9166</span>
                    </Link>
                    <Link to="mailto:info@sailorsfeast.com" title="Send us email" className="d-flex align-items-center mt-1">
                        <FontAwesomeIcon icon={faEnvelope} className="me-1" />
                        <span className="d-none d-sm-inline">info@sailorsfeast.com</span>
                    </Link>
                    {username ? (
                        <div className="dropdown ms-auto me-0 mt-1 d-flex align-items-center">
                            <button className="btn-user dropdown-toggle p-0" id="userDropdown" data-bs-toggle="dropdown">
                            <Link className="user"><FontAwesomeIcon icon={faUser} className="me-1" />{username}</Link>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end p-2">
                            <li><Link to="/user" className="dropdown-item">User Dashboard</Link></li>
                            <li><hr className="dropdown-divider m-0" /></li>
                            <li><button className="dropdown-item text-danger" onClick={logout}>Logout</button></li>
                            </ul>
                        </div>
                        ) : (
                        <div className="ms-auto me-sm-3 me-1 mt-1 d-flex align-items-center">
                            <Link to="/login" className="user">
                            <FontAwesomeIcon icon={faUser} className="me-1" />Login
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Navbar */}
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid">
                    <button onClick={toggleMenu} className="navbar-toggler p-2" aria-label="Open menu">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <Link to="/" className="navbar-brand mx-auto ms-md-4">
                        <img src="/img/logo/white-color-logo-horizontal-sailors-feast.svg" width={230} height={40} alt="Sailor's Feast logo" />
                    </Link>
                    <div className="d-flex align-items-center order-lg-2">
                        <button id="search-icon" className="search-button mx-1 mx-md-2" aria-label="Search" onClick={toggleSearch}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                        <div id="search-box" className={`search-box col-12 col-md-4 ${isSearchVisible ? '' : 'd-none'}`}>
                        <form
                            className="d-flex p-2"
                            onSubmit={handleSearchSubmit}
                            >
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search groceries"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-outline-secondary ms-1" type="submit">Search</button>
                            </form>

                            {searchResults.length > 0 && (
                                <div className="autocomplete-results position-absolute bg-white w-100 shadow mt-2 rounded">
                                    {searchResults.map(product => (
                                    <div
                                        key={product.id}
                                        className="p-2 border-bottom d-flex align-items-center search-suggestion"
                                        onClick={() => handleSearchItemClick(product.name)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src={product.images[0]?.src} alt={product.name} width="40" className="me-2" />
                                        <span>{product.name}</span>
                                    </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Link to="/cart" id="ikone" aria-label="Cart" className="me-2 me-md-4">
                            <FontAwesomeIcon icon={faCartShopping} />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>
                    </div>
                    <div className={`collapse navbar-collapse order-lg-1 ${menu ? 'show' : ''}`} id="navbarSupportedContent">
                        {menu && (
                            <button onClick={toggleMenu} className="btn btn-close d-lg-none close-btn" aria-label="Close menu"></button>
                        )}
                        <ul className="navbar-nav mx-auto mb-lg-0">
                            <li className="nav-item me-2"><Link to="/" className={`nav-link ${currentPath === '/' ? 'active' : ''}`}><FontAwesomeIcon icon={faHouse} className="mx-2 d-md-none" />Home</Link></li>
                            <li className="nav-item dropdown me-2">
                                <Link className={`nav-link dropdown-toggle ${isFoodBoxActive ? 'active' : ''}`} data-bs-toggle="dropdown"><FontAwesomeIcon icon={faBoxOpen} className="mx-2 d-md-none" />Food Box</Link>
                                <ul className="dropdown-menu">
                                    <li><Link to="/all-boxes" className={`dropdown-item ${currentPath === '/all-boxes' ? 'active' : ''}`}>Compare boxes</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link to="/standard-box" className={`dropdown-item ${currentPath === '/standard-box' ? 'active' : ''}`}>Standard Box</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link to="/friends-family-box" className={`dropdown-item ${currentPath === '/friends-family-box' ? 'active' : ''}`}>Friends&Family Box</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link to="/feast-box" className={`dropdown-item ${currentPath === '/feast-box' ? 'active' : ''}`}>Feast Box</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link to="/healthy-box" className={`dropdown-item ${currentPath === '/healthy-box' ? 'active' : ''}`} href="healthy-box.html">Healthy Box</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item me-2"><Link to="/groceries" className={`nav-link ${currentPath === '/groceries' ? 'active' : ''}`}><FontAwesomeIcon icon={faBasketShopping} className="mx-2 d-md-none" />Groceries</Link></li>
                            <li className="nav-item me-2"><Link to="/recipes" className={`nav-link ${currentPath === '/recipes' ? 'active' : ''}`} ><FontAwesomeIcon icon={faSpoon} className="mx-2 d-md-none" />Recipes</Link></li>
                            <li className="nav-item me-2"><Link to="/blog" className={`nav-link ${currentPath === '/blog' ? 'active' : ''}`}><FontAwesomeIcon icon={faBookOpen} className="mx-2 d-md-none" />Blog</Link></li>
                            <li className="nav-item"><Link to="/contact" className={`nav-link ${currentPath === '/contact' ? 'active' : ''}`}><FontAwesomeIcon icon={faPhone} className="mx-2 d-md-none" />Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;