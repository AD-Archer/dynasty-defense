import React from 'react';
import { Link } from 'react-router-dom';
import './styles/footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Dynasty Defense</h4>
          <p>Advanced Security Solutions</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/home">Dashboard</Link>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: aarch0004@launchpad.org</p>
          <a href="https://github.com/ad-archer" target="_blank" rel="noopener noreferrer">
            GitHub: ad-archer
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Dynasty Defense. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 