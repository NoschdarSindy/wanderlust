import "./searchItem.css";
import hotels from "../../data/hotels.json";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { datesAtom, destinationAtom, guestsAtom, hotelAtom } from "../../atoms";
import { getNights, getTotalPrice, pluralize } from "../../util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const SearchItem = ({ number }) => {
  const date = useRecoilValue(datesAtom);
  const guests = useRecoilValue(guestsAtom);
  const destination = useRecoilValue(destinationAtom);
  const setHotel = useSetRecoilState(hotelAtom);

  const navigate = useNavigate();

  const hotel = hotels[number];

  const handleClick = () => {
    setHotel(number);
    navigate(`/hotel`);
  };

  return (
    <div className="searchItem">
      <Link to={`/hotel`}>
        <img
          src={`/img/hotel-thumbnail/${number}.webp`}
          alt=""
          className="siImg"
        />
      </Link>
      <div className="siDesc">
        <a
          onClick={handleClick}
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          <h1 className="siTitle">
            <b>{hotel.name}</b>
          </h1>
        </a>
        <span className="siDistance">
          {hotel.location}, {destination}
        </span>
        <span className="siDistance">{hotel.metersFromCenter} from center</span>
        {hotel.freeAirportTaxi && (
          <span className="siTaxiOp">Free airport taxi</span>
        )}
        <span className="siSubtitle">{hotel.description}</span>
        {/*<span className="siFeatures">{hotel.roomName}</span>*/}
        <span className="siCancelOp">
          <FontAwesomeIcon icon={faCheck} /> Free cancellation
        </span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        <div className="siReviews">
          <div className="siRating">
            <span>{hotel.rating > 8 ? "Excellent" : "Good"}</span>
            &nbsp;&nbsp;
            <button>{hotel.rating}</button>
          </div>
          <span className="siTaxOp">{hotel.numReviews} reviews</span>
        </div>
        <div className="siDetailTexts">
          <span className="siTaxOp">
            {pluralize(getNights(date), "night")},{" "}
            {pluralize(guests.adult, "adult")}
          </span>
          <span className="siPrice">
            € {getTotalPrice(hotel.price, date, guests)}
          </span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button onClick={handleClick} className="btn btn-primary">
            See availability <FontAwesomeIcon icon={faAngleRight} size={"xs"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
