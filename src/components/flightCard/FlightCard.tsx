import { useImage } from "src/lib/composables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue } from "recoil";
import { locationsAtom } from "src/lib/atoms";
import "./flightCard.scss";

export function FlightCard(props: { mock: any; onClick: () => void }) {
  const { mock, onClick } = props;
  const thumbnailPath = "thumbnails/" + mock.airline;
  const thumbnail = useImage(thumbnailPath) as string;
  const locations = useRecoilValue(locationsAtom);
  const locationsArray = Object.values(locations);
  const getAirportCode = (location: string) =>
    /.*\((\w+)\)/.exec(location)?.[1];
  const getAirportName = (location: string) => /(.*)\s\(/.exec(location)?.[1];

  return (
    <div className="flightInfo">
      <div className={"flightRouteContainer"}>
        {["", "Return"].map((suffix, i) => (
          <div className="flightRoute" key={i}>
            <div className="flightAirline">
              <img src={thumbnail} alt="" />
            </div>
            <div className="flightSegment">
              <div className="flightTime">{mock["departureTime" + suffix]}</div>
              <div className="flightAirport">
                {getAirportCode(locationsArray[i])}
              </div>
              <div className="flightCity">
                {getAirportName(locationsArray[i])}
              </div>
            </div>
            <div className="flightDuration">
              <span>{mock.duration}</span>
              <span className="flightStops">{mock.stops}</span>
            </div>
            <div className="flightSegment">
              <div className="flightTime">{mock["arrivalTime" + suffix]}</div>
              <div className="flightAirport">
                {getAirportCode(locationsArray[(i + 1) % 2])}
              </div>
              <div className="flightCity">
                {getAirportName(locationsArray[(i + 1) % 2])}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={"separator"}></div>
      <div className="flightDetails">
        <div className="flightPrice">€ {mock.price || 120}</div>
        <button onClick={onClick} className="btn btn-primary">
          Select <FontAwesomeIcon icon={faAngleRight} size="xs" />
        </button>
      </div>
    </div>
  );
}
