import "./list.scss";
import Navbar from "../../components/navbar/Navbar";
import SearchItem from "../../components/searchItem/SearchItem";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  datesAtom,
  locationsAtom,
  countsAtom,
  askedForNotificationPermissionAtom,
} from "src/lib/atoms";
import Footer from "../../components/footer/Footer";
import { Pagination, Stack } from "@mui/material";
import { formatDateRange, pluralize } from "src/lib/util";
import { getDesignMode, getSite } from "src/lib/composables";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { sendEvent } from "src/lib/client";
import ConfirmshamingPopup from "src/components/ConfirmshamingPopup";

function NotificationPermissionBanner() {
  const [askedForNotificationPermission, setAskedForNotificationPermission] =
    useRecoilState(askedForNotificationPermissionAtom);

  const handleAccept = () => Notification.requestPermission().then(handleClose);

  const handleClose = () => {
    sendEvent("notification/end");
    setAskedForNotificationPermission(true);
  };

  useEffect(() => {
    if (!askedForNotificationPermission) sendEvent("notification/start");
  }, []);

  if (!askedForNotificationPermission)
    return (
      <div className="promoBanner">
        <button className="bannerCloseBtn" onClick={handleClose}>
          ×
        </button>
        <div className="bannerContent">
          <div className="bannerIcon">
            <FontAwesomeIcon icon={faStar} size="1x" />
          </div>
          <div className="bannerText">
            <h4>Don't miss out on our best offers!</h4>
            <p>
              Get price alerts via your browser by enabling browser
              notifications.
            </p>
          </div>
          <button
            className="btn btn-primary bannerActionBtn"
            onClick={handleAccept}
          >
            Enable notifications
          </button>
        </div>
      </div>
    );
}

const List = () => {
  const design = getDesignMode();
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
      {design.isDark && <ConfirmshamingPopup />}
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
                      .map(({ label, checked }, i) => {
                        return (
                          <div className={"lsOptionItem"} key={i}>
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
            {design.isFair && <NotificationPermissionBanner />}
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
