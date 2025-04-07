import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faUserGroup,
  faSuitcase,
  faGasPump,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useImage } from "src/lib/composables";
import "./carCard.scss";
import { pluralize } from "src/lib/util";

export function CarCard(props: { mock: any; onClick: () => void }) {
  const { mock, onClick } = props;

  const carImage = useImage("thumbnails/" + mock.image) as string;

  return (
    <div className="carCard">
      <div className="carCard__image">
        <img src={carImage} alt={mock.name} />
      </div>

      <div className="carCard__content">
        <div className="carCard__header">
          <h3 className="carCard__name">{mock.name}</h3>
          <div className="carCard__company">{mock.company}</div>
          <div className="carCard__category">{mock.category}</div>
        </div>

        <div className="carCard__specs">
          <div>
            <FontAwesomeIcon icon={faUserGroup} /> {mock.seats} seats
          </div>
          <div>
            <FontAwesomeIcon icon={faSuitcase} />{" "}
            {pluralize(mock.luggage, "suitcase")}
          </div>
          <div>
            <FontAwesomeIcon icon={faGear} /> {mock.transmission}
          </div>
          <div>
            <FontAwesomeIcon icon={faGasPump} /> {mock.fuelPolicy}
          </div>
        </div>

        <div className="carCard__footer">
          <div className="carCard__price">€ {mock.price}</div>
          <button onClick={onClick} className="btn btn-primary">
            Select <FontAwesomeIcon icon={faAngleRight} size="xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
