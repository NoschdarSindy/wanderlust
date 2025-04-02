import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  askedForCookiesAtom,
  askedForLocationAtom,
  locationsAtom,
  showBackdropAtom,
} from "../lib/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useState } from "react";
import { InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation } from "@fortawesome/free-solid-svg-icons";
import { cities } from "../lib/locationsData";
import { sendEvent } from "src/lib/client";

export default function LocationInput({ accessor, placeholder }) {
  const [locations, setLocations] = useRecoilState(locationsAtom);
  const [askedForLocation, setAskedForLocation] =
    useRecoilState(askedForLocationAtom);
  const setShowBackdrop = useSetRecoilState(showBackdropAtom);
  const askedForCookies = useRecoilValue(askedForCookiesAtom);
  const [showAutomplete, setShowAutocomplete] = useState(false);
  const [locationAccessGranted, setLocationAccessGranted] = useState(false);
  const isOrigin = accessor === "origin";
  const options = cities.map((city) => ({
    label: city,
  }));

  const getLocation = () => locations[accessor];
  const setLocation = (location: string) => {
    setLocations((prev) => ({
      ...prev,
      [accessor]: location,
    }));
  };

  const handleChange = (e) => {
    if (!askedForCookies) {
      e.preventDefault();
      return;
    }
    setLocation(
      e.target.value[0]?.toUpperCase() ||
        "" + e.target.value.slice(1)?.toLowerCase(),
    );
  };

  const handleTextFieldClick = (e) => {
    if (askedForCookies && !askedForLocation && isOrigin) {
      e.target.blur();
      setShowBackdrop(true);
      sendEvent("geolocation/start");
      navigator.geolocation.getCurrentPosition(
        () => {
          console.log("Location is enabled");
          sendEvent("geolocation/end");
          setShowBackdrop(false);
          //TODO set string to current city
          setLocation("Berlin");
          setLocationAccessGranted(true);
          setAskedForLocation(true);
        },
        (error) => {
          console.log(error);
          console.log("Location is disabled");
          sendEvent("geolocation/end");
          setShowBackdrop(false);
          setAskedForLocation(true);
        },
      );
    }
  };

  return (
    <Autocomplete
      disabled={!askedForCookies}
      value={getLocation()}
      open={showAutomplete && !locationAccessGranted}
      openOnFocus={false}
      freeSolo
      sx={{ width: "100%" }}
      disablePortal
      options={options}
      clearIcon={null}
      onInputChange={(e, newValue) => {
        if (newValue.length === 0) {
          if (showAutomplete) setShowAutocomplete(false);
        } else {
          if (!showAutomplete) setShowAutocomplete(true);
        }
        setLocation(newValue);
      }}
      onClose={() => setShowAutocomplete(false)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          disabled={!askedForCookies}
          variant="standard"
          fullWidth
          onChange={handleChange}
          onClick={handleTextFieldClick}
          sx={{
            "& .MuiAutocomplete-inputRoot": {
              paddingRight: "0 !important",
            },
          }}
          InputProps={{
            ...params.InputProps,
            disableUnderline: true,
            endAdornment: isOrigin && (
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

const options = [
  {
    label: "Berlin",
  },
  {
    label: "Hamburg",
  },
  {
    label: "Munich",
  },
  {
    label: "Cologne",
  },
  {
    label: "Frankfurt am Main",
  },
  {
    label: "Stuttgart",
  },
  {
    label: "Düsseldorf",
  },
  {
    label: "Leipzig",
  },
  {
    label: "Dortmund",
  },
  {
    label: "Essen",
  },
  {
    label: "Bremen",
  },
  {
    label: "Dresden",
  },
  {
    label: "Hanover",
  },
  {
    label: "Nuremberg",
  },
  {
    label: "Duisburg",
  },
  {
    label: "Bochum",
  },
  {
    label: "Wuppertal",
  },
  {
    label: "Bielefeld",
  },
  {
    label: "Bonn",
  },
  {
    label: "Münster",
  },
  {
    label: "Mannheim",
  },
  {
    label: "Karlsruhe",
  },
  {
    label: "Augsburg",
  },
  {
    label: "Wiesbaden",
  },
  {
    label: "Mönchengladbach",
  },
  {
    label: "Gelsenkirchen",
  },
  {
    label: "Aachen",
  },
  {
    label: "Brunswick",
  },
  {
    label: "Kiel",
  },
  {
    label: "Chemnitz",
  },
  {
    label: "Halle (Saale)",
  },
  {
    label: "Magdeburg",
  },
  {
    label: "Freiburg im Breisgau",
  },
  {
    label: "Krefeld",
  },
  {
    label: "Mainz",
  },
  {
    label: "Lübeck",
  },
  {
    label: "Erfurt",
  },
  {
    label: "Oberhausen",
  },
  {
    label: "Rostock",
  },
  {
    label: "Kassel",
  },
  {
    label: "Hagen",
  },
  {
    label: "Potsdam",
  },
  {
    label: "Saarbrücken",
  },
  {
    label: "Hamm",
  },
  {
    label: "Ludwigshafen am Rhein",
  },
  {
    label: "Mülheim an der Ruhr",
  },
  {
    label: "Oldenburg",
  },
  {
    label: "Osnabrück",
  },
  {
    label: "Leverkusen",
  },
  {
    label: "Solingen",
  },
  {
    label: "Darmstadt",
  },
  {
    label: "Heidelberg",
  },
  {
    label: "Herne city",
  },
  {
    label: "Neuss",
  },
  {
    label: "Regensburg",
  },
  {
    label: "Paderborn",
  },
  {
    label: "Ingolstadt",
  },
  {
    label: "Offenbach am Main",
  },
  {
    label: "Fürth",
  },
  {
    label: "Würzburg",
  },
  {
    label: "Heilbronn",
  },
  {
    label: "Ulm",
  },
  {
    label: "Pforzheim",
  },
  {
    label: "Wolfsburg",
  },
  {
    label: "Bottrop",
  },
  {
    label: "Göttingen",
  },
  {
    label: "Reutlingen",
  },
  {
    label: "Bremerhaven",
  },
  {
    label: "Koblenz",
  },
  {
    label: "Erlangen",
  },
  {
    label: "Bergisch Gladbach",
  },
  {
    label: "Remscheid",
  },
  {
    label: "Jena",
  },
  {
    label: "Recklinghausen",
  },
  {
    label: "Trier",
  },
  {
    label: "Salzgitter",
  },
  {
    label: "Moers",
  },
  {
    label: "Siegen",
  },
  {
    label: "Hildesheim",
  },
  {
    label: "Gütersloh",
  },
  {
    label: "Kaiserslautern",
  },
  {
    label: "Cottbus/Chóśebuz",
  },
  {
    label: "Hanau",
  },
  {
    label: "Witten",
  },
  {
    label: "Schwerin",
  },
  {
    label: "Ludwigsburg",
  },
  {
    label: "Esslingen am Neckar",
  },
  {
    label: "Gera",
  },
  {
    label: "Iserlohn",
  },
  {
    label: "Düren",
  },
  {
    label: "Tübingen",
  },
  {
    label: "Giessen",
  },
  {
    label: "Flensburg",
  },
  {
    label: "Zwickau",
  },
  {
    label: "Ratingen",
  },
  {
    label: "Lünen",
  },
  {
    label: "Villingen-Schwenningen",
  },
  {
    label: "Constance",
  },
  {
    label: "Marl",
  },
  {
    label: "Worms",
  },
  {
    label: "Minden",
  },
  {
    label: "Velbert",
  },
  {
    label: "Neumünster",
  },
  {
    label: "Dessau-Roßlau",
  },
  {
    label: "Norderstedt",
  },
  {
    label: "Delmenhorst",
  },
  {
    label: "Viersen",
  },
  {
    label: "Bamberg",
  },
  {
    label: "Marburg",
  },
  {
    label: "Rheine",
  },
  {
    label: "Gladbeck",
  },
  {
    label: "Lüneburg",
  },
  {
    label: "Wilhelmshaven",
  },
  {
    label: "Troisdorf",
  },
  {
    label: "Dorsten",
  },
  {
    label: "Detmold",
  },
  {
    label: "Bayreuth",
  },
  {
    label: "Arnsberg",
  },
  {
    label: "Castrop-Rauxel",
  },
  {
    label: "Landshut",
  },
  {
    label: "Brandenburg an der Havel",
  },
  {
    label: "Lüdenscheid",
  },
  {
    label: "Bocholt",
  },
  {
    label: "Aschaffenburg",
  },
  {
    label: "Celle",
  },
  {
    label: "Kempten",
  },
  {
    label: "Aalen",
  },
  {
    label: "Fulda",
  },
  {
    label: "Lippstadt",
  },
  {
    label: "Dinslaken",
  },
  {
    label: "Herford",
  },
  {
    label: "Rüsselsheim am Main",
  },
  {
    label: "Kerpen",
  },
  {
    label: "Weimar",
  },
  {
    label: "Neuwied",
  },
  {
    label: "Sindelfingen",
  },
  {
    label: "Dormagen",
  },
  {
    label: "Plauen",
  },
  {
    label: "Grevenbroich",
  },
  {
    label: "Rosenheim",
  },
  {
    label: "Neubrandenburg",
  },
  {
    label: "Herten",
  },
  {
    label: "Bergheim",
  },
  {
    label: "Friedrichshafen",
  },
  {
    label: "Schwäbisch Gmünd",
  },
  {
    label: "Garbsen",
  },
  {
    label: "Offenburg",
  },
  {
    label: "Wesel",
  },
  {
    label: "Hürth",
  },
  {
    label: "Greifswald",
  },
  {
    label: "Stralsund",
  },
  {
    label: "Langenfeld",
  },
  {
    label: "Neu-Ulm",
  },
  {
    label: "Unna",
  },
  {
    label: "Euskirchen",
  },
  {
    label: "Göppingen",
  },
  {
    label: "Hamelin",
  },
  {
    label: "Frankfurt (Oder)",
  },
  {
    label: "Meerbusch",
  },
  {
    label: "Stolberg",
  },
  {
    label: "Eschweiler",
  },
  {
    label: "Görlitz",
  },
  {
    label: "Sankt Augustin",
  },
  {
    label: "Waiblingen",
  },
  {
    label: "Baden-Baden",
  },
  {
    label: "Hilden",
  },
  {
    label: "Lingen (Ems)",
  },
  {
    label: "Langenhagen",
  },
  {
    label: "Pulheim",
  },
  {
    label: "Hattingen",
  },
  {
    label: "Bad Salzuflen",
  },
  {
    label: "Bad Homburg v. d. Höhe",
  },
  {
    label: "Nordhorn",
  },
  {
    label: "Schweinfurt",
  },
  {
    label: "Neustadt an der Weinstraße",
  },
  {
    label: "Wetzlar",
  },
  {
    label: "Ahlen",
  },
  {
    label: "Menden",
  },
  {
    label: "Passau",
  },
  {
    label: "Kleve",
  },
  {
    label: "Wolfenbüttel",
  },
  {
    label: "Frechen",
  },
  {
    label: "Ibbenbüren",
  },
  {
    label: "Bad Kreuznach",
  },
  {
    label: "Gummersbach",
  },
  {
    label: "Ravensburg",
  },
  {
    label: "Speyer",
  },
  {
    label: "Willich",
  },
  {
    label: "Peine",
  },
  {
    label: "Goslar",
  },
  {
    label: "Rastatt",
  },
  {
    label: "Böblingen",
  },
  {
    label: "Erftstadt",
  },
];
