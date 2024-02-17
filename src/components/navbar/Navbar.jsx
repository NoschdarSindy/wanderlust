import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCar,
  faCircleQuestion,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navContainer">
        <div className="firstRow">
          <span className="logo">
            Wanderlust Hotels{" "}
            <sub>
              <small>
                <small>powered by Booking.com</small>
              </small>
            </sub>
          </span>
          <div className={"headerListContainer"}></div>
          <div className="navItems">
            <span>EUR</span> &nbsp;&nbsp;&nbsp;
            <img
              src={"/img/us-eng.png"}
              alt=""
              style={{
                width: "1em",
                height: "auto",
                borderRadius: "50%",
                position: "relative",
                bottom: "0.1em",
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <FontAwesomeIcon icon={faCircleQuestion} />
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<span>List your property</span>
          </div>
        </div>

        <div className="headerList">
          <div className="headerListItem active">
            <FontAwesomeIcon icon={faBed} />
            <span>Hotels</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faPlane} />
            <span>Flights</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faCar} />
            <span>Car rentals</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faBed} />
            <span>Attractions</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faTaxi} />
            <span>Airport taxis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
