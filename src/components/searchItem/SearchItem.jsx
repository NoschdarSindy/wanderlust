import "./searchItem.css";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { datesAtom, destinationAtom, guestsAtom, hotelAtom } from "../../atoms";
import { useWebsite } from "../../contexts/WebsiteContext";
import { useDesignMode } from "../../contexts/DesignModeContext";
import { getNights, getTotalPrice } from "../../util";
import { hotels, flights, cars } from "../../data/mockData";

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

  const renderAmenities = () => {
    const amenities = websiteType === 'hotels' 
      ? ['Free WiFi', 'Breakfast included', 'Pool', 'Parking']
      : websiteType === 'flights'
      ? ['Baggage allowance', 'In-flight meals', 'Entertainment', 'USB Power']
      : ['GPS', 'Bluetooth', 'Air conditioning', 'Automatic'];

    return (
      <div className="siAmenities">
        {amenities.map((amenity, index) => (
          <span key={index} className="siAmenity">{amenity}</span>
        ))}
      </div>
    );
  };

  const handleClick = () => {
    setHotel(number);
    window.location.href = "/details";
  };

  return (
    <div className="searchItem">
      <div className="siImages">
        {[item.image, item.image2, item.image3].filter(Boolean).map((img, index) => (
          <img key={index} src={img} alt="" className="siImg" />
        ))}
      </div>
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siDistance">{item.distance}</span>
        <span className="siRating">
          Rating: {item.rating}/5
        </span>
        {renderAmenities()}
      </div>
      <div className="siDetails">
        {designMode && (
          <>
            {item.prevPrice && <span className="siOldPrice">${item.prevPrice * nights}</span>}
            <span className="siPrice">${totalPrice}</span>
            <span className="siTaxOp">Includes taxes and fees</span>
            <div className="siDetailTexts">
              <span className="siLimitedTime">Limited time offer</span>
              <span className="siOthersViewing">
                {Math.floor(Math.random() * 10) + 2} others viewing
              </span>
            </div>
          </>
        )}
        <button className="siCheckButton" onClick={handleClick}>See details</button>
      </div>
    </div>
  );
};

export default SearchItem;