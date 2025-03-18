
import { useEffect } from "react";
import { useResetRecoilState } from "recoil";
import { destinationAtom, datesAtom, guestsAtom } from "../../atoms";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Featured from "../../components/featured/Featured";
import PropertyList from "../../components/propertyList/PropertyList";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";

const Flights = () => {
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
      <Navbar type="flights" />
      <Header type="flights"/>
      <div className="homeContainer">
        <h1 className="homeTitle">Popular Routes</h1>
        <Featured type="flights" />
        <h1 className="homeTitle">Popular Airlines</h1>
        <PropertyList type="flights" />
        <h1 className="homeTitle">Featured Deals</h1>
        <FeaturedProperties type="flights" />
        <Footer />
      </div>
    </div>
  );
};

export default Flights;
