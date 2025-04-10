import { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

import Header from './components/pages/all-pages/header/Header';
import Footer from './components/pages/all-pages/footer/Footer';
import Home from './components/pages/home/Home';
import Groceries from './components/pages/groceries/Groceries';
import StandardBox from './components/pages/boxes/StandardBox';
import FFBox from './components/pages/boxes/FFBox';
import FeastBox from './components/pages/boxes/FeastBox';
import HealthyBox from './components/pages/boxes/HealthyBox';
import AllBoxes from './components/pages/boxes/AllBoxes';
import Blog from './components/pages/blog/Blog';
import BlogSingle from './components/pages/blog/BlogSingle';
import Contact from './components/pages/contact/Contact';
import Login from './components/pages/login/Login';
import Register from './components/pages/login/Register';
import RecipesPage from './components/pages/recipes/RecipesPage';
import RecipeDetails from './components/pages/recipes/RecipeDetails';
import CartPage from './components/pages/cart-checkout/CartPage';
import Checkout from './components/pages/cart-checkout/Checkout';
import UserDashboard from './components/pages/login/user-dash/userDashboard';
import ScrollToTop from "./components/ScrollToTop";
import Success from './components/pages/cart-checkout/Success';
import Failure from './components/pages/cart-checkout/Failure';
import TestOrder from './components/pages/groceries/TestOrder';
import AddRecipe from './components/pages/recipes/add-recipe/AddRecipe';
import AddBlogPost from './components/pages/blog/AddBlogPost';
import PrivacyPolicyPage from './components/pages/all-pages/PrivacyPolicy';
import TermsAndConditions from './components/pages/all-pages/TermsAndConditions';
import FaqPage from './components/pages/all-pages/FaqPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePageLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad);
    }

    return () => {
      window.removeEventListener('load', handlePageLoad);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <div className={`global-loader ${!isLoading ? 'fade-out' : ''}`}>
          <div className="loader-content">
            <svg className="spinner" viewBox="0 0 50 50">
              <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
            </svg>
          </div>
        </div>

        <Header />
        <ScrollToTop />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/groceries" element={<Groceries />} />
          <Route path="/standard-box" element={<StandardBox />} />
          <Route path="/friends-family-box" element={<FFBox />} />
          <Route path="/feast-box" element={<FeastBox />} />
          <Route path="/healthy-box" element={<HealthyBox />} />
          <Route path="/all-boxes" element={<AllBoxes />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogSingle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:slug" element={<RecipeDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/testorder" element={<TestOrder />} />
          <Route path="/addrecipe" element={<AddRecipe />} />
          <Route path="/addblog" element={<AddBlogPost />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/faq" element={<FaqPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;