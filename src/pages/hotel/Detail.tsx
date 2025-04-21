import "./detail.scss";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faLocationDot,
  faCircleCheck,
  faCoffee,
  faCircleArrowLeft,
  faCircleArrowRight,
  faPerson,
  faPlane,
  faCar,
  faUserGroup,
  faSuitcase,
  faGasPump,
  faGear,
  faSuitcaseRolling,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import {
  useTotalPrice,
  getImage,
  useThumbnail,
  useNights,
  useMock,
  useFormatDateRange,
} from "src/lib/composables";
import { pluralize } from "src/lib/util";
import { countsAtom, datesAtom, locationsAtom } from "src/lib/atoms";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getSite } from "src/lib/composables";
import ConfirmshamingPopup from "src/components/ConfirmshamingPopup";
import FlightCard from "src/components/flightCard/FlightCard";
import CarCard from "../../components/carCard/CarCard";

export default function Detail() {
  const navigate = useNavigate();
  const date = useRecoilValue(datesAtom);
  const guests = useRecoilValue(countsAtom);
  const locations = useRecoilValue(locationsAtom);
  const s = getSite();
  const detail = (s as any).detail ?? {};
  const mock = useMock();
  const totalGuests = guests.adult + guests.child;

  const thumbnail = useThumbnail();
  const photos = ((getImage("rooms") || []) as string[]).toSpliced(
    1,
    0,
    thumbnail,
  );

  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const handleOpen = (i: number) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction: "l" | "r") => {
    let newSlideNumber: number;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === photos.length - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const roomSwitch = (guests: number) => {
    switch (true) {
      case guests <= 2:
        return "Suite";
      case guests === 3:
        return "Triple Room";
      case guests === 4:
        return "Quadruple Room";
      default:
        return "Group Room";
    }
  };

  const totalPrice = useTotalPrice();

  const handleClick = () => {
    navigate("/checkout/your-details");
  };

  const dayBeforeStartDate = new Date(
    new Date(date[0].startDate).setDate(
      new Date(date[0].startDate).getDate() - 1,
    ),
  ).toLocaleDateString();

  const startDate = new Date(date[0].startDate).toLocaleDateString();

  // const getAirportCode = (location: string) =>
  //   /.*\((\w+)\)/.exec(location)?.[1];
  // const getAirportName = (location: string) => /(.*)\s\(/.exec(location)?.[1];

  // Car specs helpers
  const carSpecs = s.isCars
    ? [
        { icon: faUserGroup, value: `${mock.seats} seats` },
        { icon: faSuitcase, value: pluralize(mock.luggage, "suitcase") },
        { icon: faGear, value: mock.transmission },
        { icon: faGasPump, value: mock.fuelPolicy },
      ]
    : [];

  const nights = useNights();
  const formatDateRange = useFormatDateRange();

  return (
    <div>
      <Navbar />
      <div className="hotelContainer m-0">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img src={photos[slideNumber]} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}

        <div className="hotelWrapper">
          <br />
          {s.isHotels && (
            <button className="bookNow btn btn-primary" onClick={handleClick}>
              {detail.reserveButton}
            </button>
          )}
          <h1 className="hotelTitle">
            <b>
              {s.isFlights ? `Your Flight` : s.isCars ? `Details` : mock.name}
            </b>
          </h1>
          <div className="hotelAddress">
            <div>
              <FontAwesomeIcon
                icon={
                  s.isHotels
                    ? faLocationDot
                    : s.isFlights
                      ? faPlane
                      : s.isCars
                        ? faCar
                        : undefined
                }
              />{" "}
              <span>
                {s.isHotels ? (
                  `${mock.location}, ${locations.destination}`
                ) : s.isFlights ? (
                  <b>
                    {locations.origin} ⇔ {locations.destination}
                  </b>
                ) : s.isCars ? (
                  `${locations.destination} ${mock.location}`
                ) : (
                  ""
                )}
              </span>
            </div>

            <div>
              <FontAwesomeIcon icon={faCalendarDays} /> {formatDateRange}
            </div>

            {s.isFlights && (
              <span>
                <FontAwesomeIcon icon={faSuitcase} /> {totalGuests} Carry-on |{" "}
                <FontAwesomeIcon icon={faSuitcaseRolling} /> {totalGuests}{" "}
                Checked
              </span>
            )}
          </div>
          <span className="hotelDistance">
            {!s.isCars ? detail.locationNote(mock) : ""}
          </span>
          <span className="hotelPriceHighlight">{detail.pricePromo}</span>
          {s.isHotels && (
            <div className="hotelImages">
              {photos.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>
          )}
          {s.isHotels && <img src={getImage("perks") as string} alt={""} />}
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              {!s.isCars && (
                <h1 className="hotelTitle">
                  {s.isHotels ? detail.pageTitle(mock) : `Itinerary`}
                </h1>
              )}
              <pre className="hotelDesc">
                {s.isHotels ? detail.introLine(mock) : ""}

                {s.isFlights && <FlightCard onClick={handleClick} />}
                {s.isCars && <CarCard onClick={handleClick} />}
              </pre>
              {/*{s.isCars && (*/}
              {/*  <div style={{ marginBottom: 8 }}>*/}
              {/*    {carSpecs.map((spec, idx) => (*/}
              {/*      <span key={idx} style={{ marginRight: 16 }}>*/}
              {/*        <FontAwesomeIcon icon={spec.icon} /> {spec.value}*/}
              {/*      </span>*/}
              {/*    ))}*/}
              {/*  </div>*/}
              {/*)}*/}
              <small>
                <small className={"text-secondary"}>
                  {s.isHotels
                    ? "Distance in property description is calculated using © OpenStreetMap"
                    : s.isFlights
                      ? "All times are in local time."
                      : s.isCars
                        ? "Car details subject to availability"
                        : ""}
                </small>
              </small>
            </div>

            {!s.isFlights && (
              <div className="hotelDetailsPrice">
                <h2>
                  {s.isCars && (
                    <small className="siTaxOp" style={{ fontWeight: "bold" }}>
                      TOTAL
                      <br />
                    </small>
                  )}
                  <b>€ {totalPrice}</b>
                  {s.isHotels ? ` (${pluralize(nights, "night")})` : ""}
                </h2>

                {s.isHotels && (
                  <span className="siTaxOp">Includes taxes and fees</span>
                )}
                <button className="btn btn-primary" onClick={handleClick}>
                  {detail.reserveButton}
                </button>
              </div>
            )}
          </div>

          {!s.isCars && (
            <h1 className="hotelTitle">{detail.availabilityHeading}</h1>
          )}
          {s.isHotels && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Number of guests</TableCell>
                    <TableCell>
                      Price for {pluralize(nights, "night")}
                    </TableCell>
                    <TableCell>Your choices</TableCell>
                    <TableCell>Included rooms</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ verticalAlign: "top" }}
                    >
                      {roomSwitch(totalGuests)}
                    </TableCell>
                    <TableCell style={{ verticalAlign: "top" }}>
                      {[...Array(totalGuests)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faPerson} />
                      ))}
                    </TableCell>
                    <TableCell style={{ verticalAlign: "top" }}>
                      € {totalPrice}
                    </TableCell>
                    <TableCell style={{ verticalAlign: "top" }}>
                      <FontAwesomeIcon
                        icon={faCoffee}
                        width={"1em"}
                        className={"text-success"}
                      />{" "}
                      <span className={"text-success"}>
                        <b>{detail.badgeBreakfast}</b>
                      </span>
                      <br />
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        width={"1em"}
                        className={"text-success"}
                      />{" "}
                      <span className={"text-success"}>
                        <b>{detail.badgeCancellation(dayBeforeStartDate)}</b>
                      </span>
                      <br />
                      &nbsp;•&nbsp;&nbsp;
                      {detail.badgePayLater(startDate)}
                    </TableCell>
                    <TableCell style={{ verticalAlign: "top" }}>
                      <input
                        type="index"
                        className="lsOptionInput"
                        placeholder={guests.room.toString()}
                        disabled={true}
                      />
                    </TableCell>
                    <TableCell style={{ verticalAlign: "top" }}>
                      {pluralize(guests.room, "room")} for <br />
                      <h4>€ {totalPrice}</h4>
                      <span className="siTaxOp">Includes taxes and fees</span>
                      <br />
                      <br />
                      <button
                        className="w-100 btn btn-primary"
                        onClick={handleClick}
                      >
                        Reserve
                      </button>
                      <br />
                      <br />
                      <small>
                        <p>
                          <b>{detail.packageTitle}</b>
                        </p>
                        <p>
                          <FontAwesomeIcon icon={faCoffee} width={"1em"} />{" "}
                          <span>
                            <b>{detail.badgeBreakfast}</b>
                          </span>
                        </p>
                        <p>
                          <FontAwesomeIcon icon={faCircleCheck} width={"1em"} />{" "}
                          <span>
                            <b>
                              {detail.badgeCancellation(dayBeforeStartDate)}
                            </b>
                          </span>
                        </p>
                        <p>
                          &nbsp;•&nbsp;&nbsp;
                          {detail.badgePayLater(startDate)}
                        </p>
                      </small>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
