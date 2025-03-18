import "./header.css";
import { useState } from "react";
import { useWebsite } from "../../contexts/WebsiteContext";

const Header = () => {
  const { websiteType } = useWebsite();
  const [openDate, setOpenDate] = useState(false);

  return (
    <div className="header">
      <h1>{websiteType.toUpperCase()} Booking</h1>
    </div>
  );
};

export default Header;

// websiteThemes.js
export const websiteThemes = {
  'theme1': {
    headerBg: '#003580',
    headerImage: 'url(img/wanderlust.jpeg)',
    primary: '#007bff',
    secondary: '#6c757d',
    accent: '#28a745',
    fontFamily: 'Arial, sans-serif'
  },
  'theme2': {
    headerBg: '#f8f9fa',
    headerImage: 'url(img/beach.jpg)', //Example image
    primary: '#dc3545',
    secondary: '#adb5bd',
    accent: '#ffc107',
    fontFamily: '"Times New Roman", serif'
  }
  // Add more themes as needed
};

// websiteContext.js
import React, { createContext, useContext, useState } from 'react';

const WebsiteContext = createContext();

export const WebsiteProvider = ({ children, websiteType = 'theme1' }) => {
  const [theme, setTheme] = useState(websiteThemes[websiteType] || websiteThemes['theme1']); //Default to theme1

  return (
    <WebsiteContext.Provider value={{ theme, websiteType }}> {/*Added websiteType to context*/}
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
};

//checkout.js (unchanged)
import React from 'react';

const Checkout = () => {
  return (
    <div>
      <h1>Checkout Page</h1>
      {/* Add your checkout form here */}
    </div>
  );
};

export default Checkout;