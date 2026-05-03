import React from 'react';
import './Footer.css';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h3 className="text-gradient">Hafiz G Mobile & E-Sahulat</h3>
          <p className="footer-desc">
            Your trusted partner for premium mobile accessories, biometric services at your doorstep, stamp paper printing, and vehicle transfer tracking in Shadman, Lahore.
          </p>
        </div>
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <ul className="contact-list">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>G8QJ+Q6X, Main Shadman Market Rd, Shadman 1 Shadman, Lahore, 54000, Pakistan</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+92 321 2627997</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>hafizgmobilephotocopy@gmail.com</span>
            </li>
            <li>
              <Clock size={18} className="contact-icon" />
              <span>Mon-Sat: 9:00 AM - 10:00 PM</span>
            </li>
          </ul>
        </div>
        <div className="footer-map">
          <h4>Find Us</h4>
          <div className="map-container">
            <iframe
              src="https://maps.google.com/maps?q=G8QJ%2BQ6X%2C%20Lahore%2C%20Pakistan&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Location"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Hafiz G Mobile & E-Sahulat. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
