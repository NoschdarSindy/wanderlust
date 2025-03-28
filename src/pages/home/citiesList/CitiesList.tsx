import "./featured.css";
import { useImage, useSite } from "src/contexts/WebsiteContext";

const CitiesList = () => {
  const s = useSite();
  const citiesList = s.citiesList;
  const citiesImgs = useImage("homecards/cities");

  return (
    <div className="featured">
      {citiesList.map((city, i) => (
        <div className="featuredItem" key={i}>
          <img src={citiesImgs[i]} alt={city.name} className="featuredImg" />
          <div className="featuredTitles">
            <h1>{city.name}</h1>
            {s.name !== "flights" && <h2>{city.count}</h2>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CitiesList;
