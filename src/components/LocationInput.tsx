import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  askedForCookiesAtom,
  askedForLocationAtom,
  locationsAtom,
  showBackdropAtom,
} from "../lib/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { InputAdornment, Chip } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation } from "@fortawesome/free-solid-svg-icons";
import { sendEvent } from "src/lib/client";
import { getDesignMode, getLocationsData, getSite } from "src/lib/composables";
import { useRef, useState } from "react";
import ConfirmshamingPopup from "src/components/ConfirmshamingPopup";
import LocationPopup from "src/components/LocationPopup";
import IconButton from "@mui/material/IconButton";

export default function LocationInput({ accessor, placeholder }) {
  const d = getDesignMode();
  const [locations, setLocations] = useRecoilState(locationsAtom);
  const [askedForLocation, setAskedForLocation] =
    useRecoilState(askedForLocationAtom);
  const setShowBackdrop = useSetRecoilState(showBackdropAtom);
  const askedForCookies = useRecoilValue(askedForCookiesAtom);
  const hasError = useRef(false);
  const s = getSite();
  const [showGpsButton, setShowGpsButton] = useState(
    s.isHotels || accessor === "origin",
  );
  const locationsData = getLocationsData();
  const fakeGpsLocation = locationsData.fakeGpsLocation;
  let options = locationsData.options.map((label) => ({ label }));
  if (accessor === "destination")
    options = options.filter((option) => option.label !== locations.origin);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const dataListId = `${s.name}-${accessor}-locations`;

  const getLocation = () => locations[accessor] || "";

  const setLocation = (location: string) => {
    setLocations((prev) => ({ ...prev, [accessor]: location }));
    setShowGpsButton(false);
  };

  const isValidOption = (value: string) => {
    if (!value) return true;
    return options.some(
      (option) => option.label.toLowerCase() === value.toLowerCase(),
    );
  };

  const handleChange = (e) => {
    if (!askedForCookies) {
      e.preventDefault();
      return;
    }
    let value = e.target.value;
    // value =
    //   (value[0]?.toUpperCase() || "") + (value.slice(1)?.toLowerCase() || "");
    setLocation(value);
    // hasError.current = !isValidOption(newValue);
  };

  const handleBlur = () => {
    hasError.current = !isValidOption(getLocation());
  };

  const handleGeolocationSuccess = () => {
    console.log("Location permission is enabled");
    setLocation(fakeGpsLocation);
    endGeolocationEvent(true);
  };

  const handleGeolocationError = () => {
    console.error("Location permission is denied");
    endGeolocationEvent(false);
  };

  const getGeolocationPermission = () => {
    setShowBackdrop(true);
    navigator.geolocation.getCurrentPosition(
      handleGeolocationSuccess,
      ({ code }) =>
        code === 1 ? handleGeolocationError() : handleGeolocationSuccess(),
      { maximumAge: Infinity, timeout: 0 },
    );
  };

  const endGeolocationEvent = (accepted) => {
    sendEvent(`geolocation/end/${accepted ? "accept" : "reject"}`);
    setShowBackdrop(false);
    setAskedForLocation(true);
  };

  const handleTextFieldClick = (e) => {
    if (askedForCookies && !askedForLocation && showGpsButton && d.isDark) {
      e.stopPropagation();
      setShowLocationPopup(true);
    }
  };

  const handleAdornmentClick = (e) => {
    sendEvent("geolocation/start");
    getGeolocationPermission();
  };

  return (
    <>
      {showLocationPopup && <LocationPopup accept={getGeolocationPermission} />}
      <TextField
        autoComplete={"off"}
        value={getLocation()}
        onChange={handleChange}
        onClick={handleTextFieldClick}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={!askedForCookies}
        variant="standard"
        fullWidth
        error={hasError.current}
        helperText={hasError.current ? "Please select a valid location" : ""}
        InputProps={{
          disableUnderline: true,
          endAdornment: showGpsButton && (
            <InputAdornment position="end">
              {d.isFair ? (
                <Chip
                  icon={
                    <MyLocationIcon
                      sx={{ color: "var(--color-primary) !important" }}
                    />
                  }
                  label="Here"
                  onClick={handleAdornmentClick}
                  sx={{
                    borderRadius: "50px",
                    backgroundColor: "#fff",
                    color: "var(--color-primary)",
                    fontWeight: "medium",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                    cursor: "pointer",
                  }}
                />
              ) : (
                <IconButton
                  size="small"
                  onClick={
                    d.isDark ? handleTextFieldClick : handleAdornmentClick
                  }
                  sx={{
                    padding: 0,
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  <FontAwesomeIcon
                    cursor="pointer"
                    icon={faLocation}
                    className="headerIcon location"
                  />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        inputProps={{
          list: dataListId,
        }}
        sx={{
          "& .MuiInputBase-root": {
            paddingRight: "0 !important",
          },
        }}
      />
      {getLocation().length > 1 && (
        <datalist id={dataListId} style={{ height: "100%", width: "100vh" }}>
          {options.map((option) => (
            <option key={option.label} value={option.label} />
          ))}
        </datalist>
      )}
    </>
  );
}
