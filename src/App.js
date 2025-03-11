import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './components/pages/home/Home';
import Groceries from './components/pages/groceries/Groceries';
import StandardBox from './components/pages/boxes/StandardBox';
import Products from './components/pages/products/Products';
import Blog from './components/pages/blog/Blog';
import BlogSingle from './components/pages/blog/BlogSingle';
import Contact from './components/pages/contact/Contact';
import Login from './components/pages/login/Login';
import RecipesPage from './components/pages/recipes/RecipesPage';
import RecipeDetails from './components/pages/recipes/RecipeDetails';
import CartPage from './components/pages/groceries/CartPage';
import Checkout from './components/pages/groceries/Checkout';
import ScrollToTop from "./components/ScrollToTop";

import Home1 from './components/pages/izm/home1/Home1';
import Blog1 from './components/pages/izm/blog1/Blog1';
import BlogSingle1 from './components/pages/izm/blog1/BlogSingle1';
import Countries from './components/pages/izm/countries/Countries';
import SingleCountry from './components/pages/izm/countries/SingleCountry';
import Cro from './components/pages/izm/countries/Cro';
import Exchange from './components/pages/izm/zadatak/Exchange';
import Categories1 from './components/pages/products/Categories1';




function App() {

  return (

  <Router>
    <div className="App">
      <Header />
      <ScrollToTop />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/groceries" element={<Groceries />} />
        <Route path="/standard-box" element={<StandardBox />} />
        <Route path="/products" element={<Products />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogsingle/:id" element={<BlogSingle />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:slug" element={<RecipeDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/home1" element={<Home1 />} />
        <Route path="/blog1" element={<Blog1 />} />
        <Route path="/blog1/:id" element={<BlogSingle1 />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/croatia" element={<SingleCountry />} />
        <Route path="/countries" element={<Cro />} />
        <Route path="/zadatak" element={<Exchange />} />
        <Route path="/categories1" element={<Categories1 />} />

      </Routes>
      <Footer />
    </div>
  </Router>

  );
}

export default App;
