import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faCoffee,
  faDotCircle,
  faListDots,
  faLocationDot,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import hotels from "../../data/hotels.json";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { datesAtom, destinationAtom, guestsAtom, hotelAtom } from "../../atoms";
import { getNights, getTotalPrice, pluralize } from "../../util";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import * as rows from "react-bootstrap/ElementChildren";
import ConfirmshamingPopup from "../../components/ConfirmshamingPopup";

const Hotel = () => {
  const navigate = useNavigate();
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const date = useRecoilValue(datesAtom);
  const guests = useRecoilValue(guestsAtom);
  const destination = useRecoilValue(destinationAtom);
  const id = useRecoilValue(hotelAtom);

  const hotel = hotels[id];

  const photos = [
    {
      src: `/img/rooms/entrance.jpeg`,
    },
    {
      src: `/img/hotel-thumbnail/${id}.webp`,
    },
    {
      src: `/img/rooms/bathroom.jpg`,
    },
    {
      src: `/img/rooms/checkin.jpeg`,
    },
    {
      src: `/img/rooms/breakfast.jpeg`,
    },
    {
      src: `/img/rooms/tables.jpeg`,
    },
  ];

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const roomSwitch = (guests) => {
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

  const handleClick = () => {
    navigate("/your-details");
  };

  return (
    <div>
      <Navbar />
      <ConfirmshamingPopup />
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
              <img src={photos[slideNumber].src} alt="" className="sliderImg" />
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
          <button className="bookNow btn btn-primary" onClick={handleClick}>
            Reserve Now
          </button>
          <h1 className="hotelTitle">
            <b>{hotel.name}</b>
          </h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>
              {hotel.location}, {destination}
            </span>
          </div>
          <span className="hotelDistance">
            Good location – {hotel.metersFromCenter} from center
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over € 114 at this property and get a free airport taxi
          </span>
          <div className="hotelImages">
            {photos.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo.src}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <img src={"/img/perks.png"} />
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">Your stay at {hotel.name}</h1>
              <p className="hotelDesc">
                {hotel.name} has accommodations with air conditioning and free
                WiFi. The units come with hardwood floors and feature a fully
                equipped kitchenette with a microwave, a flat-screen TV, and a
                private bathroom with shower and a hairdryer. A fridge is also
                offered, as well as an electric tea pot and a coffee machine.
              </p>
              <p className="hotelDesc">
                A buffet breakfast is served daily. The hotel's restaurant is
                open from 19:00 to 22:00 Monday to Friday.
              </p>
              <p className="hotelDesc">Free private parking is available.</p>
              <small>
                <small className={"text-secondary"}>
                  Distance in property description is calculated using ©
                  OpenStreetMap
                </small>
              </small>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a {getNights(date)}-night stay!</h1>
              <span>
                Secure this property with an excellent location score of{" "}
                {hotel.rating}!
              </span>
              <h2>
                <b>€ {getTotalPrice(hotel.price, date, guests)}</b> (
                {pluralize(getNights(date), "night")})
              </h2>

              <span className="siTaxOp">Includes taxes and fees</span>
              <button className="btn btn-primary" onClick={handleClick}>
                Reserve Now
              </button>
            </div>
          </div>

          <h1 className="hotelTitle">Availability</h1>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Number of guests</TableCell>
                  <TableCell>
                    Price for {pluralize(getNights(date), "night")}
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
                    {roomSwitch(guests.adult + guests.children)}
                  </TableCell>
                  <TableCell style={{ verticalAlign: "top" }}>
                    {[...Array(guests.adult + guests.children)].map((e, i) => (
                      <FontAwesomeIcon key={i} icon={faPerson} />
                    ))}
                  </TableCell>
                  <TableCell style={{ verticalAlign: "top" }}>
                    € {getTotalPrice(hotel.price, date, guests)}
                  </TableCell>
                  <TableCell style={{ verticalAlign: "top" }}>
                    <FontAwesomeIcon
                      icon={faCoffee}
                      width={"1em"}
                      className={"text-success"}
                    />{" "}
                    <span className={"text-success"}>
                      <b>Good breakfast</b> included
                    </span>
                    <br />
                    <FontAwesomeIcon
                      icon={faCheck}
                      width={"1em"}
                      className={"text-success"}
                    />{" "}
                    <span className={"text-success"}>
                      <b>Free cancellation</b> before 6:00 PM on{" "}
                      {new Date(
                        new Date(date[0].startDate).setDate(
                          date[0].startDate.getDate() - 1,
                        ),
                      ).toLocaleDateString()}
                    </span>
                    <br />
                    &nbsp;•&nbsp;&nbsp;Pay nothing until{" "}
                    {new Date(date[0].startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell style={{ verticalAlign: "top" }}>
                    <input
                      type="number"
                      className="lsOptionInput"
                      placeholder={guests.room}
                      disabled={true}
                    />
                  </TableCell>
                  <TableCell style={{ verticalAlign: "top" }}>
                    {pluralize(guests.room, "room")} for <br />
                    <h4>€ {getTotalPrice(hotel.price, date, guests)}</h4>
                    <span className="siTaxOp">Includes taxes and fees</span>
                    <br />
                    <br />
                    <button
                      className="w-100 btn btn-primary"
                      onClick={handleClick}
                    >
                      I'll reserve
                    </button>
                    <br />
                    <br />
                    <small>
                      <p>
                        <b>Your package:</b>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faCoffee} width={"1em"} />{" "}
                        <span>
                          <b>Good breakfast</b> included
                        </span>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faCheck} width={"1em"} />{" "}
                        <span>
                          <b>Free cancellation</b> before 6:00 PM on{" "}
                          {new Date(
                            new Date(date[0].startDate).setDate(
                              date[0].startDate.getDate() - 1,
                            ),
                          ).toLocaleDateString()}
                        </span>
                      </p>
                      <p>
                        &nbsp;•&nbsp;&nbsp;Pay nothing until{" "}
                        {new Date(date[0].startDate).toLocaleDateString()}
                      </p>
                    </small>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Hotel;
