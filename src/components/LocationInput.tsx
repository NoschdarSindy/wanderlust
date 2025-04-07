import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  askedForCookiesAtom,
  askedForLocationAtom,
  locationsAtom,
  showBackdropAtom,
} from "../lib/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation } from "@fortawesome/free-solid-svg-icons";
import { sendEvent } from "src/lib/client";
import { getLocationsData, getSite } from "src/lib/composables";
import { useRef } from "react";

export default function LocationInput({ accessor, placeholder }) {
  const [locations, setLocations] = useRecoilState(locationsAtom);
  const [askedForLocation, setAskedForLocation] =
    useRecoilState(askedForLocationAtom);
  const setShowBackdrop = useSetRecoilState(showBackdropAtom);
  const askedForCookies = useRecoilValue(askedForCookiesAtom);
  const hasError = useRef(false);
  const s = getSite();
  const showGpsButton = s.isHotels || accessor === "origin";
  const locationsData = getLocationsData();
  const fakeGpsLocation = locationsData.fakeGpsLocation;
  const options = locationsData.options.map((label) => ({ label }));

  const getLocation = () => locations[accessor] || "";

  const setLocation = (location: string) => {
    setLocations((prev) => ({ ...prev, [accessor]: location }));
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

  const endGeolocationEvent = () => {
    sendEvent("geolocation/end");
    setShowBackdrop(false);
    setAskedForLocation(true);
  };

  const handleTextFieldClick = (e) => {
    if (askedForCookies && !askedForLocation && showGpsButton) {
      e.stopPropagation();
      sendEvent("geolocation/start");
      setShowBackdrop(true);
      navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        ({ code }) =>
          code === 1 ? handleGeolocationError() : handleGeolocationSuccess(),
        { maximumAge: Infinity, timeout: 0 },
      );
    }
  };

  const currentValue = getLocation();

  return (
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
          helperText={hasError.current ? "Please select a valid location" : ""}
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
                <InputAdornment position="end">
                  <FontAwesomeIcon
                    cursor="pointer"
                    icon={faLocation}
                    className="headerIcon location"
                    onClick={handleTextFieldClick}
                  />
                </InputAdornment>
              </>
            ),
          }}
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
    />
  );
}
