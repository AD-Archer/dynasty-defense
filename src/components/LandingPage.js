import React from 'react';
import { Link } from 'react-router-dom';
import './styles/landingpage.css';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Dynasty Defense System</h1>
          <p className="hero-subtitle">Advanced Security Monitoring & Alarm Management</p>
          <div className="cta-buttons">
            <Link to="/login" className="cta-button primary">Login</Link>
            <Link to="/register" className="cta-button secondary">Register</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Custom Sensors</h3>
            <p>Create and manage custom sensors for your specific security needs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Monitoring</h3>
            <p>Monitor all sensors in real-time with instant alerts and notifications</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Advanced Analytics</h3>
            <p>Comprehensive logging and reporting of all security events</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>User Management</h3>
            <p>Advanced user controls with admin privileges and custom permissions</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>Why Choose Dynasty Defense?</h2>
        <div className="about-content">
          <div className="about-text">
            <p>Dynasty Defense provides enterprise-grade security monitoring with an intuitive interface. Our system is designed for reliability, scalability, and ease of use.</p>
            <ul className="benefits-list">
              <li>✓ Customizable sensor configuration</li>
              <li>✓ Real-time alert system</li>
              <li>✓ Comprehensive audit logs</li>
              <li>✓ Mobile-responsive design</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Updated Contact Section */}
      <section className="contact">
        <div className="contact-content">
          <h2>Get Started Today</h2>
          <p>Experience the next generation of security monitoring</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">Start Free Trial</Link>
            <Link to="/learn-more" className="cta-button secondary">Learn More</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage; 