import { useEffect, useState, Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

import Header from './components/pages/all-pages/header/Header';
import Footer from './components/pages/all-pages/footer/Footer';
import ScrollToTop from "./components/ScrollToTop";

// Lazy-loaded pages
const Home = lazy(() => import('./components/pages/home/Home'));
const Groceries = lazy(() => import('./components/pages/groceries/Groceries'));
const StandardBox = lazy(() => import('./components/pages/boxes/StandardBox'));
const FFBox = lazy(() => import('./components/pages/boxes/FFBox'));
const FeastBox = lazy(() => import('./components/pages/boxes/FeastBox'));
const HealthyBox = lazy(() => import('./components/pages/boxes/HealthyBox'));
const AllBoxes = lazy(() => import('./components/pages/boxes/AllBoxes'));
const Blog = lazy(() => import('./components/pages/blog/Blog'));
const BlogSingle = lazy(() => import('./components/pages/blog/BlogSingle'));
const Contact = lazy(() => import('./components/pages/contact/Contact'));
const Login = lazy(() => import('./components/pages/login/Login'));
const Register = lazy(() => import('./components/pages/login/Register'));
const RecipesPage = lazy(() => import('./components/pages/recipes/RecipesPage'));
const RecipeDetails = lazy(() => import('./components/pages/recipes/RecipeDetails'));
const CartPage = lazy(() => import('./components/pages/cart-checkout/CartPage'));
const Checkout = lazy(() => import('./components/pages/cart-checkout/Checkout'));
const UserDashboard = lazy(() => import('./components/pages/login/user-dash/userDashboard'));
const Success = lazy(() => import('./components/pages/cart-checkout/Success'));
const Failure = lazy(() => import('./components/pages/cart-checkout/Failure'));
const TestOrder = lazy(() => import('./components/pages/groceries/TestOrder'));
const AddRecipe = lazy(() => import('./components/pages/recipes/add-recipe/AddRecipe'));
const AddBlogPost = lazy(() => import('./components/pages/blog/AddBlogPost'));
const PrivacyPolicyPage = lazy(() => import('./components/pages/all-pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./components/pages/all-pages/TermsAndConditions'));
const FaqPage = lazy(() => import('./components/pages/all-pages/FaqPage'));

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
        <Suspense fallback={<div className="text-center my-5">Loading...</div>}>
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
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
