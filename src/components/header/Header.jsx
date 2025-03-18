import {
  faBed,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { datesAtom, destinationAtom, guestsAtom } from "../../atoms";
import CityInput from "../CityInput";
import { ClickAwayListener } from "@mui/base";
import { pluralize } from "../../util";
import { useWebsite } from '../../websiteContext'; // Added import for website context

const Header = ({ type }) => {
  const destination = useRecoilValue(destinationAtom);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useRecoilState(datesAtom);
  const [showGuests, setShowGuests] = useState(false);
  const [guests, setGuests] = useRecoilState(guestsAtom);
  const theme = useWebsite(); // Get the theme from the context

  const navigate = useNavigate();

  const handleOption = (name, operation) => {
    setGuests((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? guests[name] + 1 : guests[name] - 1,
      };
    });
  };

  const handleSearch = () => {
    navigate("/hotel-results");
  };

  const getHeaderStyle = (theme) => ({
    background: theme.headerBg,
    color: "white",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    fontFamily: theme.fontFamily
  });

  return (
    <div
      className="header"
      style={
        type !== "list"
          ? {
              backgroundImage: theme.headerImage, // Use theme image
              backgroundSize: "cover",
              resize: "both",
            }
          : {}
      }
    >
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
        style={getHeaderStyle(theme)} // Apply theme to header container
      >
        {type !== "list" && (
          <div className="backdrop">
            <h1 className="headerTitle font-weight-bold" style={{ color: theme.primary }}> {/* Apply theme color */}
              Wanderlust days
              <br />
              and cozy nights
            </h1>
            <p className="headerDesc" style={{ color: theme.secondary }}> {/* Apply theme color */}
              Choose from cabins, houses, and more
            </p>
            <button className="btn btn-primary" style={{ backgroundColor: theme.primary, borderColor: theme.primary }}> {/* Apply theme color */}
              Explore vacation rentals
            </button>
            <div className="headerSearch">
              <div className="headerSearchItem">
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FontAwesomeIcon icon={faBed} className="headerIcon" />
                  &nbsp;&nbsp;
                  <CityInput />
                </span>
              </div>
              <div className="headerSearchItem">
                <span
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="headerSearchText"
                >
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="headerIcon"
                  />
                  &nbsp;&nbsp;
                  {`${new Date(date[0].startDate).toLocaleDateString(
                    "en-GB",
                  )} to ${new Date(date[0].endDate).toLocaleDateString(
                    "en-GB",
                  )}`}
                </span>
                {showDatePicker && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => {
                      const selection = item.range1;
                      setDate([
                        {
                          startDate: selection.startDate.toISOString(),
                          endDate: selection.endDate.toISOString(),
                        },
                      ]);
                    }}
                    moveRangeOnFirstSelection={false}
                    ranges={[
                      {
                        startDate: new Date(date[0].startDate),
                        endDate: new Date(date[0].endDate),
                      },
                    ]}
                    className="date"
                    minDate={new Date()}
                  />
                )}
              </div>
              <div className="headerSearchItem">
                <span
                  onClick={() => {
                    setShowGuests(!showGuests);
                    setShowDatePicker(false);
                  }}
                  className="headerSearchText"
                >
                  <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                  &nbsp;&nbsp;
                  {pluralize(guests.adult, "adult")} ·{" "}
                  {pluralize(guests.children, "child", "ren")} ·{" "}
                  {pluralize(guests.room, "room")}
                </span>
                {showGuests && (
                  <ClickAwayListener
                    onClickAway={() => {
                      setShowGuests(false);
                    }}
                  >
                    <div className="options">
                      <div className="optionItem">
                        <span className="optionText">Adult</span>
                        <div className="optionCounter">
                          <button
                            disabled={guests.adult <= 1}
                            className="optionCounterButton"
                            onClick={() => handleOption("adult", "d")}
                          >
                            -
                          </button>
                          <span className="optionCounterNumber">
                            {guests.adult}
                          </span>
                          <button
                            className="optionCounterButton"
                            onClick={() => handleOption("adult", "i")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="optionItem">
                        <span className="optionText">Children</span>
                        <div className="optionCounter">
                          <button
                            disabled={guests.children <= 0}
                            className="optionCounterButton"
                            onClick={() => handleOption("children", "d")}
                          >
                            -
                          </button>
                          <span className="optionCounterNumber">
                            {guests.children}
                          </span>
                          <button
                            className="optionCounterButton"
                            onClick={() => handleOption("children", "i")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="optionItem">
                        <span className="optionText">Room</span>
                        <div className="optionCounter">
                          <button
                            disabled={guests.room <= 1}
                            className="optionCounterButton"
                            onClick={() => handleOption("room", "d")}
                          >
                            -
                          </button>
                          <span className="optionCounterNumber">
                            {guests.room}
                          </span>
                          <button
                            className="optionCounterButton"
                            onClick={() => handleOption("room", "i")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </ClickAwayListener>
                )}
              </div>
              <div className="headerSearchItem">
                <button
                  className="headerBtn btn btn-primary"
                  onClick={handleSearch}
                  disabled={destination.length === 0}
                  tabIndex={-1}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
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
}

// websiteContext.js
import React, { createContext, useContext, useState } from 'react';

const WebsiteContext = createContext();

export const WebsiteProvider = ({ children, websiteType = 'theme1' }) => {
  const [theme, setTheme] = useState(websiteThemes[websiteType] || websiteThemes['theme1']); //Default to theme1

  return (
    <WebsiteContext.Provider value={theme}>
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

//checkout.js
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