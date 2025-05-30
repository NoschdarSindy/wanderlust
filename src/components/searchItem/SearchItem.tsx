import "./searchItem.scss";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { locationsAtom, countsAtom, mockIndexAtom } from "src/lib/atoms";
import { pluralize } from "src/lib/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  useTotalPrice,
  getImage,
  getSite,
  useNights,
  useMock,
} from "src/lib/composables";
import FlightCard from "src/components/flightCard/FlightCard";
import CarCard from "src/components/carCard/CarCard";
import { useCustomNavigate } from "src/components/NavigationProvider.tsx";

function HotelCard(props: {
  onClick: () => void;
  src: any;
  mock: any;
  locations: { origin: string; destination: string };
  guests: any;
  index: number;
}) {
  return (
    <div className="searchItem">
      <a onClick={props.onClick}>
        <img src={props.src} alt="" className="siImg" />
      </a>

      <div className="siDesc">
        <a
          onClick={props.onClick}
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          <h1 className="siTitle">
            <b>{props.mock.name}</b>
          </h1>
        </a>
        <span className="siDistance">
          {props.mock.location}, {props.locations.destination}
        </span>
        <span className="siDistance">
          {props.mock.metersFromCenter} from center
        </span>
        {props.mock.freeAirportTaxi && (
          <span className="siTaxiOp">Free airport taxi</span>
        )}
        <span className="siSubtitle">{props.mock.description}</span>
        <span className="siCancelOp">
          <FontAwesomeIcon icon={faCheck} /> Free cancellation
        </span>
        {/*<span className="siCancelOpSubtitle">*/}
        {/*  You can cancel later, so lock in this great price today!*/}
        {/*</span>*/}
      </div>

      <div className="siDetails">
        <div className="siReviews">
          <div className="siRating">
            <span>{props.mock.rating > 8 ? "Excellent" : "Good"}</span>
            &nbsp;&nbsp;
            <button>{props.mock.rating}</button>
          </div>
          <span className="siTaxOp">{props.mock.numReviews} reviews</span>
        </div>
        <div className="siDetailTexts">
          <span className="siTaxOp">
            {pluralize(useNights(), "night")},{" "}
            {pluralize(props.guests.adult, "adult")}
          </span>
          <span className="siPrice">€ {useTotalPrice(props.index)}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button onClick={props.onClick} className="btn btn-primary">
            See availability <FontAwesomeIcon icon={faAngleRight} size={"xs"} />
          </button>
        </div>
      </div>
    </div>
  );
}

const SearchItem = ({ index }) => {
  const guests = useRecoilValue(countsAtom);
  const locations = useRecoilValue(locationsAtom);
  const setItemIndex = useSetRecoilState(mockIndexAtom);
  const navigateDelayed = useCustomNavigate();
  const s = getSite();
  const thumbnail = getImage("thumbnails")[index];
  const mock = useMock(index);

  const handleClick = () => {
    setItemIndex(index);
    navigateDelayed(`/${s.item_name}`);
  };

  return (
    <>
      {s.isHotels && (
        <HotelCard
          onClick={handleClick}
          src={thumbnail}
          mock={mock}
          locations={locations}
          guests={guests}
          index={index}
        />
      )}

      {s.isFlights && <FlightCard onClick={handleClick} index={index} />}

      {s.isCars && <CarCard onClick={handleClick} index={index} />}
    </>
  );
};

export default SearchItem;
