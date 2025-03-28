import CitiesList from "src/pages/home/citiesList/CitiesList";
import LovedList from "src/pages/home/lovedList/LovedList";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import ByTypeList from "src/pages/home/byTypeList/ByTypeList";
import "./home.scss";
import CookiePopup from "../../components/CookiePopup";
import { useResetRecoilState } from "recoil";
import { countsAtom, datesAtom, destinationAtom, hotelAtom } from "src/atoms";
import { useEffect } from "react";
import { useImage, useSite } from "src/contexts/WebsiteContext";

const Home = () => {
  const s = useSite();
  const homecards = useImage("homecards/interactive");

  const resetDestination = useResetRecoilState(destinationAtom);
  const resetGuests = useResetRecoilState(countsAtom);
  const resetDates = useResetRecoilState(datesAtom);
  const resetHotel = useResetRecoilState(hotelAtom);

  useEffect(() => {
    resetDestination();
    resetGuests();
    resetDates();
    resetHotel();
  }, []);

  return (
    <div>
      <Navbar />
      <Header />
      <CookiePopup />
      <div className="homeContainer">
        <div className="homeItem" data-section="offers">
          <h1 className="homeTitle">{s.offersTitle}</h1>
          <div className="homeCards">
            <div className="card">
              <div className="card-body">
                <div className="cardRow">
                  <h5 className="card-title font-weight-bold">
                    <b>{s.longStayTitle}</b>
                  </h5>
                  <p className="card-text">{s.longStayText}</p>
                  <span className="btn btn-primary">{s.longStayButton}</span>
                </div>
                <img src={homecards[0]} alt="" />
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="cardRow">
                  <h5 className="card-title font-weight-bold">
                    <b>{s.dreamVacationTitle}</b>
                  </h5>
                  <p className="card-text">{s.dreamVacationText}</p>
                  <span className="btn btn-primary">
                    {s.dreamVacationButton}
                  </span>
                </div>
                <img src={homecards[1]} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="homeItem" data-section="types">
          <h1 className="homeTitle">{s.typesTitle}</h1>
          <ByTypeList />
        </div>
        <div className="homeItem" data-section="cities">
          <h1 className="homeTitle">{s.citiesTitle}</h1>
          <CitiesList />
        </div>
        <div className="homeItem" data-section="loved">
          <LovedList />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
