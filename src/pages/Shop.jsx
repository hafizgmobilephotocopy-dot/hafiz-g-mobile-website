import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Shop.css';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']; // Fallback placeholder

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="product-card glass">
      <div className="product-image-wrapper">
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <img src={images[currentImageIndex]} alt={product.name} className="product-image" />
        
        {images.length > 1 && (
          <div className="gallery-controls">
            <button onClick={prevImage} className="gallery-btn left"><ChevronLeft size={20}/></button>
            <button onClick={nextImage} className="gallery-btn right"><ChevronRight size={20}/></button>
          </div>
        )}
        
        {images.length > 1 && (
          <div className="gallery-dots">
            {images.map((_, idx) => (
              <span key={idx} className={`dot ${idx === currentImageIndex ? 'active' : ''}`} />
            ))}
          </div>
        )}
      </div>
      <div className="product-info">
        <div className="product-rating">
          <Star className="star-icon" size={16} fill="currentColor" />
          <span>{product.rating || '5.0'}</span>
        </div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">{product.price}</span>
          <button className="btn btn-primary btn-sm add-to-cart">
            <ShoppingBag size={18} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="shop-page animate-fade-in">
      {/* Hero Header */}
      <section className="shop-header">
        <div className="container">
          <div className="header-content text-center">
            <h1 className="hero-title">
              Our <span className="text-gradient">Premium Shop</span>
            </h1>
            <p className="hero-subtitle">
              Discover the latest mobile devices and accessories selected for ultimate performance.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="shop-products">
        <div className="container">
          {loading ? (
            <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-secondary)' }}>
              Loading premium products...
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-secondary)' }}>
              No products available at the moment. Please check back later.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
