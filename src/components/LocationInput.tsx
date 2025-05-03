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
    const newValue =
      (e.target.value[0]?.toUpperCase() || "") +
      (e.target.value.slice(1)?.toLowerCase() || "");
    setLocation(newValue);
  };

  const handleBlur = () => {
    hasError.current = !isValidOption(currentValue);
  };

  const handleGeolocationSuccess = () => {
    console.log("Location permission is enabled");
    setLocation(fakeGpsLocation);
    endGeolocationEvent();
  };

  const handleGeolocationError = () => {
    console.error("Location permission is denied");
    endGeolocationEvent();
  };

  const startGeolocationEvent = (e) => {
    sendEvent("geolocation/start");
    getGeolocationPermission();
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

  const endGeolocationEvent = () => {
    sendEvent("geolocation/end");
    setShowBackdrop(false);
    setAskedForLocation(true);
  };

  const handleTextFieldClick = (e) => {
    if (askedForCookies && !askedForLocation && showGpsButton) {
      if (d.isDark) {
        e.stopPropagation();
        setShowLocationPopup(true);
      }
    }
  };

  const handleAdornmentClick = (e) => {
    sendEvent("geolocation/start");
    getGeolocationPermission();
  };

  const currentValue = getLocation();

  return (
    <>
      {showLocationPopup && <LocationPopup accept={getGeolocationPermission} />}
      <Autocomplete
        disabled={!askedForCookies}
        value={getLocation()}
        openOnFocus={false}
        freeSolo
        sx={{ width: "100%" }}
        disablePortal
        options={
          askedForLocation
            ? options.filter(({ label }) =>
                label.toLowerCase().includes(getLocation().toLowerCase()),
              )
            : []
        }
        clearIcon={null}
        onInputChange={(_, newValue, reason) => {
          hasError.current = false;
          if (reason === "reset" && isValidOption(newValue)) {
            setLocation(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            value={getLocation()}
            placeholder={placeholder}
            disabled={!askedForCookies}
            variant="standard"
            fullWidth
            onChange={handleChange}
            onClick={handleTextFieldClick}
            onBlur={handleBlur}
            error={hasError.current} // Boolean: true if invalid, false if valid or empty
            helperText={
              hasError.current ? "Please select a valid location" : ""
            }
            sx={{
              "& .MuiAutocomplete-inputRoot": {
                paddingRight: "0 !important",
              },
            }}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              endAdornment: showGpsButton && (
                <>
                  {params.InputProps?.endAdornment}
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
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={
                          d.isDark ? handleTextFieldClick : handleAdornmentClick
                        }
                        sx={{
                          padding: 0,
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        <FontAwesomeIcon
                          cursor="pointer"
                          icon={faLocation}
                          className="headerIcon location"
                        />
                      </IconButton>
                    </InputAdornment>
                  )}
                </>
              ),
            }}
            inputProps={{
              ...params.inputProps,
            }}
          />
        )}
      />
    </>
  );
}
