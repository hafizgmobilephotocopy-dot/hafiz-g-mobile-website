import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Activity } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
