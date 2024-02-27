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

const Header = ({ type }) => {
  const destination = useRecoilValue(destinationAtom);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useRecoilState(datesAtom);
  const [showGuests, setShowGuests] = useState(false);
  const [guests, setGuests] = useRecoilState(guestsAtom);

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

  return (
    <div
      className="header"
      style={
        type !== "list"
          ? {
              backgroundImage: "url(img/wanderlust.jpeg)",
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
      >
        {type !== "list" && (
          <div className="backdrop">
            <h1 className="headerTitle font-weight-bold">
              Wanderlust days
              <br />
              and cozy nights
            </h1>
            <p className="headerDesc">Choose from cabins, houses, and more</p>
            <button className="btn btn-primary">
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
