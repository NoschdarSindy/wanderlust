
import "./searchItem.css";
import hotels from "../../data/hotels.json";
import flights from "../../data/flights.json";
import cars from "../../data/cars.json";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { datesAtom, destinationAtom, guestsAtom, hotelAtom } from "../../atoms";
import { useWebsite } from "../../contexts/WebsiteContext";
import { getNights, getTotalPrice, pluralize } from "../../util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const SearchItem = ({ number }) => {
  const { websiteType } = useWebsite();
  const date = useRecoilValue(datesAtom);
  const guests = useRecoilValue(guestsAtom);
  const destination = useRecoilValue(destinationAtom);
  const setHotel = useSetRecoilState(hotelAtom);
  const navigate = useNavigate();

  const item = {
    hotels: hotels[number],
    flights: flights[number],
    cars: cars[number]
  }[websiteType];

  const handleClick = () => {
    setHotel(number);
    navigate(`/${websiteType.slice(0, -1)}`);
  };

  const renderDetails = () => {
    switch (websiteType) {
      case 'flights':
        return (
          <>
            <span className="siDistance">{item.airline}</span>
            <span className="siDistance">{item.departureTime} - {item.arrivalTime}</span>
            <span className="siDistance">Duration: {item.duration}</span>
            {item.freeMeal && <span className="siTaxiOp">Free meal included</span>}
            {item.extraLegroom && <span className="siTaxiOp">Extra legroom</span>}
          </>
        );
      case 'cars':
        return (
          <>
            <span className="siDistance">{item.model}</span>
            <span className="siDistance">{item.location}, {destination}</span>
            <span className="siDistance">{item.metersFromCenter} from center</span>
            {item.freeInsurance && <span className="siTaxiOp">Free insurance</span>}
            <span className="siSubtitle">Seats: {item.seats} • {item.transmission}</span>
          </>
        );
      default:
        return (
          <>
            <span className="siDistance">{item.location}, {destination}</span>
            <span className="siDistance">{item.metersFromCenter} from center</span>
            {item.freeAirportTaxi && <span className="siTaxiOp">Free airport taxi</span>}
          </>
        );
    }
  };

  return (
    <div className="searchItem">
      <Link to={`/${websiteType.slice(0, -1)}`}>
        <img
          src={`/img/${websiteType}-thumbnail/${number}.webp`}
          alt=""
          className="siImg"
        />
      </Link>
      <div className="siDesc">
        <a onClick={handleClick} style={{ textDecoration: "none", cursor: "pointer" }}>
          <h1 className="siTitle">
            <b>{item.name}</b>
          </h1>
        </a>
        {renderDetails()}
        <span className="siSubtitle">{item.description}</span>
        {item.freeCancellation && (
          <>
            <span className="siCancelOp">
              <FontAwesomeIcon icon={faCheck} /> Free cancellation
            </span>
            <span className="siCancelOpSubtitle">
              You can cancel later, so lock in this great price today!
            </span>
          </>
        )}
      </div>
      <div className="siDetails">
        <div className="siReviews">
          <div className="siRating">
            <span>{item.rating > 8 ? "Excellent" : "Good"}</span>
            &nbsp;&nbsp;
            <button>{item.rating}</button>
          </div>
          <span className="siTaxOp">{item.numReviews} reviews</span>
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">${item.price}</span>
          {item.prevPrice && (
            <span className="siTaxOp" style={{ textDecoration: "line-through" }}>
              ${item.prevPrice}
            </span>
          )}
          <span className="siTaxOp">
            {websiteType === 'hotels' ? 'Includes taxes and fees' : 'All taxes included'}
          </span>
          <button className="siCheckButton" onClick={handleClick}>
            See availability <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
