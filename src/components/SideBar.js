// Sidebar.js

// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/SideBar.css"
/**
 * Sidebar Component
 *
 * This component renders a sidebar that includes user information, navigation links,
 * and a sign-out button. It also handles sidebar collapse behavior.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.user - The current logged-in user information
 * @param {Function} props.handleSignOut - Function to execute when signing out
 * @param {boolean} props.isCollapsed - Flag indicating if the sidebar is collapsed
 * @returns {JSX.Element} The Sidebar component
 */
export default function Sidebar({ user, handleSignOut, isCollapsed }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="top-nav">
        <div className="top-nav__left">
          {user ? (
            <p className="top-nav__welcome">Welcome, {user.username}</p>
          ) : (
            <p className="top-nav__loading">Loading user...</p>
          )}
        </div>

        <button className="hamburger-button" onClick={toggleMenu}>
          <span className={`hamburger-button__line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-button__line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-button__line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
      </header>

      {/* Dropdown menu */}
      <nav className={`nav-menu ${isMenuOpen ? 'nav-menu--open' : ''}`}>
        <div className="nav-menu__content">
          <Link to="/home" className="nav-menu__link" onClick={toggleMenu}>
            <button className="nav-menu__button">Home</button>
          </Link>
          <Link to="/home" className="nav-menu__link" onClick={toggleMenu}>
            <button className="nav-menu__button">Sensors</button>
          </Link>
          <Link to="/AdminLog" className="nav-menu__link" onClick={toggleMenu}>
            <button className="nav-menu__button">Logs</button>
          </Link>
          <Link to="/settings" className="nav-menu__link" onClick={toggleMenu}>
            <button className="nav-menu__button">Settings</button>
          </Link>
          <button 
            className="nav-menu__button nav-menu__button--signout" 
            onClick={() => {
              handleSignOut();
              toggleMenu();
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isMenuOpen && (
        <div className="nav-overlay" onClick={toggleMenu}></div>
      )}
    </>
  );
}
