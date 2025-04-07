import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import SearchItem from "../../components/searchItem/SearchItem";
import { useRecoilValue } from "recoil";
import { datesAtom, locationsAtom, countsAtom } from "src/lib/atoms";
import Footer from "../../components/footer/Footer";
import { Pagination, Stack } from "@mui/material";
import { formatDateRange, pluralize } from "src/lib/util";
import { getSite } from "src/lib/composables";

const List = () => {
  const { origin, destination } = useRecoilValue(locationsAtom);
  const date = useRecoilValue(datesAtom);
  const s = getSite();
  const counts = useRecoilValue(countsAtom);
  const additionalOptions =
    {
      cars: [
        { label: "automatic transmission", checked: true },
        { label: "luggage space", checked: false },
      ],
    }[s.name] ?? [];

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            {origin && (
              <div className="lsItem">
                <label>Origin</label>
                <input type="text" defaultValue={origin} disabled={true} />
              </div>
            )}
            {destination && (
              <div className="lsItem">
                <label>Destination</label>
                <input type="text" defaultValue={destination} disabled={true} />
              </div>
            )}
            <div className="lsItem pe-none">
              <label>Time span</label>
              <span>{formatDateRange(date[0].startDate, date[0].endDate)}</span>
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                {s.isHotels && (
                  <>
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
                  </>
                )}

                {!!s.searchOptions.length && (
                  <div className={"searchOptionsContainer"}>
                    {[...s.searchOptions, ...additionalOptions]
                      .filter(Boolean)
                      .map(({ label, checked }) => {
                        return (
                          <div className={"lsOptionItem"}>
                            <span className="lsOptionText">{label} </span>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={checked}
                              {...{
                                readOnly: true,
                                tabIndex: -1,
                                style: { pointerEvents: "none" },
                              }}
                            />
                          </div>
                        );
                      })}
                  </div>
                )}

                {!!Object.keys(s.counts).length &&
                  Object.entries(s.counts).map(
                    ([key, label]: [string, string]) => (
                      <div className="lsOptionItem" key={key}>
                        <span className="lsOptionText">
                          {pluralize(null, label, true)}
                        </span>
                        <input
                          type="number"
                          className="lsOptionInput"
                          placeholder={counts[key]}
                          disabled={true}
                        />
                      </div>
                    ),
                  )}
              </div>
            </div>
          </div>
          <div className="listResult">
            {[...Array(10)].map((_, i) => (
              <SearchItem index={i} key={i} />
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
