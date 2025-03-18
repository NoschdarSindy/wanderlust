import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useState } from "react";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import { useRecoilState, useRecoilValue } from "recoil";
import { datesAtom, destinationAtom, guestsAtom } from "../../atoms";
import Footer from "../../components/footer/Footer";
import { Pagination, Stack } from "@mui/material";
import { useWebsite } from "../../contexts/WebsiteContext"; // Added import for website context

const List = () => {
  const [destination, setDestination] = useRecoilState(destinationAtom);
  const date = useRecoilValue(datesAtom);
  const guests = useRecoilValue(guestsAtom);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const website = useWebsite(); // Use the website context

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                onChange={(e) => setDestination(e.target.value)}
                type="text"
                defaultValue={destination}
                disabled={true}
              />
            </div>
            <div className="lsItem pe-none">
              <label>Time span</label>
              <span
                onClick={() => setShowDatePicker(!showDatePicker)}
              >{`${new Date(date[0].startDate).toLocaleDateString(
                "en-GB",
              )} to ${new Date(date[0].endDate).toLocaleDateString(
                "en-GB",
              )}`}</span>
              {showDatePicker && (
                <DateRange className="dateRange" disabled={true} />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    disabled={true}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    disabled={true}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={guests.adult}
                    disabled={true}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={guests.children}
                    disabled={true}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={guests.room}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="listResult">
            {[...Array(10)].map((e, i) => (
              <SearchItem number={i} key={i} website={website} /> {/* Pass website context */}
            ))}

            <br />
            <Stack alignItems="center">
              <Pagination count={10} variant="outlined" disabled={true} />
            </Stack>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;