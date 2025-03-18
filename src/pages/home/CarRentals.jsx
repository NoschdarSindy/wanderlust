
import { useEffect } from "react";
import { useResetRecoilState } from "recoil";
import { destinationAtom, datesAtom, guestsAtom } from "../../atoms";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Featured from "../../components/featured/Featured";
import PropertyList from "../../components/propertyList/PropertyList";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";

const CarRentals = () => {
  const resetDestination = useResetRecoilState(destinationAtom);
  const resetGuests = useResetRecoilState(guestsAtom);
  const resetDates = useResetRecoilState(datesAtom);

  useEffect(() => {
    resetDestination();
    resetGuests();
    resetDates();
  }, []);

  return (
    <div>
      <Navbar type="cars" />
      <Header type="cars"/>
      <div className="homeContainer">
        <h1 className="homeTitle">Popular Locations</h1>
        <Featured type="cars" />
        <h1 className="homeTitle">Vehicle Types</h1>
        <PropertyList type="cars" />
        <h1 className="homeTitle">Featured Vehicles</h1>
        <FeaturedProperties type="cars" />
        <Footer />
      </div>
    </div>
  );
};

export default CarRentals;
