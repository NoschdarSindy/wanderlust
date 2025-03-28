import {
  faBed,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.scss";
import { DateRange } from "react-date-range";
import { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { datesAtom, destinationAtom, countsAtom } from "src/atoms";
import CityInput from "../CityInput";
import { ClickAwayListener } from "@mui/base";
import { pluralize } from "src/util";
import { useImage, useSite } from "src/contexts/WebsiteContext";

const Header = ({ type }: { type?: string }) => {
  const destination = useRecoilValue(destinationAtom);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useRecoilState(datesAtom);
  const [showCounters, setShowCounters] = useState(false);
  const [counts, setCounts] = useRecoilState(countsAtom);

  const navigate = useNavigate();
  const s = useSite();
  const headerImg = useImage("header");

  const handleOption = (name, operation) => {
    setCounts((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? counts[name] + 1 : counts[name] - 1,
      };
    });
  };

  const handleSearch = () => {
    navigate("/results");
  };

  return (
    <div
      className="header"
      style={
        type !== "list"
          ? {
              backgroundImage: `url(${headerImg})`,
              backgroundSize: "cover",
              backgroundPosition: "50% 70%",
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
            <h1 className="headerTitle font-weight-bold">{s.title}</h1>
            <p className="headerDesc">{s.description}</p>
            <button className="btn btn-primary">{s.exploreButton}</button>
            <div className="headerSearch">
              <div className="searchInputs">
                <div className="headerSearchItem destination">
                  <FontAwesomeIcon icon={faBed} className="headerIcon" />
                  <CityInput />
                </div>
                <div className="headerSearchItem datepicker">
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
                <div className="headerSearchItem counters">
                  <span
                    onClick={() => {
                      setShowCounters(!showCounters);
                      setShowDatePicker(false);
                    }}
                    className="headerSearchText"
                  >
                    <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                    &nbsp;&nbsp;
                    {Object.entries(s.counts)
                      .map(([key, label]) =>
                        pluralize(counts[key], label.toLowerCase()),
                      )
                      .join(" · ")}
                  </span>
                  {showCounters && (
                    <ClickAwayListener
                      onClickAway={() => {
                        setShowCounters(false);
                      }}
                    >
                      <div className="options">
                        {Object.entries(s.counts).map(([key, label]) => {
                          return (
                            <div className="optionItem" key={key}>
                              <span className="optionText">
                                {pluralize(counts[key], label.toLowerCase())}
                              </span>
                              <div className="optionCounter">
                                <button
                                  disabled={counts[key] <= 1}
                                  className="optionCounterButton"
                                  onClick={() => handleOption(key, "d")}
                                >
                                  -
                                </button>
                                <span className="optionCounterNumber">
                                  {counts[key]}
                                </span>
                                <button
                                  className="optionCounterButton"
                                  onClick={() => handleOption(key, "i")}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ClickAwayListener>
                  )}
                </div>
              </div>
              <div className="headerSearchItem searchButton">
                <button
                  className="headerBtn btn btn-primary"
                  onClick={handleSearch}
                  disabled={destination.length === 0}
                  tabIndex={-1}
                >
                  {s.searchButton}
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
