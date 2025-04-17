import { useEffect, useState, lazy } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

import Header from './components/layout/header/Header';
import Footer from './components/layout/footer/Footer';
import ScrollToTop from "./components/common/ScrollToTop";


const Home = lazy(() => import('./pages/home/Home'));
const Groceries = lazy(() => import('./pages/groceries/Groceries'));
const StandardBox = lazy(() => import('./pages/boxes/StandardBox'));
const FFBox = lazy(() => import('./pages/boxes/FFBox'));
const FeastBox = lazy(() => import('./pages/boxes/FeastBox'));
const HealthyBox = lazy(() => import('./pages/boxes/HealthyBox'));
const AllBoxes = lazy(() => import('./pages/boxes/AllBoxes'));
const Blog = lazy(() => import('./pages/blog/Blog'));
const BlogSingle = lazy(() => import('./pages/blog/BlogSingle'));
const Contact = lazy(() => import('./pages/contact/Contact'));
const Login = lazy(() => import('./pages/login/Login'));
const Register = lazy(() => import('./pages/login/Register'));
const RecipesPage = lazy(() => import('./pages/recipes/RecipesPage'));
const RecipeDetails = lazy(() => import('./pages/recipes/RecipeDetails'));
const CartPage = lazy(() => import('./pages/cart-checkout/CartPage'));
const Checkout = lazy(() => import('./pages/cart-checkout/Checkout'));
const UserDashboard = lazy(() => import('./pages/login/user-dash/userDashboard'));
const Success = lazy(() => import('./pages/cart-checkout/Success'));
const Failure = lazy(() => import('./pages/cart-checkout/Failure'));
const AddRecipe = lazy(() => import('./pages/recipes/add-recipe/AddRecipe'));
const AddBlogPost = lazy(() => import('./pages/blog/AddBlogPost'));
const PrivacyPolicyPage = lazy(() => import('./pages/pp-tc/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/pp-tc/TermsAndConditions'));
const FaqPage = lazy(() => import('./pages/FaqPage'));

const CharterLandingPage = lazy(() => import('./pages/charter/CharterLandingPage'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePageLoad = () => {
      setIsLoading(false); // odmah kad je sve stvarno učitano
    };
  
    if (document.readyState === 'complete') {
      handlePageLoad(); // ako je već učitano (korisnik prešao s druge rute)
    } else {
      window.addEventListener('load', handlePageLoad); // inače čekamo load
    }
  
    return () => {
      window.removeEventListener('load', handlePageLoad);
    };
  }, []);
  

  return (
    <Router>
      <div className="App">
        {/* Global loader dok se sve ne pripremi */}
        {isLoading && (
          <div className="global-loader">
            <div className="loader-content">
              <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
              </svg>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
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
              <Route path="/addrecipe" element={<AddRecipe />} />
              <Route path="/addblog" element={<AddBlogPost />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/faq" element={<FaqPage />} />

              <Route path="/charter" element={<CharterLandingPage />} />
            </Routes>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
