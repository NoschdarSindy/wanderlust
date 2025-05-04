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
  useIsSummaryPage,
} from "src/lib/composables";
import { pluralize } from "src/lib/util";
import {
  countsAtom,
  datesAtom,
  locationsAtom,
  travelProtectionSelectedAtom,
} from "src/lib/atoms";
import { useRecoilValue } from "recoil";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getSite } from "src/lib/composables";
import FlightCard from "src/components/flightCard/FlightCard";
import CarCard from "../../components/carCard/CarCard";
import { Grid, Chip } from "@mui/material";
import { useCustomNavigate } from "src/components/NavigationProvider.tsx";

export default function Detail() {
  const navigateDelayed = useCustomNavigate();
  const isSummary = useIsSummaryPage();
  const date = useRecoilValue(datesAtom);
  const guests = useRecoilValue(countsAtom);
  const locations = useRecoilValue(locationsAtom);
  const s = getSite();
  const detail = (s as any).detail ?? {};
  const mock = useMock();
  const totalGuests = guests.adult + guests.child;

  const thumbnail = useThumbnail();
  const photos = s.isHotels
    ? ((getImage("rooms") || []) as string[]).toSpliced(1, 0, thumbnail)
    : [];

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
  const hasTravelProtection =
    useRecoilValue(travelProtectionSelectedAtom) === "yes";

  const handleReserve = () => navigateDelayed("/checkout/your-details");
  const handleBook = () => navigateDelayed("/success");

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

  const getPriceCard = () => {
    if (isSummary) {
      return (
        <>
          <div className="hotelDetailsPrice">
            <h2>
              <small className="siTaxOp" style={{ fontWeight: "bold" }}>
                {s.isCars
                  ? "TOTAL PRICE"
                  : s.isFlights
                    ? "PRICE SUMMARY"
                    : "PRICE BREAKDOWN"}
                <br />
              </small>
              <b>
                € {(totalPrice + (hasTravelProtection ? 19.99 : 0)).toFixed(2)}
              </b>
            </h2>

            <div style={{ fontSize: "0.9em", marginTop: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  {s.isHotels
                    ? pluralize(nights, "night")
                    : s.isCars
                      ? `${pluralize(nights, "day")} rental`
                      : "Base fare"}
                </span>
                <span>€ {totalPrice.toFixed(2)}</span>
              </div>
              {hasTravelProtection && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Travel protection plan</span>
                  <span>€ 19.99</span>
                </div>
              )}
            </div>
            <span className="siTaxOp">
              {s.isHotels
                ? "Includes VAT and tourist fees"
                : s.isFlights
                  ? "Taxes and carrier charges already applied"
                  : "Price includes required local taxes"}
            </span>
            <button className="btn btn-primary mt-2" onClick={handleBook}>
              Book Now
            </button>
          </div>
        </>
      );
    }

    return (
      <>
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
          <button className="btn btn-primary" onClick={handleReserve}>
            {detail.reserveButton}
          </button>
        </div>
      </>
    );
  };
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
          <div className="hotelWrapperChild">
            <div className="hotelWrapper">
              <br />
              {s.isHotels && !isSummary && (
                <button
                  className="bookNow btn btn-primary"
                  onClick={handleReserve}
                >
                  {detail.reserveButton}
                </button>
              )}
              <h1 className="hotelTitle">
                <b>
                  {isSummary
                    ? s.isFlights
                      ? `Review Your Booking`
                      : s.isHotels
                        ? `Booking Summary`
                        : `Your Rental`
                    : s.isFlights
                      ? `Your Flight`
                      : s.isCars
                        ? `Rental Details`
                        : mock.name}
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
                    <FontAwesomeIcon icon={faSuitcase} /> {totalGuests} Carry-on
                    | <FontAwesomeIcon icon={faSuitcaseRolling} /> {totalGuests}{" "}
                    Checked
                  </span>
                )}
              </div>
              <span className="hotelDistance">{detail.locationNote(mock)}</span>
              <span className="hotelPriceHighlight">{detail.pricePromo}</span>
              {s.isHotels && !isSummary && (
                <>
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
                  <img src={getImage("perks") as string} alt={""} />
                </>
              )}
            </div>
          </div>

          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              {(!s.isCars || isSummary) && (
                <h1 className="hotelTitle">
                  {s.isHotels
                    ? detail.pageTitle(mock)
                    : s.isFlights
                      ? `Itinerary`
                      : "Rental Details"}
                </h1>
              )}
              {s.isHotels && isSummary && (
                <img
                  src={getImage("perks") as string}
                  alt={""}
                  style={{ width: "100%", marginBottom: "1rem" }}
                />
              )}
              <pre className="hotelDesc">
                {s.isHotels ? detail.introLine(mock) : ""}
                {s.isFlights && (
                  <div className={"hotelWrapperChild"}>
                    <FlightCard onClick={handleReserve} />
                    {isSummary && getPriceCard()}
                  </div>
                )}
                {s.isCars && <CarCard onClick={handleReserve} />}
                {s.isCars && (
                  <div className="carInfoExtras mt-3">
                    <h4>Included in your rental</h4>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      <Chip
                        label="Full-to-full fuel policy"
                        variant="outlined"
                      />
                      <Chip
                        label="Free cancellation up to 24h before pickup"
                        variant="outlined"
                      />
                      <Chip
                        label="Collision damage waiver"
                        variant="outlined"
                      />
                      <Chip label="Theft protection" variant="outlined" />
                      <Chip label="Roadside assistance" variant="outlined" />
                      <Chip label="No deposit required" variant="outlined" />
                      <Chip label="Air conditioning" variant="outlined" />
                      <Chip
                        label="Smartphone mount included"
                        variant="outlined"
                      />
                      <Chip label="Winter tires equipped" variant="outlined" />
                      <Chip
                        label="Mobile check-in available"
                        variant="outlined"
                      />
                      <Chip label="Child seat available" variant="outlined" />
                    </div>
                  </div>
                )}
                {s.isFlights && (
                  <div className="flightInfoExtras mt-4 p-1">
                    <h4 style={{ marginBottom: "1rem" }}>What’s Included</h4>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={1}
                          style={{
                            padding: "1rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSuitcaseRolling}
                            style={{ marginRight: "0.75rem" }}
                          />
                          1 carry-on bag (up to 8 kg)
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={1}
                          style={{
                            padding: "1rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSuitcase}
                            style={{ marginRight: "0.75rem" }}
                          />
                          1 checked bag (up to 23 kg)
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={1}
                          style={{
                            padding: "1rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCoffee}
                            style={{ marginRight: "0.75rem" }}
                          />
                          Complimentary snack and soft drink
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={1}
                          style={{
                            padding: "1rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faGear}
                            style={{ marginRight: "0.75rem" }}
                          />
                          In-seat power outlet and USB charging
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={1}
                          style={{
                            padding: "1rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            style={{ marginRight: "0.75rem" }}
                          />
                          Free seat selection at check-in
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={1}
                          style={{
                            padding: "1rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCalendarDays}
                            style={{ marginRight: "0.75rem" }}
                          />
                          Flight status updates via email & SMS
                        </Paper>
                      </Grid>
                    </Grid>
                  </div>
                )}
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
                  <pre>
                    {s.isHotels
                      ? "Distance in property description is calculated using © OpenStreetMap"
                      : s.isFlights
                        ? "Departure and arrival times are shown in the local time zones of the respective airports.\nPlease account for time differences when planning your trip."
                        : s.isCars
                          ? "Car details subject to availability. All cars are inspected before pickup and come with basic insurance. Extra coverage can be added during checkout."
                          : ""}
                  </pre>
                </small>
              </small>
            </div>

            {!s.isFlights && getPriceCard()}
          </div>

          {!s.isCars && !isSummary && (
            <h1 className="hotelTitle">{detail.availabilityHeading}</h1>
          )}
          {s.isHotels && !isSummary && (
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
                        onClick={handleReserve}
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
