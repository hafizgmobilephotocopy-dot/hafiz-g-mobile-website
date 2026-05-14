import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, MessageCircle, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const WHATSAPP_NUMBER = '923212627997';

const Cart = ({ onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleWhatsAppOrder = () => {
    let message = `🛒 *New Order from Hafiz G Mobile Shop*\\n\\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\\n`;
      message += `   Price: ${item.price}\\n`;
      message += `   Quantity: ${item.quantity}\\n\\n`;
    });
    
    message += `💰 *Total: Rs. ${getCartTotal().toFixed(2)}*\\n\\n`;
    message += `Please confirm availability and delivery details. Thank you!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-panel" onClick={e => e.stopPropagation()}>
          <div className="cart-header">
            <h2><ShoppingBag size={24} /> Your Cart</h2>
            <button className="cart-close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          <div className="cart-empty">
            <ShoppingBag size={64} strokeWidth={1} />
            <p>Your cart is empty</p>
            <button className="btn btn-primary" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2><ShoppingBag size={24} /> Your Cart</h2>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {!showCheckout ? (
          <>
            <div className="cart-items">
              {cartItems.map(item => {
                const images = item.images && item.images.length > 0
                  ? item.images
                  : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'];
                
                return (
                  <div key={item.id} className="cart-item">
                    <img src={images[0]} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-price">{item.price}</p>
                      <div className="cart-item-controls">
                        <div className="qty-controls">
                          <button 
                            className="qty-btn" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button 
                            className="qty-btn" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          className="remove-btn" 
                          onClick={() => removeFromCart(item.id)}
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-amount">Rs. {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <button className="btn btn-outline" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="btn btn-primary" onClick={() => setShowCheckout(true)}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="cart-checkout">
            <div className="checkout-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <strong>Total:</strong>
                <strong>Rs. {getCartTotal().toFixed(2)}</strong>
              </div>
            </div>
            <div className="checkout-actions">
              <button className="btn btn-outline" onClick={() => setShowCheckout(false)}>
                Back to Cart
              </button>
              <button className="btn-whatsapp-order" onClick={handleWhatsAppOrder}>
                <MessageCircle size={18} />
                Order on WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
