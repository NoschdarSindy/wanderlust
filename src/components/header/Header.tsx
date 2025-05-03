import * as icons from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays, faPerson } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.scss";
import { DateRange } from "react-date-range";
import { useState, useRef, useEffect } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { countsAtom, datesAtom, locationsAtom } from "src/lib/atoms";
import LocationInput from "../LocationInput";
import { formatDateRange, getCssVariable, pluralize } from "src/lib/util";
import { getLocationsData, getSite, getImage } from "src/lib/composables";
import { isEqual } from "date-fns";
import { ClickAwayListener } from "@mui/base";

const renderCounterSummary = (counts, countLabels) =>
  Object.entries(countLabels)
    .filter(([key]) => counts[key] > 0)
    .map(([key, label]: [string, string]) =>
      pluralize(counts[key], label.toLowerCase()),
    )
    .join(" · ");

const renderCounterOptions = (counts, countLabels, handleOption) =>
  Object.entries(countLabels).map(([key, label]: [string, string]) => (
    <div className="optionItem" key={key}>
      <span className="optionText">
        {pluralize(counts[key], label.toLowerCase())}
      </span>
      <div className="optionCounter">
        <button
          disabled={counts[key] <= (label === "child" ? 0 : 1)}
          className="optionCounterButton"
          onClick={() => handleOption(key, "d")}
        >
          -
        </button>
        <span className="optionCounterNumber">{counts[key]}</span>
        <button
          className="optionCounterButton"
          onClick={() => handleOption(key, "i")}
        >
          +
        </button>
      </div>
    </div>
  ));

const Header = ({ type }: { type?: string }) => {
  const locations = useRecoilValue(locationsAtom);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useRecoilState(datesAtom);
  const [showCounters, setShowCounters] = useState(false);
  const [counts, setCounts] = useRecoilState(countsAtom);
  const { options: locationOptions } = getLocationsData();

  const navigate = useNavigate();
  const s = getSite();
  const headerImg = getImage("header");

  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        if (s.isCars || date[0].startDate !== date[0].endDate) {
          setShowDatePicker(false);
        }
      }
    };
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker, date]);

  const handleOption = (name, operation) => {
    setCounts((prev) => {
      if (s.isCars && counts[name] === 5 && operation === "i") return prev;
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
                {s.locationInputs
                  .filter(({ label }) => label)
                  .map(({ key, icon, label }) => (
                    <div className="headerSearchItem" key={key}>
                      <FontAwesomeIcon
                        icon={icons[icon]}
                        className="headerIcon"
                      />
                      <LocationInput accessor={key} placeholder={label} />
                    </div>
                  ))}

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
                    {formatDateRange(date[0].startDate, date[0].endDate)}
                  </span>
                  {showDatePicker && (
                    <span ref={datePickerRef}>
                      <DateRange
                        ref={datePickerRef}
                        editableDateInputs={true}
                        onChange={(item) => {
                          const selection = item.range1;
                          setDate([
                            {
                              startDate: selection.startDate.toISOString(),
                              endDate: selection.endDate.toISOString(),
                            },
                          ]);
                          if (
                            !isEqual(selection.startDate, selection.endDate) ||
                            (s.isCars &&
                              selection.startDate.toISOString() ===
                                date[0].endDate)
                          ) {
                            setShowDatePicker(false);
                          }
                        }}
                        moveRangeOnFirstSelection={false}
                        ranges={[
                          {
                            startDate: new Date(date[0].startDate),
                            endDate: new Date(date[0].endDate),
                          },
                        ]}
                        className="datepicker"
                        rangeColors={[getCssVariable("color-primary")]}
                        color={getCssVariable("color-primary")}
                        minDate={new Date()}
                      />
                    </span>
                  )}
                </div>

                {Object.keys(s.counts).length > 0 && (
                  <div className="headerSearchItem counters">
                    <span
                      onClick={() => setShowCounters(!showCounters)}
                      className="headerSearchText"
                    >
                      <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                      &nbsp;&nbsp;
                      {renderCounterSummary(counts, s.counts)}
                      {s.isFlights && ", Economy"}
                    </span>
                    {showCounters && (
                      <ClickAwayListener
                        onClickAway={() => setShowCounters(false)}
                      >
                        <div className="options">
                          {renderCounterOptions(counts, s.counts, handleOption)}
                        </div>
                      </ClickAwayListener>
                    )}
                  </div>
                )}
              </div>

              <div className="headerSearchItem searchButton">
                <button
                  className="headerBtn btn btn-primary"
                  onClick={handleSearch}
                  disabled={
                    s.locationInputs
                      .map((input) => input.key)
                      .some(
                        (key) =>
                          locations[key].length === 0 ||
                          !locationOptions.includes(locations[key]),
                      ) ||
                    (!s.isCars && showDatePicker)
                  }
                  tabIndex={-1}
                >
                  {s.searchButton}
                </button>
              </div>

              {!!s.searchOptions.length && [
                <div className={"searchOptionsContainer"} key={0}>
                  {s.searchOptions.map(({ label, checked }) => {
                    return (
                      <div key={label} className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={checked}
                          {...(checked !== undefined && {
                            readOnly: true,
                            tabIndex: -1,
                            style: { pointerEvents: "none" },
                          })}
                        />
                        <label className="form-check-label">{label}</label>
                      </div>
                    );
                  })}
                </div>,
                <div className={"spacer"} key={1}></div>,
              ]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
