import "./navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import { useImage, useSite } from "src/contexts/WebsiteContext";

const Navbar = () => {
  const s = useSite();
  const usEng = useImage("us-eng") as string;

  return (
    <div className="navbar">
      <div className="navContainer">
        <div className="firstRow">
          <span className="logo">{s.title}</span>
          <div className="navItems">
            <span>EUR</span> &nbsp;&nbsp;&nbsp;
            <img
              src={usEng}
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
            <FontAwesomeIcon icon={icons.faCircleQuestion} />
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<span>{s.listYourOfferText}</span>
          </div>
        </div>

        <div className="headerList">
          {s.headerItems.map(({ icon, label }) => (
            <div className="headerListItem" key={label}>
              <FontAwesomeIcon icon={icons[icon]} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
