import "./searchItem.scss";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  datesAtom,
  locationsAtom,
  countsAtom,
  itemIndexAtom,
} from "src/lib/atoms";
import { getNights, getTotalPrice, pluralize } from "src/lib/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useImage, getSite } from "src/lib/composables";
import { FlightCard } from "src/components/flightCard/FlightCard";
import { CarCard } from "src/components/carCard/CarCard";

const SearchItem = ({ index }) => {
  const date = useRecoilValue(datesAtom);
  const guests = useRecoilValue(countsAtom);
  const locations = useRecoilValue(locationsAtom);
  const setItemIndex = useSetRecoilState(itemIndexAtom);
  const navigate = useNavigate();
  const s = getSite();
  const thumbnail = useImage("thumbnails")[index];
  const mock = s.mocks[index] as any;

  const handleClick = () => {
    setItemIndex(index);
    navigate(`/${s.item_name}`);
  };

  return (
    <div className="searchItem">
      {s.isHotels && (
        <>
          <a onClick={handleClick}>
            <img src={thumbnail} alt="" className="siImg" />
          </a>

          <div className="siDesc">
            <a
              onClick={handleClick}
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
              <h1 className="siTitle">
                <b>{mock.name}</b>
              </h1>
            </a>
            <span className="siDistance">
              {mock.location}, {locations.destination}
            </span>
            <span className="siDistance">
              {mock.metersFromCenter} from center
            </span>
            {mock.freeAirportTaxi && (
              <span className="siTaxiOp">Free airport taxi</span>
            )}
            <span className="siSubtitle">{mock.description}</span>
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
                <span>{mock.rating > 8 ? "Excellent" : "Good"}</span>
                &nbsp;&nbsp;
                <button>{mock.rating}</button>
              </div>
              <span className="siTaxOp">{mock.numReviews} reviews</span>
            </div>
            <div className="siDetailTexts">
              <span className="siTaxOp">
                {pluralize(getNights(date), "night")},{" "}
                {pluralize(guests.adult, "adult")}
              </span>
              <span className="siPrice">
                € {getTotalPrice(mock.price, date, guests)}
              </span>
              <span className="siTaxOp">Includes taxes and fees</span>
              <button onClick={handleClick} className="btn btn-primary">
                See availability{" "}
                <FontAwesomeIcon icon={faAngleRight} size={"xs"} />
              </button>
            </div>
          </div>
        </>
      )}

      {s.isFlights && <FlightCard mock={mock} onClick={handleClick} />}

      {s.isCars && <CarCard mock={mock} onClick={handleClick} />}
    </div>
  );
};

export default SearchItem;
