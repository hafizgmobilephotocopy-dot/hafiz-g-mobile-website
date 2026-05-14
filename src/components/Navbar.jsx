import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Activity, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const [showCart, setShowCart] = useState(false);
  const cartCount = getCartCount();

  return (
    <>
      <nav className="navbar glass">
        <div className="container nav-container">
          <Link to="/" className="nav-brand">
            <div className="brand-icon">
              <Smartphone className="icon text-gradient" size={28} />
            </div>
            <span className="brand-text">
              Hafiz G <span className="text-gradient">Mobile</span>
            </span>
          </Link>
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/shop" className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`}>
              Shop
            </Link>
            <Link to="/track" className={`nav-link ${location.pathname === '/track' ? 'active' : ''}`}>
              Track Status
            </Link>
            <Link to="/admin" className={`nav-link btn-outline ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
              Admin Portal
            </Link>
            <button 
              className="nav-link cart-btn" 
              onClick={() => setShowCart(true)}
              style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </>
  );
};

export default Navbar;
