import CitiesList from "src/components/home/citiesList/CitiesList";
import LovedList from "src/components/home/lovedList/LovedList";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import ByTypeList from "src/components/home/byTypeList/ByTypeList";
import "./home.scss";
import CookiePopup from "../../components/CookiePopup";
import { useResetRecoilState } from "recoil";
import {
  countsAtom,
  datesAtom,
  locationsAtom,
  mockIndexAtom,
} from "src/lib/atoms";
import { useEffect } from "react";
import { getImage, getSite } from "src/lib/composables";

const Home = () => {
  const s = getSite();
  const homecards = getImage("homecards/interactive");

  const resetDestination = useResetRecoilState(locationsAtom);
  const resetGuests = useResetRecoilState(countsAtom);
  const resetDates = useResetRecoilState(datesAtom);
  const resetItemIndex = useResetRecoilState(mockIndexAtom);

  useEffect(() => {
    resetDestination();
    resetGuests();
    resetDates();
    resetItemIndex();
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
        {s.isHotels && (
          <div className="homeItem" data-section="loved">
            <LovedList />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
