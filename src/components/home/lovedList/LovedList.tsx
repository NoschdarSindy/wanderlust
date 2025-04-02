import "./lovedList.css";
import { useImage, useSite } from "src/lib/composables";
import { HotelData } from "src/lib/siteData";

const LovedList = () => {
  const s = useSite() as HotelData;
  const featuredList = s.lovedList;
  const lovedImgs = useImage("homecards/loved") as string[];

  return (
    featuredList && (
      <>
        <h1 className="homeTitle">{s.lovedTitle}</h1>
        <div className="fp">
          {featuredList.map((item, index) => (
            <div className="fpItem" key={index}>
              <img src={lovedImgs[index]} alt={item.name} className="fpImg" />
              <span className="fpName">{item.name}</span>
              <span className="fpCity">{item.city}</span>
              <span className="fpPrice">{item.price}</span>
              <div className="fpRating">
                <button>{item.rating}</button>
                <span>{item.ratingText}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  );
};

export default LovedList;
