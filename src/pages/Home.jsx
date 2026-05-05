import React from 'react';
import { ShieldCheck, Smartphone, FileText, Car, Fingerprint, Zap, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const services = [
  {
    title: 'Doorstep Biometrics',
    description: 'Premium biometric verification services delivered right to your doorstep for your convenience.',
    icon: <Fingerprint size={32} />,
    color: '#0ea5e9'
  },
  {
    title: 'Stamp Paper Printing',
    description: 'Official E-Stamp papers printed quickly and reliably for your legal and property needs.',
    icon: <FileText size={32} />,
    color: '#22d3ee'
  },
  {
    title: 'Vehicle Transfers',
    description: 'Hassle-free vehicle transfer processes and tracking through our dedicated management portal.',
    icon: <Car size={32} />,
    color: '#10b981'
  },
  {
    title: 'Utility Bills',
    description: 'Pay your electricity, gas, and water bills instantly through our NADRA E-Sahulat system.',
    icon: <Zap size={32} />,
    color: '#f59e0b'
  },
  {
    title: 'Mobile & Accessories',
    description: 'Latest mobile phones and premium accessories available at the best market prices.',
    icon: <Smartphone size={32} />,
    color: '#8b5cf6'
  },
  {
    title: 'NADRA Services',
    description: 'CNIC fee collections and other official NADRA verification services authorized by the government.',
    icon: <ShieldCheck size={32} />,
    color: '#ec4899'
  }
];

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container animate-fade-in">
          <div className="hero-content">
            <div className="badge">Authorized NADRA E-Sahulat</div>
            <h1 className="hero-title">
              Your Complete <br />
              <span className="text-gradient">Digital Service Hub</span>
            </h1>
            <p className="hero-subtitle">
              Experience premium mobile services, doorstep biometrics, E-stamp printing, and seamless vehicle transfers in Shadman, Lahore.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-shop-now">
                <ShoppingBag size={20} />
                Shop Now
              </Link>
              <a href="#services" className="btn btn-primary">Explore Services</a>
              <Link to="/track" className="btn btn-outline">Track Transfer</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="glass visual-card">
              <ShieldCheck size={48} className="text-gradient" />
              <h3>Secure & Trusted</h3>
              <p>Official NADRA Partner</p>
            </div>
            <div className="glass visual-card floating">
              <Fingerprint size={48} className="text-gradient" />
              <h3>Premium Service</h3>
              <p>Doorstep Biometrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our <span className="text-gradient">Premium Services</span></h2>
            <p>We provide a wide range of reliable digital and retail services tailored to your needs.</p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card glass">
                <div className="service-icon" style={{ color: service.color, backgroundColor: `${service.color}15` }}>
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
