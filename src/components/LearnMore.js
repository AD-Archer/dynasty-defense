import React from 'react';
import { Link } from 'react-router-dom';
import './styles/learnmore.css';
import Footer from './Footer';

const LearnMore = () => {
  return (
    <div className="learn-more-container">
      <nav className="learn-more-nav">
        <Link to="/" className="back-link">← Back to Home</Link>
      </nav>

      <main className="learn-more-content">
        <section className="learn-more-hero">
          <h1>Learn More About Dynasty Defense</h1>
          <p className="subtitle">Understanding our comprehensive security solution</p>
        </section>

        <section className="learn-more-section">
          <h2>How It Works</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>1. Custom Sensor Setup</h3>
              <p>Create and configure sensors tailored to your specific security needs. Each sensor can be customized with unique names, icons, and descriptions.</p>
            </div>
            <div className="info-card">
              <h3>2. Real-Time Monitoring</h3>
              <p>Our system continuously monitors all sensors in real-time, providing instant updates and notifications when events are detected.</p>
            </div>
            <div className="info-card">
              <h3>3. Instant Alerts</h3>
              <p>Receive immediate notifications when sensors detect suspicious activity, ensuring quick response times to potential security threats.</p>
            </div>
            <div className="info-card">
              <h3>4. Comprehensive Logging</h3>
              <p>All system activities are logged and can be exported for analysis, providing a complete audit trail of security events.</p>
            </div>
          </div>
        </section>

        <section className="learn-more-section">
          <h2>Security Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <h3>Advanced User Management</h3>
              <p>Control access levels with admin and user roles, ensuring proper security protocol enforcement.</p>
            </div>
            <div className="feature-item">
              <h3>Customizable Alerts</h3>
              <p>Set up custom alert conditions and notification preferences for different types of security events.</p>
            </div>
            <div className="feature-item">
              <h3>Data Security</h3>
              <p>Enterprise-grade encryption and secure data storage protect your security information.</p>
            </div>
            <div className="feature-item">
              <h3>Mobile Responsive</h3>
              <p>Monitor your security system from any device with our responsive design.</p>
            </div>
          </div>
        </section>

        <section className="learn-more-section pricing">
          <h2>Pricing Plans</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Basic</h3>
              <p className="price">Free</p>
              <ul>
                <li>Up to 5 sensors</li>
                <li>Basic monitoring</li>
                <li>Email alerts</li>
                <li>24/7 support</li>
              </ul>
              <Link to="/register" className="pricing-button">Start Free</Link>
            </div>
            <div className="pricing-card featured">
              <h3>Professional</h3>
              <p className="price">$29/mo</p>
              <ul>
                <li>Unlimited sensors</li>
                <li>Advanced monitoring</li>
                <li>SMS & Email alerts</li>
                <li>Priority support</li>
                <li>Custom integrations</li>
              </ul>
              <Link to="/register" className="pricing-button">Start Trial</Link>
            </div>
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <p className="price">Custom</p>
              <ul>
                <li>All Pro features</li>
                <li>Dedicated support</li>
                <li>Custom development</li>
                <li>SLA guarantee</li>
              </ul>
              <a href="mailto:aarch0004@launchpad.org" className="pricing-button">Contact Us</a>
            </div>
          </div>
        </section>

        <section className="learn-more-section cta">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of organizations that trust Dynasty Defense for their security needs.</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">Start Free Trial</Link>
            <a href="mailto:aarch0004@launchpad.org" className="cta-button secondary">Contact Sales</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LearnMore; 