
import "./searchItem.css";
import hotels from "../../data/hotels.json";
import flights from "../../data/flights.json";
import cars from "../../data/cars.json";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { datesAtom, destinationAtom, guestsAtom, hotelAtom } from "../../atoms";
import { useWebsite } from "../../contexts/WebsiteContext";
import { useDesignMode } from "../../contexts/DesignModeContext";
import { getNights, getTotalPrice, pluralize } from "../../util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCheck } from "@fortawesome/free-solid-svg-icons";

const SearchItem = ({ number }) => {
  const { websiteType } = useWebsite();
  const { designMode } = useDesignMode();
  const dates = useRecoilValue(datesAtom);
  const setHotel = useSetRecoilState(hotelAtom);
  const guests = useRecoilValue(guestsAtom);

  const getData = () => {
    switch(websiteType) {
      case 'flights':
        return flights[number % flights.length];
      case 'cars':
        return cars[number % cars.length];
      default:
        return hotels[number % hotels.length];
    }
  };

  const item = getData();
  const nights = getNights(dates[0].startDate, dates[0].endDate);
  const totalPrice = getTotalPrice(item.price, nights);

  const handleClick = () => {
    setHotel(number);
    window.location.href = "/details";
  };

  const renderDeceptiveContent = () => (
    <>
      {item.prevPrice && (
        <span className="siOldPrice">${item.prevPrice * nights}</span>
      )}
      <span className="siPrice">${totalPrice}</span>
      <span className="siTaxOp">
        {websiteType === 'hotels' ? 'Includes taxes and fees' : 'All taxes included'}
      </span>
      <div className="siDetailTexts">
        <span className="siBookNow">Book now!</span>
        <span className="siLimitedTime">Limited time offer</span>
        <span className="siOthersViewing">
          {Math.floor(Math.random() * 10) + 2} others viewing this {websiteType === 'hotels' ? 'room' : websiteType === 'flights' ? 'flight' : 'car'}
        </span>
      </div>
    </>
  );

  const renderFairContent = () => (
    <>
      <span className="siPrice">${totalPrice}</span>
      <span className="siTaxOp">
        {websiteType === 'hotels' ? 'Includes taxes and fees' : 'All taxes included'}
      </span>
    </>
  );

  return (
    <div className="searchItem">
      <img src="https://placehold.co/200x200" alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        {websiteType === 'hotels' && (
          <>
            <span className="siDistance">{item.distance} from center</span>
            <span className="siSubtitle">
              {pluralize(guests.adult, "adult")} · {pluralize(guests.children, "child")} · {pluralize(guests.room, "room")}
            </span>
          </>
        )}
        {websiteType === 'flights' && (
          <>
            <span className="siDistance">{item.airline}</span>
            <span className="siSubtitle">
              {item.departureTime} - {item.arrivalTime} ({item.duration})
            </span>
          </>
        )}
        {websiteType === 'cars' && (
          <>
            <span className="siDistance">{item.location} ({item.metersFromCenter} from center)</span>
            <span className="siSubtitle">
              {item.seats} seats · {item.transmission}
            </span>
          </>
        )}
        <span className="siFeatures">{item.description}</span>
        {item.freeCancellation && (
          <span className="siCancelOp">Free cancellation</span>
        )}
        {item.freeMeal && websiteType === 'flights' && (
          <span className="siCancelOp">Free meal</span>
        )}
        {item.freeInsurance && websiteType === 'cars' && (
          <span className="siCancelOp">Free insurance</span>
        )}
      </div>
      <div className="siDetails">
        <div className="siRating">
          <span>Excellent</span>
          <button>{item.rating}</button>
        </div>
        <div className="siDetailTexts">
          {designMode === 'deceptive' ? renderDeceptiveContent() : renderFairContent()}
          <button className="siCheckButton" onClick={handleClick}>
            See availability <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
