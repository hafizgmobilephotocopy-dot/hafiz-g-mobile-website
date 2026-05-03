import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, ChevronRight, ChevronLeft, Minus, Plus, MessageCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Shop.css';

const WHATSAPP_NUMBER = '923212627997';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOrder, setShowOrder] = useState(false);
  const [qty, setQty] = useState(1);
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleBuyNow = () => {
    setShowOrder(true);
    setQty(1);
  };

  const handleOrderWhatsApp = () => {
    const message =
      `🛒 *New Order from Hafiz G Mobile Shop*\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `💰 *Price:* ${product.price}\n` +
      `🔢 *Quantity:* ${qty}\n` +
      (product.tag ? `🏷️ *Category:* ${product.tag}\n` : '') +
      `\n📝 *Description:* ${product.description || 'N/A'}\n\n` +
      `Please confirm availability and delivery details. Thank you!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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

        {!showOrder ? (
          <div className="product-footer">
            <span className="product-price">{product.price}</span>
            <button className="btn btn-primary btn-sm add-to-cart" onClick={handleBuyNow}>
              <ShoppingBag size={18} />
              Buy Now
            </button>
          </div>
        ) : (
          <div className="order-panel">
            <div className="order-panel-header">
              <span className="order-panel-price">{product.price}</span>
              <button className="order-cancel-btn" onClick={() => setShowOrder(false)} title="Cancel">
                <X size={16} />
              </button>
            </div>
            <div className="qty-row">
              <span className="qty-label">Quantity</span>
              <div className="qty-controls">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14}/></button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)}><Plus size={14}/></button>
              </div>
            </div>
            <button className="btn-whatsapp-order" onClick={handleOrderWhatsApp}>
              <MessageCircle size={18} />
              Order on WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PAGE_SIZE = 20;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchProducts = async (pageNum) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const from = pageNum * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error && data) {
      setProducts(data);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handlePrev = () => setPage(p => Math.max(0, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages - 1, p + 1));

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
            <div className="shop-loading">
              <div className="loading-spinner" />
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="shop-meta">
                <span>{totalCount} product{totalCount !== 1 ? 's' : ''} available</span>
                {totalPages > 1 && (
                  <span>Page {page + 1} of {totalPages}</span>
                )}
              </div>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={handlePrev}
                    disabled={page === 0}
                  >
                    ← Prev
                  </button>
                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`page-num ${i === page ? 'active' : ''}`}
                        onClick={() => setPage(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    className="page-btn"
                    onClick={handleNext}
                    disabled={page >= totalPages - 1}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
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
