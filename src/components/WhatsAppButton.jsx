import React from 'react';
import './WhatsAppButton.css';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '923212627997'; // 03212627997 formatted with country code 92
  const message = 'Hello, I want to inquire about a service from Hafiz G Mobile.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="whatsapp-float-btn"
      aria-label="Chat on WhatsApp"
    >
      <div className="whatsapp-icon-wrapper">
        <MessageCircle size={32} />
      </div>
      <span className="whatsapp-tooltip">Chat with us!</span>
    </a>
  );
};

export default WhatsAppButton;
